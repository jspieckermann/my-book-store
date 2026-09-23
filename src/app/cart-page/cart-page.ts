import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Cart } from '../cart/cart';
import { BookCard } from '../book-card/book-card';
import { Language } from '../language/language';

@Component({
  imports: [RouterLink, BookCard],
  selector: 'app-cart-page',
  styleUrl: './cart-page.css',
  templateUrl: './cart-page.html',
})
export class CartPage {
  protected readonly cart = inject(Cart);
  protected readonly language = inject(Language);

  protected readonly itemCountLabel = computed(() => {
    const count = this.cart.count();
    const word = this.language.translate(count === 1 ? 'cartPage.item' : 'cartPage.items');
    return `${count} ${word}`;
  });

  protected readonly formattedTotalPrice = computed(() =>
    this.cart.totalPrice().toLocaleString(this.language.localeCode(), { style: 'currency', currency: 'EUR' }),
  );
}
