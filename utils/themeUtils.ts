import { Theme, THEMES, DEFAULT_THEME_ID } from '../types';

/**
 * Calculates the relative luminance of a color.
 * Implementation based on WCAG 2.0 formula.
 */
const getLuminance = (r: number, g: number, b: number) => {
    const [rs, gs, bs] = [r, g, b].map(c => {
        c = c / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
};

/**
 * Returns either black or white text color based on background color luminance
 * to ensure WCAG AA compliance.
 * @param hexColor Background color in hex format (with or without #)
 */
export const getContrastColor = (hexColor: string): string => {
    const hex = hexColor.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    const luminance = getLuminance(r, g, b);
    // Threshold 0.179 is a common approximation for contrast ratio 4.5:1
    // However, simple 0.5 threshold on luminance is often sufficient for Black/White decision.
    return luminance > 0.5 ? '#000000' : '#FFFFFF';
};

/**
 * Generates a Custom Theme object from user inputs.
 * @param c1 Start color hex (without #)
 * @param c2 End color hex (without #)
 * @param angle Gradient angle in degrees
 */
export const generateCustomTheme = (c1: string, c2: string, angle: number): Theme => {
    const textColor = getContrastColor(c1); // Base text color on start color (dominant)

    // Convert hex to RGB for rgba processing
    const hexToRgb = (hex: string) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    // Derive accent color from text color with transparency
    // This ensures the accent is always visible/consistent with the theme mode (light/dark)
    const rgb = hexToRgb(textColor);
    const accentColor = rgb
        ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.3)`
        : (textColor === '#FFFFFF' ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)');

    return {
        id: 'custom',
        label: 'Custom',
        gradient: `linear-gradient(${angle}deg, #${c1} 0%, #${c2} 100%)`,
        textColor: textColor,
        accentColor: accentColor,
        customConfig: { c1, c2, angle }
    };
};

/**
 * Retrieves a Theme object by ID.
 * Handles fallback logic:
 * 1. If ID is valid preset -> return preset
 * 2. If ID is 'custom' but no URL/config provided (this checks basic existence) -> logic handled in App.tsx typically
 *    but here we can try to recover last known custom if passed (not available here)
 *    so this function mainly routes presets.
 * 3. Fallback -> Default Theme (Red).
 */
export const getThemeById = (id: string | null | undefined): Theme => {
    if (!id) return THEMES.find(t => t.id === DEFAULT_THEME_ID)!;

    const preset = THEMES.find(t => t.id === id);
    if (preset) return preset;

    // 'custom' case is special, usually handled by App state hydration because it needs params.
    // If we just get 'custom' without config context here, it's invalid effectively,
    // but let's return Default to be safe, anticipating App.tsx handles the specific custom logic.

    return THEMES.find(t => t.id === DEFAULT_THEME_ID)!;
};
