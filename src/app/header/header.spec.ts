import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { signal } from '@angular/core';
import { Header } from './header';
import { Cart } from '../cart/cart';
import { GoogleAuth } from '../google-auth/google-auth';

describe('Header', () => {
  let loginMock: ReturnType<typeof vi.fn>;
  let logoutMock: ReturnType<typeof vi.fn>;

  afterEach(() => {
    localStorage.removeItem('language');
  });

  function createFixture(user: { name: string } | null, count: number) {
    loginMock = vi.fn();
    logoutMock = vi.fn();
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: Cart, useValue: { count: signal(count) } },
        { provide: GoogleAuth, useValue: { user: signal(user), login: loginMock, logout: logoutMock } },
      ],
    });
    const fixture = TestBed.createComponent(Header);
    fixture.detectChanges();
    return fixture;
  }

  it('renders the logo and title inside a single link to the main page', () => {
    const fixture = createFixture(null, 0);
    const el = fixture.nativeElement as HTMLElement;

    const brand = el.querySelector('.brand');
    expect(brand).toBeTruthy();
    expect(brand?.tagName).toBe('A');
    expect(brand?.getAttribute('href')).toBe('/');
    expect(brand?.querySelector('.logo')).toBeTruthy();
    expect(brand?.querySelector('.title')?.textContent).toBe('My-Book-Store');
  });

  it('hides the cart icon entirely when signed out', () => {
    const fixture = createFixture(null, 0);

    expect((fixture.nativeElement as HTMLElement).querySelector('.cart')).toBeNull();
  });

  it('shows a non-interactive cart icon with no badge when signed in and the cart is empty', () => {
    const fixture = createFixture({ name: 'Ada' }, 0);
    const el = fixture.nativeElement as HTMLElement;

    const cart = el.querySelector('.cart');
    expect(cart).toBeTruthy();
    expect(cart?.tagName).toBe('SPAN');
    expect(el.querySelector('.cart-badge')).toBeNull();
  });

  it('shows an interactive cart link with a badge when signed in and the cart has items', () => {
    const fixture = createFixture({ name: 'Ada' }, 3);
    const el = fixture.nativeElement as HTMLElement;

    const cart = el.querySelector('.cart');
    expect(cart).toBeTruthy();
    expect(cart?.tagName).toBe('A');
    expect(cart?.getAttribute('href')).toBe('/cart');
    expect(el.querySelector('.cart-badge')?.textContent?.trim()).toBe('3');
  });

  it('shows a login button when signed out, wired to GoogleAuth.login()', () => {
    const fixture = createFixture(null, 0);
    const el = fixture.nativeElement as HTMLElement;

    expect(el.querySelector('.user-name')).toBeNull();
    const loginButton = el.querySelector<HTMLButtonElement>('.login');
    expect(loginButton).toBeTruthy();

    loginButton!.click();

    expect(loginMock).toHaveBeenCalled();
  });

  it('shows the user name and a logout button when signed in, wired to GoogleAuth.logout()', () => {
    const fixture = createFixture({ name: 'Ada Lovelace' }, 0);
    const el = fixture.nativeElement as HTMLElement;

    expect(el.querySelector('.login')).toBeNull();
    expect(el.querySelector('.user-name')?.textContent).toContain('Ada Lovelace');
    const logoutButton = el.querySelector<HTMLButtonElement>('.logout');
    expect(logoutButton).toBeTruthy();

    logoutButton!.click();

    expect(logoutMock).toHaveBeenCalled();
  });

  it('shows the language switcher control when signed out', () => {
    const fixture = createFixture(null, 0);
    expect((fixture.nativeElement as HTMLElement).querySelector('.language-switcher')).toBeTruthy();
  });

  it('shows the language switcher control when signed in', () => {
    const fixture = createFixture({ name: 'Ada' }, 0);
    expect((fixture.nativeElement as HTMLElement).querySelector('.language-switcher')).toBeTruthy();
  });

  it('shows the current language as flag + code on the toggle button, and the menu is closed by default', () => {
    const fixture = createFixture(null, 0);
    const el = fixture.nativeElement as HTMLElement;

    expect(el.querySelector('.language-switcher-toggle')?.textContent).toContain('EN');
    expect(el.querySelector('.language-switcher-menu')).toBeNull();
  });

  it('opens the menu on click, showing a flag + code option for each language', () => {
    const fixture = createFixture(null, 0);
    const el = fixture.nativeElement as HTMLElement;

    el.querySelector<HTMLButtonElement>('.language-switcher-toggle')!.click();
    fixture.detectChanges();

    const options = Array.from(el.querySelectorAll<HTMLButtonElement>('.language-switcher-option'));
    expect(options.map((option) => option.textContent?.trim())).toEqual(['🇬🇧 EN', '🇩🇪 DE']);
    expect(options[0].classList.contains('selected')).toBe(true);
  });

  it('switches the language and closes the menu when an option is selected', () => {
    const fixture = createFixture(null, 0);
    const el = fixture.nativeElement as HTMLElement;

    el.querySelector<HTMLButtonElement>('.language-switcher-toggle')!.click();
    fixture.detectChanges();
    const options = Array.from(el.querySelectorAll<HTMLButtonElement>('.language-switcher-option'));
    options[1].click();
    fixture.detectChanges();

    expect(el.querySelector('.language-switcher-toggle')?.textContent).toContain('DE');
    expect(el.querySelector('.language-switcher-menu')).toBeNull();
  });

  it('closes the menu when clicking outside it', () => {
    const fixture = createFixture(null, 0);
    const el = fixture.nativeElement as HTMLElement;

    el.querySelector<HTMLButtonElement>('.language-switcher-toggle')!.click();
    fixture.detectChanges();
    expect(el.querySelector('.language-switcher-menu')).toBeTruthy();

    document.body.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    fixture.detectChanges();

    expect(el.querySelector('.language-switcher-menu')).toBeNull();
  });
});
