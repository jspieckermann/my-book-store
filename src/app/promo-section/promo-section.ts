import { Component, ElementRef, afterRenderEffect, effect, inject, signal, viewChild, viewChildren } from '@angular/core';
import { BookSummary, GoogleBooks } from '../book-search/google-books';
import { Language } from '../language/language';
import { PromoCard } from '../promo-card/promo-card';

// Not a display target — just a sane DOM-size ceiling. How many of these are
// actually shown is decided at runtime by how many fully fit the row's width.
const MAX_PROMO_BOOKS = 20;

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

@Component({
  imports: [PromoCard],
  selector: 'app-promo-section',
  styleUrl: './promo-section.css',
  templateUrl: './promo-section.html',
})
export class PromoSection {
  private readonly googleBooks = inject(GoogleBooks);
  protected readonly language = inject(Language);

  protected readonly books = signal<BookSummary[]>([]);

  private readonly rowRef = viewChild<ElementRef<HTMLElement>>('row');
  private readonly cardRefs = viewChildren(PromoCard, { read: ElementRef<HTMLElement> });
  private readonly resizeTick = signal(0);

  // Cards that don't fully fit the row's width are hidden entirely rather than left
  // partially clipped by the row's `overflow: hidden` — see promo-section.css.
  protected readonly visibleCount = signal(Infinity);

  constructor() {
    this.googleBooks.searchRandom().subscribe({
      next: ({ books }) => {
        const withCover = books.filter((book) => book.coverImageUrl !== undefined);
        this.books.set(shuffle(withCover).slice(0, MAX_PROMO_BOOKS));
      },
      error: () => this.books.set([]),
    });

    effect((onCleanup) => {
      const row = this.rowRef()?.nativeElement;
      if (!row || typeof ResizeObserver === 'undefined') {
        return;
      }
      const observer = new ResizeObserver(() => this.resizeTick.update((n) => n + 1));
      observer.observe(row);
      onCleanup(() => observer.disconnect());
    });

    afterRenderEffect(() => {
      this.resizeTick();
      const row = this.rowRef()?.nativeElement;
      const cards = this.cardRefs().map((ref) => ref.nativeElement);
      if (!row || cards.length === 0) {
        return;
      }

      const rowRight = row.getBoundingClientRect().right;
      let count = 0;
      for (const card of cards) {
        if (card.getBoundingClientRect().right <= rowRight + 0.5) {
          count++;
        } else {
          break;
        }
      }
      this.visibleCount.set(count);
    });
  }
}
