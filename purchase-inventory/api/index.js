try {
  const serverlessModule = require('../dist/serverless');
  module.exports = serverlessModule.handler || serverlessModule.default || serverlessModule;
} catch (err) {
  console.error('Error loading serverless handler:', err);
  throw err;
}
