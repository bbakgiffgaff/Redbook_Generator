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

export const AUTO_SHRINK = {
    minFontSize: 22,
    step: 2,
    maxOverflowTolerance: 0.1, // 10%
    defaultFontSize: 28, // Matches TYPOGRAPHY.fontSize parsed
};

export const MARKDOWN_STYLES = {
    bold: {
        fontWeight: 700,
    },
    list: {
        listStyleType: 'disc',
        paddingLeft: '1em',
        marginBottom: '0.5em',
    },
    listItem: {
        marginBottom: '0.25em',
    },
    paragraph: {
        marginBottom: '1em',
    }
};
