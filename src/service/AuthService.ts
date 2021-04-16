import axios from "axios";
import { PostOptions } from "./HttpServiceCommon";

const DEFAULT_API_BASE_URL = '/api/auth-service/1.0';

class AuthServiceImpl {

  apiBaseUrl: string;

  constructor(apiBaseUrl: string | null = null){
    this.apiBaseUrl = (apiBaseUrl || DEFAULT_API_BASE_URL);
  }

  async get_about(): Promise<any>{
    return await axios.get(`${this.apiBaseUrl}/about`).then(res=>res.data);
  }

  async post_login(options: PostOptions<any>): Promise<AuthToken>{
    return await axios.post(`${this.apiBaseUrl}/login`, options.body).then(res=>res.data);
  }

  async post_refreshToken(options: PostOptions<any>): Promise<AuthRefreshDto>{
    return await axios.post(`${this.apiBaseUrl}/refreshToken`, options.body).then(res=>res.data);
  }

}

interface AuthToken {
  access_token: string;
  token_type: string;
}

interface AuthRefreshDto {
  access_token: string;
  token_type: string;
  expires_in: number;
}

function AuthService(){
  return new AuthServiceImpl();
}

export { AuthService };
