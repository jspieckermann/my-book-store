import { Component, computed, inject, input } from '@angular/core';
import { BookSummary } from '../book-search/google-books';
import { Cart } from '../cart/cart';
import { GoogleAuth } from '../google-auth/google-auth';
import { Language } from '../language/language';

const MIN_DISCOUNT_PERCENT = 40;
const MAX_DISCOUNT_PERCENT = 90;

@Component({
  imports: [],
  selector: 'app-promo-card',
  styleUrl: './promo-card.css',
  templateUrl: './promo-card.html',
})
export class PromoCard {
  readonly book = input.required<BookSummary>();

  protected readonly cart = inject(Cart);
  protected readonly googleAuth = inject(GoogleAuth);
  protected readonly language = inject(Language);

  private readonly discountPercent = Math.round(
    Math.random() * (MAX_DISCOUNT_PERCENT - MIN_DISCOUNT_PERCENT) + MIN_DISCOUNT_PERCENT,
  );

  protected readonly discountBadgeText = computed(() =>
    this.language.translate('promoSection.discountBadge', { percent: this.discountPercent }),
  );

  protected readonly nowPrice = computed(
    () => Math.round(this.book().price * (1 - this.discountPercent / 100) * 100) / 100,
  );

  protected readonly formattedOriginalPrice = computed(() =>
    this.book().price.toLocaleString(this.language.localeCode(), { style: 'currency', currency: 'EUR' }),
  );

  protected readonly formattedNowPrice = computed(() =>
    this.nowPrice().toLocaleString(this.language.localeCode(), { style: 'currency', currency: 'EUR' }),
  );

  protected addToCart(): void {
    this.cart.add({ ...this.book(), price: this.nowPrice() });
  }
}
