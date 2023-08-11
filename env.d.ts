/// <reference types="vite/client" />

interface ImportMetaEnv {

  /** background color for app logo */
  readonly VITE_LOGO_BG_COLOR: string;

  /** auth-token refresh interval (in seconds) */
  readonly VITE_AUTH_REFRESH_SEC: number|string;

  /** when trying to resume auth, if exceed this amount of time, 
   * dont resume. */
  readonly VITE_RESUME_AUTH_LIMIT_SEC: number|string;

  /** http request timeout (in ms) for REST api call */
  readonly VITE_REST_CALL_TIMEOUT_MS: number|string;
  
  /** baseUrl for auth-service (REST api) */
  readonly VITE_AUTH_REST_API_BASE_URL: string;
  
  // debug flag for views
  readonly VITE_LoginForm_debug: number|string;
  readonly VITE_Footer_debug: number|string;
  readonly VITE_MenuBar_debug: number|string;
  
  // debug flag for stores
  readonly VITE_AuthProvider_debug: number|string;
  readonly VITE_AuthStore_debug: number|string;
  readonly VITE_PreferenceStore_debug: number|string;
  readonly VITE_MessageStore_debug: number|string;
  
  // debug flag for services
  readonly VITE_MessageService_debug: number|string;
  readonly VITE_AuthService_debug: number|string;
      
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
