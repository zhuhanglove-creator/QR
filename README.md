# 自定义收款码模板生成工具

纯前端、可部署到 GitHub Pages 的收款码模板编辑器。用户上传微信、支付宝等收款码图片后，工具会在浏览器本地完成二维码检测、裁剪、结构化重绘、模板化排版、可扫性校验和 PNG 导出。

## 功能列表

- 本地上传二维码截图、背景图
- 自动检测二维码区域
- 优先基于解码内容重建真实模块矩阵
- 解码失败时退回近似结构化重绘
- 模板切换联动二维码配色与样式
- 安全模式 / 高级美化模式
- 浏览器端回扫校验
- 高清 PNG 导出
- 模板导入 / 导出 JSON
- `localStorage` 自动保存基础编辑状态

## 技术栈

- React
- TypeScript
- Vite
- Tailwind CSS
- Zustand
- React Konva
- jsQR
- qrcode-generator
- react-dropzone

## 本地运行

```bash
npm install
npm run dev
```

## 构建

```bash
npm run build
```

## GitHub Pages 部署

1. 将仓库默认分支设为 `main`
2. 在 GitHub 仓库设置中启用 Pages，并选择 `GitHub Actions`
3. 推送到 `main` 后会自动执行 `.github/workflows/deploy-pages.yml`
4. 工作流会在构建时注入 `GITHUB_PAGES=true`，Vite 会使用仓库子路径作为 `base`

如果你的仓库名不是 `qr-template-studio`，请修改 [vite.config.ts](/F:/github/收款码/二创/二维码制作最终版/vite.config.ts) 中的 `base`。

## 模板系统说明

- 内置 5 个默认模板
- 模板缩略图位于 `public/templates/*/thumbnail.svg`
- 每个模板目录包含一个 `config.json`
- 编辑器运行时使用 `src/data/templates/presets.ts` 中的结构化模板数据
- 支持当前模板导出为 JSON，也支持重新导入

## 隐私说明

所有图片都只在本地浏览器中处理，不会上传到服务器。二维码检测、分析、重绘、回扫校验和导出全部发生在浏览器端。

## 当前实现策略

- 能成功解码时：直接根据二维码内容重建真实模块矩阵，再进行样式重绘
- 未成功解码时：对裁剪后的二值图进行近似网格分析，保守重绘，并提示风险
- 导出前建议再次触发可扫性校验

## 后续扩展方向

- 完整手动裁剪框选与角点透视矫正
- 双码/多码高级布局编辑
- Logo、头像、贴纸素材库
- 图层顺序和吸附对齐
- 更强的模板市场与远程模板索引
