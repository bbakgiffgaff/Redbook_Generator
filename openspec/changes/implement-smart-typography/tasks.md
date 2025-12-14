1.  [ ] **Foundation**: Update `constants.ts`
    - [ ] Add `AUTO_SHRINK` thresholds (Min 22px, Step 2px, Tolerance 0.1).
    - [ ] Define `MARKDOWN_STYLES` object (font-weight, padding, list-styles) for strict reuse.
2.  [ ] **Core Logic**: Create `utils/markdownRenderer.tsx`
    - [ ] Implement `parseMarkdown` basic parser (Bold, List).
    - [ ] Implement `renderMarkdown` for DOM/React consumption.
3.  [ ] **Logic Upgrade**: Update `utils/textUtils.ts` (`paginateText`)
    - [ ] Refactor `measureContentHeight` to reuse Singleton Container and apply `MARKDOWN_STYLES`.
    - [ ] Implement support for rendering parsed nodes.
    - [ ] Implement "Shrink Loop": Try smaller fonts if overflow is < 10%.
    - [ ] Ensure `line-height` scales dynamically with `font-size`.
4.  [ ] **UI Integration**: Update `components/Card.tsx`
    - [ ] Use `renderMarkdown` to display content.
    - [ ] Apply `MARKDOWN_STYLES` to the rendered output.
    - [ ] Accept and apply dynamic `fontSize` prop.
5.  [ ] **Verification**:
    - [ ] **Parser Tests**: Verify `**bold**`, `- list`, and plain text handling (including edge cases like `*` literals).
    - [ ] **Shrink Logic**: 
        - [ ] Verify overflow < 10% triggers font reduction (28px -> 26px).
        - [ ] Verify overflow >= 10% forces standard pagination.
    - [ ] **Visual Sync**: Confirm DOM measurement container matches Card render pixel-perfectly.
