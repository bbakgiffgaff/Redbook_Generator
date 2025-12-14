# Design: Dynamic Visual Pagination

## Core Strategy
Instead of guessing the safe height, the App will render a hidden "Skeleton Card" to measure the exact available pixel height for text. This ensures the pagination logic strictly follows the actual CSS layout at runtime.

## Architecture

### 1. Constants & Styling
**File**: `constants.ts`
- `CARD_DIMENSIONS`: Width (600px), Height (800px).
- `TYPOGRAPHY`: Font family, size (28px), line-height (1.8).
- `DEFAULT_SAFE_HEIGHT`: 520px (Fallback).
- `CONTENT_PADDING`: 60px.

### 2. Dynamic Measurement (App Layer)
- **Mechanism**: Render a `<div id="layout-reference">` that mirrors the Card structure (Header + Footer + Padding).
- **Trigger**: `useEffect` waits for `document.fonts.ready`.
- **Measurement**: `clientHeight` of the empty content area is captured as `dynamicSafeHeight`.
- **Fallback**: If measurement is 0 (e.g., SSR or initial render), use `DEFAULT_SAFE_HEIGHT`.

### 3. Pagination Logic (Utils Layer)
- **Function**: `paginateText(text, containerHeight)`
- **Measurement Mechanism**:
    - **Singleton**: Utilize a lazily-created `div` (Offscreen) to prevent layout thrashing.
    - **Style Sync**: This container MUST strictly match the Card's `content-area`:
        - `width`: `CONTENT_WIDTH` (Calculated from 600px - padding).
        - `padding`, `font-family`, `font-size`, `line-height`, `letter-spacing`, `font-weight`.
        - **Critical**: `word-break: break-word` to ensure long URLs don't break layout width.
- **Algorithm (Splitting Strategy)**:
    1.  **Paragraph Priority**: Try fitting entire paragraphs first.
    2.  **Sentence Priority**: If a paragraph overflows, split by `。！？.!?`.
    3.  **Character Fallback**: If a single sentence overflows (e.g., long URL), force split by character/word.
    4.  Accumulate content until `div.scrollHeight > containerHeight`.

### 4. Performance & Lifecycle
- **Debounce**: `App.tsx` applies 300ms debounce to input text.
- **Lifecycle**: Measurement happens on mount (after `document.fonts.ready`). Window resize re-measurement is optional as Card dimensions are fixed (600x800).
- **Resilience**: If `clientHeight` is 0 (hidden/SSR), use `DEFAULT_SAFE_HEIGHT`.
