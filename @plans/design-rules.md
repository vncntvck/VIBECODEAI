# Design & Implementation Rules - Laporan Keuangan

## Design Principles

1. **Neo-Brutalist Aesthetic**: Use strong outlines (e.g., `2px solid #000`), flat backgrounds, and bold shadows.
2. **Typography**: Primary font is **Inter** or **Hanken Grotesk**. Use distinct weights for hierarchy.
3. **Color Palette**:
   - Primary: `#000000`
   - Secondary: `#0051d5` (Blue)
   - Background: `#f8f9ff`
   - Error: `#ba1a1a` (Red)
   - Success: `#166534` (Green)
4. **Consistency**: Follow the grid system observed in `@design/code.html`.
5. **Responsiveness**: Mobile-first approach. Use a maximum width of `1200px` for desktop layouts.

## Technical Rules

1. **Framework-free**: Use only pure HTML, Vanilla CSS, and Vanilla JavaScript.
2. **Folder Structure**: All code assets must reside in `@web/`.
3. **Storage**:
   - Use `localStorage` exclusively.
   - Use prefix `fintjam_` for all keys to avoid collisions.
4. **Security**:
   - Check `fintjam_session` on every protected page.
   - Redirect to `login.html` if session is missing.
5. **Currency**: Always format amounts as Rupiah (e.g., `Rp 1.000.000`).
6. **Modularity**: Split logic into `auth.js`, `storage.js`, and `ui.js` where possible, or keep it manageable within script tags if requested simple. (Following user preference for "simple" but efficient).
