import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Breadcrumb } from './breadcrumb';

describe('Breadcrumb', () => {
  afterEach(() => {
    localStorage.removeItem('language');
  });

  function createFixture(currentPageLabel: string) {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    const fixture = TestBed.createComponent(Breadcrumb);
    fixture.componentRef.setInput('currentPageLabel', currentPageLabel);
    fixture.detectChanges();
    return fixture;
  }

  it("links back to the main page, labeled with the main page's title", () => {
    const fixture = createFixture('Your Cart');
    const link = (fixture.nativeElement as HTMLElement).querySelector<HTMLAnchorElement>('.breadcrumb-link');

    expect(link).toBeTruthy();
    expect(link?.getAttribute('href')).toBe('/');
    expect(link?.textContent?.trim()).toBe('Search');
  });

  it('shows the current page label, not as a link, marked as the current page', () => {
    const fixture = createFixture('Your Cart');
    const el = fixture.nativeElement as HTMLElement;

    const current = el.querySelector('.breadcrumb-current');
    expect(current?.textContent?.trim()).toBe('Your Cart');
    expect(current?.tagName).not.toBe('A');
    expect(current?.getAttribute('aria-current')).toBe('page');
  });

  it('renders a different current page label as given', () => {
    const fixture = createFixture('Imprint');
    const el = fixture.nativeElement as HTMLElement;

    expect(el.querySelector('.breadcrumb-current')?.textContent?.trim()).toBe('Imprint');
  });
});
