const { exec } = require('child_process');

async function searchReplace() {
  console.log('Starting Database search-replace...');

  return new Promise((resolve, reject) => {
    exec(`vip dev-env --slug=nu-edu search-replace="https://www.nu.edu,http://nu-edu.vipdev.lndo.site" --all-tables"`, (error, stdout, stderr) => {
      if (error) {
        reject(new Error(`Database search-replace failed: ${error.message}`));
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

module.exports = { searchReplace };
