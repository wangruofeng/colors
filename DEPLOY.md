# 本地运行与部署

- 线上域名：https://colors.wangruofeng007.com
- 私有仓库：https://github.com/wangruofeng/colors
- Cloudflare Pages 通过 GitHub 集成自动部署 `main`。
- Node.js 22；无需安装 npm 依赖。
- 构建命令：`npm run build`；发布目录：`dist`；根目录：仓库根目录。
- 本地运行：`npm start`，访问 http://localhost:5178。
- 验证：`npm run check`。742 张高清图片、缩略图和全部工具页面随项目一同部署。

## 许可证与源码

原作者：小小东；上游与修改说明见 `UPSTREAM.md`，完整许可证见 `LICENSE`。本站提供 `/downloads/source.zip`，由构建时的 Git 提交自动生成，不包含凭证、Git 历史或依赖目录。

下载包包含全部可编辑源代码与构建输入。图片不作二次压缩或修改：`assets/data/images.js` 列出全部高清图路径，`thumbnails/color-card-NNN.jpg` 为对应缩略图。可从本网站相同路径取得二进制素材，或从上游公开仓库获得完整图片资源。源码包中的 `git archive` 构建步骤需在 Git 仓库内执行；解压后可 `git init` 并提交源文件再构建，也可直接用静态 HTTP 服务预览。
