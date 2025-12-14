# Implement Dynamic Visual Pagination

## Summary
Replace the current rigid 120-character pagination limit with a dynamic, visual-height-based system. This ensures text perfectly fills cards based on actual rendering dimensions, accommodating different languages and layouts automatically.

## Problem
Current pagination uses a hard `120` char limit. This leads to:
- Empty space on cards if text is english/narrow.
- Overflow if text is wide.
- Awkward mid-sentence breaks.
- Inability to adapt to future style changes (padding, fonts).

## Solution
Implement a "What You See Is What You Get" pagination by measuring text in a hidden DOM element that mirrors the Card's CSS.
