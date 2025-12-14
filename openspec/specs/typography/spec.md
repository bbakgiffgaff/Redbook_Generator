# typography Specification

## Purpose
TBD - created by archiving change implement-smart-typography. Update Purpose after archive.
## Requirements
### Requirement: Markdown Support
The system SHALL support basic Markdown syntax to enhance text expressiveness.
#### Scenario: Bold Text
- **Given** text containing `**keyword**`
- **When** rendered in Card or Measurement container
- **Then** the "keyword" MUST be displayed with `font-weight: 700` (Bold).

#### Scenario: List Items
- **Given** lines starting with `- `
- **When** rendered
- **Then** they MUST be displayed as list items with strict indentation and bullets.
- **And** the indentation MUST be identical in both measurement and final display.

### Requirement: Auto-Shrink Typography
The system SHALL strictly reduce font size to prevent minor text overflows ("orphan lines").
#### Scenario: Minor Overflow
- **Given** a text chunk that exceeds the page height by less than 10%
- **When** paginating
- **Then** the system MUST attempt to reduce the font size (down to 22px).
- **And** if the reduced size fits, it MUST be used for that page.
- **And** the line-height MUST adjust proportionally (ratio 1.8).

#### Scenario: Major Overflow
- **Given** a text chunk that exceeds tolerance (>10%) or cannot fit even at 22px
- **When** paginating
- **Then** the system MUST split the text (standard pagination) and reset to Default Font Size (28px) for the next page.

