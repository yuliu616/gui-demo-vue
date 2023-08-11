import { describe, it, expect } from '../testingFramework';
import { RestfulUtil } from '../../src/util/RestfulUtil';
import { type RestfulError } from '../../src/model/restful/RestfulError';

describe('RestfulUtil', function(){

  it('could recognize timeout', function(){
    let fakeTimeoutError: any = new Error();
    fakeTimeoutError.isAxiosError = true;
    fakeTimeoutError.name = 'AxiosError';
    fakeTimeoutError.message = 'timeout of 123ms exceed';
    fakeTimeoutError.code = 'ECONNABORTED';
    fakeTimeoutError.status = null;
    fakeTimeoutError.stack = 'AxiosError: timeout of 123ms exceeded at XMLHttpRequest.handleTimeout ... dummy';
    fakeTimeoutError.request = { dummy: true };
    // fakeTimeoutError.response = null; // no response
    let out: RestfulError = RestfulUtil.asError(fakeTimeoutError);
    expect(out.isTimeout).to.be.true;
    expect(out.statusCode).to.be.undefined;
    expect(out.code).eq('ERROR_TIMEOUT');
  });

  it('could recognize request cancelation', function(){
    let reqCanceledError: any = new Error();
    reqCanceledError.isAxiosError = true;
    reqCanceledError.name = 'CanceledError';
    reqCanceledError.message = 'canceled';
    reqCanceledError.code = 'ERR_CANCELED';
    reqCanceledError.status = null;
    reqCanceledError.stack = 'CanceledError: canceled at throwIfCancellationRequested ... dummy';
    // reqCanceledError.request = null; // no request
    // reqCanceledError.response = null; // no response
    let out: RestfulError = RestfulUtil.asError(reqCanceledError);
    expect(out.isTimeout).to.be.false;
    expect(out.statusCode).to.be.undefined;
    expect(out.code).eq('ERROR_CANCELED')
  });

  it('could recognize http 403 (Forbidden)', function(){
    let accessDeniedError: any = new Error();
    accessDeniedError.isAxiosError = true;
    accessDeniedError.name = 'AxiosError';
    accessDeniedError.message = 'Request failed with status code 403';
    accessDeniedError.code = 'ERR_BAD_REQUEST';
    accessDeniedError.status = 403;
    accessDeniedError.stack = 'AxiosError: Request failed with status code 403 ... dummy';
    accessDeniedError.request = { dummy: true };
    accessDeniedError.response = {
      status: 403,
      statusText: 'Forbidden',
      config: {
        dummy: true,
        method: 'post',
        url: 'http://dummy.com',
        data: { dummy: true },
      },
      data: "", // no payload
    };
    let out: RestfulError = RestfulUtil.asError(accessDeniedError);
    expect(out.isTimeout).to.be.undefined;
    expect(out.statusCode).to.eq(403); // Forbidden
    expect(out.code).eq('HTTP_ERROR_403'); // Forbidden
  });

  it('could recognize http 404 (PageNotFound)', function(){
    let pageNotFundError: any = new Error();
    pageNotFundError.isAxiosError = true;
    pageNotFundError.name = 'AxiosError';
    pageNotFundError.message = 'Request failed with status code 404';
    pageNotFundError.code = 'ERR_BAD_REQUEST';
    pageNotFundError.status = 404;
    pageNotFundError.stack = 'AxiosError: Request failed with status code 404 ... dummy';
    pageNotFundError.request = { dummy: true };
    pageNotFundError.response = {
      status: 404,
      statusText: '',
      config: {
        dummy: true,
        method: 'post',
        url: 'http://dummy.com',
        data: { dummy: true },
      },
      data: "<html><body>nginx: 404 Page Not Found </body></html>", // html payload
    };
    let out: RestfulError = RestfulUtil.asError(pageNotFundError);
    expect(out.isTimeout).to.be.undefined;
    expect(out.statusCode).to.eq(404); // PageNotFound
    expect(out.code).eq('HTTP_ERROR_404'); // PageNotFound
  });

  // including CORS error, no internet
  it('could recognize network error(axios layer)', function(){
    let unknownAxiosError: any = new Error('Request failed with status code 400');
    unknownAxiosError.isAxiosError = true;
    unknownAxiosError.name = 'AxiosError';
    unknownAxiosError.code = 'ERR_NETWORK';
    unknownAxiosError.status = null;
    unknownAxiosError.stack = 'AxiosError: Network Error ... dummy';
    // unknownAxiosError.request = null; // no request
    // unknownAxiosError.response = null; // no response
    let out: RestfulError = RestfulUtil.asError(unknownAxiosError, { suppressErrLog: true });
    expect(out.isTimeout).to.be.undefined;
    expect(out.statusCode).to.be.undefined;
    expect(out.code).eq('ERROR_NETWORK');
  });

  it('could recognize non-axios error', function(){
    let fakeError: any = new Error('fake error');
    let out: RestfulError = RestfulUtil.asError(fakeError, { suppressErrLog: true });
    expect(out.isTimeout).to.be.undefined;
    expect(out.statusCode).to.be.undefined;
    expect(out.code).eq('ERROR_UNKNOWN');
  });

  it('could recognize backend error(Bad Request) with error code inside payload', function(){
    let fakeApp400Error: any = new Error('Request failed with status code 400');
    fakeApp400Error.isAxiosError = true;
    fakeApp400Error.name = 'AxiosError';
    fakeApp400Error.code = 'ERR_BAD_REQUEST';
    fakeApp400Error.status = 400;
    fakeApp400Error.stack = 'AxiosError: Request failed with status code 400 ... dummy';
    fakeApp400Error.request = { dummy: true };
    fakeApp400Error.response = {
      status: 400,
      statusText: 'Bad Request',
      config: {
        dummy: true,
        method: 'post',
        url: 'http://dummy.com',
        data: { dummy: true },
      },
      data: {
        errorCode: 'APP_ERR_1234',
      },
    };
    let out: RestfulError = RestfulUtil.asError(fakeApp400Error);
    expect(out.isTimeout).to.be.false;
    expect(out.statusCode).to.be.undefined;
    expect(out.code).eq('APP_ERR_1234');
  });

  // including payload decoding/parsing error
  it('could recognize backend INVALID_USE_ERROR', function(){
    let fakeApp400Error: any = new Error('Request failed with status code 400');
    fakeApp400Error.isAxiosError = true;
    fakeApp400Error.name = 'AxiosError';
    fakeApp400Error.code = 'ERR_BAD_REQUEST';
    fakeApp400Error.status = 400;
    fakeApp400Error.stack = 'AxiosError: Request failed with status code 400 ... dummy';
    fakeApp400Error.request = { dummy: true };
    fakeApp400Error.response = {
      status: 400,
      statusText: 'Bad Request',
      config: {
        dummy: true,
        method: 'post',
        url: 'http://dummy.com',
        data: { dummy: true },
      },
      data: {
        errorCode: '"INVALID_USE_ERROR"',
      },
    };
    let out: RestfulError = RestfulUtil.asError(fakeApp400Error);
    expect(out.isTimeout).to.be.false;
    expect(out.statusCode).to.be.undefined;
    expect(out.code).eq('"INVALID_USE_ERROR"');
  });

  it('could recognize backend validation error', function(){
    let fakeApp400Error: any = new Error('Request failed with status code 400');
    fakeApp400Error.isAxiosError = true;
    fakeApp400Error.name = 'AxiosError';
    fakeApp400Error.code = 'ERR_BAD_REQUEST';
    fakeApp400Error.status = 400;
    fakeApp400Error.stack = 'AxiosError: Request failed with status code 400 ... dummy';
    fakeApp400Error.request = { dummy: true };
    fakeApp400Error.response = {
      status: 400,
      statusText: 'Bad Request',
      config: {
        dummy: true,
        method: 'post',
        url: 'http://dummy.com',
        data: { dummy: true },
      },
      data: {
        errorCode: '"VALIDATION_ERROR"',
      },
    };
    let out: RestfulError = RestfulUtil.asError(fakeApp400Error);
    expect(out.isTimeout).to.be.false;
    expect(out.statusCode).to.be.undefined;
    expect(out.code).eq('"VALIDATION_ERROR"');
  });

});
