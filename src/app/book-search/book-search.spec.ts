import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { Subject } from 'rxjs';
import { BookSearch } from './book-search';
import { GoogleBooks, SearchResultsPage } from './google-books';
import { Cart } from '../cart/cart';
import { GoogleAuth } from '../google-auth/google-auth';
import { Language } from '../language/language';

describe('BookSearch', () => {
  let searchResult$: Subject<SearchResultsPage>;
  let searchMock: ReturnType<typeof vi.fn>;

  afterEach(() => {
    localStorage.removeItem('language');
  });

  function createComponent(): BookSearch {
    searchResult$ = new Subject<SearchResultsPage>();
    searchMock = vi.fn(() => searchResult$);
    TestBed.configureTestingModule({
      providers: [
        BookSearch,
        { provide: GoogleBooks, useValue: { search: searchMock } },
        { provide: Cart, useValue: { add: vi.fn(), remove: vi.fn() } },
        { provide: GoogleAuth, useValue: { user: signal(null), login: vi.fn(), logout: vi.fn() } },
      ],
    });
    return TestBed.inject(BookSearch);
  }

  function setQuery(component: BookSearch, value: string): void {
    component['query'].set(value);
  }

  function createFixture() {
    searchResult$ = new Subject<SearchResultsPage>();
    searchMock = vi.fn(() => searchResult$);
    const searchRandomMock = vi.fn(() => new Subject<SearchResultsPage>());
    TestBed.configureTestingModule({
      providers: [
        { provide: GoogleBooks, useValue: { search: searchMock, searchRandom: searchRandomMock } },
        { provide: Cart, useValue: { add: vi.fn(), remove: vi.fn() } },
        { provide: GoogleAuth, useValue: { user: signal(null), login: vi.fn(), logout: vi.fn() } },
      ],
    });
    const fixture = TestBed.createComponent(BookSearch);
    fixture.detectChanges();
    return fixture;
  }

  it('disables search for an empty or whitespace-only query', () => {
    const component = createComponent();

    setQuery(component, '');
    expect(component['isSearchDisabled']()).toBe(true);

    setQuery(component, '   ');
    expect(component['isSearchDisabled']()).toBe(true);

    setQuery(component, 'Dune');
    expect(component['isSearchDisabled']()).toBe(false);
  });

  it('does nothing when search() is called with an empty query', () => {
    const component = createComponent();

    component['search']();

    expect(searchMock).not.toHaveBeenCalled();
    expect(component['state']()).toEqual({ kind: 'idle' });
  });

  it('shows a loading state while the request is in flight', () => {
    const component = createComponent();
    setQuery(component, 'Dune');

    component['search']();

    expect(component['state']()).toEqual({ kind: 'loading' });
    expect(component['isSearchDisabled']()).toBe(true);
    expect(searchMock).toHaveBeenCalledWith('Dune', 1);
  });

  it('shows a found state with results', () => {
    const component = createComponent();
    setQuery(component, 'Dune');
    component['search']();

    searchResult$.next({ books: [{ title: 'Dune', price: 24.99 }], totalItems: 1 });

    expect(component['state']()).toEqual({ kind: 'found', books: [{ title: 'Dune', price: 24.99 }], totalItems: 1 });
  });

  it('shows a not-found state when no books match', () => {
    const component = createComponent();
    setQuery(component, 'zzzzz');
    component['search']();

    searchResult$.next({ books: [], totalItems: 0 });

    expect(component['state']()).toEqual({ kind: 'not-found' });
  });

  it('shows an error state when the request fails', () => {
    const component = createComponent();
    setQuery(component, 'Dune');
    component['search']();

    searchResult$.error(new Error('boom'));

    expect(component['state']()).toEqual({ kind: 'error' });
  });

  it('computes pagination signals at page-size boundaries', () => {
    const component = createComponent();
    setQuery(component, 'Dune');
    component['search']();
    searchResult$.next({ books: [{ title: 'Dune', price: 24.99 }], totalItems: 10 });

    expect(component['hasNextPage']()).toBe(false);
    expect(component['hasPreviousPage']()).toBe(false);
    expect(component['totalPages']()).toBe(1);
  });

  it('has a next page when totalItems is 11 (just over one page)', () => {
    const component = createComponent();
    setQuery(component, 'Dune');
    component['search']();
    searchResult$.next({ books: [{ title: 'Dune', price: 24.99 }], totalItems: 11 });

    expect(component['hasNextPage']()).toBe(true);
    expect(component['totalPages']()).toBe(2);
  });

  it('has a next page when totalItems is 20 (exactly two pages)', () => {
    const component = createComponent();
    setQuery(component, 'Dune');
    component['search']();
    searchResult$.next({ books: [{ title: 'Dune', price: 24.99 }], totalItems: 20 });

    expect(component['hasNextPage']()).toBe(true);
    expect(component['totalPages']()).toBe(2);
  });

  it('goToNextPage() fetches the next page using the submitted query, not a since-edited live input', () => {
    const component = createComponent();
    setQuery(component, 'Dune');
    component['search']();
    searchResult$.next({ books: [{ title: 'Dune p1', price: 24.99 }], totalItems: 11 });

    setQuery(component, 'something else entirely');
    component['goToNextPage']();

    expect(searchMock).toHaveBeenLastCalledWith('Dune', 2);

    searchResult$.next({ books: [{ title: 'Dune p2', price: 24.99 }], totalItems: 11 });
    expect(component['page']()).toBe(2);
    expect(component['state']()).toEqual({ kind: 'found', books: [{ title: 'Dune p2', price: 24.99 }], totalItems: 11 });
    expect(component['hasPreviousPage']()).toBe(true);
  });

  it('goToPreviousPage() returns to the prior page', () => {
    const component = createComponent();
    setQuery(component, 'Dune');
    component['search']();
    searchResult$.next({ books: [{ title: 'Dune p1', price: 24.99 }], totalItems: 11 });
    component['goToNextPage']();
    searchResult$.next({ books: [{ title: 'Dune p2', price: 24.99 }], totalItems: 11 });

    component['goToPreviousPage']();

    expect(searchMock).toHaveBeenLastCalledWith('Dune', 1);
    searchResult$.next({ books: [{ title: 'Dune p1', price: 24.99 }], totalItems: 11 });
    expect(component['page']()).toBe(1);
  });

  it('reverts to the previous page when a next-page fetch returns zero books', () => {
    const component = createComponent();
    setQuery(component, 'Dune');
    component['search']();
    const firstPageState = { kind: 'found' as const, books: [{ title: 'Dune p1', price: 24.99 }], totalItems: 11 };
    searchResult$.next({ books: firstPageState.books, totalItems: firstPageState.totalItems });

    component['goToNextPage']();
    searchResult$.next({ books: [], totalItems: 11 });

    expect(component['state']()).toEqual(firstPageState);
    expect(component['page']()).toBe(1);
  });

  it('resets to page 1 when a new search is submitted', () => {
    const component = createComponent();
    setQuery(component, 'Dune');
    component['search']();
    searchResult$.next({ books: [{ title: 'Dune p1', price: 24.99 }], totalItems: 11 });
    component['goToNextPage']();
    searchResult$.next({ books: [{ title: 'Dune p2', price: 24.99 }], totalItems: 11 });
    expect(component['page']()).toBe(2);

    setQuery(component, 'Foundation');
    component['search']();

    expect(component['page']()).toBe(1);
    expect(searchMock).toHaveBeenLastCalledWith('Foundation', 1);
  });

  it('does not trigger a fetch when the language changes while idle', () => {
    createComponent();
    searchMock.mockClear();

    TestBed.inject(Language).setLanguage('de');
    TestBed.tick();

    expect(searchMock).not.toHaveBeenCalled();
  });

  it('re-sends the active search and preserves the current page when the language changes', () => {
    const component = createComponent();
    setQuery(component, 'Dune');
    component['search']();
    searchResult$.next({ books: [{ title: 'Dune p1', price: 24.99 }], totalItems: 11 });
    component['goToNextPage']();
    searchResult$.next({ books: [{ title: 'Dune p2', price: 24.99 }], totalItems: 11 });
    expect(component['page']()).toBe(2);
    searchMock.mockClear();

    TestBed.inject(Language).setLanguage('de');
    TestBed.tick();

    expect(searchMock).toHaveBeenCalledWith('Dune', 2);
  });

  it('renders the search form with a disabled button until text is typed', () => {
    const fixture = createFixture();
    const el = fixture.nativeElement as HTMLElement;
    const input = el.querySelector<HTMLInputElement>('.search-input')!;
    const button = el.querySelector<HTMLButtonElement>('.search-button')!;

    expect(button.disabled).toBe(true);

    input.value = 'Dune';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(button.disabled).toBe(false);
  });

  it('submitting the form triggers a search', () => {
    const fixture = createFixture();
    const el = fixture.nativeElement as HTMLElement;
    const input = el.querySelector<HTMLInputElement>('.search-input')!;
    input.value = 'Dune';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    el.querySelector('form')!.dispatchEvent(new Event('submit'));
    fixture.detectChanges();

    expect(searchMock).toHaveBeenCalledWith('Dune', 1);
    expect(el.querySelector('.status-loading')).toBeTruthy();
  });

  it('renders the error message when the request fails', () => {
    const fixture = createFixture();
    const component = fixture.componentInstance;
    setQuery(component, 'Dune');
    component['search']();

    searchResult$.error(new Error('boom'));
    fixture.detectChanges();

    expect((fixture.nativeElement as HTMLElement).querySelector('.status-error')).toBeTruthy();
  });

  it('renders the not-found message when no books match', () => {
    const fixture = createFixture();
    const component = fixture.componentInstance;
    setQuery(component, 'zzzzz');
    component['search']();

    searchResult$.next({ books: [], totalItems: 0 });
    fixture.detectChanges();

    expect((fixture.nativeElement as HTMLElement).querySelector('.status-not-found')).toBeTruthy();
  });

  it('renders result cards without pagination when totalItems is 10 or fewer', () => {
    const fixture = createFixture();
    const component = fixture.componentInstance;
    setQuery(component, 'Dune');
    component['search']();

    searchResult$.next({ books: [{ title: 'Dune', price: 24.99 }, { title: 'Dune Messiah', price: 19.99 }], totalItems: 2 });
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelectorAll('.book-card').length).toBe(2);
    expect(el.querySelector('.pagination')).toBeNull();
  });

  it('renders pagination with correct disabled states and page text when totalItems exceeds 10', () => {
    const fixture = createFixture();
    const component = fixture.componentInstance;
    setQuery(component, 'Dune');
    component['search']();
    searchResult$.next({ books: [{ title: 'Dune p1', price: 24.99 }], totalItems: 11 });
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    const [previousButton, nextButton] = Array.from(
      el.querySelectorAll<HTMLButtonElement>('.pagination-button'),
    );
    expect(previousButton.disabled).toBe(true);
    expect(nextButton.disabled).toBe(false);
    expect(el.querySelector('.pagination-page')?.textContent).toContain('Page 1 of 2');

    nextButton.click();
    searchResult$.next({ books: [{ title: 'Dune p2', price: 24.99 }], totalItems: 11 });
    fixture.detectChanges();

    expect(previousButton.disabled).toBe(false);
    expect(nextButton.disabled).toBe(true);
    expect(el.querySelector('.pagination-page')?.textContent).toContain('Page 2 of 2');

    previousButton.click();
    searchResult$.next({ books: [{ title: 'Dune p1', price: 24.99 }], totalItems: 11 });
    fixture.detectChanges();

    expect(el.querySelector('.pagination-page')?.textContent).toContain('Page 1 of 2');
  });

  it('shows the promo section before any search has been performed', () => {
    const fixture = createFixture();

    expect((fixture.nativeElement as HTMLElement).querySelector('app-promo-section')).toBeTruthy();
  });

  it('shows the promo section alongside the not-found message', () => {
    const fixture = createFixture();
    const component = fixture.componentInstance;
    setQuery(component, 'zzzzz');
    component['search']();

    searchResult$.next({ books: [], totalItems: 0 });
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.status-not-found')).toBeTruthy();
    expect(el.querySelector('app-promo-section')).toBeTruthy();
  });

  it('hides the promo section while a search is loading', () => {
    const fixture = createFixture();
    const component = fixture.componentInstance;
    setQuery(component, 'Dune');

    component['search']();
    fixture.detectChanges();

    expect((fixture.nativeElement as HTMLElement).querySelector('app-promo-section')).toBeNull();
  });

  it('hides the promo section when a search fails', () => {
    const fixture = createFixture();
    const component = fixture.componentInstance;
    setQuery(component, 'Dune');
    component['search']();

    searchResult$.error(new Error('boom'));
    fixture.detectChanges();

    expect((fixture.nativeElement as HTMLElement).querySelector('app-promo-section')).toBeNull();
  });

  it('hides the promo section when results are found', () => {
    const fixture = createFixture();
    const component = fixture.componentInstance;
    setQuery(component, 'Dune');
    component['search']();

    searchResult$.next({ books: [{ title: 'Dune', price: 24.99 }], totalItems: 1 });
    fixture.detectChanges();

    expect((fixture.nativeElement as HTMLElement).querySelector('app-promo-section')).toBeNull();
  });
});
