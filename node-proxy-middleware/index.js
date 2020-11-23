const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const bodyParser = require("body-parser");
const multer = require("multer");
const upload = multer();
const app = express();
const PORT = 3000;
const API_SERVICE_URL = "https://fusion.spmobileapi.net";
const fs = require("fs");
const zlib = require("zlib");

app.get("/", (req, resp) => {
  resp.send("HELLO");
});

const proxy = createProxyMiddleware({
  target: API_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: {},
  selfHandleResponse: true,
  // 配置selfHandleResponse : true后，必须通过res响应数据，否则客户端获取不到返回
  onProxyRes: async function (proxyRes, req, res) {
    let body = {};
    const responseBody = await getBody(proxyRes);
    if (responseBody) body = responseBody;

    if (req.url.indexOf("?") > -1) {
      req.url = req.url.substring(0, req.url.indexOf("?"));
    }

    // 对api接口的返回值进行过滤
    let data = JSON.stringify(body, null, 2);
    fs.writeFile("./proxyRes", data, (error) => {
      if (error) {
        console.log("writeFile err: ", error);
        throw error;
      }
      console.log(` Data written to file`);
    });
    res.json(body);
  },
});

/**
 * 从proxyRes获取body数据，返回json对象
 * @param {*} proxyRes
 * @param {*} res
 */
function getBody(proxyRes) {
  return new Promise((resolve, reject) => {
    let chunks = [];
    let size = 0;
    proxyRes.on("data", function (chunk) {
      // 先找出編碼方式，content-encoding
      // ex: gzip
      // console.log("content-encoding: ", proxyRes.headers["content-encoding"]);
      chunks.push(chunk);
      size += chunk.length;
    });
    proxyRes.on("end", function () {
      const originalBuf = Buffer.concat(chunks, size);
      const decodedStr = zlib.gunzipSync(originalBuf).toString("utf8");
      const resBodyObj = JSON.parse(decodedStr);
      try {
        resolve(resBodyObj);
      } catch (error) {
        reject(error);
      }
    });
  });
}

app.use("/", proxy);

app.listen(PORT, () => {
  console.log(`node proxy middleware listening at: ${PORT}`);
});
