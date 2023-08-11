import { describe, it, expect } from '../testingFramework';
import { DateUtil } from '../../src/util/DateUtil';
import dayjs from 'dayjs';

describe('DateUtil.getAge', function(){

  it('age simply works', function(){
    let age = DateUtil.getAge('2000-01-01', '2020-01-01');
    expect(age).eq(20);
  });

  it('age of under 1 year works', function(){
    let age = DateUtil.getAge('2000-01-01', '2000-10-01');
    expect(age).eq(0);
  });

  it('age of under 1 year (late dob) works', function(){
    let age = DateUtil.getAge('2000-12-01', '2000-12-20');
    expect(age).eq(0);
  });

  it('negative age return as zero works', function(){
    let age = DateUtil.getAge('2000-01-01', '1999-12-01');
    expect(age).eq(0);
  });

  it('on feb birthday works', function(){
    let age = DateUtil.getAge('2000-02-01', '2010-02-01');
    expect(age).eq(10);
  });

  it('feb birthday just passed works', function(){
    let age = DateUtil.getAge('2000-02-01', '2010-04-01');
    expect(age).eq(10);
  });

  it('not yet feb birthday works', function(){
    let age = DateUtil.getAge('2000-02-01', '2011-01-25');
    expect(age).eq(10);
  });
  
  it('on dec birthday works', function(){
    let age = DateUtil.getAge('2000-12-01', '2020-12-01');
    expect(age).eq(20);
  });

  it('dec birthday just passed works', function(){
    let age = DateUtil.getAge('2000-12-01', '2020-12-02');
    expect(age).eq(20);
  });

  it('not yet dec birthday works', function(){
    let age = DateUtil.getAge('2000-12-01', '2020-11-30');
    expect(age).eq(19);
  });

});

describe('DateUtil.formatDate', function(){

  it('formatDate simply works', function(){
    let text = DateUtil.formatDate('2020-06-24', 'YYYY-MM-DD');
    expect(text).eq('2020-06-24');
  });

  it('formatDate could accept string local date', function(){
    let text = DateUtil.formatDate('2020-06-24', 'YYYY-MM-DD');
    expect(text).eq('2020-06-24');
  });

  it('formatDate could accept JSDate', function(){
    let d = new Date(2020, 1, 20);  // same as 2020-02-20T00:00:00 (local time zone)
    let text = DateUtil.formatDate(d, 'YYYY-MM-DD');
    expect(text).eq('2020-02-20');
  });

  it('formatDate could accept dayjs date', function(){
    let d = dayjs('2020-02-20');
    let text = DateUtil.formatDate(d, 'YYYY-MM-DD');
    expect(text).eq('2020-02-20');
  });

  it('formatDate could accept null as current time', function(){
    let text = DateUtil.formatDate(null, 'YYYY-MM-DD');
    expect(text).match(/[0-9][0-9][0-9][0-9]-[0-1][0-9]-[0-3][0-9]/);
  });

});
