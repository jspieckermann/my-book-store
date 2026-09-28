import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { PromoCard } from './promo-card';
import { Cart } from '../cart/cart';
import { GoogleAuth } from '../google-auth/google-auth';
import { BookSummary } from '../book-search/google-books';

describe('PromoCard', () => {
  let addMock: ReturnType<typeof vi.fn>;
  let userSignal: ReturnType<typeof signal<{ name: string } | null>>;

  afterEach(() => {
    localStorage.removeItem('language');
  });

  function createFixture(book: BookSummary) {
    addMock = vi.fn();
    userSignal = signal<{ name: string } | null>({ name: 'Ada' });
    TestBed.configureTestingModule({
      providers: [
        { provide: Cart, useValue: { add: addMock } },
        { provide: GoogleAuth, useValue: { user: userSignal } },
      ],
    });
    const fixture = TestBed.createComponent(PromoCard);
    fixture.componentRef.setInput('book', book);
    fixture.detectChanges();
    return fixture;
  }

  const fullBook: BookSummary = {
    title: 'Dune',
    authors: ['Frank Herbert'],
    publisher: 'Ace',
    publishedDate: '1965',
    description: 'A desert planet.',
    coverImageUrl: 'https://example.com/dune.jpg',
    averageRating: 4.5,
    ratingsCount: 128,
    price: 50,
  };

  it('shows the original price struck through and a lower discounted price', () => {
    const fixture = createFixture(fullBook);
    const el = fixture.nativeElement as HTMLElement;

    const originalText = el.querySelector('.promo-price-original')?.textContent ?? '';
    const nowText = el.querySelector('.promo-price-now')?.textContent ?? '';
    expect(originalText).toContain('50.00');

    const originalValue = parseFloat(originalText.replace(/[^\d.]/g, ''));
    const nowValue = parseFloat(nowText.replace(/[^\d.]/g, ''));
    expect(nowValue).toBeLessThan(originalValue);
  });

  it('shows a percentage-off badge between 40% and 90%', () => {
    const fixture = createFixture(fullBook);
    const badgeText = (fixture.nativeElement as HTMLElement).querySelector('.promo-discount-badge')?.textContent ?? '';

    const match = badgeText.match(/-(\d+)%/);
    expect(match).toBeTruthy();
    const percent = Number(match![1]);
    expect(percent).toBeGreaterThanOrEqual(40);
    expect(percent).toBeLessThanOrEqual(90);
  });

  it('does not render author, publisher, description, or rating', () => {
    const fixture = createFixture(fullBook);
    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';

    expect(text).not.toContain('Frank Herbert');
    expect(text).not.toContain('Ace');
    expect(text).not.toContain('A desert planet.');
    expect(text).not.toContain('128');
  });

  it('shows the add-to-cart button when signed in, and adds the book at the discounted price', () => {
    const fixture = createFixture(fullBook);
    const el = fixture.nativeElement as HTMLElement;
    const nowText = el.querySelector('.promo-price-now')?.textContent ?? '';
    const nowValue = parseFloat(nowText.replace(/[^\d.]/g, ''));

    const button = el.querySelector<HTMLButtonElement>('.promo-add-to-cart-button');
    expect(button).toBeTruthy();
    button!.click();

    expect(addMock).toHaveBeenCalledWith({ ...fullBook, price: nowValue });
  });

  it('hides the add-to-cart button when signed out', () => {
    const fixture = createFixture(fullBook);
    userSignal.set(null);
    fixture.detectChanges();

    expect((fixture.nativeElement as HTMLElement).querySelector('.promo-add-to-cart-button')).toBeNull();
  });
});
