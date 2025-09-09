import { io, Socket } from 'socket.io-client';
import { authService } from './auth';

export interface CommunityMessage {
  _id: string;
  community: string;
  sender: {
    _id: string;
    firstName?: string;
    lastName?: string;
    name?: string;
    userType: string;
  };
  content: string;
  messageType: string;
  createdAt: string;
  updatedAt: string;
  isEdited: boolean;
  reactions: Array<{
    user: string;
    emoji: string;
    createdAt: string;
  }>;
}

export interface MessageEventHandlers {
  onNewMessage?: (message: CommunityMessage, communityId: string) => void;
  onMessageEdited?: (message: CommunityMessage, communityId: string) => void;
  onMessageDeleted?: (messageId: string, communityId: string) => void;
  onReactionAdded?: (messageId: string, reaction: any, communityId: string) => void;
  onReactionRemoved?: (messageId: string, userId: string, communityId: string) => void;
  onCommunitySubscribed?: (communityId: string, communityName: string) => void;
  onCommunityUnsubscribed?: (communityId: string) => void;
  onConnectionEstablished?: (userId: string) => void;
  onError?: (error: string) => void;
}

class WebSocketService {
  private socket: Socket | null = null;
  private isConnecting = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 2000;
  private isReconnecting = false;
  private connectionFailures = 0;
  private lastFailureTime = 0;
  private circuitBreakerThreshold = 10;
  private circuitBreakerTimeout = 60000; // 1 minute
  private eventHandlers: MessageEventHandlers = {};
  private subscribedCommunities = new Set<string>();

  constructor() {
    this.connect = this.connect.bind(this);
    this.disconnect = this.disconnect.bind(this);
  }

  async connect(): Promise<boolean> {
    if (this.socket?.connected || this.isConnecting || this.isReconnecting) {
      return true;
    }

    // Circuit breaker check
    const now = Date.now();
    if (this.connectionFailures >= this.circuitBreakerThreshold) {
      if (now - this.lastFailureTime < this.circuitBreakerTimeout) {
        console.warn(`Socket.IO circuit breaker active. Too many failures (${this.connectionFailures}). Waiting until circuit opens.`);
        return false;
      } else {
        // Reset circuit breaker after timeout
        console.log('Socket.IO circuit breaker timeout expired. Resetting failure count.');
        this.connectionFailures = 0;
      }
    }

    try {
      this.isConnecting = true;
      const token = authService.getToken();
      
      if (!token || !authService.isAuthenticated()) {
        console.warn('Socket.IO connection skipped: No valid authentication token');
        this.isConnecting = false;
        this.connectionFailures++;
        this.lastFailureTime = now;
        return false;
      }

      const serverUrl = this.getServerUrl();
      console.log('Connecting to Socket.IO:', serverUrl);
      
      this.socket = io(serverUrl, {
        auth: {
          token
        },
        transports: ['websocket', 'polling'],
        autoConnect: true,
        reconnection: true,
        reconnectionAttempts: this.maxReconnectAttempts,
        reconnectionDelay: this.reconnectDelay
      });
      
      // Set up event handlers
      this.setupEventHandlers();

      // Wait for connection to establish or fail
      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Socket.IO connection timeout'));
        }, 10000);

        this.socket!.on('connect', () => {
          clearTimeout(timeout);
          console.log('Socket.IO connected successfully');
          this.isConnecting = false;
          this.isReconnecting = false;
          this.reconnectAttempts = 0;
          this.connectionFailures = 0; // Reset circuit breaker on successful connection
          resolve(true);
        });

