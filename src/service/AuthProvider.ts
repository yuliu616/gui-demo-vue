import { rootStore } from "@/stores";
import { AuthStoreState } from "@/stores/authStore";
import { Message, MessageType } from "@/stores/messageStore";
import { Store } from "vuex";
import { AuthService, AuthServiceImpl } from "./AuthService";
import { MessageService, MessageServiceImpl } from "./MessageService";
import { message_text } from "../translation/en/message";
import { word_text } from "../translation/en/word";

const DEFAULT_ROOT_STORE = rootStore;

export class AuthProviderImpl {

  public rootStore: Store<any>;
  public authStore: AuthStoreState;
  public authService: AuthServiceImpl;
  public messageService: MessageServiceImpl;

  constructor(
    rootStore: Store<any> = DEFAULT_ROOT_STORE,
    authStore: AuthStoreState | null = null,
    authService: AuthServiceImpl = AuthService(),
    messageService: MessageServiceImpl = MessageService(),
  ){
    this.rootStore = rootStore;
    this.authStore = authStore || rootStore.state.authStore;
    this.authService = authService;
    this.messageService = messageService;
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
    await this.messageService.sendMessage({
      viewName: word_text['word.login'],
      type: MessageType.INFO,
      text: message_text['sentence.login.passed'],
    });
  }

  async logout(){
    this.rootStore.dispatch('authStore/onLogout');
    await this.messageService.sendMessage({
      viewName: word_text['word.login'],
      type: MessageType.INFO,
      text: message_text['sentence.login.logoutDone'],
    });
  }

  isLoggedIn(): boolean {
    return this.authStore.loggedIn;
  }

}

export function AuthProvider(): AuthProviderImpl {
  return new AuthProviderImpl();
}
