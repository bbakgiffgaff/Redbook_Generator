# Proposal: Add Color Schemes

## Metadata
- **Change ID**: `add-color-schemes`
- **Status**: Proposed
- **Type**: Feature

## Summary
Introduce configurable color themes for the card generator to allow users to customize the visual appearance of the generated images. Currently, the application uses a hardcoded Red gradient ("RedBook" style). This change will add options for other color palettes like Blue, Green, Dark, and Beige, plus a Custom Theme builder.

## Why
The current implementation hardcodes the card background to a specific Red gradient in `components/Card.tsx`. Users cannot change this, limiting the utility of the tool for different content types or personal preferences.

## Design
1.  **Data Model**:
    *   Define `Theme` interface in `types.ts` with:
        *   `id`: unique string (e.g., 'red', 'custom')
        *   `label`: human-readable name
        *   `gradient`: CSS background property
        *   `textColor`: Primary text color hex (ensuring WCAG AA contrast)
        *   `accentColor`: Secondary/accent color hex
    *   Define `cardThemes` constant using `as const` with 5 presets: **Red, Blue, Green, Dark, Beige** (using specific Hex values).
    *   **Custom Theme**: Support dynamic construction of `Theme` object via user input (Gradient Angle `angle`, Color 1 `c1`, Color 2 `c2`).
        *   **Accent Color Strategy**: For custom themes, `accentColor` will automatically derive from the `textColor` (e.g., `textColor` with 30-50% opacity) to simplify user choice and ensure harmony.
2.  **State Management**:
    *   Lift theme state to `App.tsx`.
    *   **Persistence Priority**: 1. URL Query > 2. LocalStorage > 3. Default ('red').
    *   **Custom Sharing**: Support `?theme=custom&c1=hex&c2=hex&angle=deg` (Hex values MUST NOT include `#`).
    *   LocalStorage: Persist last used custom setting as fallback.
    *   **Fallback**: rigorous fallback to 'red' default if an invalid theme ID is loaded.
3.  **UI**:
    *   Implement a **visual theme selector** (color swatches) in `Editor.tsx`.
    *   **Custom Panel**: Add "Custom" swatch that expands a native color picker panel (`<input type="color">`) + Angle Slider.
    *   **Auto-Contrast**: Utility to automatically set text color (Black/White) based on background luminance (WCAG AA).
4.  **Rendering**:
     *   Update `Card.tsx` to fully utilize the `Theme` object.
     *   **Export**: Ensure `html2canvas` captures only `.card-node` for consistent 600x800 output.

## Impact
- **Non-breaking**: Default theme will remain "Red" to match existing behavior.
- **UI Changes**: New section in Editor sidebar. Card visual appearance changes based on selection.
