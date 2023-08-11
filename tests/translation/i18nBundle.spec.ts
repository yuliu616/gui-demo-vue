import { describe, it, expect } from '../testingFramework';
import { i18nBundles, i18nModel, i18nDefaultBundle } from '../../src/translation/i18n';

describe('i18n', function(){

  it('simply works', function(){
    let bundle: i18nModel = i18nDefaultBundle;
    // for usePreferenceStore().i18n.word['word.hello']
    let out = bundle.word['word.hello'];
    expect(out).eq('Hello');
    // for usePreferenceStore().i18n.model.Message['model.name']
    out = bundle.model.Message['model.name'];
    expect(out).eq('Message');
  });

  it('(en) works', function(){
    let bundle: i18nModel = i18nBundles.en;
    let out = bundle.word['word.hello'];
    expect(out).eq('Hello');
    // for usePreferenceStore().i18n.model.Message['model.name']
    out = bundle.model.Message['model.name'];
    expect(out).eq('Message');
  });

  it('(zh) works', function(){
    let bundle: i18nModel = i18nBundles.zh;
    // for usePreferenceStore().i18n.word['word.hello']
    let out = bundle.word['word.hello'];
    expect(out).eq('你好');
    // for usePreferenceStore().i18n.model.Message['model.name']
    out = bundle.model.Message['model.name'];
    expect(out).eq('讯息');
  });

  it('t(translate method) works', function(){
    let bundle: i18nModel = i18nDefaultBundle;
    // for usePreferenceStore().i18n.word['word.hello']
    let out = bundle.t('word', 'word.hello');
    expect(out).eq('Hello');
    // for usePreferenceStore().i18n.model.Message['model.name']
    out = bundle.t('model.Message', 'model.name');
    expect(out).eq('Message');
  });

  it('(en) t(translate method) works', function(){
    let bundle: i18nModel = i18nBundles.en;
    // for usePreferenceStore().i18n.word['word.hello']
    let out = bundle.t('word', 'word.hello');
    expect(out).eq('Hello');
    // for usePreferenceStore().i18n.model.Message['model.name']
    out = bundle.t('model.Message', 'model.name');
    expect(out).eq('Message');
  });

  it('(zh) t(translate method) works', function(){
    let bundle: i18nModel = i18nBundles.zh;
    // for usePreferenceStore().i18n.word['word.hello']
    let out = bundle.t('word', 'word.hello');
    expect(out).eq('你好');
    // for usePreferenceStore().i18n.model.Message['model.name']
    out = bundle.t('model.Message', 'model.name');
    expect(out).eq('讯息');
  });

  it('(en) t(translate method) for pack works', function(){
    let bundle: i18nModel = i18nBundles.en;
    // for usePreferenceStore().i18n.core.word['word.enum.LocaleCode.en']
    let out = bundle.t('core.word', 'word.enum.LocaleCode.en');
    expect(out).eq('English');
  });

  it('(zh) t(translate method) for pack works', function(){
    let bundle: i18nModel = i18nBundles.zh;
    // for usePreferenceStore().i18n.core.word['word.enum.LocaleCode.en']
    let out = bundle.t('core.word', 'word.enum.LocaleCode.en');
    expect(out).eq('英语');
  });

});