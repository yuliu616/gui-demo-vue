import { describe } from 'mocha';
import { expect } from 'chai';
import { MinValueRule } from '../../../src/model/validation/MinValueRule';

describe('MinValueRule', function(){

  it('works for lower bound', function(){
    let out = new MinValueRule(100).validate(100);
    expect(out).to.be.null;
  });

  it('could reject by lower bound', function(){
    let out = new MinValueRule(100).validate(99);
    expect(out).is.an('object');
    if (out) {
      expect(out.reason).is.an('string');
      expect(out.reason).to.not.be.empty;  
    }
  });

  it('works for lower bound, for string', function(){
    let out = new MinValueRule('apple').validate('apple');
    expect(out).to.be.null;
  });

  it('could reject by lower bound, for string', function(){
    let out = new MinValueRule('apple').validate('appld');
    expect(out).is.an('object');
    if (out) {
      expect(out.reason).is.an('string');
      expect(out.reason).to.not.be.empty;  
    }
  });

  it('works for lower bound, for string with length-diff', function(){
    let out = new MinValueRule('apple').validate('apple-pie');
    expect(out).to.be.null;
  });

  it('could reject by lower bound, for string with length-diff', function(){
    let out = new MinValueRule('apple-pie').validate('apple');
    expect(out).is.an('object');
    if (out) {
      expect(out.reason).is.an('string');
      expect(out.reason).to.not.be.empty;  
    }
  });

  it('accept not-filled, for number', function(){
    let out = new MinValueRule(100).validate(null);
    expect(out).to.be.null;
    out = new MinValueRule(100).validate(undefined);
    expect(out).to.be.null;
  });

  it('accept not-filled, for string', function(){
    let out = new MinValueRule('apple').validate(null);
    expect(out).to.be.null;
    out = new MinValueRule('apple').validate('');
    expect(out).to.be.null;
    out = new MinValueRule('apple').validate(undefined);
    expect(out).to.be.null;
  });

  it('reject nonsense value', function(){
    let out = new MinValueRule(100).validate(NaN);
    expect(out).is.an('object');
    if (out) {
      expect(out.reason).is.an('string');
      expect(out.reason).to.not.be.empty;  
    }
    out = new MinValueRule(100).validate(1/0);
    expect(out).is.an('object');
    if (out) {
      expect(out.reason).is.an('string');
      expect(out.reason).to.not.be.empty;  
    }
  });

});
