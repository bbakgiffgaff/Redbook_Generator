# Spec: Visual Pagination

## MODIFIED Requirements

### Requirement: Dynamic Pagination Logic
The system SHALL handle text pagination based on real-time DOM measurements rather than static character limits.
#### Scenario: Text exceeds available card height
- **Given** a long text input
- **And** a card layout with dynamic header/footer heights
- **When** the text is paginated
- **Then** the split points MUST be determined by the actual rendered pixel height of the text content.
- **And** the text MUST NEVER visually overflow the card content area.
- **And** the available height MUST be measured dynamically from the runtime layout, not hardcoded.

### Requirement: Paragraph handling
The system SHALL prioritize semantic integrity when splitting text.
#### Scenario: Paragraph handling
- **Given** a multi-paragraph text
- **When** paginating
- **Then** the logic MUST prioritize keeping paragraphs intact on one page.
- **And** ONLY split paragraphs if they exceed the page height individually.

### Requirement: Input Debounce
The system SHALL throttle expensive layout calculations during user input.
#### Scenario: Input Debounce
- **Given** the user is typing rapidly
- **When** text is updated
- **Then** the pagination calculation MUST NOT run immediately.
- **And** MUST wait for a 300ms debounce period to avoid performance degradation.

### Requirement: Font Loading
The system SHALL ensure fonts are loaded before performing layout calculations.
#### Scenario: Font Loading
- **Given** a fresh page load
- **When** calculating layout
- **Then** calculation MUST wait for `document.fonts.ready` to ensure accurate text measurement.

### Requirement: Layout Integrity
The measurement system SHALL strictly replicate the visual styling of the card.
#### Scenario: Measurement Styling
- **Given** the hidden measurement container
- **When** initialized
- **Then** it MUST match the `content-area` width, padding, font-size, letter-spacing, and line-height.
- **And** it MUST apply `word-break: break-word` to correctly handle long strings.

### Requirement: Resilience
The system SHALL provide a fallback mechanism if dynamic measurement fails.
#### Scenario: Measurement Failure
- **Given** the measurement API returns 0 or fails (e.g. server-side rendering or hidden iframe)
- **When** paginating
- **Then** the system MUST use `DEFAULT_SAFE_HEIGHT` (520px) as the fallback limit.

### Requirement: Splitting Priority
The system SHALL follow a strict hierarchy when breaking text.
#### Scenario: Splitting Hierarchy
- **Given** text that overflows the page
- **When** split points are calculated
- **Then** the system MUST try to break at Paragraphs first.
- **Then** at Sentences (punctuation) if paragraphs are too long.
- **Then** at Characters/Words only if a single sentence exceeds the page height.
