require('dotenv').config({ path: `${__dirname}/.env` })

module.exports = {
  apps: [
    {
      name: 'Shiro',
      cwd: __dirname,
      script: '.next/standalone/server.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'production',
        PORT: '2323',
        HOSTNAME: '0.0.0.0',
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
        NEXT_PUBLIC_GATEWAY_URL: process.env.NEXT_PUBLIC_GATEWAY_URL,
        ENABLE_EXPERIMENTAL_COREPACK: process.env.ENABLE_EXPERIMENTAL_COREPACK,
        NEXT_SHARP_PATH: process.env.NEXT_SHARP_PATH,
      },
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
    },
  ],
}
