import { describe } from 'mocha';
import { expect } from 'chai';
import { ObjectHelper } from '../../src/util/ObjectHelper';

describe('ObjectHelper', function(){

  it('cloneWithValueReset works', function(){
    let o1 = { f1: 123, f2: 234 };
    let out = ObjectHelper.cloneWithValueReset(o1, 999);
    expect(out.f1).eq(999);
    expect(out.f2).eq(999);
  });

  it('cloneWithValueReset wont affect source object', function(){
    let o1 = { f1: 123, f2: 234 };
    let out = ObjectHelper.cloneWithValueReset(o1, 999);
    expect(o1.f1).eq(123);
    expect(o1.f2).eq(234);
  });

  it('map works', function(){
    let o1 = { f1: 123, f2: 234 };
    let sum = 0;
    let out = ObjectHelper.map(o1, v=>{
      return 'FF'+v;
    });
    expect(out.f1).eq('FF123');
    expect(out.f2).eq('FF234');
  });

  it('map wont affect source object', function(){
    let o1 = { f1: 123, f2: 234 };
    let sum = 0;
    let out = ObjectHelper.map(o1, v=>{
      return 'FF'+v;
    });
    expect(o1.f1).eq(123);
    expect(o1.f2).eq(234);
  });

});