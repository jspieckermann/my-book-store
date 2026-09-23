import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { GoogleBooks } from './google-books';
import { environment } from '../../environments/environment';
import { Language } from '../language/language';

describe('GoogleBooks', () => {
  let googleBooks: GoogleBooks;
  let httpMock: HttpTestingController;
  const originalApiKey = environment.googleBooksApiKey;

  beforeEach(() => {
    localStorage.removeItem('language');
    TestBed.configureTestingModule({
      providers: [GoogleBooks, provideHttpClient(), provideHttpClientTesting()],
    });
    googleBooks = TestBed.inject(GoogleBooks);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    environment.googleBooksApiKey = originalApiKey;
    localStorage.removeItem('language');
    httpMock.verify();
  });

  it('queries by ISBN for a 13-digit query', () => {
    googleBooks.search('9783140225915', 1).subscribe();

    const req = httpMock.expectOne(() => true);
    expect(req.request.params.get('q')).toBe('isbn:9783140225915');
    req.flush({ items: [], totalItems: 0 });
  });

  it('queries by ISBN for a hyphenated 10-digit query', () => {
    googleBooks.search('0-13-468599-7', 1).subscribe();

    const req = httpMock.expectOne(() => true);
    expect(req.request.params.get('q')).toBe('isbn:0134685997');
    req.flush({ items: [], totalItems: 0 });
  });

  it('queries generally for a non-ISBN query', () => {
    googleBooks.search('Faust Goethe', 1).subscribe();

    const req = httpMock.expectOne(() => true);
    expect(req.request.params.get('q')).toBe('Faust Goethe');
    req.flush({ items: [], totalItems: 0 });
  });

  it('computes startIndex/maxResults for page 1', () => {
    googleBooks.search('anything', 1).subscribe();

    const req = httpMock.expectOne(() => true);
    expect(req.request.params.get('startIndex')).toBe('0');
    expect(req.request.params.get('maxResults')).toBe('10');
    req.flush({ items: [], totalItems: 0 });
  });

  it('computes startIndex for page 3', () => {
    googleBooks.search('anything', 3).subscribe();

    const req = httpMock.expectOne(() => true);
    expect(req.request.params.get('startIndex')).toBe('20');
    req.flush({ items: [], totalItems: 0 });
  });

  it('includes the API key when configured', () => {
    environment.googleBooksApiKey = 'test-api-key';

    googleBooks.search('anything', 1).subscribe();

    const req = httpMock.expectOne(() => true);
    expect(req.request.params.get('key')).toBe('test-api-key');
    req.flush({ items: [], totalItems: 0 });
  });

  it('omits the API key when not configured', () => {
    environment.googleBooksApiKey = '';

    googleBooks.search('anything', 1).subscribe();

    const req = httpMock.expectOne(() => true);
    expect(req.request.params.has('key')).toBe(false);
    req.flush({ items: [], totalItems: 0 });
  });

  it('maps each response item to a BookSummary, rewriting http cover URLs to https', () => {
    let result: { books: { price: number }[]; totalItems: number } | undefined;
    googleBooks.search('anything', 1).subscribe((page) => (result = page));

    httpMock.expectOne(() => true).flush({
      totalItems: 2,
      items: [
        {
          volumeInfo: {
            title: 'Dune',
            authors: ['Frank Herbert'],
            publisher: 'Ace',
            publishedDate: '1965',
            description: 'A desert planet.',
            imageLinks: { thumbnail: 'http://example.com/dune.jpg' },
          },
        },
        { volumeInfo: { title: 'No cover' } },
      ],
    });

    expect(result).toEqual({
      totalItems: 2,
      books: [
        {
          title: 'Dune',
          authors: ['Frank Herbert'],
          publisher: 'Ace',
          publishedDate: '1965',
          description: 'A desert planet.',
          coverImageUrl: 'https://example.com/dune.jpg',
          price: expect.any(Number),
        },
        {
          title: 'No cover',
          authors: undefined,
          publisher: undefined,
          publishedDate: undefined,
          description: undefined,
          coverImageUrl: undefined,
          price: expect.any(Number),
        },
      ],
    });
    for (const book of result?.books ?? []) {
      expect(book.price).toBeGreaterThanOrEqual(10);
      expect(book.price).toBeLessThanOrEqual(70.5);
    }
  });

  it('maps averageRating/ratingsCount through when present, and omits them when absent', () => {
    let result: { books: { averageRating?: number; ratingsCount?: number }[]; totalItems: number } | undefined;
    googleBooks.search('anything', 1).subscribe((page) => (result = page));

    httpMock.expectOne(() => true).flush({
      totalItems: 2,
      items: [
        { volumeInfo: { title: 'Dune', averageRating: 4.5, ratingsCount: 128 } },
        { volumeInfo: { title: 'Unrated' } },
      ],
    });

    expect(result?.books[0].averageRating).toBe(4.5);
    expect(result?.books[0].ratingsCount).toBe(128);
    expect(result?.books[1].averageRating).toBeUndefined();
    expect(result?.books[1].ratingsCount).toBeUndefined();
  });

  it('generates a random price between 10.00 and 70.50 with at most 2 decimal places', () => {
    let result: { books: { price: number }[]; totalItems: number } | undefined;
    googleBooks.search('anything', 1).subscribe((page) => (result = page));

    httpMock.expectOne(() => true).flush({
      totalItems: 1,
      items: [{ volumeInfo: { title: 'Dune' } }],
    });

    const price = result?.books[0].price ?? -1;
    expect(price).toBeGreaterThanOrEqual(10);
    expect(price).toBeLessThanOrEqual(70.5);
    expect(Math.round(price * 100)).toBeCloseTo(price * 100, 5);
  });

  it('restricts requests to the current language (English by default)', () => {
    googleBooks.search('anything', 1).subscribe();

    const req = httpMock.expectOne(() => true);
    expect(req.request.params.get('langRestrict')).toBe('en');
    req.flush({ items: [], totalItems: 0 });
  });

  it('restricts requests to German after the language is switched', () => {
    TestBed.inject(Language).setLanguage('de');

    googleBooks.search('anything', 1).subscribe();

    const req = httpMock.expectOne(() => true);
    expect(req.request.params.get('langRestrict')).toBe('de');
    req.flush({ items: [], totalItems: 0 });
  });

  it('searchByAuthors issues one quoted inauthor request per author, not an OR-joined query', () => {
    // The Google Books API does not reliably support OR-combining `inauthor:` clauses in a
    // single query (verified against the live API: it returns irrelevant or zero results) —
    // see design.md's revision on this. One request per author is required instead.
    googleBooks.searchByAuthors(['Frank Herbert', 'Brian Herbert']).subscribe();

    const requests = httpMock.match(() => true);
    expect(requests.map((req) => req.request.params.get('q')).sort()).toEqual(
      ['inauthor:"Brian Herbert"', 'inauthor:"Frank Herbert"'].sort(),
    );
    requests.forEach((req) => req.flush({ items: [], totalItems: 0 }));
  });

  it('searchByAuthors with a single author still issues exactly one request', () => {
    googleBooks.searchByAuthors(['Frank Herbert']).subscribe();

    const req = httpMock.expectOne(() => true);
    expect(req.request.params.get('q')).toBe('inauthor:"Frank Herbert"');
    req.flush({ items: [], totalItems: 0 });
  });

  it('searchByAuthors merges results from every author request and dedupes by title', () => {
    let result: { books: { title?: string }[]; totalItems: number } | undefined;
    googleBooks.searchByAuthors(['Frank Herbert', 'Brian Herbert']).subscribe((page) => (result = page));

    const requests = httpMock.match(() => true);
    const frankReq = requests.find((req) => req.request.params.get('q') === 'inauthor:"Frank Herbert"')!;
    const brianReq = requests.find((req) => req.request.params.get('q') === 'inauthor:"Brian Herbert"')!;
    frankReq.flush({ items: [{ volumeInfo: { title: 'Dune' } }, { volumeInfo: { title: 'Shared Title' } }], totalItems: 2 });
    brianReq.flush({ items: [{ volumeInfo: { title: 'shared title' } }, { volumeInfo: { title: 'Hunters of Dune' } }], totalItems: 2 });

    expect(result?.books.map((book) => book.title)).toEqual(['Dune', 'Shared Title', 'Hunters of Dune']);
    expect(result?.totalItems).toBe(3);
  });

  it('searchByAuthors includes langRestrict and the configured API key on every request, same as search()', () => {
    environment.googleBooksApiKey = 'test-api-key';
    TestBed.inject(Language).setLanguage('de');

    googleBooks.searchByAuthors(['Frank Herbert', 'Brian Herbert']).subscribe();

    const requests = httpMock.match(() => true);
    expect(requests).toHaveLength(2);
    for (const req of requests) {
      expect(req.request.params.get('langRestrict')).toBe('de');
      expect(req.request.params.get('key')).toBe('test-api-key');
      req.flush({ items: [], totalItems: 0 });
    }
  });

  it('maps a response with no items to an empty result', () => {
    let result: { books: unknown[]; totalItems: number } | undefined;
    googleBooks.search('anything', 1).subscribe((page) => (result = page));

    httpMock.expectOne(() => true).flush({});

    expect(result).toEqual({ books: [], totalItems: 0 });
  });
});
