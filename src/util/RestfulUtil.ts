import type { ILogger } from "@/model/core/ILogger";
import { type RestfulError } from "@/model/restful/RestfulError";
import axios, { AxiosError, type AxiosResponse } from "axios";

export const ERROR_UNKNOWN = 'ERROR_UNKNOWN';
export const ERROR_CANCELED = 'ERROR_CANCELED';
export const ERROR_TIMEOUT = 'ERROR_TIMEOUT';
export const ERROR_NETWORK = 'ERROR_NETWORK';

enum AXIOS_ERROR_CODE {
  ERR_FR_TOO_MANY_REDIRECTS = "ERR_FR_TOO_MANY_REDIRECTS",
  ERR_BAD_OPTION_VALUE = "ERR_BAD_OPTION_VALUE",
  ERR_BAD_OPTION = "ERR_BAD_OPTION",
  ERR_NETWORK = "ERR_NETWORK",
  ERR_DEPRECATED = "ERR_DEPRECATED",
  ERR_BAD_RESPONSE = "ERR_BAD_RESPONSE",
  ERR_BAD_REQUEST = "ERR_BAD_REQUEST",
  ERR_NOT_SUPPORT = "ERR_NOT_SUPPORT",
  ERR_INVALID_URL = "ERR_INVALID_URL",
  ERR_CANCELED = "ERR_CANCELED",
  ECONNABORTED = "ECONNABORTED",
  ETIMEDOUT = "ETIMEDOUT",
}

const logger: ILogger = console;

/**
 * util class for RESTful api
 * RESTful api 的工具类
 */
export class RestfulUtil {

  static debug = false;

  /**
   * convert the provided JS error object (produced by Axios)
   * to a generic error object.
   * 以 error(JS error object)参数生成定义化的错误对象
   */
  public static asError(err: any, 
    options: { includeTrace?: boolean, suppressErrLog?: boolean }|null = null,
  ): RestfulError {
    // {
    //   logger?.log('RestfulUtil.asError got error:', err);
    //   logger?.log('RestfulUtil.asError got error.isAxiosError:', err.isAxiosError);
    //   logger?.log('RestfulUtil.asError got error(json):', JSON.stringify(err, null, 2));
    //   if (err.request) logger?.log('err.request(json):', JSON.stringify(err.request, null, 2));
    //   if (err.response) logger?.log('err.response(json):', JSON.stringify(err.response, null, 2));
    // }
    let errorMessage: string|null = null;
    let trace: any = {};

    // for AxiosResponse
    let axiosErr: AxiosError = err;
    let axiosErrRes: AxiosResponse = err.response;
    
    if (!axiosErr.isAxiosError &&
    err && err.message) {
      errorMessage = err.message;
    }
    if (options?.includeTrace && axiosErr.config) {
      trace.endpoint = `${axiosErr.config.method?.toUpperCase()} ${axiosErr.config.url}`;
    }

    if (RestfulUtil.debug) {
      if (axiosErr.isAxiosError) {
        if (axiosErr.response) {
          logger?.log('asError: axiosErr.response =', axiosErr.response);
        } else {
          logger?.log('asError: axiosErr =', axiosErr);
        }
      } else {
        logger?.log('asError: non-axiosErr =', err);
      }
    }

    if (!axiosErr.isAxiosError){
      // non AxiosError (includes error from client code, before/after making request.)
      if (!options?.suppressErrLog) logger?.error(`unhandled axios error, err.message=[${err.message}]`);
      return <RestfulError>{
        code: ERROR_UNKNOWN,
        trace: Object.keys(trace) ? trace : null,
      };
    } else if (!axiosErr.response) {
      // for error without response (and status)
      if (axiosErr.code == AXIOS_ERROR_CODE.ERR_CANCELED) {
        // request aborted(canceled) at client side,
        // like request time out, etc.
        return <RestfulError>{
          isTimeout: false,
          code: ERROR_CANCELED,
          trace: Object.keys(trace) ? trace : null,
        };
      } else if (axiosErr.code == AXIOS_ERROR_CODE.ECONNABORTED) {
        // request timeout
        return <RestfulError>{
          isTimeout: true,
          code: ERROR_TIMEOUT,
          trace: Object.keys(trace) ? trace : null,
        };
      } else if (axiosErr.code == AXIOS_ERROR_CODE.ERR_NETWORK) {
        // network error (network related error but have no specific reason)
        // (including no network, request blocked by CORS policy, etc.)
        if (!options?.suppressErrLog) logger?.error(`generic network axios error, code=[${axiosErr.code}]`);
        return <RestfulError>{
          code: ERROR_NETWORK,
          trace: Object.keys(trace) ? trace : null,
        };
      } else {
        if (!options?.suppressErrLog) logger?.error(`unhandled axios error, code=[${axiosErr.code}]`);
        return <RestfulError>{
          code: ERROR_UNKNOWN,
          trace: Object.keys(trace) ? trace : null,
        };
      }
    } else { // for response exists
      // for non-app error (network error, etc.)
      if (axiosErrRes.status == 403 || 
        axiosErrRes.status == 404) 
      {
        // 403 (Forbidden)
        // 404 (PageNotFound)
        return <RestfulError>{
          statusCode: axiosErrRes.status,
          code: `HTTP_ERROR_${axiosErrRes.status}`,
          message: axiosErrRes.statusText,
          trace: Object.keys(trace) ? trace : null,
        };
      } else if (axiosErrRes.status >= 500 && axiosErrRes.status < 600) {
        // 5xx error
        return <RestfulError>{
          code: `HTTP_ERROR_${axiosErrRes.status}`,
          message: axiosErrRes.statusText,
          trace: Object.keys(trace) ? trace : null,
        };

      } else if (axiosErrRes && axiosErrRes.config && axiosErrRes.status) {
        // 4xx error: app defined error
        if (options?.includeTrace && axiosErrRes.data) {
          trace.payload = axiosErrRes.data;
        }
        let result: RestfulError = {
          isTimeout: false,
          trace: Object.keys(trace) ? trace : null,
        };
        // 400 (Bad Request)
        if (axiosErrRes.status >= 400 && axiosErrRes.status < 500 
        && axiosErrRes.data) {
          if (axiosErrRes.data.errorCode || axiosErrRes.data.code) {
            // for response payload is coded
            result.code = (axiosErrRes.data.errorCode || axiosErrRes.data.code);
            result.messageArguments = axiosErrRes.data?.arg;
          } else if (axiosErrRes.data.message){
            result.statusCode = axiosErrRes.status;
            result.message = axiosErrRes.data.message;
          }
        } else if (errorMessage){
          result.statusCode = axiosErrRes.status;
          result.message = errorMessage;
        }
        return result;
      }
    }

    // fallback
    return <RestfulError>{
      code: ERROR_UNKNOWN,
      message: errorMessage,
    };
  }

}
