import axios from "axios";

const DEFAULT_API_BASE_URL = '/api/auth-service/1.0';

class AuthServiceImpl {

  constructor(apiBaseUrl){
    this.apiBaseUrl = (apiBaseUrl || DEFAULT_API_BASE_URL);
  }

  async get_about(){
    return await axios.get(`${this.apiBaseUrl}/about`).then(res=>res.data);
  }

  async post_login(options){
    return await axios.post(`${this.apiBaseUrl}/login`, options.body).then(res=>res.data);
  }

  async post_refreshToken(options){
    return await axios.post(`${this.apiBaseUrl}/refreshToken`, options.body).then(res=>res.data);
  }

}

function AuthService(){
  return new AuthServiceImpl();
}

export { AuthService };
