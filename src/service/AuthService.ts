import axios from "axios";
import { PostOptions } from "./HttpServiceCommon";

const DEFAULT_API_BASE_URL = '/api/auth-service/1.1';

export class AuthServiceImpl {

  apiBaseUrl: string;

  constructor(apiBaseUrl: string = DEFAULT_API_BASE_URL){
    this.apiBaseUrl = apiBaseUrl;
  }

  async get_about(): Promise<any>{
    return await axios.get(`${this.apiBaseUrl}/about`).then(res=>res.data);
  }

  async post_login(options: PostOptions<LoginDto>): Promise<AuthToken>{
    return await axios.post(`${this.apiBaseUrl}/login`, options.body).then(res=>res.data);
  }

  async post_login_refreshToken(options: PostOptions<any>): Promise<AuthRefreshDto>{
    return await axios.post(`${this.apiBaseUrl}/login/refreshToken`, options.body).then(res=>res.data);
  }

}

export interface AuthToken {
  access_token: string;
  token_type: string;
}

export interface AuthRefreshDto {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface LoginDto {
  username: string;
  password: string;
} 

class Singleton {
  static value: AuthServiceImpl;
}

export function AuthService() {
  if (!Singleton.value) {
    Singleton.value = new AuthServiceImpl();
  }
  return Singleton.value;
}
