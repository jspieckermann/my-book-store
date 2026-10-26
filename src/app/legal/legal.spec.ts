import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { LegalPage } from './legal';
import { Language } from '../language/language';
import { LEGAL_NOTICES } from './legal-notices-data';

describe('LegalPage', () => {
  afterEach(() => {
    localStorage.removeItem('language');
  });

  function createFixture(locale?: 'en' | 'de') {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    if (locale) {
      TestBed.inject(Language).setLanguage(locale);
    }
    const fixture = TestBed.createComponent(LegalPage);
    fixture.detectChanges();
    return fixture;
  }

  it('renders the page', () => {
    const fixture = createFixture();

    expect(fixture.componentInstance).toBeTruthy();
  });

  it('shows a breadcrumb above the title, linking to the main page, with the Legal page as current', () => {
    const fixture = createFixture();
    const el = fixture.nativeElement as HTMLElement;

    const breadcrumb = el.querySelector('app-breadcrumb');
    const title = el.querySelector('.page-title');
    expect(breadcrumb).toBeTruthy();
    const position = breadcrumb!.compareDocumentPosition(title!);
    expect(position & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();

    const link = breadcrumb?.querySelector<HTMLAnchorElement>('.breadcrumb-link');
    expect(link?.getAttribute('href')).toBe('/');
    expect(breadcrumb?.querySelector('.breadcrumb-current')?.textContent?.trim()).toBe('Legal');
  });

  it('renders one row per dependency, each showing name, version, and license — every entry included, none filtered out', () => {
    const fixture = createFixture();
    const el = fixture.nativeElement as HTMLElement;

    const rows = el.querySelectorAll('.legal-row');
    expect(rows.length).toBe(LEGAL_NOTICES.length);
    expect(LEGAL_NOTICES.length).toBeGreaterThan(0);

    LEGAL_NOTICES.forEach((notice, i) => {
      const row = rows[i];
      expect(row.querySelector('.legal-name')?.textContent?.trim()).toBe(notice.name);
      expect(row.querySelector('.legal-version')?.textContent?.trim()).toBe(notice.version);
      expect(row.querySelector('.legal-license')?.textContent?.trim()).toBe(notice.license);
    });
  });

  it('includes a known production dependency with a non-empty version and license', () => {
    const fixture = createFixture();
    const el = fixture.nativeElement as HTMLElement;

    const angularCore = LEGAL_NOTICES.find((n) => n.name === '@angular/core');
    expect(angularCore).toBeTruthy();
    expect(el.textContent).toContain('@angular/core');
    expect(angularCore!.version.length).toBeGreaterThan(0);
    expect(angularCore!.license.length).toBeGreaterThan(0);
  });

  it('shows English heading and labels by default', () => {
    const fixture = createFixture();
    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';

    expect(text).toContain('Legal');
    expect(text).toContain('Package');
    expect(text).toContain('Version');
    expect(text).toContain('License');
  });

  it('shows German heading and labels after switching to German, while dependency data stays unchanged', () => {
    const fixture = createFixture('de');
    const el = fixture.nativeElement as HTMLElement;
    const text = el.textContent ?? '';

    expect(text).toContain('Rechtliches');
    expect(text).toContain('Paket');
    expect(text).toContain('Version');
    expect(text).toContain('Lizenz');

    const firstNotice = LEGAL_NOTICES[0];
    const firstRow = el.querySelector('.legal-row');
    expect(firstRow?.querySelector('.legal-name')?.textContent?.trim()).toBe(firstNotice.name);
    expect(firstRow?.querySelector('.legal-version')?.textContent?.trim()).toBe(firstNotice.version);
    expect(firstRow?.querySelector('.legal-license')?.textContent?.trim()).toBe(firstNotice.license);
  });
});
