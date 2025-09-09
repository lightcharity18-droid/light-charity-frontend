import { useEffect, useCallback, useRef } from 'react';
import { webSocketService, MessageEventHandlers, CommunityMessage } from '@/lib/websocket';
import { authService } from '@/lib/auth';

interface UseWebSocketOptions {
  autoConnect?: boolean;
  communities?: string[];
}

interface UseWebSocketReturn {
  isConnected: boolean;
  subscribeToCommunity: (communityId: string) => void;
  unsubscribeFromCommunity: (communityId: string) => void;
  connect: () => Promise<boolean>;
  disconnect: () => void;
}

export const useWebSocket = (
  handlers: MessageEventHandlers = {},
  options: UseWebSocketOptions = {}
): UseWebSocketReturn => {
  const { autoConnect = true, communities = [] } = options;
  const handlersRef = useRef(handlers);
  const isConnectedRef = useRef(false);

  // Update handlers ref when handlers change
  useEffect(() => {
    handlersRef.current = handlers;
  }, [handlers]);

  // Set up event handlers
  useEffect(() => {
    const wrappedHandlers: MessageEventHandlers = {
      onNewMessage: (message: CommunityMessage, communityId: string) => {
        console.log('useWebSocket hook received new message for community:', communityId);
        if (handlersRef.current.onNewMessage) {
          try {
            handlersRef.current.onNewMessage(message, communityId);
          } catch (error) {
            console.error('Error in onNewMessage handler:', error);
          }
        }
      },
      onMessageEdited: (message: CommunityMessage, communityId: string) => {
        handlersRef.current.onMessageEdited?.(message, communityId);
      },
      onMessageDeleted: (messageId: string, communityId: string) => {
        handlersRef.current.onMessageDeleted?.(messageId, communityId);
      },
      onReactionAdded: (messageId: string, reaction: any, communityId: string) => {
        handlersRef.current.onReactionAdded?.(messageId, reaction, communityId);
      },
      onReactionRemoved: (messageId: string, userId: string, communityId: string) => {
        handlersRef.current.onReactionRemoved?.(messageId, userId, communityId);
      },
      onCommunitySubscribed: (communityId: string, communityName: string) => {
        handlersRef.current.onCommunitySubscribed?.(communityId, communityName);
      },
      onCommunityUnsubscribed: (communityId: string) => {
        handlersRef.current.onCommunityUnsubscribed?.(communityId);
      },
      onConnectionEstablished: (userId: string) => {
        isConnectedRef.current = true;
        handlersRef.current.onConnectionEstablished?.(userId);
      },
      onError: (error: string) => {
        handlersRef.current.onError?.(error);
      }
    };

    webSocketService.setEventHandlers(wrappedHandlers);
  }, []);

  // Auto-connect and subscribe to communities
  useEffect(() => {
    let mounted = true;

    const initializeConnection = async () => {
      if (!authService.isAuthenticated() || !autoConnect) {
        return;
      }

      try {
        const connected = await webSocketService.connect();
        if (connected && mounted) {
          isConnectedRef.current = true;
          
          // Subscribe to specified communities
          communities.forEach(communityId => {
            webSocketService.subscribeToCommunity(communityId);
          });
        }
      } catch (error) {
        console.error('Failed to initialize WebSocket connection:', error);
        if (mounted) {
          handlersRef.current.onError?.('Failed to connect to real-time messaging');
        }
      }
    };

    initializeConnection();

    return () => {
      mounted = false;
    };
  }, [autoConnect, communities]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (webSocketService.isConnected()) {
        communities.forEach(communityId => {
          webSocketService.unsubscribeFromCommunity(communityId);
        });
      }
    };
  }, [communities]);

  const connect = useCallback(async (): Promise<boolean> => {
    try {
      const connected = await webSocketService.connect();
      if (connected) {
        isConnectedRef.current = true;
      }
      return connected;
    } catch (error) {
      console.error('Failed to connect WebSocket:', error);
      handlersRef.current.onError?.('Failed to connect to real-time messaging');
      return false;
    }
  }, []);

  const disconnect = useCallback((): void => {
    webSocketService.disconnect();
    isConnectedRef.current = false;
  }, []);

  const subscribeToCommunity = useCallback((communityId: string): void => {
    webSocketService.subscribeToCommunity(communityId);
  }, []);

  const unsubscribeFromCommunity = useCallback((communityId: string): void => {
    webSocketService.unsubscribeFromCommunity(communityId);
  }, []);

  return {
    isConnected: webSocketService.isConnected(),
    subscribeToCommunity,
    unsubscribeFromCommunity,
    connect,
    disconnect
  };
};

// Hook specifically for community messaging
export const useCommunityMessages = (
  communityId: string | null,
  onNewMessage?: (message: CommunityMessage) => void,
  onMessageUpdated?: (message: CommunityMessage) => void,
  onMessageDeleted?: (messageId: string) => void
) => {
  const handlers: MessageEventHandlers = {
    onNewMessage: (message: CommunityMessage, msgCommunityId: string) => {
      if (communityId && msgCommunityId === communityId) {
        console.log('useCommunityMessages hook received new message for community:', 
          msgCommunityId, 'Message ID:', message._id);
        
        try {
          if (onNewMessage) {
            onNewMessage(message);
            console.log('Called onNewMessage handler with new message');
          } else {
            console.warn('No onNewMessage handler provided to useCommunityMessages');
          }
        } catch (error) {
          console.error('Error in useCommunityMessages onNewMessage handler:', error);
        }
      }
    },
    onMessageEdited: (message: CommunityMessage, msgCommunityId: string) => {
      if (communityId && msgCommunityId === communityId) {
        onMessageUpdated?.(message);
      }
    },
    onMessageDeleted: (messageId: string, msgCommunityId: string) => {
      if (communityId && msgCommunityId === communityId) {
        onMessageDeleted?.(messageId);
      }
    },
    onError: (error: string) => {
      console.error('Community WebSocket error:', error);
    }
  };

  const webSocket = useWebSocket(handlers, {
    autoConnect: true,
    communities: communityId ? [communityId] : []
  });

  useEffect(() => {
    if (communityId && webSocket.isConnected) {
      webSocket.subscribeToCommunity(communityId);
      
      return () => {
        webSocket.unsubscribeFromCommunity(communityId);
      };
    }
  }, [communityId, webSocket.isConnected]);

  return webSocket;
};

// Hook for dashboard messages (multiple communities)
export const useDashboardMessages = (
  userCommunities: string[] = [],
  onNewMessage?: (message: CommunityMessage, communityId: string) => void
) => {
  const handlers: MessageEventHandlers = {
    onNewMessage: (message: CommunityMessage, communityId: string) => {
      if (userCommunities.includes(communityId)) {
        onNewMessage?.(message, communityId);
      }
    },
    onError: (error: string) => {
      console.error('Dashboard WebSocket error:', error);
    }
  };

  return useWebSocket(handlers, {
    autoConnect: true,
    communities: userCommunities
  });
};
