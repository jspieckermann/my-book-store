import { Service, computed, effect, signal } from '@angular/core';
import { Locale, TRANSLATIONS } from './translations';

const STORAGE_KEY = 'language';

function loadInitialLocale(): Locale {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored === 'de' ? 'de' : 'en';
}

@Service()
export class Language {
  private readonly _current = signal<Locale>(loadInitialLocale());
  readonly current = this._current.asReadonly();

  readonly localeCode = computed(() => (this._current() === 'de' ? 'de-DE' : 'en-US'));

  constructor() {
    effect(() => {
      document.documentElement.lang = this._current();
    });
  }

  setLanguage(locale: Locale): void {
    this._current.set(locale);
    localStorage.setItem(STORAGE_KEY, locale);
  }

  translate(key: string, params?: Record<string, string | number>): string {
    const template = TRANSLATIONS[this._current()][key] ?? key;
    if (!params) {
      return template;
    }
    return template.replace(/\{(\w+)\}/g, (match, name) =>
      name in params ? String(params[name]) : match,
    );
  }
}
