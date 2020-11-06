const uuid = require('uuid');

const getBase64Buffer = (base64) => {
  const imageFileTypes = ['jpeg', 'jpg', 'png'];
  const buffer = Buffer.from(base64.replace(/^data:image\/\w+;base64,/, ''), 'base64');
  const type = base64.split(';')[0].split('/')[1];
  if (!imageFileTypes.includes(type)) throw new Error(`Can only accept 'jpeg' and 'png', not '${type}'`);
  return { buffer, type };
};

const dbInsertQuery = (pool, dbName, id, desc, size, type) => (
  new Promise((res, rej) => {
    const query = `INSERT INTO ${dbName} VALUES (?, ?, ?, ?);`;
    const values = [id, desc, size, type];
    pool.query(query, values, (err, data) => {
      if (err) throw rej(err);
      res(data);
    });
  })
);

const dbDeleteQuery = (pool, dbName, id) => (
  new Promise((res) => {
    const query = `DELETE FROM ${dbName} WHERE UUID=?;`;
    pool.query(query, [id], (err) => {
      if (err) console.warn(`Error trying to delete '${id}' from RDS`, err);
      res();
    });
  })
);

const uploadBase64ToS3 = async (s3, base64) => {
  const { buffer, type } = module.exports.getBase64Buffer(base64);
  const id = uuid.v4();
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: id,
    Body: buffer,
    ContentEncoding: 'base64',
    ContentType: `image/${type}`,
  };
  const { Location } = await s3.upload(params).promise();
  console.log(`File uploaded successfully. ${Location}`);
  return {
    id,
    url: Location,
    size: Buffer.byteLength(buffer),
    type,
  };
};

const deleteS3 = async (s3, id) => {
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: id,
  };
  try {
    await s3.headObject(params).promise();
    await s3.deleteObject(params).promise();
  } catch (err) {
    console.warn(`Error trying to delete '${id}' from S3`, err);
  }
};

module.exports = {
  getBase64Buffer,
  dbInsertQuery,
  dbDeleteQuery,
  uploadBase64ToS3,
  deleteS3,
};
