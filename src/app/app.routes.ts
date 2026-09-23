import { Routes } from '@angular/router';
import { BookSearch } from './book-search/book-search';
import { CartPage } from './cart-page/cart-page';
import { ImpressumPage } from './impressum/impressum';

export const routes: Routes = [
  { path: '', component: BookSearch },
  { path: 'cart', component: CartPage },
  { path: 'impressum', component: ImpressumPage },
];
