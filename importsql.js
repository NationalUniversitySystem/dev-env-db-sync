const { exec } = require('child_process');

async function importSql(filePath) {
  console.log('Starting VIP SQL import...');

  return new Promise((resolve, reject) => {
    exec(`vip dev-env import sql ${filePath} --slug=nu-edu --search-replace="https://www.nu.edu,http://www.nu-edu.vipdev.lndo.site" --search-replace="nu.edu,nu-edu.vipdev.lndo.site" --url="www.nu.edu"`, (error, stdout, stderr) => {
      if (error) {
        reject(new Error(`VIP SQL import failed: ${error.message}`));
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

module.exports = { importSql };
