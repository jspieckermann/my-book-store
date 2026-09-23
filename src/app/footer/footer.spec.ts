import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Footer } from './footer';
import { Language } from '../language/language';

describe('Footer', () => {
  afterEach(() => {
    localStorage.removeItem('language');
  });

  function createFixture() {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    const fixture = TestBed.createComponent(Footer);
    fixture.detectChanges();
    return fixture;
  }

  it('creates and renders the version', () => {
    const fixture = createFixture();

    expect(fixture.componentInstance).toBeTruthy();
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('v1.0');
  });

  it('renders a link to the Impressum page, with text following the selected language', () => {
    const fixture = createFixture();
    const el = fixture.nativeElement as HTMLElement;

    const link = el.querySelector<HTMLAnchorElement>('.impressum-link');
    expect(link).toBeTruthy();
    expect(link?.textContent?.trim()).toBe('Imprint');
    expect(link?.getAttribute('href')).toBe('/impressum');

    TestBed.inject(Language).setLanguage('de');
    fixture.detectChanges();

    expect(link?.textContent?.trim()).toBe('Impressum');
  });
});
