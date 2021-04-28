import { describe } from 'mocha';
import { expect } from 'chai';
import { RegExpTextRule } from '../../../src/model/validation/RegExpTextRule';

describe('RegExpTextRule', function(){

  it('allow letter-only as decided', function(){
    let out = new RegExpTextRule(/^[A-Za-z]+$/).validate('Peter');
    expect(out).to.be.null;
  });

  it('could reject by letter-only as decided', function(){
    let out = new RegExpTextRule(/^[A-Za-z]+$/).validate('Peter 123');
    expect(out).is.an('object');
    if (out) {
      expect(out.reason).is.an('string');
      expect(out.reason).to.not.be.empty;  
    }
  });

  it('allow search for word as decided', function(){
    let out = new RegExpTextRule(/son/).validate('Johnson');
    expect(out).to.be.null;
  });

  it('could reject by search for word as decided', function(){
    let out = new RegExpTextRule(/son/).validate('Brotherhood');
    expect(out).is.an('object');
    if (out) {
      expect(out.reason).is.an('string');
      expect(out.reason).to.not.be.empty;  
    }
  });

  it('allow Chinese Char only as decided', function(){
    let out = new RegExpTextRule(/^\p{Script=Han}+$/u).validate('公主');
    expect(out).to.be.null;
  });

  it('could reject by Chinese Char only as decided', function(){
    let out = new RegExpTextRule(/^\p{Script=Han}+$/u).validate('Princess');
    expect(out).is.an('object');
    if (out) {
      expect(out.reason).is.an('string');
      expect(out.reason).to.not.be.empty;  
    }
  });

  it('accept not-filled', function(){
    let out = new RegExpTextRule(/^[A-Za-z]+$/).validate(null);
    expect(out).to.be.null;
    out = new RegExpTextRule(/^[A-Za-z]+$/).validate('');
    expect(out).to.be.null;
    out = new RegExpTextRule(/^[A-Za-z]+$/).validate(undefined);
    expect(out).to.be.null;
  });

});
