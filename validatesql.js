const { exec } = require('child_process');

async function validateSql(filePath) {
  console.log('Starting VIP SQL validation...');

  return new Promise((resolve, reject) => {
    exec(`vip import validate-sql ${filePath}`, (error, stdout, stderr) => {
      if (error) {
        reject(new Error(`VIP SQL validation failed: ${error.message}`));
        return;
      }

      if (stderr) {
        reject(new Error(stderr));
        return;
      }
      console.log(`stdout:\n${stdout}`);
      resolve();
    });
  });
};

module.exports = { validateSql };