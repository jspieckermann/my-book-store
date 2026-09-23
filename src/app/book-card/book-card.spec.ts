import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { BookCard } from './book-card';
import { Cart } from '../cart/cart';
import { GoogleAuth } from '../google-auth/google-auth';
import { BookSummary } from '../book-search/google-books';
import { Language } from '../language/language';

describe('BookCard', () => {
  let addMock: ReturnType<typeof vi.fn>;
  let removeMock: ReturnType<typeof vi.fn>;
  let userSignal: ReturnType<typeof signal<{ name: string } | null>>;

  afterEach(() => {
    localStorage.removeItem('language');
  });

  function createFixture(book: BookSummary, inputs: { showAddToCart?: boolean; showDelete?: boolean } = {}) {
    addMock = vi.fn();
    removeMock = vi.fn();
    userSignal = signal<{ name: string } | null>({ name: 'Ada' });
    TestBed.configureTestingModule({
      providers: [
        { provide: Cart, useValue: { add: addMock, remove: removeMock } },
        { provide: GoogleAuth, useValue: { user: userSignal } },
      ],
    });
    const fixture = TestBed.createComponent(BookCard);
    fixture.componentRef.setInput('book', book);
    if (inputs.showAddToCart !== undefined) {
      fixture.componentRef.setInput('showAddToCart', inputs.showAddToCart);
    }
    if (inputs.showDelete !== undefined) {
      fixture.componentRef.setInput('showDelete', inputs.showDelete);
    }
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
    price: 24.99,
  };

  it('renders all attributes when present', () => {
    const fixture = createFixture(fullBook);
    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';

    expect(text).toContain('Dune');
    expect(text).toContain('Frank Herbert');
    expect(text).toContain('Ace');
    expect(text).toContain('1965');
    expect(text).toContain('A desert planet.');
  });

  it('renders the cover image when coverImageUrl is present', () => {
    const fixture = createFixture(fullBook);
    const img = (fixture.nativeElement as HTMLElement).querySelector('.book-cover');

    expect(img).toBeTruthy();
    expect(img?.getAttribute('src')).toBe('https://example.com/dune.jpg');
  });

  it('omits attributes and the cover image that are missing, with no placeholder', () => {
    const fixture = createFixture({ title: 'Untitled Draft', price: 12.5 });
    const el = fixture.nativeElement as HTMLElement;

    expect(el.querySelector('.book-cover')).toBeNull();
    expect(el.textContent).toContain('Untitled Draft');
    expect(el.querySelectorAll('.book-attribute').length).toBe(1);
  });

  it('shows the "Add to cart" button by default when signed in, and wires it to Cart.add()', () => {
    const fixture = createFixture(fullBook);
    const button = (fixture.nativeElement as HTMLElement).querySelector<HTMLButtonElement>('.add-to-cart-button');

    expect(button).toBeTruthy();
    button!.click();

    expect(addMock).toHaveBeenCalledWith(fullBook);
  });

  it('hides the "Add to cart" button when showAddToCart is false', () => {
    const fixture = createFixture(fullBook, { showAddToCart: false });

    expect((fixture.nativeElement as HTMLElement).querySelector('.add-to-cart-button')).toBeNull();
  });

  it('hides the "Add to cart" button when signed out', () => {
    const fixture = createFixture(fullBook);
    userSignal.set(null);
    fixture.detectChanges();

    expect((fixture.nativeElement as HTMLElement).querySelector('.add-to-cart-button')).toBeNull();
  });

  it('hides the delete button by default', () => {
    const fixture = createFixture(fullBook);

    expect((fixture.nativeElement as HTMLElement).querySelector('.delete-button')).toBeNull();
  });

  it('shows the delete button when showDelete is true, and wires it to Cart.remove()', () => {
    const fixture = createFixture(fullBook, { showDelete: true });
    const button = (fixture.nativeElement as HTMLElement).querySelector<HTMLButtonElement>('.delete-button');

    expect(button).toBeTruthy();
    button!.click();

    expect(removeMock).toHaveBeenCalledWith(fullBook);
  });

  it('renders a short description in full with no expand button', () => {
    const fixture = createFixture(fullBook);
    const el = fixture.nativeElement as HTMLElement;

    expect(el.textContent).toContain('A desert planet.');
    expect(el.querySelector('.expand-button')).toBeNull();
  });

  it('truncates a description longer than 350 characters with an ellipsis and a "Read more" control', () => {
    const longDescription = 'A '.repeat(200).trim() + ' finalword';
    const fixture = createFixture({ ...fullBook, description: longDescription });
    const el = fixture.nativeElement as HTMLElement;
    const button = el.querySelector<HTMLButtonElement>('.expand-button');

    expect(el.textContent).not.toContain(longDescription);
    expect(el.textContent).toContain('…');
    expect(button).toBeTruthy();
    expect(button!.textContent).toContain('Read more');
  });

  it('reveals the full description and toggles aria-expanded/text when the expand button is clicked, then re-collapses on a second click', () => {
    const longDescription = 'A '.repeat(200).trim() + ' finalword';
    const fixture = createFixture({ ...fullBook, description: longDescription });
    const el = fixture.nativeElement as HTMLElement;
    const button = el.querySelector<HTMLButtonElement>('.expand-button')!;

    expect(button.getAttribute('aria-expanded')).toBe('false');
    expect(button.textContent).toContain('Read more');

    button.click();
    fixture.detectChanges();

    expect(button.getAttribute('aria-expanded')).toBe('true');
    expect(button.textContent).toContain('Read less');
    expect(el.textContent).toContain(longDescription);

    button.click();
    fixture.detectChanges();

    expect(button.getAttribute('aria-expanded')).toBe('false');
    expect(button.textContent).toContain('Read more');
    expect(el.textContent).not.toContain(longDescription);
    expect(el.textContent).toContain('…');
  });

  it('renders no rating when averageRating/ratingsCount are absent', () => {
    const fixture = createFixture(fullBook);
    const el = fixture.nativeElement as HTMLElement;

    expect(el.querySelector('.rating')).toBeNull();
  });

  it('renders the correct filled/outline star split and the ratings count in brackets', () => {
    const fixture = createFixture({ ...fullBook, averageRating: 3.6, ratingsCount: 128 });
    const el = fixture.nativeElement as HTMLElement;
    const stars = el.querySelectorAll<SVGElement>('.rating-star');

    expect(stars.length).toBe(5);
    expect(Array.from(stars).filter((s) => s.classList.contains('filled')).length).toBe(4);
    expect(el.querySelector('.rating-count')?.textContent).toContain('(128)');
  });

  it('rounds a low average rating down to the nearest whole star', () => {
    const fixture = createFixture({ ...fullBook, averageRating: 3.4, ratingsCount: 50 });
    const el = fixture.nativeElement as HTMLElement;
    const stars = el.querySelectorAll<SVGElement>('.rating-star');

    expect(Array.from(stars).filter((s) => s.classList.contains('filled')).length).toBe(3);
  });

  it('renders the price formatted as currency in the default (English) locale, with no label, above the add-to-cart button', () => {
    const fixture = createFixture({ ...fullBook, price: 42.5 });
    const el = fixture.nativeElement as HTMLElement;
    const price = el.querySelector('.price');

    expect(price?.textContent?.trim().replace(/\s/g, ' ')).toBe('€42.50');
    expect(price?.textContent).not.toContain('Price');
  });

  it('renders the price above the delete button on a cart card', () => {
    const fixture = createFixture({ ...fullBook, price: 9.99 }, { showAddToCart: false, showDelete: true });
    const el = fixture.nativeElement as HTMLElement;

    expect(el.querySelector('.price')?.textContent?.trim().replace(/\s/g, ' ')).toBe('€9.99');
    expect(el.querySelector('.delete-button')).toBeTruthy();
  });

  it('formats the price in German currency style once the language is switched to German', () => {
    const fixture = createFixture({ ...fullBook, price: 42.5 });
    const language = TestBed.inject(Language);
    language.setLanguage('de');
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;

    expect(el.querySelector('.price')?.textContent?.trim().replace(/\s/g, ' ')).toBe('42,50 €');
  });
});
