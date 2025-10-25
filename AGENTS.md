# UCS Agriculture Project Snapshot

## Tech Stack & Layout
- Next.js App Router (`src/app`) with TypeScript, Tailwind, Framer Motion, Lenis smooth-scrolling, Swiper, Mapbox GL, and dynamic imports for heavy sections.
- Global styles live in `src/app/globals.css` and fonts in `src/app/fonts.css`; environment-driven assets rely on `NEXT_PUBLIC_CDN_URL` with local fallbacks in `/public`.
- Shared landing components sit under `src/components/AgricultureLanding`; admin utilities under `src/components/Admin`; hooks/lib folders back auxiliary logic (`src/hooks`, `src/lib`).

## Home Page (`src/app/page.tsx`)
### Hero (`Hero.tsx`)
- Animated navigation + hero slider with `heroImages = ["/hero1.webp", "/hero3.webp"]`; logos/wheat sourced from `${NEXT_PUBLIC_CDN_URL}` and fall back to `/public` assets (e.g., `logo.svg`, `wheat.webp`).
- Headline/body copy is hard-coded in component; dropdown content rendered via `Header` component.

### Mission Highlight (`OurMissionHome.tsx`)
- Drives marquee logos from CDN/local files (`aag.png`, `agrova.png`, etc.) and counter cards with copy inside `statsForMobileCards` + inline strings.
- CEO quote uses `${NEXT_PUBLIC_CDN_URL}/ceo.jpg` with local fallback.

### Products (`OurProduct.tsx` & `ExpandingProductImage.tsx`)
- `productData` array defines titles/descriptions and image filenames (`/ourproducts1.webp`, `/4.webp`, `/5.webp`, `/ourproducts4.webp`).
- Promotional imagery pulled via CDN fallback pattern; large center image uses `/2.jpg`.

### Gallery (`Gallery/Gallery.tsx`)
- Fetches collections from `/api/gallery`; cover/slide images come from Supabase URLs returned in `GalleryImage.url` (not bundled in repo).
- Section title/description strings embedded in component; modal handled by `GalleryModal.tsx`.

### Operation Map (`OperationMap.tsx` & `Map.tsx`)
- Lazy-loads Mapbox map requiring `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN`; `locations` array holds marker metadata (Mersin, Habur, etc.).
- UI controls text resides inline; no external data files.

### Advantages (`OurAdvantages.tsx` + `AdvantageBentoCard.tsx`)
- `features` array defines copy and background image filenames (`/7.webp`, `/8.webp`, `/9.jpg`, `/10.jpg`, `/14.webp`, `/15.webp`).
- Backgrounds fetched via CDN first; modal text mirrors `description` strings.

### Services Cards (`CardsComponent.tsx`)
- `projects` array stores titles, multi-paragraph descriptions, and related images (`/11.webp`, `/13.webp`, `/12.webp`).
- Uses Lenis + Framer Motion for scroll scaling.

### Contact & Footer (`ContactForm.tsx`, `Footer.tsx`)
- Form labels/placeholders hard-coded; CTA icon hits `${NEXT_PUBLIC_CDN_URL}/arrow.svg` fallback `/arrow.svg`.
- Contact map is an embedded Google Maps iframe; `ReactSignature` component renders digital signature pad when Chrome.
- Footer text (address, phone, email) and social icons defined inline; logo references CDN/local `logo.svg`.

## About Page (`src/app/about/page.tsx`)
### About Header (`AboutUs.tsx`)
- Copy baked into component; emphasises company model.

### Mission Blocks (`OurMission.tsx`)
- Hero image `about.webp` (CDN fallback); quotes and paragraphs inline.

### Documents (`Documents.tsx` + `src/lib/pdfData.json`)
- Lists documents from `pdfData.json`; PDFs served from `/public/pdfs/<file>` via `/view?file=` route handled by `PDFViewer.tsx`.

## Admin & Auxiliary Routes
- `/admin` (client-side) leverages `components/Admin` forms/modals to CRUD galleries against `/api/gallery`.
- `/view` suspends `PDFViewer` for document rendering.
- `/login` and `/app/api` directories exist (not inspected in detail here) for authentication and API endpoints.

## Asset Inventory Highlights (`/public`)
- Contains all fallback imagery: hero slides (`hero1.webp`, `hero3.webp`), product shots (`2.jpg`, `4.webp`, `5.webp`, `ourproducts1.webp`), services graphics (`11.webp`, `12.webp`, `13.webp`), advantage backgrounds (`7.webp`–`15.webp`), logos for marquee (`aag.png`, `agrova.png`, etc.), and documents (`/pdfs/1.pdf`–`4.pdf`).
