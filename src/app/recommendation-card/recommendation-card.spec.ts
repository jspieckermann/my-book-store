import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { RecommendationCard } from './recommendation-card';
import { Cart } from '../cart/cart';
import { GoogleAuth } from '../google-auth/google-auth';
import { Language } from '../language/language';
import { BookSummary } from '../book-search/google-books';

describe('RecommendationCard', () => {
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
    const fixture = TestBed.createComponent(RecommendationCard);
    fixture.componentRef.setInput('book', book);
    fixture.detectChanges();
    return fixture;
  }

  const fullBook: BookSummary = {
    title: 'Dune Messiah',
    authors: ['Frank Herbert'],
    publisher: 'Ace',
    publishedDate: '1969',
    description: 'The sequel.',
    coverImageUrl: 'https://example.com/dune-messiah.jpg',
    averageRating: 4.2,
    ratingsCount: 80,
    price: 19.99,
  };

  it('renders the cover, title, and authors', () => {
    const fixture = createFixture(fullBook);
    const el = fixture.nativeElement as HTMLElement;

    const img = el.querySelector<HTMLImageElement>('.recommendation-cover');
    expect(img?.getAttribute('src')).toBe('https://example.com/dune-messiah.jpg');
    expect(el.textContent).toContain('Dune Messiah');
    expect(el.textContent).toContain('Frank Herbert');
  });

  it('omits the cover image when coverImageUrl is absent', () => {
    const fixture = createFixture({ title: 'Untitled', price: 10 });

    expect((fixture.nativeElement as HTMLElement).querySelector('.recommendation-cover')).toBeNull();
  });

  it('shows the add-to-cart button when signed in, and wires it to Cart.add()', () => {
    const fixture = createFixture(fullBook);
    const button = (fixture.nativeElement as HTMLElement).querySelector<HTMLButtonElement>('.add-to-cart-button');

    expect(button).toBeTruthy();
    button!.click();

    expect(addMock).toHaveBeenCalledWith(fullBook);
  });

  it('hides the add-to-cart button when signed out', () => {
    const fixture = createFixture(fullBook);
    userSignal.set(null);
    fixture.detectChanges();

    expect((fixture.nativeElement as HTMLElement).querySelector('.add-to-cart-button')).toBeNull();
  });

  it('does not render publisher, published date, description, or rating', () => {
    const fixture = createFixture(fullBook);
    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';

    expect(text).not.toContain('Ace');
    expect(text).not.toContain('1969');
    expect(text).not.toContain('The sequel.');
    expect(text).not.toContain('4.2');
  });

  it('renders the price formatted as currency in the default (English) locale', () => {
    const fixture = createFixture({ ...fullBook, price: 19.99 });
    const el = fixture.nativeElement as HTMLElement;

    expect(el.querySelector('.recommendation-price')?.textContent?.trim().replace(/\s/g, ' ')).toBe('€19.99');
  });

  it('formats the price in German currency style once the language is switched to German', () => {
    const fixture = createFixture({ ...fullBook, price: 19.99 });
    const language = TestBed.inject(Language);
    language.setLanguage('de');
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.recommendation-price')?.textContent?.trim().replace(/\s/g, ' ')).toBe('19,99 €');
  });

  it('truncates a title longer than 50 characters with an ellipsis', () => {
    const longTitle = 'A'.repeat(60);
    const fixture = createFixture({ ...fullBook, title: longTitle });
    const el = fixture.nativeElement as HTMLElement;

    const titleText = el.querySelector('.recommendation-title')?.textContent ?? '';
    expect(titleText).toBe(`${'A'.repeat(50)}…`);
  });

  it('truncates authors longer than 50 characters with an ellipsis', () => {
    const longAuthors = ['A'.repeat(30), 'B'.repeat(30)];
    const fixture = createFixture({ ...fullBook, authors: longAuthors });
    const el = fixture.nativeElement as HTMLElement;

    const authorsText = el.querySelector('.recommendation-authors')?.textContent ?? '';
    const joined = longAuthors.join(', ');
    expect(authorsText).toBe(`${joined.slice(0, 50)}…`);
    expect(authorsText.length).toBe(51);
  });

  it('does not truncate title or authors at or under 50 characters', () => {
    const fixture = createFixture(fullBook);
    const el = fixture.nativeElement as HTMLElement;

    expect(el.querySelector('.recommendation-title')?.textContent).toBe('Dune Messiah');
    expect(el.querySelector('.recommendation-authors')?.textContent).toBe('Frank Herbert');
  });
});
