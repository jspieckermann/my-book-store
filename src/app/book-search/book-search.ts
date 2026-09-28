import { Component, computed, effect, inject, signal, untracked } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BookSummary, GoogleBooks } from './google-books';
import { BookCard } from '../book-card/book-card';
import { PromoSection } from '../promo-section/promo-section';
import { Language } from '../language/language';

const PAGE_SIZE = 10;

type SearchState =
  | { kind: 'idle' }
  | { kind: 'loading' }
  | { kind: 'error' }
  | { kind: 'not-found' }
  | { kind: 'found'; books: BookSummary[]; totalItems: number };

@Component({
  imports: [FormsModule, BookCard, PromoSection],
  selector: 'app-book-search',
  styleUrl: './book-search.css',
  templateUrl: './book-search.html',
})
export class BookSearch {
  private readonly googleBooks = inject(GoogleBooks);
  protected readonly language = inject(Language);

  protected readonly query = signal('');
  protected readonly state = signal<SearchState>({ kind: 'idle' });
  protected readonly page = signal(1);
  private readonly activeQuery = signal('');

  protected readonly isSearchDisabled = computed(
    () => this.query().trim().length === 0 || this.state().kind === 'loading',
  );
  protected readonly hasPreviousPage = computed(() => this.page() > 1);
  protected readonly hasNextPage = computed(() => {
    const current = this.state();
    return current.kind === 'found' && this.page() * PAGE_SIZE < current.totalItems;
  });
  protected readonly totalPages = computed(() => {
    const current = this.state();
    return current.kind === 'found' ? Math.ceil(current.totalItems / PAGE_SIZE) : 0;
  });

  constructor() {
    effect(() => {
      this.language.current();
      untracked(() => {
        if (this.activeQuery()) {
          this.fetchPage(this.page());
        }
      });
    });
  }

  protected onQueryInput(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }

  protected search(): void {
    const trimmedQuery = this.query().trim();
    if (!trimmedQuery || this.state().kind === 'loading') {
      return;
    }

    this.activeQuery.set(trimmedQuery);
    this.page.set(1);
    this.state.set({ kind: 'loading' });
    this.googleBooks.search(trimmedQuery, 1).subscribe({
      next: ({ books, totalItems }) =>
        this.state.set(books.length > 0 ? { kind: 'found', books, totalItems } : { kind: 'not-found' }),
      error: () => this.state.set({ kind: 'error' }),
    });
  }

  protected goToNextPage(): void {
    if (!this.hasNextPage() || this.state().kind === 'loading') {
      return;
    }
    this.fetchPage(this.page() + 1);
  }

  protected goToPreviousPage(): void {
    if (!this.hasPreviousPage() || this.state().kind === 'loading') {
      return;
    }
    this.fetchPage(this.page() - 1);
  }

  private fetchPage(targetPage: number): void {
    const previousState = this.state();
    this.state.set({ kind: 'loading' });
    this.googleBooks.search(this.activeQuery(), targetPage).subscribe({
      next: ({ books, totalItems }) => {
        if (books.length === 0) {
          // Google's totalItems is an estimate; treat an empty page as having
          // reached the end and keep showing the previously-displayed page.
          this.state.set(previousState);
          return;
        }
        this.page.set(targetPage);
        this.state.set({ kind: 'found', books, totalItems });
      },
      error: () => this.state.set({ kind: 'error' }),
    });
  }
}
