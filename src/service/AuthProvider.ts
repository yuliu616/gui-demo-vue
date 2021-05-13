import { rootStore } from "@/stores";
import { AuthStoreState } from "@/stores/authStore";
import { Store } from "vuex";
import { AuthService } from "./AuthService";
import { MessageService } from "./MessageService";
import { JobScheduler } from "./JobScheduler";
import moment from "moment";
import { PreferenceStoreState } from "@/stores/preferenceStore";

const DEFAULT_ROOT_STORE = rootStore;
const TIME_DIFF_TOLERANCE = 2;

export class AuthProviderImpl {

  public rootStore: Store<any>;
  public authStore: AuthStoreState;
  public preferenceStore: PreferenceStoreState;

  private authTokenRefreshFreqSec: number;

  debug = false;

  constructor(
    rootStore: Store<any> = DEFAULT_ROOT_STORE,
    authStore: AuthStoreState | null = null,
    preferenceStore: PreferenceStoreState | null = null,
    protected authService = AuthService(),
    protected messageService = MessageService(),
    protected jobScheduler = JobScheduler(),
  ){
    this.rootStore = rootStore;
    this.authStore = authStore || rootStore.state.authStore;
    this.preferenceStore = preferenceStore || rootStore.state.preferenceStore;
    this.authTokenRefreshFreqSec = this.preferenceStore.auth.tokenRefreshSec;
  }

  async init(){
    if (this.debug) console.log(`AuthProvider init with refresh interval:${this.authTokenRefreshFreqSec}s.`);
    await this.rootStore.dispatch('authStore/init');
    if (this.authStore.loggedIn) {
      this.startTokenRefreshIfNeeded();
      // create background job to keep auto refresh token
      this.addTokenRefreshSchedule();
    }
  }

  async login(value:{ username: string, password: string }): Promise<any> {
    let tokenRes = await this.authService.post_login({
      body: {
        username: value.username,
        password: value.password,
      },
    });
    if (!tokenRes.access_token) {
      throw new Error('access_token missing in login response.');
    }
    this.rootStore.dispatch('authStore/onLoginPass', 
      tokenRes.access_token, 
    );
    if (this.debug) console.log(`login pass, token:`, tokenRes.access_token);

    // create background job to keep auto refresh token
    this.addTokenRefreshSchedule();

    await this.messageService.info(
      {viewName: this.preferenceStore.i18n.view['view.Login']},
      this.preferenceStore.i18n.message['sentence.login.passed'],
    );
  }

  async addTokenRefreshSchedule(){
    this.jobScheduler.registerJob({
      name: 'authTokenRefreshJob',
      timeoutMs: this.authTokenRefreshFreqSec * 1000,
      task: ()=>{
        this.startTokenRefresh();
      },
    });
  }

  /**
   * normally, token refresh is just invoked periodically,
   * but sometimes, when we found the token is not refreshed 
   * at the assumed time, we invoke refresh immediately.
   */
  async startTokenRefreshIfNeeded(){
    let accessLastFetch = this.authStore.accessLastFetch;
    if (accessLastFetch) {
      let t = moment(accessLastFetch)
        .add(this.authTokenRefreshFreqSec + TIME_DIFF_TOLERANCE, 'second');
      if (moment().isAfter(t)) {
        if (this.debug) console.log(`startTokenRefreshIfNeeded: invoke token refresh immediately`);
        await this.startTokenRefresh();
      }
    } else {
      console.error(`no way to refresh token while there is not previously fetched.`);
    }
  }

  async startTokenRefresh() {
    let tokenRes;
    try {
      tokenRes = await this.authService.post_login_refreshToken({
        body: {}
      });
    } catch (err) {
      // for security reason, dont send error object to messageService
      await this.messageService.errorMsg(
        {viewName: this.preferenceStore.i18n.view['view.Login']}, null, 
        this.preferenceStore.i18n.error['ERROR_AUTH_REFRESH'],
      );
      // if failed to refresh token, auto logout
      this.logout();
      return;
    }

    this.rootStore.dispatch('authStore/onTokenRefresh', 
      tokenRes.access_token, 
    );
    if (this.debug) console.log(`token refreshed`, tokenRes.access_token);
  }

  async logout(){
    this.rootStore.dispatch('authStore/onLogout');
    this.jobScheduler.cancelAllJobs();
    if (this.debug) console.log(`logout done.`);

    await this.messageService.info(
      {viewName: this.preferenceStore.i18n.view['view.Login']},
      this.preferenceStore.i18n.message['sentence.login.logoutDone'],
    );
  }

  isLoggedIn(): boolean {
    return this.authStore.loggedIn;
  }

}

class Singleton {
  static value: AuthProviderImpl;
}

export function AuthProvider(debug = false) {
  if (!Singleton.value) {
    Singleton.value = new AuthProviderImpl();
  }
  Singleton.value.debug = debug;
  return Singleton.value;
}
