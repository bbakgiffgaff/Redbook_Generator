# Design: Custom Backgrounds (MVP)

## Scope & Constraints
- 仅支持“本地上传 → data URL”作为背景，避免外链跨域污染。
- 只维护一张当前背景（无历史库），优先内存状态，可选 localStorage 持久化。
- 导出依然捕获 `.card-node`，预览与导出渲染保持一致。

## Storage & Compression
- 输入：`image/*`，大小上限建议 5MB。
- 压缩：读取后用 `<canvas>` 等比缩放，最长边 ≤1200px，导出 JPEG 质量 ≈0.7，目标 200–500KB。
- 持久化：可选存储压缩后的 data URL；若 localStorage 超配额，回退为内存态并提示。
- 清理：使用 `URL.createObjectURL` 预览时需 `revokeObjectURL`；提供“重置背景”按钮回退默认渐变。

## Rendering & Export
- 背景层：卡片内底层使用 `<img src={dataURL} style="object-fit: cover">`，尺寸与卡片一致。
- 遮罩层：黑色 overlay，0–80% 可调，默认约 40%；用户控件优先，暂不做自动主色检测。
- 文本层：沿用主题文本色，提示遮罩过低可能影响可读性。
- 加载等待：导出前需等待图片 `onload`（或缓存标记）；加载失败则回退默认渐变并提示，`isExporting` 状态必须复位。

## Validation & UX
- 上传校验：类型 `image/*`，大小超限直接提示并拒绝；压后仍超阈值也提示。
- UI：Editor 增加背景区域：上传按钮、预览缩略图、遮罩滑块、重置按钮。
- 性能：压缩在前端完成，单例状态避免多图占用；测量容器无需加载背景图，保持分页性能。
