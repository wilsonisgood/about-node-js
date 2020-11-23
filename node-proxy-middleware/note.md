# node-proxy-middleware

- 簡介
  - proxy
  - 依照 content-encoding 去做 decode
- lib
  - http-proxy-middleware
    - `const { createProxyMiddleware } = require("http-proxy-middleware");`
    - `selfHandleResponse: true,`
    - **先找出編碼方式，content-encoding，ex: gzip**
      - `proxyRes.headers["content-encoding"]`
  - zlib
    - `const zlib = require("zlib");`
    - [How do you manipulate proxy response](https://github.com/chimurai/http-proxy-middleware/issues/97)
