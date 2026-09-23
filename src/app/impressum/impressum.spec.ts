import { TestBed } from '@angular/core/testing';
import { ImpressumPage } from './impressum';
import { Language } from '../language/language';

describe('ImpressumPage', () => {
  afterEach(() => {
    localStorage.removeItem('language');
  });

  function createFixture(locale?: 'en' | 'de') {
    TestBed.configureTestingModule({});
    if (locale) {
      TestBed.inject(Language).setLanguage(locale);
    }
    const fixture = TestBed.createComponent(ImpressumPage);
    fixture.detectChanges();
    return fixture;
  }

  function expectRequiredContent(el: HTMLElement): void {
    const text = el.textContent ?? '';

    // Operator identity and address
    expect(text).toContain('Max Mustermann');
    expect(text).toContain('Musterstraße 12');
    expect(text).toContain('12345 Musterstadt');

    // Contact details
    expect(text).toContain('+49 30 12345678');
    expect(el.querySelector('a[href="mailto:contact@my-book-store.example"]')).toBeTruthy();

    // VAT identification number
    expect(text).toContain('DE123456789');

    // EU ODR link
    expect(el.querySelector('a[href="https://ec.europa.eu/consumers/odr/"]')).toBeTruthy();

    // Consumer dispute-resolution statement
    expect(text).toContain('nicht bereit und nicht verpflichtet');

    // Liability disclaimer
    expect(text).toContain('Haftung für Inhalte');
    expect(text).toContain('Haftung für Links');
  }

  it('renders the page', () => {
    const fixture = createFixture();

    expect(fixture.componentInstance).toBeTruthy();
  });

  it('shows the required content when the language defaults to English', () => {
    const fixture = createFixture();

    expectRequiredContent(fixture.nativeElement as HTMLElement);
  });

  it('shows the same required content, unchanged, after switching the language to German', () => {
    const fixture = createFixture('de');

    expectRequiredContent(fixture.nativeElement as HTMLElement);
  });
});
