1.  [x] **Foundation**: Create `constants.ts` with layout dimensions (`CONTENT_WIDTH`) and `DEFAULT_SAFE_HEIGHT` (520px).
2.  [x] **Logic Component**: Rewrite `utils/textUtils.ts`:
    - [x] Implement `measureContentHeight` with a singleton, offscreen DOM container.
    - [x] Ensure measurement container strictly syncs `padding`, `font`, and `word-break: break-word` with Card styles.
    - [x] Implement `paginateText` with Paragraph > Sentence > Char priority.
3.  [x] **App Layer**: Modify `App.tsx`:
    - [x] Implement `useDebounce` hook (300ms).
    - [x] Add hidden "Skeleton" measurement node to capture `safeHeight`.
    - [x] Implement Layout Effect to measure height on mount (MUST wait for `document.fonts.ready`).
    - [x] (Optional) Add resize listener if layout is responsive (skip if fixed).
    - [x] Implement fallback to `DEFAULT_SAFE_HEIGHT` if measurement is 0.
4.  [x] **UI Layer**: Update `components/Card.tsx` to import and usage strict `constants` for consistent styling.
