# Implement Smart Typography

## Why
Current card generation suffers from two visual issues:
1. **Orphaned Lines**: Slight overflows cause rigid pagination, creating awkward single lines on new pages.
2. **Flat Text**: Lack of rich text support (bold, list) makes structure hard to emphasize.

## What Changes
This proposal introduces a "Smart Typography" system:
1. **Auto-Shrink**: Dynamically reduce font size (down to 22px) if content slightly overflows (<10%), preventing unnecessary pagination.
2. **Markdown Support**: Render basic Markdown (`**bold**`, `- list`) to both the measurement container and the final card, ensuring structure is preserved.
3. **Unified Rendering**: Abstract text rendering into a shared utility to guarantee consistency between measurement and display.

## Scope
- `utils/textUtils.ts`: Upgrade measurement to support Markdown parsing and "Shrink Loop".
- `components/Card.tsx`: Replace simple text rendering with Markdown rendering.
- `constants.ts`: Add thresholds for auto-shrink.
