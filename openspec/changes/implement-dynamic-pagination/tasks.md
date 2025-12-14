1.  [ ] **Foundation**: Create `constants.ts` with layout dimensions (`CONTENT_WIDTH`) and `DEFAULT_SAFE_HEIGHT` (520px).
2.  [ ] **Logic Component**: Rewrite `utils/textUtils.ts`:
    - [ ] Implement `measureContentHeight` with a singleton, offscreen DOM container.
    - [ ] Ensure measurement container strictly syncs `padding`, `font`, and `word-break: break-word` with Card styles.
    - [ ] Implement `paginateText` with Paragraph > Sentence > Char priority.
3.  [ ] **App Layer**: Modify `App.tsx`:
    - [ ] Implement `useDebounce` hook (300ms).
    - [ ] Add hidden "Skeleton" measurement node to capture `safeHeight`.
    - [ ] Implement Layout Effect to measure height on mount (MUST wait for `document.fonts.ready`).
    - [ ] (Optional) Add resize listener if layout is responsive (skip if fixed).
    - [ ] Implement fallback to `DEFAULT_SAFE_HEIGHT` if measurement is 0.
4.  [ ] **UI Layer**: Update `components/Card.tsx` to import and usage strict `constants` for consistent styling.
