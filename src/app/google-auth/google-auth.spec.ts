import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { GoogleAuth } from './google-auth';
import { environment } from '../../environments/environment';

describe('GoogleAuth', () => {
  let httpMock: HttpTestingController;
  let initTokenClientMock: ReturnType<typeof vi.fn>;
  let requestAccessTokenMock: ReturnType<typeof vi.fn>;
  const originalClientId = environment.googleOAuthClientId;
  const originalWindowGoogle = (window as unknown as { google?: unknown }).google;

  function stubWindowGoogle(): void {
    requestAccessTokenMock = vi.fn();
    initTokenClientMock = vi.fn(() => ({ requestAccessToken: requestAccessTokenMock }));
    (window as unknown as { google: unknown }).google = {
      accounts: { oauth2: { initTokenClient: initTokenClientMock } },
    };
  }

  function tokenCallback(): (response: { access_token?: string }) => void {
    return initTokenClientMock.mock.calls[0][0].callback;
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GoogleAuth, provideHttpClient(), provideHttpClientTesting()],
    });
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    environment.googleOAuthClientId = originalClientId;
    (window as unknown as { google?: unknown }).google = originalWindowGoogle;
    httpMock.verify();
  });

  it('login() no-ops when no client ID is configured', () => {
    environment.googleOAuthClientId = '';
    stubWindowGoogle();
    const googleAuth = TestBed.inject(GoogleAuth);

    googleAuth.login();

    expect(initTokenClientMock).not.toHaveBeenCalled();
  });

  it('login() no-ops when window.google is unavailable', () => {
    environment.googleOAuthClientId = 'test-client-id';
    delete (window as unknown as { google?: unknown }).google;
    const googleAuth = TestBed.inject(GoogleAuth);

    expect(() => googleAuth.login()).not.toThrow();
    httpMock.expectNone(() => true);
  });

  it('login() constructs the token client and requests a token when configured', () => {
    environment.googleOAuthClientId = 'test-client-id';
    stubWindowGoogle();
    const googleAuth = TestBed.inject(GoogleAuth);

    googleAuth.login();

    expect(initTokenClientMock).toHaveBeenCalledWith(
      expect.objectContaining({ client_id: 'test-client-id', scope: 'openid email profile' }),
    );
    expect(requestAccessTokenMock).toHaveBeenCalled();
  });

  it('login() reuses the same token client on subsequent calls', () => {
    environment.googleOAuthClientId = 'test-client-id';
    stubWindowGoogle();
    const googleAuth = TestBed.inject(GoogleAuth);

    googleAuth.login();
    googleAuth.login();

    expect(initTokenClientMock).toHaveBeenCalledTimes(1);
    expect(requestAccessTokenMock).toHaveBeenCalledTimes(2);
  });

  it('sets the signed-in user from the userinfo response after a successful token grant', () => {
    environment.googleOAuthClientId = 'test-client-id';
    stubWindowGoogle();
    const googleAuth = TestBed.inject(GoogleAuth);
    googleAuth.login();

    tokenCallback()({ access_token: 'tok123' });

    const req = httpMock.expectOne((r) => r.url.includes('userinfo'));
    expect(req.request.headers.get('Authorization')).toBe('Bearer tok123');
    req.flush({ name: 'Ada Lovelace' });

    expect(googleAuth.user()).toEqual({ name: 'Ada Lovelace' });
  });

  it('leaves the user signed out when the userinfo response has no name', () => {
    environment.googleOAuthClientId = 'test-client-id';
    stubWindowGoogle();
    const googleAuth = TestBed.inject(GoogleAuth);
    googleAuth.login();

    tokenCallback()({ access_token: 'tok123' });
    httpMock.expectOne((r) => r.url.includes('userinfo')).flush({});

    expect(googleAuth.user()).toBeNull();
  });

  it('leaves the user signed out when the token response has no access token', () => {
    environment.googleOAuthClientId = 'test-client-id';
    stubWindowGoogle();
    const googleAuth = TestBed.inject(GoogleAuth);
    googleAuth.login();

    tokenCallback()({});

    httpMock.expectNone(() => true);
    expect(googleAuth.user()).toBeNull();
  });

  it('leaves the user signed out when the userinfo request fails', () => {
    environment.googleOAuthClientId = 'test-client-id';
    stubWindowGoogle();
    const googleAuth = TestBed.inject(GoogleAuth);
    googleAuth.login();

    tokenCallback()({ access_token: 'tok123' });
    httpMock
      .expectOne((r) => r.url.includes('userinfo'))
      .flush('Server error', { status: 500, statusText: 'Server Error' });

    expect(googleAuth.user()).toBeNull();
  });

  it('logout() clears the signed-in user', () => {
    environment.googleOAuthClientId = 'test-client-id';
    stubWindowGoogle();
    const googleAuth = TestBed.inject(GoogleAuth);
    googleAuth.login();
    tokenCallback()({ access_token: 'tok123' });
    httpMock.expectOne((r) => r.url.includes('userinfo')).flush({ name: 'Ada Lovelace' });
    expect(googleAuth.user()).toEqual({ name: 'Ada Lovelace' });

    googleAuth.logout();

    expect(googleAuth.user()).toBeNull();
  });
});
