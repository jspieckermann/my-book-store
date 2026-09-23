import { Component, computed, inject, input, signal } from '@angular/core';
import { BookSummary } from '../book-search/google-books';
import { Cart } from '../cart/cart';
import { GoogleAuth } from '../google-auth/google-auth';
import { Language } from '../language/language';

const DESCRIPTION_TRUNCATE_LENGTH = 350;

@Component({
  imports: [],
  selector: 'app-book-card',
  styleUrl: './book-card.css',
  templateUrl: './book-card.html',
})
export class BookCard {
  readonly book = input.required<BookSummary>();
  readonly showAddToCart = input(true);
  readonly showDelete = input(false);

  protected readonly cart = inject(Cart);
  protected readonly googleAuth = inject(GoogleAuth);
  protected readonly language = inject(Language);

  protected readonly expanded = signal(false);

  protected readonly descriptionTruncated = computed(() => {
    const description = this.book().description;
    return !!description && description.length > DESCRIPTION_TRUNCATE_LENGTH;
  });

  protected readonly displayDescription = computed(() => {
    const description = this.book().description ?? '';
    if (!this.descriptionTruncated() || this.expanded()) {
      return description;
    }
    const cut = description.slice(0, DESCRIPTION_TRUNCATE_LENGTH);
    const lastSpace = cut.lastIndexOf(' ');
    const trimmed = lastSpace > 0 ? cut.slice(0, lastSpace) : cut;
    return `${trimmed}…`;
  });

  protected toggleExpanded(): void {
    this.expanded.update((expanded) => !expanded);
  }

  protected readonly ratingAvailable = computed(() => {
    const book = this.book();
    return book.averageRating !== undefined && book.ratingsCount !== undefined;
  });

  protected readonly ratingStars = computed(() => {
    const rating = Math.round(this.book().averageRating ?? 0);
    const filledCount = Math.min(5, Math.max(0, rating));
    return Array.from({ length: 5 }, (_, i) => i < filledCount);
  });

  protected readonly ratingLabel = computed(() => {
    const filledCount = this.ratingStars().filter(Boolean).length;
    return this.language.translate('bookCard.ratingLabel', {
      filled: filledCount,
      count: this.book().ratingsCount ?? 0,
    });
  });

  protected readonly formattedPrice = computed(() =>
    this.book().price.toLocaleString(this.language.localeCode(), { style: 'currency', currency: 'EUR' }),
  );
}
