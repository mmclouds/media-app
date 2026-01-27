## 1. 实施
- [x] 1.1 新增 `z-image-config-fields.tsx`，包含 prompt、aspect_ratio 的 UI 与参数映射。
- [x] 1.2 在 `MODEL_REGISTRY` 注册 z-image，并接入生成请求构建逻辑与 credit estimate。
- [x] 1.3 在积分价格配置中新增 z-image 规则（priceUsd=0.004）。

## 2. 验证
- [ ] 2.1 启动页面后选择 Images → Z-Image，确认可填写 prompt、aspect_ratio，并且提示为英文。
- [ ] 2.2 触发积分估算，验证 z-image 显示为 1 积分（0.004 × 200 四舍五入）。
