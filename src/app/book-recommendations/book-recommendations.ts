import { Component, computed, effect, inject, signal, untracked } from '@angular/core';
import { BookSummary, GoogleBooks } from '../book-search/google-books';
import { Cart } from '../cart/cart';
import { Language } from '../language/language';
import { RecommendationCard } from '../recommendation-card/recommendation-card';

const PAGE_SIZE = 3;
const MAX_AUTHORS = 5;

@Component({
  imports: [RecommendationCard],
  selector: 'app-book-recommendations',
  styleUrl: './book-recommendations.css',
  templateUrl: './book-recommendations.html',
})
export class BookRecommendations {
  private readonly cart = inject(Cart);
  private readonly googleBooks = inject(GoogleBooks);
  protected readonly language = inject(Language);

  protected readonly uniqueAuthors = computed(() =>
    [...new Set(this.cart.books().flatMap((book) => book.authors ?? []))].slice(0, MAX_AUTHORS),
  );

  protected readonly recommendations = signal<BookSummary[]>([]);
  protected readonly pageIndex = signal(0);

  private fetchedAuthorsKey = '';

  constructor() {
    effect(() => {
      const authors = this.uniqueAuthors();
      const authorsKey = authors.join('|');

      untracked(() => {
        if (authorsKey === this.fetchedAuthorsKey) {
          return;
        }
        this.fetchedAuthorsKey = authorsKey;

        if (authors.length === 0) {
          this.recommendations.set([]);
          this.pageIndex.set(0);
          return;
        }

        this.googleBooks.searchByAuthors(authors).subscribe({
          next: ({ books }) => {
            const cartTitles = new Set(
              this.cart.books().map((book) => book.title?.trim().toLowerCase()),
            );
            const filtered = books.filter((book) => !cartTitles.has(book.title?.trim().toLowerCase()));
            this.pageIndex.set(0);
            this.recommendations.set(filtered);
          },
          error: () => this.recommendations.set([]),
        });
      });
    });
  }

  protected readonly visibleRecommendations = computed(() =>
    this.recommendations().slice(this.pageIndex() * PAGE_SIZE, (this.pageIndex() + 1) * PAGE_SIZE),
  );

  protected readonly hasPreviousPage = computed(() => this.pageIndex() > 0);
  protected readonly hasNextPage = computed(
    () => (this.pageIndex() + 1) * PAGE_SIZE < this.recommendations().length,
  );
  protected readonly hasMultiplePages = computed(() => this.recommendations().length > PAGE_SIZE);

  protected goToNextPage(): void {
    if (!this.hasNextPage()) {
      return;
    }
    this.pageIndex.update((index) => index + 1);
  }

  protected goToPreviousPage(): void {
    if (!this.hasPreviousPage()) {
      return;
    }
    this.pageIndex.update((index) => index - 1);
  }
}
