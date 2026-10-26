import { Component, inject } from '@angular/core';
import { Breadcrumb } from '../breadcrumb/breadcrumb';
import { Language } from '../language/language';
import { LEGAL_NOTICES } from './legal-notices-data';

@Component({
  imports: [Breadcrumb],
  selector: 'app-legal',
  styleUrl: './legal.css',
  templateUrl: './legal.html',
})
export class LegalPage {
  protected readonly language = inject(Language);
  protected readonly notices = LEGAL_NOTICES;
}
