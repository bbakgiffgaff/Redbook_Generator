# Proposal: Add Color Schemes

## Metadata
- **Change ID**: `add-color-schemes`
- **Status**: Proposed
- **Type**: Feature

## Summary
Introduce configurable color themes for the card generator to allow users to customize the visual appearance of the generated images. Currently, the application uses a hardcoded Red gradient ("RedBook" style). This change will add options for other color palettes like Blue, Green, and Purple/Dark.

## Why
The current implementation hardcodes the card background to a specific Red gradient in `components/Card.tsx`. Users cannot change this, limiting the utility of the tool for different content types or personal preferences.

## Design
1.  **Data Model**:
    *   Define `Theme` interface in `types.ts` with:
        *   `id`: unique string identifier (e.g., 'red', 'blue')
        *   `label`: human-readable name
        *   `gradient`: CSS background property
        *   `textColor`: Primary text color hex (ensuring WCAG AA contrast)
        *   `accentColor`: Secondary/accent color hex
    *   Define `cardThemes` constant using `as const` for type safety (Red, Blue, Green, Dark, Beige).
2.  **State Management**:
    *   Lift theme state to `App.tsx`.
    *   **Persistence**: Sync theme selection to URL query parameters (e.g., `?theme=blue`) and/or `localStorage`.
    *   **Fallback**: rigorous fallback to 'red' default if an invalid theme ID is loaded.
3.  **UI**:
    *   Implement a **visual theme selector** (color swatches) in `Editor.tsx`, specifically avoiding simple dropdowns for better UX.
    *   Show current theme state clearly.
4.  **Rendering**:
     *   Update `Card.tsx` to fully utilize the `Theme` object for background, text colors, and watermark opacity/colors.
     *   Ensure WYSIWYG consistency between preview and export.

## Impact
- **Non-breaking**: Default theme will remain "Red" to match existing behavior.
- **UI Changes**: New section in Editor sidebar. Card visual appearance changes based on selection.
