const mysqlStack = [];
const mysqlMock = {
  stack: mysqlStack,
  createPool: () => ({
    query: (sqlSquery, vars, callback) => {
      mysqlStack.push([sqlSquery, vars]);
      callback(null, 'OK');
    },
  }),
};

const AWSStack = [];
const AWSMock = {
  stack: AWSStack,
  config: { update: () => {} },
  upload: (params) => {
    AWSStack.push(['uplaod', params]);
    return Promise.resolve({ Location: params.id });
  },
  headObject: (params) => AWSStack.push(['head', params]),
  deleteObject: (params) => AWSStack.push(['delete', params]),
};
AWSMock.S3 = function S3Contructor() { return AWSMock; };

module.exports = {
  mysqlMock,
  AWSMock,
};
