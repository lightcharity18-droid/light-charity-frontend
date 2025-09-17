// Google Identity Services TypeScript declarations

interface GoogleCredentialResponse {
  credential: string;
  select_by: string;
}

interface GoogleAccounts {
  id: {
    initialize: (config: {
      client_id: string;
      callback: (response: GoogleCredentialResponse) => void;
      auto_select?: boolean;
      cancel_on_tap_outside?: boolean;
      use_fedcm_for_prompt?: boolean;
    }) => void;
    prompt: () => void;
    disableAutoSelect: () => void;
    cancel: () => void;
    renderButton: (
      element: HTMLElement,
      config: {
        theme?: 'outline' | 'filled_blue' | 'filled_black';
        size?: 'large' | 'medium' | 'small';
        text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin';
        shape?: 'rectangular' | 'pill' | 'circle' | 'square';
        logo_alignment?: 'left' | 'center';
        width?: number;
        locale?: string;
      }
    ) => void;
  };
}

interface Window {
  google?: {
    accounts: GoogleAccounts;
  };
}

declare global {
  interface Window {
    google?: {
      accounts: GoogleAccounts;
    };
  }
}

export {};
