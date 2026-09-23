import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Footer } from './footer';

describe('Footer', () => {
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

  it('renders a link to the Impressum page', () => {
    const fixture = createFixture();
    const el = fixture.nativeElement as HTMLElement;

    const link = el.querySelector<HTMLAnchorElement>('.impressum-link');
    expect(link).toBeTruthy();
    expect(link?.textContent?.trim()).toBe('Impressum');
    expect(link?.getAttribute('href')).toBe('/impressum');
  });
});
