import { describe, it, expect } from '../testingFramework';
import { ObjectUtil } from '../../src/util/ObjectUtil';

describe('ObjectUtil', function(){

  it('cloneWithValueReset works', function(){
    let o1 = { f1: 123, f2: 234 };
    let out = ObjectUtil.cloneWithValueReset(o1, 999);
    expect(out.f1).eq(999);
    expect(out.f2).eq(999);
  });

  it('cloneWithValueReset wont affect source object', function(){
    let o1 = { f1: 123, f2: 234 };
    let out = ObjectUtil.cloneWithValueReset(o1, 999);
    expect(o1.f1).eq(123);
    expect(o1.f2).eq(234);
  });

  it('map works', function(){
    let o1 = { f1: 123, f2: 234 };
    let sum = 0;
    let out = ObjectUtil.map(o1, v=>{
      return 'FF'+v;
    });
    expect(out.f1).eq('FF123');
    expect(out.f2).eq('FF234');
  });

  it('map wont affect source object', function(){
    let o1 = { f1: 123, f2: 234 };
    let sum = 0;
    let out = ObjectUtil.map(o1, v=>{
      return 'FF'+v;
    });
    expect(o1.f1).eq(123);
    expect(o1.f2).eq(234);
  });

  it ('traverseObjectGraph could operate on leaf of 1 level object', function(){
    let sum = 0;
    ObjectUtil.traverseObjectGraph({
      first: 1,
      second: 2,
      third: 3,
    }, 
    (pathSoFar, it)=>{
      return typeof it == 'number';
    }, 
    (pathSoFar, it)=>{
      sum += it;
    });
    expect(sum).eq(6);
  });

  it ('traverseObjectGraph could map path with leaf for 1 level object', function(){
    let leafOfPath: any = {};
    ObjectUtil.traverseObjectGraph({
      first: 1,
      second: 2,
      third: 3,
    }, 
    (pathSoFar, it)=>{
      return typeof it == 'number';
    }, 
    (pathSoFar, it)=>{
      leafOfPath[pathSoFar] = it;
    });
    expect(leafOfPath).is.an('object');
    expect(leafOfPath.first).eq(1);
    expect(leafOfPath.second).eq(2);
    expect(leafOfPath.third).eq(3);
  });

  it ('traverseObjectGraph could operate on leaf of nested object with 2 level', function(){
    let sum = 0;
    ObjectUtil.traverseObjectGraph({
      first: 1,
      second: {
        s2a: 101,
        s2b: 102,
        s2c: 110,
        s2d: 150,
      },
      third: 3,
    }, 
    (pathSoFar, it)=>{
      return typeof it == 'number';
    }, 
    (pathSoFar, it)=>{
      sum += it;
    });
    expect(sum).eq(467);
  });

  it ('traverseObjectGraph could map path with leaf for nested object with 2 level', function(){
    let leafOfPath: any = {};
    ObjectUtil.traverseObjectGraph({
      first: 1,
      second: {
        s2a: 101,
        s2b: 102,
        s2c: 110,
        s2d: 150,
      },
      third: 3,
    }, 
    (pathSoFar, it)=>{
      return typeof it == 'number';
    }, 
    (pathSoFar, it)=>{
      leafOfPath[pathSoFar] = it;
    });
    expect(leafOfPath).is.an('object');
    expect(leafOfPath.first).eq(1);
    expect(leafOfPath).to.not.have.property('second');
    expect(leafOfPath['second.s2a']).eq(101);
    expect(leafOfPath['second.s2b']).eq(102);
    expect(leafOfPath['second.s2c']).eq(110);
    expect(leafOfPath['second.s2d']).eq(150);
    expect(leafOfPath.third).eq(3);
  });

  it ('traverseObjectGraph wont go into null/empty node', function(){
    let sum = 0;
    let leafOfPath: any = {};
    ObjectUtil.traverseObjectGraph({
      first: 1,
      second: {
        s2a: 101,
        s2b: {
          bOne: null,
          bTwo: 2000,
          bThree: undefined,
          bFour: 1000,
          bFive: 3000,
        },
        s2c: null,
        s2d: 150,
      },
      third: null,
      forth: 4,
    }, 
    (pathSoFar, it)=>{
      return typeof it == 'number';
    }, 
    (pathSoFar, it)=>{
      leafOfPath[pathSoFar] = it;
      sum += it;
    });
    expect(leafOfPath).is.an('object');
    expect(leafOfPath.first).eq(1);
    expect(leafOfPath).to.not.have.property('second');
    expect(leafOfPath['second.s2a']).eq(101);
    expect(leafOfPath).to.not.have.property('second.s2b');
    expect(leafOfPath).to.not.have.property('second.s2b.bOne');
    expect(leafOfPath['second.s2b.bTwo']).eq(2000);
    expect(leafOfPath).to.not.have.property('second.s2b.bThree');
    expect(leafOfPath['second.s2b.bFour']).eq(1000);
    expect(leafOfPath['second.s2b.bFive']).eq(3000);
    expect(leafOfPath).to.not.have.property('second.s2c');
    expect(leafOfPath['second.s2d']).eq(150);
    expect(leafOfPath).to.not.have.property('third');
    expect(leafOfPath.forth).eq(4);
    expect(sum).eq(6256);
  });

  it('reduceAsPropertyBag for f1 works', function(){
    let items: {f1: string, f2: string}[] = [
      {f1: 'peter', f2: 'good'},
      {f1: 'john', f2: 'rich'},
      {f1: 'rose', f2: 'beauty'},
      {f1: 'jim', f2: 'cheap'},
    ];
    let out = ObjectUtil.reduceAsPropertyBag(items, 'f1', 100);
    expect(out.peter).eq(100);
    expect(out.john).eq(100);
    expect(out.rose).eq(100);
    expect(out.jim).eq(100);
    expect(out.good).is.undefined;
    expect(out.rich).is.undefined;
    expect(out.beauty).is.undefined;
    expect(out.cheap).is.undefined;
  });
  it('reduceAsPropertyBag for f2 works', function(){
    let items: {f1: string, f2: string}[] = [
      {f1: 'peter', f2: 'good'},
      {f1: 'john', f2: 'rich'},
      {f1: 'rose', f2: 'beauty'},
      {f1: 'jim', f2: 'cheap'},
    ];
    let out = ObjectUtil.reduceAsPropertyBag(items, 'f2', 100);
    expect(out.peter).is.undefined;
    expect(out.john).is.undefined;
    expect(out.rose).is.undefined;
    expect(out.jim).is.undefined;
    expect(out.good).eq(100);
    expect(out.rich).eq(100);
    expect(out.beauty).eq(100);
    expect(out.cheap).eq(100);
  });

  it('reduceAsPropertyBag for empty list works', function(){
    let items: {f1: string, f2: string}[] = [
    ];
    let out = ObjectUtil.reduceAsPropertyBag(items, 'f2', 100);
    expect(out.peter).is.undefined;
    expect(out.cheap).is.undefined;
    expect(out).to.be.an('object');
  });

  it('getKeyListOfPropertyBag for matched works', function(){
    let out = ObjectUtil.getKeyListOfPropertyBag({
      'peter': 10,
      'john': 12,
      'rose': 88,
      'jim': 0.4,
    }, num=>(num >= 10));
    expect(out).to.be.an('array');
    expect(out).to.have.length(3);
  });

  it('getKeyListOfPropertyBag could return no match works', function(){
    let out = ObjectUtil.getKeyListOfPropertyBag({
      'peter': 10,
      'john': 12,
      'rose': 88,
      'jim': 0.4,
    }, num=>(num >= 100));
    expect(out).to.be.an('array');
    expect(out).to.have.length(0);
  });

});