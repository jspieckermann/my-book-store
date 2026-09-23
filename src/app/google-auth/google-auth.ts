import { Service, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

const USERINFO_ENDPOINT = 'https://www.googleapis.com/oauth2/v3/userinfo';

interface GoogleTokenResponse {
  access_token?: string;
}

interface GoogleTokenClient {
  requestAccessToken(): void;
}

interface GoogleAccountsOAuth2 {
  initTokenClient(config: {
    client_id: string;
    scope: string;
    callback: (response: GoogleTokenResponse) => void;
  }): GoogleTokenClient;
}

declare global {
  interface Window {
    google?: {
      accounts: {
        oauth2: GoogleAccountsOAuth2;
      };
    };
  }
}

interface UserInfoResponse {
  name?: string;
}

@Service()
export class GoogleAuth {
  private readonly http = inject(HttpClient);
  private tokenClient: GoogleTokenClient | null = null;

  private readonly _user = signal<{ name: string } | null>(null);
  readonly user = this._user.asReadonly();

  login(): void {
    if (!environment.googleOAuthClientId || !window.google) {
      return;
    }

    if (!this.tokenClient) {
      this.tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: environment.googleOAuthClientId,
        scope: 'openid email profile',
        callback: (response) => this.handleTokenResponse(response),
      });
    }

    this.tokenClient.requestAccessToken();
  }

  logout(): void {
    this._user.set(null);
  }

  private handleTokenResponse(response: GoogleTokenResponse): void {
    if (!response.access_token) {
      this._user.set(null);
      return;
    }

    this.http
      .get<UserInfoResponse>(USERINFO_ENDPOINT, {
        headers: { Authorization: `Bearer ${response.access_token}` },
      })
      .subscribe({
        next: (userInfo) => this._user.set(userInfo.name ? { name: userInfo.name } : null),
        error: () => this._user.set(null),
      });
  }
}
