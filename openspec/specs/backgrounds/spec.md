# backgrounds Specification

## Purpose
TBD - created by archiving change add-custom-backgrounds. Update Purpose after archive.
## Requirements
### Requirement: Custom Background Upload
The system SHALL allow users to set a custom card background via local image upload.
#### Scenario: Successful Upload
- **Given** I select an image file (`image/*`) under 5MB
- **When** I upload it
- **Then** the image SHALL be compressed (longest side ≤1200px, JPEG quality ≈0.7) to a data URL
- **And** the card preview SHALL render the image as the background with `object-fit: cover`

#### Scenario: Invalid File Rejection
- **Given** I select a file that is not `image/*` or exceeds the size limit
- **When** I upload it
- **Then** the upload SHALL be rejected
- **And** I SHALL see an error/validation message

### Requirement: Overlay Control
The system SHALL provide an adjustable overlay to maintain text readability.
#### Scenario: Overlay Slider
- **Given** I have set a custom background
- **When** I adjust an overlay opacity control between 0% and 80%
- **Then** the card preview SHALL reflect the new overlay opacity in real time
- **And** the default overlay SHALL be approximately 40% black

### Requirement: Export Consistency
The system SHALL export cards with the applied background reliably.
#### Scenario: Image Load Wait
- **Given** a custom background image is set
- **When** I click Download
- **Then** the system SHALL wait for the background image to load (or use cache) before capturing `.card-node`
- **And** if the image fails to load, it SHALL fall back to the default gradient without blocking export
- **And** the exporting/loading state SHALL be cleared even on failure

### Requirement: Persistence & Reset
The system SHALL manage background state predictably without exhausting storage.
#### Scenario: Single Background Persistence
- **Given** I set a custom background
- **When** I reload the page
- **Then** the last background MAY be restored if stored (e.g., in localStorage)
- **And** if storage fails (e.g., quota exceeded), the system SHALL still function with an in-memory background

#### Scenario: Reset to Default
- **Given** a custom background is active
- **When** I click a reset/clear action
- **Then** the card background SHALL revert to the default gradient
- **And** any stored background reference SHALL be cleared

