const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;
const multer = require("multer");
const upload = multer();
const fs = require("fs");
const mkdirp = require("mkdirp");

const writeFile = async (path, fileName, content, errHandle) => {
  await mkdirp(path, function (err) {
    if (err) {
      console.log("mkdirp.err: ", err);
    } else {
      console.log(`json: ${path}${fileName}.json`);
      fs.writeFile(`${path}${fileName}.json`, content, (error) => {
        if (error) {
          console.log("writeFile err: ", error);
          throw error;
        }
        console.log(`${path}Data written to file`);
      });
    }
  });
};

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(bodyParser.json());

app.use(upload.array(), (req, resp, next) => {
  const { res } = req.body;
  console.log("req: ", req);
  if (res) {
    const body = { ...req.body };
    delete body.res;
    const param = { ...body };
    delete param.nonce;
    delete param.timestamp;
    const exportObj = {
      req: {
        headers: req.headers,
        body,
        param,
        path: req.path,
      },
      resp: res,
    };

    let exportJsonStr = JSON.stringify(exportObj, null, 2);
    const originalPath = req.path;
    const originalPathSplitedArr = originalPath.split("/");
    const lastOneIdx = originalPathSplitedArr.length - 1;
    const docPathArray = originalPathSplitedArr.filter(
      (path, pathIdx) => pathIdx !== lastOneIdx
    );
    let fileDocPath = "";
    docPathArray.map((docPath) => {
      fileDocPath = `${fileDocPath}${docPath}/`;
    });
    console.log("fileDocPath: ", fileDocPath);

    const paramStr = JSON.stringify(param);
    const lastPath = originalPathSplitedArr[lastOneIdx];
    const fileName = `${lastPath}@${paramStr}@`;
    console.log("fileName: ", fileName);

    writeFile(`./exportDoc${fileDocPath}`, fileName, exportJsonStr, (err) => {
      if (err) throw err;
      console.log(`${path}Data written to file`);
    });
  }

  resp.status(404).send({
    status: 404,
    error: "Not found",
  });
});

app.listen(port, () => {
  console.log(`Example app listening at: ${port}`);
});
