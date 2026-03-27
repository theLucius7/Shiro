const fs = require('fs')
const path = require('path')

const rootDir = path.resolve(__dirname, '..')
const standaloneDir = path.join(rootDir, '.next', 'standalone')
const standaloneServer = path.join(standaloneDir, 'server.js')
const buildStaticDir = path.join(rootDir, '.next', 'static')
const runtimeStaticDir = path.join(standaloneDir, '.next', 'static')
const publicDir = path.join(rootDir, 'public')
const runtimePublicDir = path.join(standaloneDir, 'public')

if (!fs.existsSync(standaloneServer)) {
  console.error("missing .next/standalone/server.js; run 'corepack pnpm build' first")
  process.exit(1)
}

if (!fs.existsSync(buildStaticDir)) {
  console.error("missing .next/static; run 'corepack pnpm build' first")
  process.exit(1)
}

fs.mkdirSync(path.dirname(runtimeStaticDir), { recursive: true })
fs.rmSync(runtimeStaticDir, { recursive: true, force: true })
fs.cpSync(buildStaticDir, runtimeStaticDir, { recursive: true })

fs.rmSync(runtimePublicDir, { recursive: true, force: true })
fs.cpSync(publicDir, runtimePublicDir, { recursive: true })

require(standaloneServer)
