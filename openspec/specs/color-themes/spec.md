# color-themes Specification

## Purpose
TBD - created by archiving change add-color-schemes. Update Purpose after archive.
## Requirements
### Requirement: Support Multiple Color Themes
The application MUST support selectable color themes for the generated cards.

#### Scenario: Default Theme
Given the application is loaded
When I check the initial state
Then the "Red" (classic) theme should be selected by default
And the cards should be rendered with the red gradient background

#### Scenario: Switch Theme
Given I am editing a card
When I click on a different theme swatch (e.g., "Blue" color block) in the editor
Then the preview cards should immediately update to use the Blue gradient background
And the export should use the Blue theme

### Requirement: Theme Configuration
Each theme MUST define at least:
- A background gradient (CSS value)
- Primary text color (usually white for these styles)
- Accent colors (for decorations)
- Unique ID and label

#### Scenario: Data Structure
Given I am inspecting the `THEMES` configuration
When I check the type definition
Then it MUST enforce the string `id`, `gradient`, and `label` properties
And it MUST be a read-only constant (`as const`)

### Requirement: Theme Persistence and Robustness
The application MUST preserve the user's theme choice and handle invalid states gracefully.

#### Scenario: Persistence & Priority
The application determines the active theme based on the following priority (highest to lowest):
1.  **URL Query Parameter** (`?theme=...`)
2.  **Local Storage** (User's last choice)
3.  **Default** ('red')

#### Scenario: URL Overrides Local Storage
Given I have "Green" stored in localStorage
When I visit the app with `?theme=blue`
Then the "Blue" theme MUST be selected

#### Scenario: Fallback for Invalid Storage
Given localStorage contains an invalid theme `{theme: "invalid_id"}`
And no URL parameter is present
When I load the app
Then the "Red" (Default) theme MUST be selected
And the application MUST NOT crash

#### Scenario: Predefined Themes
The system MUST offer the following presets with specific color values to ensure consistent aesthetics:

*   **Red** (Default)
    *   Gradient: `linear-gradient(135deg, #D92027 0%, #B51B22 100%)`
    *   Text Color: `#FFFFFF`
*   **Blue** (Tech)
    *   Gradient: `linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)`
    *   Text Color: `#FFFFFF`
*   **Green** (Nature)
    *   Gradient: `linear-gradient(135deg, #059669 0%, #047857 100%)`
    *   Text Color: `#FFFFFF`
*   **Dark** (Modern)
    *   Gradient: `linear-gradient(135deg, #1F2937 0%, #111827 100%)`
    *   Text Color: `#FFFFFF`
*   **Beige** (Minimalist)
    *   Gradient: `linear-gradient(135deg, #F5F5F4 0%, #E7E5E4 100%)`
    *   Text Color: `#1C1917` (Dark Stone for WCAG AA constrast)

### Requirement: Custom Theme Support
The system MUST allow users to create a custom gradient theme using a color picker.

#### Scenario: Custom Color Picker
Given I select the "Custom" option in the theme selector
Then a panel MUST appear with inputs for Color 1, Color 2, and Angle
And using the native color picker (`<input type="color">`) MUST update the preview in real-time

#### Scenario: Auto Contrast (WCAG AA)
Given I choose a background color with low luminance (dark)
Then the system MUST automatically switch the Text Color to White to ensure WCAG AA contrast
Given I choose a background color with high luminance (light)
Then the system MUST automatically switch the Text Color to Black

#### Scenario: Custom URL Sharing
Given I have configured a custom theme (e.g., Pink to Purple, 45deg)
When I copy the URL, it MUST include the parameters `?theme=custom&c1=FF00FF&c2=800080&angle=45` (Hex values without `#`)
And when another user opens this URL
Then they MUST see the exact same custom gradient applied automatically
And the "Custom" swatch MUST be selected

#### Scenario: Broken Custom URL Fallback
Given I open a URL `?theme=custom` but it is missing c1/c2 parameters or they are invalid
And I have a previously saved valid custom theme in localStorage
Then the system SHOULD fall back to the saved custom theme from localStorage
If localStorage is also empty or invalid
Then the system MUST fall back to the "Red" default theme

### Requirement: Accessibility & UI
The theme selector MUST be accessible and usable.

#### Scenario: Keyboard Navigation (Presets)
Given I am using a keyboard
When I tab into the theme selector
Then I MUST be able to focus each theme swatch
And select one using the Enter or Space key
And each swatch MUST have a descriptive `aria-label`

#### Scenario: Custom Panel Accessibility
Given the Custom panel is open
When I navigate with keyboard
Then I MUST be able to focus the Color Pickers and Angle Slider
And adjust values using keyboard controls

### Requirement: Robust Export
Export functionality MUST be consistent and resilient.

#### Scenario: Export Scope
Given I have applied a theme
When I click download
Then the system MUST capture ONLY the `.card-node` element (excluding external margins/shadows)
And the result MUST be exactly 600x800px

#### Scenario: Error Recovery
Given the export process fails (e.g., timeout)
Then the "Processing" loading state MUST be cleared
And the user MUST be able to try again

