import axios from "axios";
import type { ILogger } from "@/model/core/ILogger";
import type { People } from "@/model/people/People";
import { PromiseUtil } from "@/util/PromiseUtil";
import type { GetOptions, PostOptions } from "@/model/restful/RestfulServiceConsumer";

const PEOPLE_REST_API_BASE_URL = import.meta.env.VITE_PEOPLE_REST_API_BASE_URL;
// const PEOPLE_REST_API_BASE_URL = '/api/people-service/1.1';

export class PeopleServiceImpl {

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

    if (this.debug) this.logger?.log(`PeopleService created with apiBaseUrl[${apiBaseUrl}].`);
    this.apiBaseUrl = apiBaseUrl;
  }

  async get_about(options: GetOptions): Promise<any>{
    let url = `${this.apiBaseUrl}/about`;
    if (this.debug) this.logger?.log(`GET: ${url}`);
    return await axios.get(url, {
      signal: options.consumer.restCallAbortController.signal,
    })
    .then(res=>res.data)
    .catch(err=>{
      if (this.debug) this.logger?.log("response(error)", err);
      throw err;
    });
  }

  async get_people(options: get_people_params): Promise<People[]>{
    let url = `${this.apiBaseUrl}/people`;
    if (this.debug) this.logger?.log(`GET: ${url} options:`, options);
    return await axios.get(url, {
      params: {
        offset: options?.offset || DEFAULT_OFFSET,
        size: options?.size || DEFAULT_SIZE,
        isActive: options?.isActive || 0,
      },
      signal: options.consumer.restCallAbortController.signal,
    })
    .then(res=>res.data)
    .catch(err=>{
      if (this.debug) this.logger?.log("response(error)", err);
      throw err;
    });
  }

  async post_people(options: PostOptions<People>): Promise<People> {
    let url = `${this.apiBaseUrl}/people`;
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

  async get_people_x(id: string, options: GetOptions): Promise<People> {
    let url = `${this.apiBaseUrl}/people/${id}`;
    if (this.debug) this.logger?.log(`GET: ${url}`);
    return await axios.get(url, {
      signal: options.consumer.restCallAbortController.signal,
    })
    .then(res=>res.data)
    .catch(err=>{
      if (this.debug) this.logger?.log("response(error)", err);
      throw err;
    });
  }

  async put_people_x(id: string, options: PostOptions<People>): Promise<People> {
    let url = `${this.apiBaseUrl}/people/${id}`;
    if (this.debug) this.logger?.log(`PUT: ${url} payload =`, JSON.stringify(options.body, null, 2));
    return await axios.put(url, options.body, {
      signal: options.consumer.restCallAbortController.signal,
    })
    .then(res=>res.data)
    .catch(err=>{
      if (this.debug) this.logger?.log("response(error)", err);
      throw err;
    });
  }

}

const DEFAULT_OFFSET = 0;
const DEFAULT_SIZE = 10;

interface get_people_params extends GetOptions {
  offset: number;
  size: number;
  /**
   * "0" for false,
   * "1" for true,
   * "-1" for anything.
   */
  isActive?: number;
}

class Singleton {
  static value: PeopleServiceImpl;
}

/**
 * adapter class for RESTful service [people-service]
 */
export function PeopleService() {
  if (!Singleton.value) {
    let debug: boolean = !!(+import.meta.env.VITE_PeopleService_debug);
    Singleton.value = new PeopleServiceImpl(
      PEOPLE_REST_API_BASE_URL,
      {
        logger: console,
        debug: debug,
      }
    );
  }
  return Singleton.value;
}
