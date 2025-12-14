1.  [x] **Foundation**: Update `constants.ts`
    - [x] Add `AUTO_SHRINK` thresholds (Min 22px, Step 2px, Tolerance 0.1).
    - [x] Define `MARKDOWN_STYLES` object (font-weight, padding, list-styles) for strict reuse.
2.  [x] **Core Logic**: Create `utils/markdownRenderer.tsx`
    - [x] Implement `parseMarkdown` basic parser (Bold, List).
    - [x] Implement `renderMarkdown` for DOM/React consumption.
3.  [x] **Logic Upgrade**: Update `utils/textUtils.ts` (`paginateText`)
    - [x] Refactor `measureContentHeight` to reuse Singleton Container and apply `MARKDOWN_STYLES`.
    - [x] Implement support for rendering parsed nodes.
    - [x] Implement "Shrink Loop": Try smaller fonts if overflow is < 10%.
    - [x] Ensure `line-height` scales dynamically with `font-size`.
4.  [x] **UI Integration**: Update `components/Card.tsx`
    - [x] Use `renderMarkdown` to display content.
    - [x] Apply `MARKDOWN_STYLES` to the rendered output.
    - [x] Accept and apply dynamic `fontSize` prop.
5.  [ ] **Verification**:
    - [x] **Parser Tests**: Verify `**bold**`, `- list`, and plain text handling (including edge cases like `*` literals).
    - [x] **Shrink Logic**: 
        - [x] Verify overflow < 10% triggers font reduction (28px -> 26px).
        - [x] Verify overflow >= 10% forces standard pagination.
    - [x] **Visual Sync**: Confirm DOM measurement container matches Card render pixel-perfectly.
