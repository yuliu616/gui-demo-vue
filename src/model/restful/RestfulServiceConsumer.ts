/**
 * consumer of RESTful service
 * (for example, if A object call service B, 
 * A is the consumer of B.)
 */
export interface RestfulServiceConsumer {

  /**
   * to allow cancellation of RESTful request.
   * (refer to 'axios')
   */
  restCallAbortController: AbortController;

}

export interface PostOptions<T> {

  body: T;

  consumer: RestfulServiceConsumer;

};

export interface PutOptions<T> {

  body: T;

  consumer: RestfulServiceConsumer;

};

export interface GetOptions {

  consumer: RestfulServiceConsumer;

}
