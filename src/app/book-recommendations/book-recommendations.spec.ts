import { TestBed } from '@angular/core/testing';
import { signal, WritableSignal } from '@angular/core';
import { Subject } from 'rxjs';
import { BookRecommendations } from './book-recommendations';
import { BookSummary, GoogleBooks, SearchResultsPage } from '../book-search/google-books';
import { Cart } from '../cart/cart';

describe('BookRecommendations', () => {
  let searchResult$: Subject<SearchResultsPage>;
  let searchByAuthorsMock: ReturnType<typeof vi.fn>;
  let cartBooks: WritableSignal<BookSummary[]>;

  afterEach(() => {
    localStorage.removeItem('language');
  });

  function book(title: string, authors: string[]): BookSummary {
    return { title, authors, price: 10 };
  }

  function createFixture(initialBooks: BookSummary[] = []) {
    searchResult$ = new Subject<SearchResultsPage>();
    searchByAuthorsMock = vi.fn(() => searchResult$);
    cartBooks = signal<BookSummary[]>(initialBooks);
    TestBed.configureTestingModule({
      providers: [
        { provide: GoogleBooks, useValue: { searchByAuthors: searchByAuthorsMock } },
        { provide: Cart, useValue: { books: cartBooks } },
      ],
    });
    const fixture = TestBed.createComponent(BookRecommendations);
    fixture.detectChanges();
    TestBed.tick();
    return fixture;
  }

  it('does not fetch when the cart is empty', () => {
    createFixture([]);

    expect(searchByAuthorsMock).not.toHaveBeenCalled();
  });

  it("fetches recommendations using the cart's unique authors when the cart has books", () => {
    createFixture([book('Dune', ['Frank Herbert']), book('Foundation', ['Isaac Asimov'])]);

    expect(searchByAuthorsMock).toHaveBeenCalledWith(['Frank Herbert', 'Isaac Asimov']);
  });

  it('caps the queried authors at 5 unique authors', () => {
    createFixture([
      book('B1', ['A1']),
      book('B2', ['A2']),
      book('B3', ['A3']),
      book('B4', ['A4']),
      book('B5', ['A5']),
      book('B6', ['A6']),
    ]);

    expect(searchByAuthorsMock).toHaveBeenCalledWith(['A1', 'A2', 'A3', 'A4', 'A5']);
  });

  it('excludes recommendations whose title matches a book already in the cart, case-insensitively', () => {
    const fixture = createFixture([book('Dune', ['Frank Herbert'])]);

    searchResult$.next({
      books: [book('DUNE', ['Frank Herbert']), book('Children of Dune', ['Frank Herbert'])],
      totalItems: 2,
    });
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelectorAll('app-recommendation-card').length).toBe(1);
    expect(el.textContent).toContain('Children of Dune');
  });

  it('refetches when a book by a new author is added to the cart', () => {
    createFixture([book('Dune', ['Frank Herbert'])]);
    searchResult$.next({ books: [], totalItems: 0 });
    searchByAuthorsMock.mockClear();

    cartBooks.update((books) => [...books, book('Foundation', ['Isaac Asimov'])]);
    TestBed.tick();

    expect(searchByAuthorsMock).toHaveBeenCalledWith(['Frank Herbert', 'Isaac Asimov']);
  });

  it('does not refetch when a book by an already-represented author is added', () => {
    createFixture([book('Dune', ['Frank Herbert'])]);
    searchResult$.next({ books: [], totalItems: 0 });
    searchByAuthorsMock.mockClear();

    cartBooks.update((books) => [...books, book('Dune Messiah', ['Frank Herbert'])]);
    TestBed.tick();

    expect(searchByAuthorsMock).not.toHaveBeenCalled();
  });

  it('renders nothing when the fetch returns no results', () => {
    const fixture = createFixture([book('Dune', ['Frank Herbert'])]);

    searchResult$.next({ books: [], totalItems: 0 });
    fixture.detectChanges();

    expect((fixture.nativeElement as HTMLElement).querySelector('.book-recommendations')).toBeNull();
  });

  it('shows no pagination controls when everything fits on one page', () => {
    const fixture = createFixture([book('Dune', ['Frank Herbert'])]);

    searchResult$.next({
      books: [book('B1', ['Frank Herbert']), book('B2', ['Frank Herbert'])],
      totalItems: 2,
    });
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelectorAll('app-recommendation-card').length).toBe(2);
    expect(el.querySelector('.pagination-arrow')).toBeNull();
  });

  it('clears recommendations when the cart becomes empty after having items', () => {
    const fixture = createFixture([book('Dune', ['Frank Herbert'])]);
    searchResult$.next({ books: [book('Foundation', ['Isaac Asimov'])], totalItems: 1 });
    fixture.detectChanges();
    expect((fixture.nativeElement as HTMLElement).querySelector('.book-recommendations')).toBeTruthy();

    cartBooks.set([]);
    TestBed.tick();
    fixture.detectChanges();

    expect((fixture.nativeElement as HTMLElement).querySelector('.book-recommendations')).toBeNull();
  });

  it('clears recommendations and does not throw when the fetch errors', () => {
    const fixture = createFixture([book('Dune', ['Frank Herbert'])]);

    expect(() => {
      searchResult$.error(new Error('boom'));
      fixture.detectChanges();
    }).not.toThrow();

    expect((fixture.nativeElement as HTMLElement).querySelector('.book-recommendations')).toBeNull();
  });

  it('goToNextPage does nothing when already on the last page', () => {
    const fixture = createFixture([book('Dune', ['Frank Herbert'])]);
    searchResult$.next({ books: [book('B1', ['Frank Herbert']), book('B2', ['Frank Herbert'])], totalItems: 2 });
    fixture.detectChanges();

    fixture.componentInstance['goToNextPage']();

    expect(fixture.componentInstance['pageIndex']()).toBe(0);
  });

  it('goToPreviousPage does nothing when already on the first page', () => {
    const fixture = createFixture([book('Dune', ['Frank Herbert'])]);
    searchResult$.next({ books: [book('B1', ['Frank Herbert']), book('B2', ['Frank Herbert'])], totalItems: 2 });
    fixture.detectChanges();

    fixture.componentInstance['goToPreviousPage']();

    expect(fixture.componentInstance['pageIndex']()).toBe(0);
  });

  it('shows the correct page window and disables Previous/Next at the ends', () => {
    const fixture = createFixture([book('Dune', ['Frank Herbert'])]);
    const books = Array.from({ length: 6 }, (_, i) => book(`Book ${i + 1}`, ['Frank Herbert']));
    searchResult$.next({ books, totalItems: 6 });
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelectorAll('app-recommendation-card').length).toBe(3);
    const [previousButton, nextButton] = Array.from(el.querySelectorAll<HTMLButtonElement>('.pagination-arrow'));
    expect(previousButton.disabled).toBe(true);
    expect(nextButton.disabled).toBe(false);

    nextButton.click();
    fixture.detectChanges();

    expect(el.querySelectorAll('app-recommendation-card').length).toBe(3);
    expect(previousButton.disabled).toBe(false);
    expect(nextButton.disabled).toBe(true);

    previousButton.click();
    fixture.detectChanges();

    expect(el.querySelectorAll('app-recommendation-card').length).toBe(3);
    expect(previousButton.disabled).toBe(true);
  });
});
