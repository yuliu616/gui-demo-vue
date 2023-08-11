import axios from "axios";
import type { ILogger } from "@/model/core/ILogger";
import type { Product } from "@/model/product/Product";
import type { Brand } from "@/model/product/Brand";
import { PromiseUtil } from "@/util/PromiseUtil";
import type { GetOptions, PostOptions } from "@/model/restful/RestfulServiceConsumer";

const PRODUCT_REST_API_BASE_URL = import.meta.env.VITE_PRODUCT_REST_API_BASE_URL;
// const PRODUCT_REST_API_BASE_URL = '/api/product-service/1.1';

export class ProductServiceImpl {

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

    if (this.debug) this.logger?.log(`ProductService created with apiBaseUrl[${apiBaseUrl}].`);
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

  async get_product(options: get_product_params): Promise<Product[]>{
    let url = `${this.apiBaseUrl}/product`;
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

  async post_product(options: PostOptions<Product>): Promise<Product> {
    let url = `${this.apiBaseUrl}/product`;
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

  async get_product_x(id: string, options: GetOptions): Promise<Product> {
    let url = `${this.apiBaseUrl}/product/${id}`;
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

  async put_product_x(id: string, options: PostOptions<Product>): Promise<Product> {
    let url = `${this.apiBaseUrl}/product/${id}`;
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

  async get_brand(options: get_brand_params): Promise<Brand[]> {
    let url = `${this.apiBaseUrl}/brand`;
    if (this.debug) this.logger?.log(`GET: ${url} options:`, options);
    return await axios.get(url, {
      params: {
        offset: options?.offset || DEFAULT_OFFSET,
        size: options?.size || DEFAULT_SIZE,
      },
      signal: options.consumer.restCallAbortController.signal,
    }).then(res=>res.data);
  }

}

const DEFAULT_OFFSET = 0;
const DEFAULT_SIZE = 10;

interface get_product_params extends GetOptions {
  offset: number;
  size: number;
  /**
   * "0" for false,
   * "1" for true,
   * "-1" for anything.
   */
  isActive?: number;
}

interface get_brand_params extends GetOptions {
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
  static value: ProductServiceImpl;
}

/**
 * adapter class for RESTful service [product-service]
 */
export function ProductService() {
  if (!Singleton.value) {
    let debug: boolean = !!(+import.meta.env.VITE_ProductService_debug);
    Singleton.value = new ProductServiceImpl(
      PRODUCT_REST_API_BASE_URL,
      {
        logger: console,
        debug: debug,
      }
    );
  }
  return Singleton.value;
}