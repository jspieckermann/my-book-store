import { Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Language } from '../language/language';

@Component({
  imports: [RouterLink],
  selector: 'app-breadcrumb',
  styleUrl: './breadcrumb.css',
  templateUrl: './breadcrumb.html',
})
export class Breadcrumb {
  readonly currentPageLabel = input.required<string>();

  protected readonly language = inject(Language);
}
