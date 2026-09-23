import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Language } from '../language/language';

@Component({
  imports: [RouterLink],
  selector: 'app-footer',
  styleUrl: './footer.css',
  templateUrl: './footer.html',
})
export class Footer {
  protected readonly language = inject(Language);
}
