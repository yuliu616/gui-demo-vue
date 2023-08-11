import axios from "axios";
import type { ILogger } from "@/model/core/ILogger";
import { PromiseUtil } from "@/util/PromiseUtil";
import type { PostOptions } from "@/model/restful/RestfulServiceConsumer";

const AUTH_REST_API_BASE_URL = import.meta.env.VITE_AUTH_REST_API_BASE_URL;
// const AUTH_REST_API_BASE_URL = '/api/auth-service/1.1';

export class AuthServiceImpl {

  apiBaseUrl: string;

  debug = false;
  logger?: ILogger;
  
  constructor(apiBaseUrl: string,
    options?: {
      debug?: boolean,
      logger?: ILogger,
    },
  ) {
    this.debug = options?.debug || false;
    this.logger = options?.logger;

    if (this.debug) this.logger?.log(`AuthService created with apiBaseUrl[${apiBaseUrl}].`);
    this.apiBaseUrl = apiBaseUrl;
  }

  async get_about(): Promise<any>{
    let url = `${this.apiBaseUrl}/about`;
    if (this.debug) this.logger?.log(`GET: ${url}`);
    return await axios.get(url)
      .then(res=>res.data)
      .catch(err=>{
        if (this.debug) this.logger?.log("response(error)", err);
        throw err;
      });
  }

  async post_login(options: PostOptions<LoginDto>): Promise<AuthToken>{
    let url = `${this.apiBaseUrl}/login`;
    if (this.debug) this.logger?.log(`POST: ${url} payload =`, JSON.stringify(options.body, null, 2));
    return await axios.post(url, options.body, {
      signal: options.consumer.restCallAbortController.signal,
    })
    .then(res=>res.data)
    .catch(err=>{
      if (this.debug) this.logger?.log("response(error)", err);
      throw err;
    });
  }

  async post_login_refreshToken(options: PostOptions<object>): Promise<AuthRefreshDto>{
    let url = `${this.apiBaseUrl}/login/refreshToken`;
    if (this.debug) this.logger?.log(`POST: ${url} payload =`, JSON.stringify(options.body, null, 2));
    return await axios.post(url, options.body, {
      signal: options.consumer.restCallAbortController.signal,
    })
    .then(res=>res.data)
    .catch(err=>{
      if (this.debug) this.logger?.log("response(error)", err);
      throw err;
    });
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

/**
 * adapter class for RESTful service [auth-service]
 */
export function AuthService() {
  if (!Singleton.value) {
    let debug: boolean = !!(+import.meta.env.VITE_AuthService_debug);
    Singleton.value = new AuthServiceImpl(
      AUTH_REST_API_BASE_URL,
      {
        logger: console,
        debug: debug,
      }
    );
  }
  return Singleton.value;
}
