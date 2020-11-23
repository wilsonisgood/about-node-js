

# about Node.js

- 學習階段
  - node-mkdirp-write-file 
    - 簡介
        - 開資料夾
        - 輸出 .json
        - 解析 body
    - lib
      - mkdirp 
          - 按照路徑，開出資料夾。 
              `await mkdirp(path, function (err) {
                if (err) {
                  console.log("mkdirp.err: ", err);
                }
              });`
      - fs.writeFile
          - 將資料寫成 .json
              `fs.writeFile(``${path}${fileName}.json``, content, (error) => {
                if (error) {
                  console.log("writeFile err: ", error);
                  throw error;
                }
                console.log(``${path}Data written to file``);
              });`
      - bodyParser
          - 解析 resp. body
              `app.use(
                  bodyParser.urlencoded({
                    extended: true,
                  })
                );`
            `app.use(bodyParser.json());`
      - multer
        - [Node.js] express.js + body-parser 處理multipart/form-data的解決方案
            https://medium.com/cubemail88/node-js-express-js-body-parser-%E8%99%95%E7%90%86multipart-form-data%E7%9A%84%E8%A7%A3%E6%B1%BA%E6%96%B9%E6%A1%88-d89d2699b9f

          `const multer = require("multer");`
          `const upload = multer();`
          `app.use(upload.array(), (req, resp, next) => {});`
          
  - node-proxy-middleware
    - 簡介
        - proxy
        - 依照 content-encoding 去做 decode
    - lib
        - http-proxy-middleware
            `const { createProxyMiddleware } = require("http-proxy-middleware");`
            `selfHandleResponse: true,`
            先找出編碼方式，content-encoding，ex: gzip
            `proxyRes.headers["content-encoding"]`
            
        - zlib
            `const zlib = require("zlib");`
            
          
            
            How do you manipulate proxy response
https://github.com/chimurai/http-proxy-middleware/issues/97
