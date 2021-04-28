import { describe } from 'mocha';
import { expect } from 'chai';
import { MaxValueRule } from '../../../src/model/validation/MaxValueRule';

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
      expect(out.reason).to.not.be.empty;  
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
      expect(out.reason).to.not.be.empty;  
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
      expect(out.reason).to.not.be.empty;  
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
      expect(out.reason).to.not.be.empty;  
    }
    out = new MaxValueRule(100).validate(1/0);
    expect(out).is.an('object');
    if (out) {
      expect(out.reason).is.an('string');
      expect(out.reason).to.not.be.empty;  
    }
  });

});
