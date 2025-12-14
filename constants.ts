export const CARD_DIMENSIONS = {
    width: 600,
    height: 800,
    padding: 60, // p-[60px]
};

// Calculated Constants
export const CONTENT_WIDTH = CARD_DIMENSIONS.width - (CARD_DIMENSIONS.padding * 2); // 480px

// Fallback height if measurement fails
export const DEFAULT_SAFE_HEIGHT = 520;

// Typography - Must match Card.tsx exactly
export const TYPOGRAPHY = {
    fontFamily: '"Noto Sans SC", sans-serif',
    fontSize: '28px',
    lineHeight: '1.8',
    letterSpacing: '0.025em', // tracking-wide
    fontWeight: 500, // font-medium
};