        this.socket!.on('connect_error', (error) => {
          clearTimeout(timeout);
          console.error('Socket.IO connection error:', error);
          this.isConnecting = false;
          this.connectionFailures++;
          this.lastFailureTime = Date.now();
          reject(new Error('Socket.IO connection failed'));
        });
      });

    } catch (error) {
      this.isConnecting = false;
      this.connectionFailures++;
      this.lastFailureTime = Date.now();
      console.error('Socket.IO connection error:', error);
      this.eventHandlers.onError?.(error instanceof Error ? error.message : 'Connection failed');
      return false;
    }
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }

    this.subscribedCommunities.clear();
    this.isConnecting = false;
    this.reconnectAttempts = 0;
  }

  private getServerUrl(): string {
    // Use BACKEND_URL for production, fallback to localhost for development
    if (process.env.NODE_ENV === 'production') {
      const backendUrl = process.env.BACKEND_URL;
      if (backendUrl) {
        return backendUrl;
      }
      // Fallback for production if BACKEND_URL is not set
      const protocol = window.location.protocol === 'https:' ? 'https:' : 'http:';
      return `${protocol}//${window.location.host}`;
    }
    
    // Development environment
    return 'http://localhost:5000';
  }

  private setupEventHandlers(): void {
    if (!this.socket) return;

    this.socket.on('connection_established', (data) => {
      console.log('Socket.IO connection established:', data);
      this.eventHandlers.onConnectionEstablished?.(data.userId);
    });

    this.socket.on('new_message', (data) => {
      console.log('Received new message event:', 
        'Community:', data.communityId,
        'Message ID:', data.message?._id,
        'Content:', data.message?.content?.substring(0, 20) + '...',
        'Sender:', data.message?.sender);
      
      // Validate message data structure
      if (!data || !data.message || !data.communityId) {
        console.error('Invalid message data structure:', data);
        return;
      }
        
      // Call the event handler with the message data
      if (this.eventHandlers.onNewMessage) {
        try {
          console.log('Calling onNewMessage handler with:', {
            messageId: data.message._id,
            communityId: data.communityId,
            sender: data.message.sender,
            isValidMessage: !!data.message._id
          });
          
          this.eventHandlers.onNewMessage(
            data.message,
            data.communityId
          );
          
          console.log('onNewMessage handler executed successfully');
        } catch (error) {
          console.error('Error in onNewMessage handler:', error);
        }
      } else {
        console.warn('No onNewMessage handler registered');
      }
    });

    this.socket.on('message_edited', (data) => {
      this.eventHandlers.onMessageEdited?.(
        data.message,
        data.communityId
      );
    });

    this.socket.on('message_deleted', (data) => {
      this.eventHandlers.onMessageDeleted?.(
        data.messageId,
        data.communityId
      );
    });

    this.socket.on('message_reaction_added', (data) => {
      this.eventHandlers.onReactionAdded?.(
        data.messageId,
        data.reaction,
        data.communityId
      );
    });

    this.socket.on('message_reaction_removed', (data) => {
      this.eventHandlers.onReactionRemoved?.(
        data.messageId,
        data.userId,
        data.communityId
      );
    });

    this.socket.on('community_subscribed', (data) => {
      this.subscribedCommunities.add(data.communityId);
      this.eventHandlers.onCommunitySubscribed?.(
        data.communityId,
        data.communityName
      );
    });

    this.socket.on('community_unsubscribed', (data) => {
      this.subscribedCommunities.delete(data.communityId);
      this.eventHandlers.onCommunityUnsubscribed?.(data.communityId);
    });

    this.socket.on('error', (data) => {
      console.error('Socket.IO server error:', data.message);
      this.eventHandlers.onError?.(data.message);
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Socket.IO disconnected:', reason);
      this.isConnecting = false;
    });

    this.socket.on('reconnect', (attemptNumber) => {
      console.log('Socket.IO reconnected after', attemptNumber, 'attempts');
      this.reconnectAttempts = 0;
      this.connectionFailures = 0;
      
      // Re-subscribe to communities
      for (const communityId of this.subscribedCommunities) {
        this.subscribeToCommunity(communityId);
      }
    });

    this.socket.on('reconnect_error', (error) => {
      console.error('Socket.IO reconnection error:', error);
      this.reconnectAttempts++;
    });
  }


  subscribeToCommunity(communityId: string): void {
    console.log('Subscribing to community:', communityId);
    
    if (this.socket?.connected) {
      this.socket.emit('subscribe_community', { communityId });
      // Track subscription locally
      this.subscribedCommunities.add(communityId);
    } else {
      console.warn('Socket.IO is not connected. Cannot subscribe to community:', communityId);
    }
  }

  unsubscribeFromCommunity(communityId: string): void {
    if (this.socket?.connected) {
      this.socket.emit('unsubscribe_community', { communityId });
      this.subscribedCommunities.delete(communityId);
    } else {
      console.warn('Socket.IO is not connected. Cannot unsubscribe from community:', communityId);
    }
  }

  setEventHandlers(handlers: MessageEventHandlers): void {
    this.eventHandlers = { ...this.eventHandlers, ...handlers };
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  canConnect(): boolean {
    // Check circuit breaker
    const now = Date.now();
    if (this.connectionFailures >= this.circuitBreakerThreshold) {
      if (now - this.lastFailureTime < this.circuitBreakerTimeout) {
        return false;
      }
    }
    
    return authService.isAuthenticated() && !!authService.getToken();
  }

  getSubscribedCommunities(): Set<string> {
    return new Set(this.subscribedCommunities);
  }

  reset(): void {
    this.disconnect();
    this.reconnectAttempts = 0;
    this.isReconnecting = false;
    this.isConnecting = false;
    this.connectionFailures = 0;
    this.lastFailureTime = 0;
    this.subscribedCommunities.clear();
    this.eventHandlers = {};
  }

  forceStop(): void {
    console.log('Force stopping Socket.IO service');
    this.connectionFailures = this.circuitBreakerThreshold + 1; // Trigger circuit breaker
    this.lastFailureTime = Date.now();
    this.disconnect();
  }
}

// Create singleton instance
export const webSocketService = new WebSocketService();

// Auto-connect when authenticated
export const initializeWebSocket = async (): Promise<boolean> => {
  if (authService.isAuthenticated()) {
    try {
      return await webSocketService.connect();
    } catch (error) {
      console.error('Failed to initialize Socket.IO:', error);
      return false;
    }
  }
  return false;
};

// Clean up on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    webSocketService.disconnect();
  });
}
