import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { Cart } from './cart';
import { GoogleAuth } from '../google-auth/google-auth';
import { BookSummary } from '../book-search/google-books';

describe('Cart', () => {
  let userSignal: ReturnType<typeof signal<{ name: string } | null>>;

  function setup(): Cart {
    userSignal = signal<{ name: string } | null>({ name: 'Ada' });
    TestBed.configureTestingModule({
      providers: [Cart, { provide: GoogleAuth, useValue: { user: userSignal } }],
    });
    return TestBed.inject(Cart);
  }

  const book: BookSummary = { title: 'Dune', authors: ['Frank Herbert'], price: 24.99 };

  it('add() appends a book and increments count', () => {
    const cart = setup();

    cart.add(book);

    expect(cart.count()).toBe(1);
    expect(cart.books()).toEqual([book]);
  });

  it('add() stores a distinct copy so identical books are separate entries', () => {
    const cart = setup();

    cart.add(book);
    cart.add(book);

    expect(cart.count()).toBe(2);
    expect(cart.books()[0]).not.toBe(cart.books()[1]);
  });

  it('remove() removes only the exact entry, leaving an identical duplicate intact', () => {
    const cart = setup();

    cart.add(book);
    cart.add(book);
    const [first, second] = cart.books();

    cart.remove(first);

    expect(cart.count()).toBe(1);
    expect(cart.books()).toEqual([second]);
  });

  it('clears the cart when the user signs out', () => {
    const cart = setup();
    cart.add(book);
    expect(cart.count()).toBe(1);

    userSignal.set(null);
    TestBed.tick();

    expect(cart.count()).toBe(0);
    expect(cart.books()).toEqual([]);
  });

  it('totalPrice is 0 for an empty cart', () => {
    const cart = setup();

    expect(cart.totalPrice()).toBe(0);
  });

  it('totalPrice sums the price of every book in the cart', () => {
    const cart = setup();

    cart.add(book);
    cart.add({ title: 'Foundation', price: 15.01 });

    expect(cart.totalPrice()).toBeCloseTo(40, 5);
  });

  it('totalPrice updates after remove()', () => {
    const cart = setup();

    cart.add(book);
    cart.add({ title: 'Foundation', price: 15.01 });
    const [first] = cart.books();
    cart.remove(first);

    expect(cart.totalPrice()).toBeCloseTo(15.01, 5);
  });

  it('starts empty when no user is signed in from the start', () => {
    userSignal = signal<{ name: string } | null>(null);
    TestBed.configureTestingModule({
      providers: [Cart, { provide: GoogleAuth, useValue: { user: userSignal } }],
    });
    const cart = TestBed.inject(Cart);
    TestBed.tick();

    expect(cart.count()).toBe(0);
  });
});
