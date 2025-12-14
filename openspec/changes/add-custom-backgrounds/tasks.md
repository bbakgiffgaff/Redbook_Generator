1. [ ] **Baseline**: Add constants for upload limits and overlay (max file size, max dimension 1200px, JPEG quality, overlay defaults/range).
2. [ ] **Utils**: Implement image compression helper (`file -> dataURL`, enforce size/type, resize & JPEG quality), with rejection messaging.
3. [ ] **State**: Add background state (dataURL, overlayOpacity), optional persistence (localStorage best-effort), and reset/clear handling.
4. [ ] **UI**: Update Editor with background section: upload control (accept image/*, size validation), preview thumbnail, overlay slider (0–80%, default ~40%), and reset button.
5. [ ] **Rendering**: Update Card to render background `<img object-fit: cover>` with overlay; keep default gradient fallback.
6. [ ] **Export Robustness**: Ensure download flow waits for background image load (or cached) before html2canvas; on failure, fall back to gradient and always clear exporting state.
7. [ ] **Validation**:
   - [ ] Upload rejection: non-image or oversize files are blocked with message.
   - [ ] Compression reduces typical images to target size; large images are resized.
   - [ ] Overlay slider updates preview and persists across reload when stored.
   - [ ] Export works with custom background (and after reset), no CORS/tainted canvas issues.
