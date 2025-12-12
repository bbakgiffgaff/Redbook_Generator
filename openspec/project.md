# Project Context

## Purpose
A client-side utility application designed to automatically convert variable-length text into aesthetic "RedBook" (XiaoHongShu) style image cards. It solves the pain point of manual typesetting for social media posts by automatically paginating text and generating downloadable images.

## Tech Stack
-   **Core**: React v19, TypeScript, Vite
-   **Styling**: Tailwind CSS (via CDN)
-   **Utilities**:
    -   `html2canvas`: DOM to Image conversion
    -   `jszip`: Batch image downloading
    -   `lucide-react`: Icons

## Project Conventions

### Code Style
-   **Functional Components**: All components are React Functional Components using Hooks.
-   **Styling**: Primary use of Tailwind CSS utility classes.
-   **File Structure**:
    -   `/components`: UI components (e.g., `Card.tsx`, `Editor.tsx`).
    -   `/utils`: Pure logic (e.g., `textUtils.ts` for pagination) and browser APIs (`downloadUtils.ts`).
    -   `types.ts`: Shared TypeScript interfaces.

### Architecture Patterns
-   **Client-Side Only**: No backend server or API dependencies. All logic (pagination, image generation) runs in the browser.
-   **Unidirectional Data Flow**: State is managed in `App.tsx` and passed down to `Editor` and `Card` components.

### Testing Strategy
-   **Manual Testing**: Currently relies on manual verification in the browser (editing text, checking pagination, downloading zip).
-   **Future**: Potential for Vitest + React Testing Library for unit tests (especially `textUtils.ts`).

### Git Workflow
-   Direct commits to `main` for small changes.
-   Feature branches recommended for larger features.

## Domain Context
-   **RedBook Style**: Requires specific aspect ratios (typically 3:4), clear typography, and "ins-style" aesthetics.
-   **Pagination**: Text must be intelligently split to fit within cards without overflowing, creating a cohesive carousel experience.

## Important Constraints
-   **Browser Compatibility**: Relies on `html2canvas`, which may have minor rendering differences across browsers.
-   **Performance**: Generating many cards at once may be CPU intensive; client-side generation limits.

## External Dependencies
-   **Google Fonts**: Noto Sans SC via CDN.
-   **Tailwind CDN**: Loaded directly in `index.html` (not locally installed).
