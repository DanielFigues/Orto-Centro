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

```bash
cp .env.example .env
```

Create `.env.example` with the following content:

```env
VITE_API_URL=http://localhost:8000
API_TOKEN=your_secure_token_here
```

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
- Products are served by the PHP backend from the SQLite database. They include fields such as `name`, `category`, `subcategory`, `description`, `short_description`, `technical_specs` (stored as JSON), `brand`, `sizes`, and up to three image URLs (`image_url`, `image_url_2`, `image_url_3`). Images are uploaded to and served from the `public/uploads/` directory.
- Images currently in the repository are placeholders and should be replaced before launch.

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
3. **Configuration:** Ensure the `VITE_API_URL` environment variable points to your production API URL (e.g., `https://api.yourdomain.com`). Set the `API_TOKEN` securely on your server.
4. **CORS:** Configure your web server or the PHP script to allow CORS requests from your frontend domain. Ensure the `.env` configuration on the production server is secure and inaccessible via the web.
5. **Uploads:** Make sure the `public/uploads` directory (or wherever your production uploads go) has the appropriate write permissions for the web server user.
