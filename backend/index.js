require('dotenv').config();

const PROD = process.env.NODE_ENV === 'production';

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mysql = require('mysql');
const AWS = require('aws-sdk');

const pkg = require('./package.json');
const utils = require('./utils');

const origin = PROD ? process.env.CORS_ORIGIN : '*';

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
});

const s3 = new AWS.S3();
const app = express();
const pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.RDS_HOST,
  user: process.env.RDS_USER,
  password: process.env.RDS_PASSWORD,
  port: process.env.RDS_PORT,
  database: process.env.RDS_NAME,
});

app.use(express.json({ limit: '800kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin }));
app.use(morgan('combined'));

const buildError = (ok, message, code) => ({ ok, message, code });

app.get('/', (_, res) => {
  res.send(`Crossover file upload running, version: ${pkg.version}`);
});

app.post('/upload', async (req, res) => {
  const { file, description } = req.body;
  if (!file) {
    const errData = buildError(false, 'Object "file" not found in body', 400);
    return res.status(400).json(errData);
  }
  let key;
  let s3Uploaded = false;
  let rdsInserted = false;
  try {
    const { id, url, size, type } = await utils.uploadBase64ToS3(s3, file);
    key = id;
    s3Uploaded = true;
    await utils.dbInsertQuery(pool, 'Images', id, description, type, size);
    rdsInserted = true;
    res.status(201).json({
      ok: true,
      data: { id, url, description },
    });
  } catch (err) {
    if (s3Uploaded) utils.deleteS3(s3, key);
    if (rdsInserted) utils.dbDeleteQuery(pool, 'Images', key);
    console.warn(err.stack);
    res.status(500).json(buildError(false, err.message, 500));
  }
});

app.get('/images', async (req, res) => {
  const { q, maxSize, type, pageSize, page } = req.query;
  const itemSize = pageSize || 20;
  const query = { from: (page || 0) * itemSize, size: itemSize };
  const must = [];
  if (q) must.push({ fuzzy: { description: q } });
  if (type) must.push({ fuzzy: { type } });
  if (maxSize) must.push({ range: { size: { lte: maxSize } } });
  if (must.length > 0) query.query = { bool: { must } };
  try {
    const { resp, body } = await utils.httpGet(process.env.ES_SEARCH_ENDPOINT, query);
    if (resp.statusCode !== 200) throw new Error(JSON.stringify(body));
    const bucketUrl = `http://${process.env.S3_BUCKET_NAME}.s3.us-east-2.amazonaws.com/`;
    const images = body.hits.hits.map((v) => ({ url: bucketUrl + v._source.uuid, ...v._source }));
    res.status(resp.statusCode).json({ ok: true, data: images });
  } catch (err) {
    console.warn(err);
    res.status(500).json(buildError(false, err.message, 500));
  }
});

app.server = app.listen(process.env.PORT, () => {
  console.log(`server running at: http://localhost:${process.env.PORT}`);
});

module.exports = app;
