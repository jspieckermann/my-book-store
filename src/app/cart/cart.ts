import { Service, computed, effect, inject, signal } from '@angular/core';
import { BookSummary } from '../book-search/google-books';
import { GoogleAuth } from '../google-auth/google-auth';

@Service()
export class Cart {
  private readonly googleAuth = inject(GoogleAuth);

  private readonly _books = signal<BookSummary[]>([]);
  readonly books = this._books.asReadonly();
  readonly count = computed(() => this._books().length);
  readonly totalPrice = computed(() => this._books().reduce((sum, book) => sum + book.price, 0));

  constructor() {
    effect(() => {
      if (!this.googleAuth.user()) {
        this._books.set([]);
      }
    });
  }

  add(book: BookSummary): void {
    this._books.update((books) => [...books, { ...book }]);
  }

  remove(book: BookSummary): void {
    this._books.update((books) => books.filter((b) => b !== book));
  }
}
