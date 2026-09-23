import { Routes } from '@angular/router';
import { BookSearch } from './book-search/book-search';
import { CartPage } from './cart-page/cart-page';

export const routes: Routes = [
  { path: '', component: BookSearch },
  { path: 'cart', component: CartPage },
];
