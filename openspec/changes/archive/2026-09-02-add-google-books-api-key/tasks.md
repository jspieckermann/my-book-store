## 1. Environment configuration scaffolding

- [x] 1.1 Create `src/environments/environment.example.ts` exporting `{ googleBooksApiKey: '' }`, tracked in git as the setup template — verify the file exists and is committed (not gitignored)
- [x] 1.2 Add `src/environments/environment.ts` (copy of the example) to `.gitignore`, and create a local `src/environments/environment.ts` with an empty `googleBooksApiKey` for now — verify `git status` shows `environment.ts` as untracked/ignored while `environment.example.ts` is tracked

## 2. Service: include the key when configured

- [x] 2.1 Update `GoogleBooks.searchByIsbn()` in `src/app/isbn-search/google-books.ts` to import `environment` and add a `key` param to the request only when `environment.googleBooksApiKey` is non-empty — verify by inspecting the request params logic for both the empty-key and non-empty-key cases
- [x] 2.2 Remove the leftover debug `console.log(params)` in `google-books.ts` while editing this file — verify the file contains no `console.log` calls

## 3. Verification

- [x] 3.1 Run `npm run build` and confirm it completes without errors (with `environment.ts` present locally as created in 1.2)
- [x] 3.2 Run `npm test` and confirm existing tests still pass
- [x] 3.3 With `googleBooksApiKey` left empty, perform a search and confirm (via browser devtools network tab) the request to `googleapis.com/books/v1/volumes` has no `key` query parameter — behavior unchanged from before this change
- [x] 3.4 Obtain a real Google Cloud API key with the Books API enabled (HTTP referrer restriction recommended per proposal.md), place it in the local `environment.ts`, perform a search, and confirm (via browser devtools network tab) the request includes the `key` query parameter and no longer returns the previously-seen `429 Quota exceeded` response
