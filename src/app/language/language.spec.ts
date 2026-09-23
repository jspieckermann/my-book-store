import { TestBed } from '@angular/core/testing';
import { Language } from './language';

describe('Language', () => {
  beforeEach(() => {
    localStorage.removeItem('language');
    TestBed.configureTestingModule({ providers: [Language] });
  });

  afterEach(() => {
    localStorage.removeItem('language');
  });

  it('defaults to English when no language has been stored', () => {
    const language = TestBed.inject(Language);

    expect(language.current()).toBe('en');
  });

  it('setLanguage() sets the language and persists it', () => {
    const language = TestBed.inject(Language);

    language.setLanguage('de');

    expect(language.current()).toBe('de');
    expect(localStorage.getItem('language')).toBe('de');
  });

  it('setLanguage() can switch back to English', () => {
    const language = TestBed.inject(Language);

    language.setLanguage('de');
    language.setLanguage('en');

    expect(language.current()).toBe('en');
  });

  it('a fresh instance picks up a previously persisted language', () => {
    localStorage.setItem('language', 'de');

    const language = TestBed.inject(Language);

    expect(language.current()).toBe('de');
  });

  it('translate() substitutes {placeholder} params', () => {
    const language = TestBed.inject(Language);

    expect(language.translate('bookSearch.pageOf', { page: 2, total: 5 })).toBe('Page 2 of 5');
  });

  it('translate() returns the German string once set to German', () => {
    const language = TestBed.inject(Language);
    language.setLanguage('de');

    expect(language.translate('bookSearch.pageTitle')).toBe('Suche');
  });

  it('localeCode is en-US for English and de-DE for German', () => {
    const language = TestBed.inject(Language);

    expect(language.localeCode()).toBe('en-US');

    language.setLanguage('de');

    expect(language.localeCode()).toBe('de-DE');
  });

  it('sets document.documentElement.lang to follow the current language', () => {
    const language = TestBed.inject(Language);
    TestBed.tick();
    expect(document.documentElement.lang).toBe('en');

    language.setLanguage('de');
    TestBed.tick();

    expect(document.documentElement.lang).toBe('de');
  });
});
