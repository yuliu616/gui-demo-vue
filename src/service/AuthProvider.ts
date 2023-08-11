import type { ILogger } from "@/model/core/ILogger";
import { useAuthStore } from "@/stores/AuthStore";
import { AuthService, type LoginDto } from "./AuthService";
import { MessageService } from "./MessageService";
import { usePreferenceStore } from "@/stores/PreferenceStore";
import { BrowserApiUtil } from "@/util/BrowserApiUtil";

export class AuthProviderImpl {

  debug = false;
  logger?: ILogger;
  tokenRefreshJobId?: number;

  restCallAbortController = new AbortController();
  
  private AuthStore = useAuthStore();
  private PreferenceStore = usePreferenceStore();
  private authService = AuthService();
  private messageService = MessageService();
  
  constructor(options?: {
      debug?: boolean,
      logger?: ILogger,
    },
  ) {
    this.debug = options?.debug || false;
    this.logger = options?.logger;
    if (this.debug) this.logger?.log(`AuthProvider created.`);
  }

  async login(value: LoginDto): Promise<any> {
    let tokenRes = await this.authService.post_login({ body: value, consumer: this });
    if (!tokenRes.access_token) {
      throw new Error('access_token missing in login response.');
    }
    await this.AuthStore.onLoginPass(tokenRes.access_token);
    if (this.debug) this.logger?.log(`login pass, token:`, tokenRes.access_token);

    // create background job to keep auto refresh token
    this.startTokenRefreshRepeatedJob();

    await this.messageService.info(
      {viewName: this.PreferenceStore.i18n.view['view.Login']},
      this.PreferenceStore.i18n.message['sentence.login.passed'],
    );
  }

  startTokenRefreshRepeatedJob(){
    this.tokenRefreshJobId = BrowserApiUtil.createRepeatedTimerJob(
      ()=>new Promise((resolve, reject)=>{
        if (this.debug) this.logger?.log('TimerJob:refreshAuthToken.');
        try {
          this.refreshAuthToken().then(result=>{
            if (!result && this.tokenRefreshJobId) {
              if (this.debug) this.logger?.log(`kill(${this.tokenRefreshJobId}) TimerJob:refreshAuthToken.`);
              BrowserApiUtil.removeRepeatedTimerJob(this.tokenRefreshJobId);
              delete this.tokenRefreshJobId;
            }
          });
        } catch (err) {
          this.logger?.error('error in TimerJob:refreshAuthToken.', err);
        }
      }), 
      'refreshAuthToken', 
      this.PreferenceStore.auth.tokenRefreshSec * 1000
    );
    if (this.debug) this.logger?.log(`TimerJob:refreshAuthToken created(${this.tokenRefreshJobId}).`);
  }

  /**
   * @returns true if refreshed successfully.
   */
  async refreshAuthToken(): Promise<boolean> {
    try {
      let tokenRes = await this.authService.post_login_refreshToken({ body: {}, consumer: this });
      await this.AuthStore.onTokenRefresh(tokenRes.access_token);
      return true;
    } catch (err) {
      // for security reason, dont send error object to messageService
      await this.messageService.errorMsg(
        {viewName: this.PreferenceStore.i18n.view['view.Login']}, null,
        this.PreferenceStore.i18n.error['ERROR_AUTH_REFRESH'],
      );
      // if failed to refresh token, auto logout
      await this.logout(true);
      return false;
    }
  }

  async logout(dontSendMessage: boolean = false){
    if (this.tokenRefreshJobId) {
      if (this.debug) this.logger?.log(`kill(${this.tokenRefreshJobId}) TimerJob:refreshAuthToken.`);
      BrowserApiUtil.removeRepeatedTimerJob(this.tokenRefreshJobId);
      delete this.tokenRefreshJobId;
    }
    await this.AuthStore.onLogout();
    if (this.debug) this.logger?.log(`logout done.`);
    if (!dontSendMessage) {
      await this.messageService.info(
        {viewName: this.PreferenceStore.i18n.view['view.Login']},
        this.PreferenceStore.i18n.message['sentence.login.logoutDone'],
      );  
    }
  }

  /**
   * @deprecated check 'authStore.loggedIn' instead.
   */
  isLoggedIn(): boolean {
    return this.AuthStore.loggedIn;
  }

}

class Singleton {
  static value: AuthProviderImpl;
}

/**
 * encapsulated version of functionalities of authentication,
 * like login, logout, etc.
 */
export function AuthProvider() {
  if (!Singleton.value) {
    let debug: boolean = !!(+import.meta.env.VITE_AuthProvider_debug);
    Singleton.value = new AuthProviderImpl(
      {
        logger: console,
        debug: debug,
      }
    );
  }
  return Singleton.value;
}
