const { expect, request } = require('chai')
  .use(require('chai-http'))
  .use(require('chai-as-promised'));
const sinon = require('sinon');

const utils = require('./utils');
const app = require('./index');

describe('Index', () => {
  after(() => {
    app.server.close();
  });

  describe('Get /', () => {
    it('should get version', async () => {
      const res = await request(app).get('/');
      expect(res.status).to.be.equal(200);
      expect(res.ok).to.be.true;
      expect(res.text).to.contain('version');
    });
  });

  describe('Post /upload', () => {
    const s3Return = { id: '1', url: 'url', size: 10, type: 'png' };
    let uploadS3Stub;
    let queryStub;

    beforeEach(() => {
      uploadS3Stub = sinon.stub(utils, 'uploadBase64ToS3').resolves(s3Return);
      queryStub = sinon.stub(utils, 'dbInsertQuery').resolves();
    });
    afterEach(() => {
      uploadS3Stub.restore();
      queryStub.restore();
    });

    it('should upload file to s3', async () => {
      const res = await request(app).post('/upload').send({
        file: 'base64',
        description: 'blabla',
      });
      expect(res.status).to.be.equal(201);
      expect(res.ok).to.be.true;
      expect(res.body.data.id).to.be.equal(s3Return.id);
      expect(res.body.data.url).to.be.equal(s3Return.url);
      expect(res.body.data.description).to.be.string('blabla');
      sinon.assert.calledOnce(uploadS3Stub);
      sinon.assert.calledOnce(queryStub);
    });

    it('should error if there is not a file on body', async () => {
      const res = await request(app).post('/upload').send();
      expect(res.status).to.be.equal(400);
      expect(res.ok).to.be.false;
      expect(res.body.message).to.be.string('Object "file" not found in body');
    });
  });
});
