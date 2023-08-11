import { describe, it, expect } from '../testingFramework';
import { ValidValueSetRule } from '../../src/model/validation/ValidValueSetRule';

export const ERROR_INVALID_VALUE = 'ERROR_INVALID_VALUE';

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
      expect(out.reason).eq(ERROR_INVALID_VALUE);
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
      expect(out.reason).eq(ERROR_INVALID_VALUE);
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
      expect(out.reason).eq(ERROR_INVALID_VALUE);
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
      expect(out.reason).eq(ERROR_INVALID_VALUE);
    }
    out = new ValidValueSetRule([
      11, 13, 17, 19,
    ]).validate(1/0);
    expect(out).is.an('object');
    if (out) {
      expect(out.reason).is.an('string');
      expect(out.reason).eq(ERROR_INVALID_VALUE);
    }
  });

  it('support customize errorCode', function(){
    let out = new ValidValueSetRule([
      'apple', 'orange', 'banana'
    ], 'i never recognize this is a fruit').validate('pie-apple');
    expect(out).is.an('object');
    expect(out).is.an('object');
    if (out) {
      expect(out.reason).is.an('string');
      expect(out.reason).eq('i never recognize this is a fruit');
    }
  });

});

export enum Gender { 
  MALE = 'MALE', 
  FEMALE = 'FEMALE', 
}
