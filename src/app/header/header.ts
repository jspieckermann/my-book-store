import { Component, ElementRef, HostListener, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Cart } from '../cart/cart';
import { GoogleAuth } from '../google-auth/google-auth';
import { Language } from '../language/language';
import { Locale } from '../language/translations';

@Component({
  imports: [RouterLink],
  selector: 'app-header',
  styleUrl: './header.css',
  templateUrl: './header.html',
})
export class Header {
  protected readonly cart = inject(Cart);
  protected readonly googleAuth = inject(GoogleAuth);
  protected readonly language = inject(Language);
  private readonly elementRef = inject(ElementRef<HTMLElement>);

  protected readonly languageMenuOpen = signal(false);

  protected toggleLanguageMenu(): void {
    this.languageMenuOpen.update((open) => !open);
  }

  protected closeLanguageMenu(): void {
    this.languageMenuOpen.set(false);
  }

  protected selectLanguage(locale: Locale): void {
    this.language.setLanguage(locale);
    this.closeLanguageMenu();
  }

  @HostListener('document:click', ['$event'])
  protected onDocumentClick(event: MouseEvent): void {
    if (this.languageMenuOpen() && !this.elementRef.nativeElement.contains(event.target as Node)) {
      this.closeLanguageMenu();
    }
  }
}
