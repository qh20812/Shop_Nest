# PR Notes - Persisting and Rendering User Avatars

This PR adds frontend normalization and a DB migration scaffold to support storing and rendering real user avatars in the Admin Users table.

What I changed:

1. Added migration: `database/migrations/2025_10_12_000000_add_avatar_to_users_table.php`
   - Adds nullable `avatar` and `avatar_url` columns to `users` table.

2. Updated Avatar component: `resources/js/components/ui/Avatar.tsx`
   - Accepts nullable avatar fields
   - Normalizes relative paths to `/storage/...` so avatars stored as `avatars/xxx.jpg` are rendered via public storage link
   - Keeps fallback initials behavior on image load error

3. Updated Admin Users page: `resources/js/pages/Admin/Users/Index.tsx`
   - Adds `avatar` and `avatar_url` fields to the `User` type
   - Normalizes per-user avatar_url when backend provides relative `avatar` paths
   - Uses existing `Avatar` component to render avatars in users table

Server-side steps still required (not implemented here):

- Update `app/Http/Controllers/Settings/ProfileController.php` (or equivalent) to accept avatar uploads and store them on the `public` disk, e.g.:

```php
if ($request->hasFile('avatar')) {
    $path = $request->file('avatar')->store('avatars', 'public');
    $user->avatar = $path; // e.g. avatars/abc.jpg
    $user->avatar_url = Storage::url($path); // optional cached full URL
    $user->save();
}
```

- Ensure `php artisan storage:link` has been run so that `Storage::url()` resolves to `/storage/...` and files are accessible.

- Update Admin user listing (e.g. `app/Http/Controllers/Admin/UserController.php@index`) to include `avatar_url` in the Inertia props. If you only store `avatar` (relative path), compute `avatar_url` server-side using `Storage::url($user->avatar)` and include it in the `users` array passed to Inertia.

- Add validation for uploads in `ProfileUpdateRequest`: `image`, `max:2048`, `mimes:jpg,jpeg,png,gif,webp`.

Testing steps (manual):

1. Run migration:

```powershell
php artisan migrate
```

2. Ensure storage link exists:

```powershell
php artisan storage:link
```

3. Update backend controller (see snippet above), then run the app and upload an avatar from the Profile Settings page.

4. Check that the file exists under `public/storage/avatars/...` and the database `users.avatar` contains the relative path.

5. Visit Admin -> Users and confirm avatars appear next to user names. If not, inspect the `users` Inertia props to verify `avatar` or `avatar_url` values.

Notes:
- This PR changes only frontend normalization and adds the DB migration. It intentionally avoids making backend controller changes so you can review and tune storage policy, file naming, and user permissions before deploying.
- If you prefer storing only `avatar` (relative path) in DB, the frontend will normalize it to `/storage/...`. If you prefer storing full URLs, you can populate `avatar_url` server-side and the frontend will use it directly.

If you'd like, I can also implement the controller/FormRequest and feature tests in this branch—let me know if you want me to proceed with those server-side changes.