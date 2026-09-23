import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { signal } from '@angular/core';
import { of } from 'rxjs';
import { CartPage } from './cart-page';
import { Cart } from '../cart/cart';
import { GoogleAuth } from '../google-auth/google-auth';
import { BookSummary, GoogleBooks } from '../book-search/google-books';

describe('CartPage', () => {
  function createFixture(books: BookSummary[]) {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        {
          provide: Cart,
          useValue: {
            books: signal(books),
            count: () => books.length,
            totalPrice: () => books.reduce((sum, book) => sum + book.price, 0),
            add: vi.fn(),
            remove: vi.fn(),
          },
        },
        { provide: GoogleAuth, useValue: { user: signal({ name: 'Ada' }) } },
        // BookRecommendations (rendered when the cart is non-empty) injects GoogleBooks —
        // stub it so these tests never issue a real network request.
        { provide: GoogleBooks, useValue: { searchByAuthors: vi.fn(() => of({ books: [], totalItems: 0 })) } },
      ],
    });
    const fixture = TestBed.createComponent(CartPage);
    fixture.detectChanges();
    return fixture;
  }

  const book: BookSummary = { title: 'Dune', price: 24.99 };

  it('renders the back link', () => {
    const fixture = createFixture([]);
    const link = (fixture.nativeElement as HTMLElement).querySelector('.back-link');

    expect(link).toBeTruthy();
  });

  it('renders one book card per book in the cart, without an "Add to cart" button', () => {
    const fixture = createFixture([book, { title: 'Foundation', price: 15.0 }]);
    const el = fixture.nativeElement as HTMLElement;

    expect(el.querySelectorAll('.book-card').length).toBe(2);
    expect(el.querySelector('.add-to-cart-button')).toBeNull();
    expect(el.querySelector('.delete-button')).toBeTruthy();
  });

  it('shows an empty-cart message instead of a list when the cart has no books', () => {
    const fixture = createFixture([]);
    const el = fixture.nativeElement as HTMLElement;

    expect(el.querySelector('.results-list')).toBeNull();
    expect(el.querySelector('.status')?.textContent).toContain('Your cart is empty');
  });

  it('shows the PayPal-styled button when the cart has books', () => {
    const fixture = createFixture([book]);
    const button = (fixture.nativeElement as HTMLElement).querySelector<HTMLButtonElement>('.paypal-button');

    expect(button).toBeTruthy();
    expect(() => button!.click()).not.toThrow();
  });

  it('hides the PayPal-styled button when the cart is empty', () => {
    const fixture = createFixture([]);

    expect((fixture.nativeElement as HTMLElement).querySelector('.paypal-button')).toBeNull();
  });

  it('shows the order summary with singular item wording and the total price', () => {
    const fixture = createFixture([book]);
    const summary = (fixture.nativeElement as HTMLElement).querySelector('.payment-summary');

    expect(summary?.textContent).toContain('1 item');
    expect(summary?.textContent?.replace(/\s/g, ' ')).toContain('€24.99');
  });

  it('shows the order summary with plural item wording and the summed total price', () => {
    const fixture = createFixture([book, { title: 'Foundation', price: 15.01 }]);
    const summary = (fixture.nativeElement as HTMLElement).querySelector('.payment-summary');

    expect(summary?.textContent).toContain('2 items');
    expect(summary?.textContent?.replace(/\s/g, ' ')).toContain('€40.00');
  });

  it('hides the order summary when the cart is empty', () => {
    const fixture = createFixture([]);

    expect((fixture.nativeElement as HTMLElement).querySelector('.payment-summary')).toBeNull();
  });
});
