# Orto Centro

An online product catalog for Orto Centro, a health and accessibility products store. Customers can browse mobility aids, orthopedic supports, bathroom safety items and more, so they can find what they need without calling the store every time.

This is a catalog, not an e-commerce site: there is no cart, no checkout and no promotions. Prices are shown only when a product has one.

<!-- TODO: add a screenshot or GIF of the home page here, e.g. ![Home page](docs/home.png) -->

## Features

- **Hero and category rail.** Horizontal, scroll-snap category browser with drag support, keyboard navigation and a hover overlay.
- **Featured products showcase.** One product at a time with a progress bar that fills while the slide is active. Pauses on hover and focus, and stops for good after the first manual interaction.
- **Product detail pages** with gallery, description and specifications.
- **Category pages** with subcategories.
- **Header navigation** with subcategory dropdowns and a "More" menu that adapts to the available width.
- **Product search.**
- **Light and dark themes.**
- **Admin page** to manage products. The admin page allows adding, editing, and deleting products, including image uploads, and is protected by a token-based authentication system.
- **Accessibility first:** WCAG AA contrast, visible focus states, full keyboard navigation, prefers-reduced-motion support and large click targets, since many visitors are elderly people and caregivers.

## Tech stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React, TypeScript, Vite |
| **Backend** | PHP |
| **Database** | SQLite |
| **Styling** | Tailwind CSS |

## Getting started

### Prerequisites

- Node.js 18 or newer
- PHP 8.0 or newer
- SQLite3 (usually bundled with PHP)

### 1. Clone and install

```bash
git clone <repository-url>
cd Orto-Centro
npm install
```

### 2. Configure the environment

Create a `.env` file in the project root:

```env
VITE_API_URL=http://localhost:8000
API_TOKEN=your_secure_token_here
```

Available variables:

| Variable | Description |
| :--- | :--- |
| `VITE_API_URL` | Base URL of the PHP backend API (the Vite dev server already proxies `/api` to `http://localhost:8000`, so this is only needed if the API is hosted elsewhere). |
| `VITE_SITE_URL` | Public URL of the deployed site, without a trailing slash (e.g. `https://www.ortocentro.com.br`). Used to build the product link inside the WhatsApp availability message. If empty, the app falls back to `window.location.origin`, which is fine for local development. |
| `API_TOKEN` | Admin panel token — must match the token configured on the PHP server. |

### 3. Set up the database

The application uses SQLite, so there is no need for a separate database server. The database file will be created automatically in the `backend/` directory when the backend is first accessed, or you can create it manually by running the initialization script:

```bash
php backend/database.php
```

*(Optional)* To populate the database with initial sample data, you can run:

```bash
php backend/seed.php
```
*(assuming a seed.php file exists)*

### 4. Run the project

Start the PHP backend:

```bash
cd backend
php -S localhost:8000
```

In another terminal, start the frontend:

```bash
npm run dev
```

The site is available at http://localhost:5173 and the API at http://localhost:8000.

## Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |

## Project structure

```text
Orto-Centro/
├── backend/            # PHP API and SQLite database
├── public/             # Static assets (including uploaded images)
├── src/
│   ├── components/
│   │   ├── bits/       # Reusable visual components (cards, carousel, text effects)
│   │   ├── catalog/    # Product and category components
│   │   ├── layout/     # Header, footer, page layout
│   │   └── ui/         # Generic UI building blocks
│   ├── context/        # React context providers
│   ├── data/           # Categories and static content (single source of truth)
│   ├── hooks/
│   ├── lib/
│   ├── pages/          # Home, Category, ProductDetail, Admin
│   ├── services/       # API access
│   ├── types/
│   ├── App.tsx
│   └── main.tsx
├── index.html
└── package.json
```

## Content and data

- Categories live in a single file in `src/data/`. The header menu, category rail, footer, search and filters all read from it, so adding or reordering a category is a one-file change.
- Products are served by the PHP backend from the SQLite database. They include fields such as `name`, `category`, `subcategory`, `description`, `short_description`, `technical_specs` (stored as JSON), `brand`, `sizes`, `price` (optional, nullable) and up to five image URLs (`image_url`, `image_url_2`, `image_url_3`, `image_url_4`, `image_url_5`). Images are uploaded to and served from the `public/uploads/` directory.
- Images currently in the repository are placeholders and should be replaced before launch.

## Database

- Schema changes are **automatic and permanent**: no manual migration script is ever needed.
- `backend/database.php` contains the connection (`db()`) and the migration runner. On the first connection of each request, it applies every pending migration from `backend/migrations/` **inside a single transaction** (a failure rolls everything back, so the database is never half-migrated) and records each applied migration in the `schema_migrations` table (`id`, `name`, `applied_at`). If everything is already applied, it does nothing.
- A fresh, empty database ends up with the complete current schema automatically; an existing (old or already migrated) database is upgraded in place without data loss.
- **How to add a new migration:** create a numbered file in `backend/migrations/`, e.g. `004_add_column_x.php`, with a higher number than the last existing one, returning a closure:

  ```php
  <?php
  declare(strict_types=1);
  return function (PDO $pdo): void {
      // Idempotent, additive change, e.g.:
      // $columns = $pdo->query('PRAGMA table_info(products)')->fetchAll(PDO::FETCH_COLUMN, 1);
      // if (!in_array('column_x', $columns, true)) {
      //     $pdo->exec("ALTER TABLE products ADD COLUMN column_x TEXT DEFAULT ''");
      // }
  };
  ```

  Files must match `NNN_name.php` and are applied in filename order. Keep migrations additive and idempotent (check `PRAGMA table_info` before `ALTER TABLE`), and never drop or modify existing data. After deploying the file, the next request applies it automatically — on production too.
- The real database (`backend/data/catalog.sqlite`) is **not** in the repository: `backend/data/*.sqlite`, `*.sqlite3` and `*.db` are ignored by git. `backend/data/` (database) and `backend/uploads/` (uploads) are created automatically by the backend if missing.
- `backend/data/` must not be web-accessible (the `.sqlite` file must not be downloadable by URL). It ships an `.htaccess` with `Require all denied` for Apache (requires `AllowOverride All`). For Nginx, add an equivalent rule, e.g. `location /backend/data/ { deny all; return 404; }`. Best practice: keep the whole `backend/` directory outside the web root and only expose `index.php` (and `/uploads/` for images).

## Accessibility

The audience of this site includes elderly users and caregivers, so accessibility is a core requirement and not an extra:

- WCAG AA color contrast in both themes
- Keyboard navigation for every interactive element, with visible focus
- Auto-advancing content can be paused (hover, focus) and stops after the first interaction
- Animations are disabled when the user prefers reduced motion
- Touch targets of at least 44px on touch devices

## Deployment

1. **Frontend:** Build the frontend using `npm run build`. The output will be placed in the `dist/` folder.
2. **Backend:** Upload the contents of the `backend/` directory and the `dist/` directory to your web server (e.g., Apache or Nginx with PHP support).
3. **Configuration:** Ensure the `VITE_API_URL` environment variable points to your production API URL (e.g., `https://api.yourdomain.com`). Set `VITE_SITE_URL` to the public URL of the deployed site (e.g., `https://www.ortocentro.com.br`) so the WhatsApp availability message links use the production domain. Set the `API_TOKEN` securely on your server.
4. **CORS:** Configure your web server or the PHP script to allow CORS requests from your frontend domain. Ensure the `.env` configuration on the production server is secure and inaccessible via the web.
5. **Uploads:** Make sure the `public/uploads` directory (or wherever your production uploads go) has the appropriate write permissions for the web server user.
