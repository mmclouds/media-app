## 1. 实施
- [x] 1.1 在模型注册中新增 Nano Banana Pro（含默认参数）
- [x] 1.2 新增 Nano Banana Pro 配置表单组件（字段与组件映射、上传限制提示）
- [x] 1.3 新增请求体构建逻辑（仅透传 inputFileUuids）
- [x] 1.4 新增积分计费规则（1K/2K/4K 分档）
- [ ] 1.5 自测图片生成流程与积分预估

## 2. 验证
- [ ] 2.1 前台表单字段显示与交互验证
- [ ] 2.2 请求体不包含 input.image_input / input.image_urls
- [ ] 2.3 inputFileUuids 查询参数透传验证
- [ ] 2.4 积分预估在 1K/2K/4K 时正确
