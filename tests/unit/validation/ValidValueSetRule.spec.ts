import { describe } from 'mocha';
import { expect } from 'chai';
import { ValidValueSetRule } from '../../../src/model/validation/ValidValueSetRule';

describe('ValidValueSetRule', function(){

  it('works for number', function(){
    let out = new ValidValueSetRule([
      11, 13, 17, 19,
    ]).validate(17);
    expect(out).to.be.null;
  });

  it('could reject for number', function(){
    let out = new ValidValueSetRule([
      11, 13, 17, 19,
    ]).validate(15);
    expect(out).is.an('object');
    if (out) {
      expect(out.reason).is.an('string');
      expect(out.reason).to.not.be.empty;  
    }
  });

  it('works for string', function(){
    let out = new ValidValueSetRule([
      'apple', 'orange', 'banana'
    ]).validate('banana');
    expect(out).to.be.null;
  });

  it('could reject for string', function(){
    let out = new ValidValueSetRule([
      'apple', 'orange', 'banana'
    ]).validate('pie-apple');
    expect(out).is.an('object');
    if (out) {
      expect(out.reason).is.an('string');
      expect(out.reason).to.not.be.empty;  
    }
  });

  it('works for enum', function(){
    let out = new ValidValueSetRule(Object.keys(Gender))
      .validate('FEMALE');
    expect(out).to.be.null;
  });

  it('could reject for enum', function(){
    let out = new ValidValueSetRule(Object.keys(Gender))
      .validate('WOMAN');
    expect(out).is.an('object');
    if (out) {
      expect(out.reason).is.an('string');
      expect(out.reason).to.not.be.empty;  
    }
  });

  it('accept not-filled, for number', function(){
    let out = new ValidValueSetRule([
      11, 13, 17, 19,
    ]).validate(null);
    expect(out).to.be.null;
    out = new ValidValueSetRule([
      11, 13, 17, 19,
    ]).validate(undefined);
    expect(out).to.be.null;
  });

  it('accept not-filled, for string', function(){
    let out = new ValidValueSetRule([
      'apple', 'orange', 'banana'
    ]).validate(null);
    expect(out).to.be.null;
    out = new ValidValueSetRule([
      'apple', 'orange', 'banana'
    ]).validate('');
    expect(out).to.be.null;
    out = new ValidValueSetRule([
      'apple', 'orange', 'banana'
    ]).validate(undefined);
    expect(out).to.be.null;
  });

  it('reject nonsense value', function(){
    let out = new ValidValueSetRule([
      11, 13, 17, 19,
    ]).validate(NaN);
    expect(out).is.an('object');
    if (out) {
      expect(out.reason).is.an('string');
      expect(out.reason).to.not.be.empty;  
    }
    out = new ValidValueSetRule([
      11, 13, 17, 19,
    ]).validate(1/0);
    expect(out).is.an('object');
    if (out) {
      expect(out.reason).is.an('string');
      expect(out.reason).to.not.be.empty;  
    }
  });

});

export enum Gender { 
  MALE = 'MALE', 
  FEMALE = 'FEMALE', 
}
