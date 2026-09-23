import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ImpressumPage } from './impressum';
import { Language } from '../language/language';

describe('ImpressumPage', () => {
  afterEach(() => {
    localStorage.removeItem('language');
  });

  function createFixture(locale?: 'en' | 'de') {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    if (locale) {
      TestBed.inject(Language).setLanguage(locale);
    }
    const fixture = TestBed.createComponent(ImpressumPage);
    fixture.detectChanges();
    return fixture;
  }

  function expectFixedData(el: HTMLElement): void {
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
  }

  it('renders the page', () => {
    const fixture = createFixture();

    expect(fixture.componentInstance).toBeTruthy();
  });

  it('shows a breadcrumb above the title, linking to the main page, with the Impressum page as current', () => {
    const fixture = createFixture();
    const el = fixture.nativeElement as HTMLElement;

    const breadcrumb = el.querySelector('app-breadcrumb');
    const title = el.querySelector('.page-title');
    expect(breadcrumb).toBeTruthy();
    const position = breadcrumb!.compareDocumentPosition(title!);
    expect(position & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();

    const link = breadcrumb?.querySelector<HTMLAnchorElement>('.breadcrumb-link');
    expect(link?.getAttribute('href')).toBe('/');
    expect(link?.textContent?.trim()).toBe('Search');
    expect(breadcrumb?.querySelector('.breadcrumb-current')?.textContent?.trim()).toBe('Imprint');

    TestBed.inject(Language).setLanguage('de');
    fixture.detectChanges();

    expect(link?.textContent?.trim()).toBe('Suche');
    expect(breadcrumb?.querySelector('.breadcrumb-current')?.textContent?.trim()).toBe('Impressum');
  });

  it('shows English headings and labels by default, alongside the unchanged fixed data', () => {
    const fixture = createFixture();
    const el = fixture.nativeElement as HTMLElement;
    const text = el.textContent ?? '';

    expect(text).toContain('Imprint');
    expect(text).toContain('Information pursuant to § 5 DDG');
    expect(text).toContain('Germany');
    expect(text).toContain('Contact');
    expect(text).toContain('Email:');
    expect(text).toContain('Phone:');
    expect(text).toContain('VAT Identification Number');
    expect(text).toContain('EU Dispute Resolution');
    expect(text).toContain('Consumer Dispute Resolution');
    expect(text).toContain('not willing and not obligated');
    expect(text).toContain('Liability for Content');
    expect(text).toContain('Liability for Links');
    expectFixedData(el);
  });

  it('shows German headings and labels after switching to German, alongside the same unchanged fixed data', () => {
    const fixture = createFixture('de');
    const el = fixture.nativeElement as HTMLElement;
    const text = el.textContent ?? '';

    expect(text).toContain('Impressum');
    expect(text).toContain('Angaben gemäß § 5 DDG');
    expect(text).toContain('Deutschland');
    expect(text).toContain('Kontakt');
    expect(text).toContain('E-Mail:');
    expect(text).toContain('Telefon:');
    expect(text).toContain('Umsatzsteuer-ID');
    expect(text).toContain('EU-Streitschlichtung');
    expect(text).toContain('Verbraucherstreitbeilegung');
    expect(text).toContain('nicht bereit und nicht verpflichtet');
    expect(text).toContain('Haftung für Inhalte');
    expect(text).toContain('Haftung für Links');
    expectFixedData(el);
  });
});
