# Design: Smart Typography

## 1. Unified Rendering Pipeline
To ensure 100% accuracy between the hidden "Measurement Container" and the visible "Card", we must abstract the rendering logic.

- **Component**: `RichTextRenderer(text: string): ReactNode`
- **Output**: Returns a React Fragment containing:
    - `p` (Normal text)
    - `strong` (Bold `**text**`)
    - `ul > li` (Lists `- item`)
- **Usage**:
    - **Measurement**: `createRoot(offscreenDiv).render(<RichTextRenderer text={chunk} />)`
    - **Display**: `<Card>{... <RichTextRenderer text={pageContent} /> ...}</Card>`

## 2. Auto-Shrink Algorithm
The pagination logic (`paginateText`) will be enhanced with a "Try-Srink" loop.

### Logic Flow
1.  **Iterate Font Sizes**: `[28px (default), 26px, 24px, 22px (min)]`.
2.  **Measure**: For the current chunk of text (Paragraph priority), measure height at current font size.
3.  **Check Overflow**:
    - If `height <= safeHeight`: **Success**. Commit this chunk to current page.
    - If `height > safeHeight`:
        - Calculate `overflowRatio = (height - safeHeight) / safeHeight`.
        - If `overflowRatio < 0.1` (10%) AND `fontSize > minFontSize`:
            - **Retry**: Reduce font size, update line-height, re-measure.
        - Else:
            - **Fail**: Split text (fallback to Sentence/Char splitting) and move into next page.
            - **Reset**: Next page starts with Default Font Size (28px).

### Constants
- `DEFAULT_FONT_SIZE`: 28px
- `MIN_FONT_SIZE`: 22px
- `SHRINK_STEP`: 2px
- `MAX_OVERFLOW_TOLERANCE`: 0.1

## 3. Style Sync
- **Shared Config**: Define `MARKDOWN_STYLES` object in `constants.ts` containing:
    - `fontWeight` (bold), `listStyleType`, `paddingLeft` (lists), `letterSpacing`, `marginBottom`.
- **Implementation**: Both `Card.tsx` and the `OffscreenContainer` MUST consume these exact styles.
- **Singleton Pattern**: The `OffscreenContainer` must be a singleton to prevent layout thrashing and ensure consistent measurement state.
