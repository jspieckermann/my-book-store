import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { of } from 'rxjs';
import { PromoSection } from './promo-section';
import { BookSummary, GoogleBooks, SearchResultsPage } from '../book-search/google-books';
import { Cart } from '../cart/cart';
import { GoogleAuth } from '../google-auth/google-auth';

describe('PromoSection', () => {
  afterEach(() => {
    localStorage.removeItem('language');
  });

  function createFixture(page: SearchResultsPage) {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        { provide: GoogleBooks, useValue: { searchRandom: () => of(page) } },
        { provide: Cart, useValue: { add: vi.fn() } },
        { provide: GoogleAuth, useValue: { user: signal(null) } },
      ],
    });
    const fixture = TestBed.createComponent(PromoSection);
    fixture.detectChanges();
    return fixture;
  }

  function book(overrides: Partial<BookSummary> = {}): BookSummary {
    return { title: 'A Book', price: 20, coverImageUrl: 'https://example.com/cover.jpg', ...overrides };
  }

  it('excludes books without a cover image from the displayed set', () => {
    const fixture = createFixture({
      books: [book({ title: 'Has cover' }), book({ title: 'No cover', coverImageUrl: undefined })],
      totalItems: 2,
    });

    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(fixture.componentInstance['books']().length).toBe(1);
    expect(text).not.toContain('No cover');
  });

  it('renders nothing when the fetch returns no cover-bearing books', () => {
    const fixture = createFixture({ books: [book({ coverImageUrl: undefined })], totalItems: 1 });

    expect((fixture.nativeElement as HTMLElement).querySelector('.promo-section')).toBeNull();
  });

  it('renders every qualifying book as a card, up to the candidate cap, leaving how many are visible to runtime measurement', () => {
    const books = Array.from({ length: 8 }, (_, i) => book({ title: `Book ${i}` }));
    const fixture = createFixture({ books, totalItems: books.length });

    expect((fixture.nativeElement as HTMLElement).querySelectorAll('app-promo-card').length).toBe(8);
  });

  it('caps the candidate set at MAX_PROMO_BOOKS when more qualifying books are fetched', () => {
    const books = Array.from({ length: 30 }, (_, i) => book({ title: `Book ${i}` }));
    const fixture = createFixture({ books, totalItems: books.length });

    expect((fixture.nativeElement as HTMLElement).querySelectorAll('app-promo-card').length).toBe(20);
  });

  it('can show a different random set across fresh component instances', () => {
    const books = Array.from({ length: 8 }, (_, i) => book({ title: `Book ${i}` }));
    const seenSets = new Set<string>();

    for (let i = 0; i < 20; i++) {
      const fixture = createFixture({ books, totalItems: books.length });
      const titles = fixture.componentInstance['books']()
        .map((b) => b.title)
        .join(',');
      seenSets.add(titles);
    }

    expect(seenSets.size).toBeGreaterThan(1);
  });

  it('observes the row for resizes and disconnects the observer when the component is destroyed', () => {
    const observeMock = vi.fn();
    const disconnectMock = vi.fn();
    class FakeResizeObserver {
      observe = observeMock;
      disconnect = disconnectMock;
      unobserve = vi.fn();
    }
    const original = globalThis.ResizeObserver;
    globalThis.ResizeObserver = FakeResizeObserver as unknown as typeof ResizeObserver;

    try {
      const fixture = createFixture({ books: [book()], totalItems: 1 });
      TestBed.tick();

      const row = (fixture.nativeElement as HTMLElement).querySelector('.promo-row');
      expect(observeMock).toHaveBeenCalledWith(row);

      fixture.destroy();

      expect(disconnectMock).toHaveBeenCalled();
    } finally {
      globalThis.ResizeObserver = original;
    }
  });

  it('hides a card whose measured right edge falls past the row, stopping at the first non-fitting card', () => {
    const fixture = createFixture({
      books: [book({ title: 'A' }), book({ title: 'B' }), book({ title: 'C' })],
      totalItems: 3,
    });

    const row = (fixture.nativeElement as HTMLElement).querySelector('.promo-row') as HTMLElement;
    const cards = Array.from((fixture.nativeElement as HTMLElement).querySelectorAll('app-promo-card')) as HTMLElement[];

    vi.spyOn(row, 'getBoundingClientRect').mockReturnValue({ right: 100 } as DOMRect);
    vi.spyOn(cards[0], 'getBoundingClientRect').mockReturnValue({ right: 50 } as DOMRect);
    vi.spyOn(cards[1], 'getBoundingClientRect').mockReturnValue({ right: 150 } as DOMRect);
    vi.spyOn(cards[2], 'getBoundingClientRect').mockReturnValue({ right: 200 } as DOMRect);

    fixture.componentInstance['resizeTick'].update((n) => n + 1);
    TestBed.tick();
    fixture.detectChanges();

    expect(cards[0].classList.contains('promo-card-hidden')).toBe(false);
    expect(cards[1].classList.contains('promo-card-hidden')).toBe(true);
    expect(cards[2].classList.contains('promo-card-hidden')).toBe(true);
  });
});
