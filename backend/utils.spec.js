const { expect } = require('chai')
  .use(require('chai-as-promised'));
const sinon = require('sinon');
const mysql = require('mysql');
const AWS = require('aws-sdk');
const https = require('https');
const utils = require('./utils');

describe('Utils', () => {
  describe('getBase64Buffer', () => {
    const base64img = 'data:image/png;base64,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iAAAAFxlWElmTU0AKgAAAAgABAEGAAMAAAABAAIAAAESAAMAAAABAAEAAAEoAAMAAAABAAIAAIdpAAQAAAABAAAAPgAAAAAAAqACAAQAAAABAAAAA6ADAAQAAAABAAAAAwAAAACFsPHwAAACsmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNS40LjAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyIKICAgICAgICAgICAgeG1sbnM6ZXhpZj0iaHR0cDovL25zLmFkb2JlLmNvbS9leGlmLzEuMC8iPgogICAgICAgICA8dGlmZjpSZXNvbHV0aW9uVW5pdD4yPC90aWZmOlJlc29sdXRpb25Vbml0PgogICAgICAgICA8dGlmZjpPcmllbnRhdGlvbj4xPC90aWZmOk9yaWVudGF0aW9uPgogICAgICAgICA8dGlmZjpDb21wcmVzc2lvbj4xPC90aWZmOkNvbXByZXNzaW9uPgogICAgICAgICA8dGlmZjpQaG90b21ldHJpY0ludGVycHJldGF0aW9uPjI8L3RpZmY6UGhvdG9tZXRyaWNJbnRlcnByZXRhdGlvbj4KICAgICAgICAgPGV4aWY6UGl4ZWxZRGltZW5zaW9uPjM8L2V4aWY6UGl4ZWxZRGltZW5zaW9uPgogICAgICAgICA8ZXhpZjpQaXhlbFhEaW1lbnNpb24+MzwvZXhpZjpQaXhlbFhEaW1lbnNpb24+CiAgICAgIDwvcmRmOkRlc2NyaXB0aW9uPgogICA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgq+kgz0AAAAFklEQVQIHWOUk5P7zwAFTDAGiEbhAAAwewFfzQgs5wAAAABJRU5ErkJggg==';
    const base64pdf = 'data:application/pdf;base64,iVBORw0KGgoAA==';

    it('should return buffer and type', () => {
      const { buffer, type } = utils.getBase64Buffer(base64img);
      expect(type).to.be.string('png');
      expect(buffer).to.not.be.undefined;
    });

    it('should only accept images', () => {
      const errMsg = 'Can only accept \'jpeg\' and \'png\', not \'pdf\'';
      expect(() => utils.getBase64Buffer(base64pdf)).to.throw(errMsg);
    });

    it('should error if input is not a base64 sting', () => {
      expect(() => utils.getBase64Buffer(1)).to.throw();
    });
  });

  describe('dbInsertQuery', () => {
    const mysqlPool = mysql.createPool({ host: 'localhost' });
    let queryStub;

    beforeEach(() => {
      queryStub = sinon.stub(mysqlPool, 'query');
    });
    afterEach(() => {
      queryStub.restore();
    });

    it('should query the given data', async () => {
      queryStub.yields(null, 'OK');
      const res = await utils.dbInsertQuery(mysqlPool, 'test', 'a', 'b', 'c', 'd');
      expect(res).to.be.string('OK');
      sinon.assert.calledWith(queryStub, 'INSERT INTO test VALUES (?, ?, ?, ?);', ['a', 'b', 'c', 'd']);
    });

    it('should error if query fails', () => {
      queryStub.yields('ERROR', null);
      expect(utils.dbInsertQuery(mysqlPool, 'test', 'a', 'b', 'c', 'd'))
        .to.eventually.be.rejectedWith('ERROR');
      sinon.assert.calledWith(queryStub, 'INSERT INTO test VALUES (?, ?, ?, ?);', ['a', 'b', 'c', 'd']);
    });
  });

  describe('dbDeleteQuery', () => {
    const mysqlPool = mysql.createPool({ host: 'localhost' });
    let queryStub;
    let consoleStub;

    beforeEach(() => {
      queryStub = sinon.stub(mysqlPool, 'query');
      consoleStub = sinon.stub(console, 'warn');
    });
    afterEach(() => {
      queryStub.restore();
      consoleStub.restore();
    });

    it('should query the given data', async () => {
      queryStub.yields(null, 'OK');
      await utils.dbDeleteQuery(mysqlPool, 'test', 'id');
      sinon.assert.calledWith(queryStub, 'DELETE FROM test WHERE UUID=?;', ['id']);
    });

    it('should output error if query fails', async () => {
      queryStub.yields('ERROR', null);
      await utils.dbDeleteQuery(mysqlPool, 'test', 'id');
      sinon.assert.calledWith(consoleStub, 'Error trying to delete \'id\' from RDS', 'ERROR');
    });
  });

  describe('uploadBase64ToS3', () => {
    const s3 = new AWS.S3();
    let getBufferStub;
    let uploadStub;

    beforeEach(() => {
      getBufferStub = sinon.stub(utils, 'getBase64Buffer').returns({ buffer: Buffer.alloc(1), type: 'png' });
      uploadStub = sinon.stub(s3, 'upload')
        .returns({
          promise: () => Promise.resolve({ Location: 'url' }),
        });
    });
    afterEach(() => {
      getBufferStub.restore();
      uploadStub.restore();
    });

    it('should upload to s3', async () => {
      const { id, url, size, type } = await utils.uploadBase64ToS3(s3, 'base64');
      expect(id).to.be.a('string');
      expect(url).to.be.equal('url');
      expect(size).to.be.equal(1);
      expect(type).to.be.string('png');
      sinon.assert.calledWith(getBufferStub, 'base64');
      const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: id,
        Body: Buffer.alloc(1),
        ContentEncoding: 'base64',
        ContentType: 'image/png',
        ACL: 'public-read',
      };
      sinon.assert.calledWith(uploadStub, params);
    });
  });

  describe('deleteS3', () => {
    const s3 = new AWS.S3();
    let headObject;
    let deleteObject;
    let consoleStub;

    beforeEach(() => {
      headObject = sinon.stub(s3, 'headObject')
        .returns({ promise: () => Promise.resolve() });
      deleteObject = sinon.stub(s3, 'deleteObject')
        .returns({
          promise: () => Promise.resolve({ Location: 'url' }),
        });
      consoleStub = sinon.stub(console, 'warn');
    });
    afterEach(() => {
      headObject.restore();
      deleteObject.restore();
      consoleStub.restore();
    });

    it('should delete from s3 if file exists', async () => {
      await utils.deleteS3(s3, 'id');
      const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: 'id',
      };
      sinon.assert.calledWith(headObject, params);
      sinon.assert.calledWith(deleteObject, params);
    });

    it('should not delete if file does not exist', async () => {
      const err = Error('ERROR');
      headObject.returns({ promise: () => Promise.reject(err) });
      await utils.deleteS3(s3, 'id');
      const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: 'id',
      };
      sinon.assert.calledWith(headObject, params);
      sinon.assert.notCalled(deleteObject);
      sinon.assert.calledWith(consoleStub, 'Error trying to delete \'id\' from S3', err);
    });
  });

  describe('httpsGet', () => {
    let requestStub;
    const reqStub = { on: sinon.stub(), end: sinon.stub() };
    const respStub = { on: sinon.stub() };

    beforeEach(() => {
      requestStub = sinon.stub(https, 'request').returns(reqStub).yields(respStub);
    });
    afterEach(() => {
      requestStub.restore();
    });

    it('should make an https request to url', async () => {
      respStub.on.withArgs('end').yields();
      respStub.on.withArgs('data').yields('{"data": "RESPONSE"}');
      const data = { query: 'test' };
      const { resp, body } = await utils.httpsGet('https://test.com/hi', data);
      const params = {
        method: 'GET',
        hostname: 'test.com',
        path: '/hi',
        port: null,
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(JSON.stringify(data)),
        },
      };
      expect(body.data).to.be.string('RESPONSE');
      sinon.assert.calledWith(requestStub, params);
      sinon.assert.calledWith(resp.on, 'data');
      sinon.assert.calledWith(resp.on, 'end');
      sinon.assert.calledWith(reqStub.end, JSON.stringify(data));
    });

    it('should reject and error if there request fails', () => {
      respStub.on.withArgs('error').yields('ERROR');
      expect(utils.httpsGet('https://test.com/hi', {})).to.rejectedWith('ERROR');
      sinon.assert.calledOnce(requestStub);
    });
  });
});
