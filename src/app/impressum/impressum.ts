import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Language } from '../language/language';

@Component({
  imports: [RouterLink],
  selector: 'app-impressum',
  styleUrl: './impressum.css',
  templateUrl: './impressum.html',
})
export class ImpressumPage {
  protected readonly language = inject(Language);
}
