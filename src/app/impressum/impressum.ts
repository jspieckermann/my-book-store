import { Component, inject } from '@angular/core';
import { Breadcrumb } from '../breadcrumb/breadcrumb';
import { Language } from '../language/language';

@Component({
  imports: [Breadcrumb],
  selector: 'app-impressum',
  styleUrl: './impressum.css',
  templateUrl: './impressum.html',
})
export class ImpressumPage {
  protected readonly language = inject(Language);
}
