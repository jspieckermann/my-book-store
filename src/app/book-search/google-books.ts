import { Service, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Language } from '../language/language';

const VOLUMES_ENDPOINT = 'https://www.googleapis.com/books/v1/volumes';
const PAGE_SIZE = 10;
const MIN_PRICE = 10;
const MAX_PRICE = 70.5;

function isIsbnFormat(query: string): boolean {
  const cleaned = query.replace(/[-\s]/g, '');
  return /^\d{9}[\dXx]$/.test(cleaned) || /^\d{13}$/.test(cleaned);
}

export interface BookSummary {
  title?: string;
  authors?: string[];
  publisher?: string;
  publishedDate?: string;
  description?: string;
  coverImageUrl?: string;
  averageRating?: number;
  ratingsCount?: number;
  price: number;
}

export interface SearchResultsPage {
  books: BookSummary[];
  totalItems: number;
}

interface VolumesResponse {
  totalItems?: number;
  items?: {
    volumeInfo?: {
      title?: string;
      authors?: string[];
      publisher?: string;
      publishedDate?: string;
      description?: string;
      imageLinks?: {
        smallThumbnail?: string;
        thumbnail?: string;
      };
      averageRating?: number;
      ratingsCount?: number;
    };
  }[];
}

function toBookSummary(volumeInfo: NonNullable<VolumesResponse['items']>[number]['volumeInfo']): BookSummary {
  const coverImageUrl = volumeInfo?.imageLinks?.thumbnail ?? volumeInfo?.imageLinks?.smallThumbnail;

  return {
    title: volumeInfo?.title,
    authors: volumeInfo?.authors,
    publisher: volumeInfo?.publisher,
    publishedDate: volumeInfo?.publishedDate,
    description: volumeInfo?.description,
    coverImageUrl: coverImageUrl?.replace(/^http:\/\//, 'https://'),
    averageRating: volumeInfo?.averageRating,
    ratingsCount: volumeInfo?.ratingsCount,
    price: Math.round((Math.random() * (MAX_PRICE - MIN_PRICE) + MIN_PRICE) * 100) / 100,
  };
}

@Service()
export class GoogleBooks {
  private readonly http = inject(HttpClient);
  private readonly language = inject(Language);

  search(query: string, page: number): Observable<SearchResultsPage> {
    const cleaned = query.replace(/[-\s]/g, '');
    const q = isIsbnFormat(query) ? `isbn:${cleaned}` : query;
    const params: Record<string, string> = {
      q,
      startIndex: String((page - 1) * PAGE_SIZE),
      maxResults: String(PAGE_SIZE),
      langRestrict: this.language.current(),
    };
    if (environment.googleBooksApiKey) {
      params['key'] = environment.googleBooksApiKey;
    }

    return this.http.get<VolumesResponse>(VOLUMES_ENDPOINT, { params }).pipe(
      map((response) => ({
        books: (response.items ?? []).map((item) => toBookSummary(item.volumeInfo)),
        totalItems: response.totalItems ?? 0,
      })),
    );
  }
}
