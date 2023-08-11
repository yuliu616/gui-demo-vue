import { describe, it, expect } from '../testingFramework';
import { MaxValueRule } from '../../src/model/validation/MaxValueRule';

export const ERROR_INVALID_VALUE = 'ERROR_INVALID_VALUE';

describe('MaxValueRule', function(){

  it('works for upper bound', function(){
    let out = new MaxValueRule(100).validate(100);
    expect(out).to.be.null;
  });

  it('could reject by upper bound', function(){
    let out = new MaxValueRule(100).validate(101);
    expect(out).is.an('object');
    if (out) {
      expect(out.reason).is.an('string');
      expect(out.reason).eq(ERROR_INVALID_VALUE);
    }
  });

  it('works for upper bound, for string', function(){
    let out = new MaxValueRule('apple').validate('apple');
    expect(out).to.be.null;
  });

  it('could reject by upper bound, for string', function(){
    let out = new MaxValueRule('apple').validate('applf');
    expect(out).is.an('object');
    if (out) {
      expect(out.reason).is.an('string');
      expect(out.reason).eq(ERROR_INVALID_VALUE);
    }
  });

  it('works for upper bound, for string with length-diff', function(){
    let out = new MaxValueRule('apple-pie').validate('apple');
    expect(out).to.be.null;
  });

  it('could reject by upper bound, for string with length-diff', function(){
    let out = new MaxValueRule('apple').validate('apple-pie');
    expect(out).is.an('object');
    if (out) {
      expect(out.reason).is.an('string');
      expect(out.reason).eq(ERROR_INVALID_VALUE);
    }
  });

  it('accept not-filled, for number', function(){
    let out = new MaxValueRule(100).validate(null);
    expect(out).to.be.null;
    out = new MaxValueRule(100).validate(undefined);
    expect(out).to.be.null;
  });

  it('accept not-filled, for string', function(){
    let out = new MaxValueRule('apple').validate(null);
    expect(out).to.be.null;
    out = new MaxValueRule('apple').validate('');
    expect(out).to.be.null;
    out = new MaxValueRule('apple').validate(undefined);
    expect(out).to.be.null;
  });

  it('reject nonsense value', function(){
    let out = new MaxValueRule(100).validate(NaN);
    expect(out).is.an('object');
    if (out) {
      expect(out.reason).is.an('string');
      expect(out.reason).eq(ERROR_INVALID_VALUE);
    }
    out = new MaxValueRule(100).validate(1/0);
    expect(out).is.an('object');
    if (out) {
      expect(out.reason).is.an('string');
      expect(out.reason).eq(ERROR_INVALID_VALUE);
    }
  });

  it('works for lower bound inclusively', function(){
    let out = new MaxValueRule(100, { exclusive: false }).validate(100);
    expect(out).to.be.null;
  });

  it('reject for lower bound inclusively', function(){
    let out = new MaxValueRule(100, { exclusive: true }).validate(100);
    if (out) {
      expect(out.reason).is.an('string');
      expect(out.reason).eq(ERROR_INVALID_VALUE);
    }
  });

  it('support customize errorCode', function(){
    let out = new MaxValueRule(100, null,
      'this number is too big',
    ).validate(101);
    expect(out).is.an('object');
    if (out) {
      expect(out.reason).is.an('string');
      expect(out.reason).eq('this number is too big');
    }
  });

});
