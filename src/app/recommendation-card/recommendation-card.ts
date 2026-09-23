import { Component, computed, inject, input } from '@angular/core';
import { BookSummary } from '../book-search/google-books';
import { Cart } from '../cart/cart';
import { GoogleAuth } from '../google-auth/google-auth';
import { Language } from '../language/language';

const MAX_TEXT_LENGTH = 50;

function truncate(text: string): string {
  return text.length > MAX_TEXT_LENGTH ? `${text.slice(0, MAX_TEXT_LENGTH)}…` : text;
}

@Component({
  imports: [],
  selector: 'app-recommendation-card',
  styleUrl: './recommendation-card.css',
  templateUrl: './recommendation-card.html',
})
export class RecommendationCard {
  readonly book = input.required<BookSummary>();

  protected readonly cart = inject(Cart);
  protected readonly googleAuth = inject(GoogleAuth);
  protected readonly language = inject(Language);

  protected readonly displayTitle = computed(() => truncate(this.book().title ?? ''));
  protected readonly displayAuthors = computed(() => truncate(this.book().authors?.join(', ') ?? ''));
  protected readonly formattedPrice = computed(() =>
    this.book().price.toLocaleString(this.language.localeCode(), { style: 'currency', currency: 'EUR' }),
  );

  protected readonly cartQuantity = computed(() => {
    const title = this.book().title?.trim().toLowerCase();
    return this.cart.books().filter((b) => b.title?.trim().toLowerCase() === title).length;
  });
}
