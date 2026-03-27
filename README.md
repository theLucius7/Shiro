# Shiro

> 一套基于 [Innei/Shiro](https://github.com/Innei/Shiro) 持续改出来的「自用、魔改版 Shiro」。

这不是上游仓库的原版镜像，也不是一个面向所有人的开箱即用主题模板。

这个仓库更接近“我自己的站点前端源码”:

- 保留了 Shiro 的整体设计语言、Mix Space 生态适配和一部分交互思路
- 混入了自用站点需要的功能、接口代理、后台能力、发布脚本和实验性改动
- 会优先服务当前站点自身需求，不承诺和上游保持完全一致，也不保证对所有部署环境通用

如果你要找的是:

- 通用版 Shiro
- 官方文档
- 面向社区的稳定主题版本

优先参考:

- [Innei/Shiro](https://github.com/Innei/Shiro)
- Mix Space 主题部署文档: https://mx-space.js.org/docs/themes/shiro/deploy

## 项目定位

这个仓库的目标很简单:

- 给我自己的站点使用
- 在原版 Shiro 基础上继续魔改
- 把一些和个人工作流强相关的东西直接放进仓库里

因此你会在这里看到一些并不“通用主题化”的内容，比如:

- 只为当前站点保留的页面结构和 UI 细节
- 和特定 API / Gateway / 第三方服务绑定的实现
- 轻量后台、写作面板、代理 API、WebSocket、摘要能力等混合在同一个仓库
- 偏向我自己部署方式的 standalone / Docker / CI 发布脚本

一句话总结:

> 这是一套能跑、能继续改、但明显带有强烈自用痕迹的 Shiro fork。

## 和上游的关系

本项目基于 Shiro，也仍然属于 Mix Space 生态的一部分，但已经不是“纯上游”了。

你可以把它理解成:

- 设计与基础思路来自上游
- 代码实现已经按自用需求长期分叉
- 文档、行为和部署细节请以当前仓库为准

如果当前仓库和上游 README、截图、部署说明出现差异，以当前仓库代码为准。

## 仓库里有什么

当前仓库大致包含这些部分:

- 基于 Next.js App Router 的前台站点
- 一个轻量后台，包含内容编辑、评论管理等能力
- 一批站点内用的 API routes
  - GitHub / TMDB / Bangumi / 音乐接口代理
  - S3 上传
  - Webhook
  - AI 摘要
- 一套组件预览环境，放在 `storybook/`
- Docker、standalone、CI release 相关脚本

## 技术栈

- Next.js
- React
- TypeScript
- Tailwind CSS
- Jotai
- TanStack Query
- Socket.IO
- Mix Space API Client

## 本地开发

环境要求:

- Node.js >= 20
- `pnpm@10.12.4`

初始化:

```bash
cp .env.template .env
pnpm install
```

启动开发环境:

```bash
pnpm dev
```

默认端口:

```text
2323
```

## 常用脚本

```bash
pnpm dev         # 本地开发
pnpm dev:turbo   # 使用 turbopack
pnpm build       # 生产构建
pnpm analyze     # 构建并分析 bundle
pnpm lint        # eslint --fix
```

## 组件预览

仓库里额外带了一套组件预览环境，在 `storybook/` 下。

```bash
cd storybook
pnpm install
pnpm dev
```

构建:

```bash
cd storybook
pnpm build
```

## 部署说明

### Docker

```bash
cp .env.template .env
docker compose up -d
```

`docker-compose.yml` 默认会:

- 挂载当前目录下的 `.env`
- 挂载 `public/`
- 暴露 `2323`

### Standalone / Release

构建产物相关脚本:

- `ci-release-build.sh`
- `standalone-bundle.sh`

它们会围绕 `.next/standalone` 做打包，适合当前仓库自己的发布流程。

## 环境变量

最基础的环境变量可从 `.env.template` 开始。

常见配置包括:

- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_GATEWAY_URL`
- `TMDB_API_KEY`
- `GH_TOKEN`

按你启用的功能不同，可能还需要额外补充:

- `OPENAI_API_KEY`
- `WEBHOOK_SECRET`
- `S3_ACCESS_KEY`
- `S3_SECRET_KEY`
- `CROSSBELL_TOKEN`
- `UPSTASH_URL`
- `UPSTASH_TOKEN`

## 使用预期

如果你打算直接 fork 这个仓库，请先接受下面这件事:

- 你拿到的不是一个“官方标准 Shiro”
- 你拿到的是一套已经明显按个人需求改过的站点代码

这意味着:

- 某些功能会强依赖我的接口约定
- 某些配置不会为了通用性做抽象
- 某些改动可能只考虑“我这里能跑”

如果你只是想搭一个标准 Shiro 站点，直接从上游开始通常更省事。

## 致谢与许可

- 上游项目: [Innei/Shiro](https://github.com/Innei/Shiro)
- 生态项目: [Mix Space](https://github.com/mx-space)

本项目沿用原项目的许可证与附加条款，请同时阅读:

- [LICENSE](LICENSE)
- [ADDITIONAL_TERMS.md](ADDITIONAL_TERMS.md)
