const { rewriteSql } = require('./rewritesql');
const { validateSql } = require('./validatesql');

const inputFilePath = 'nu-db.sql';
const outputFilePath = 'nu-db-copy.sql';

(async () => {
  try {
    await rewriteSql(inputFilePath, outputFilePath);
    console.log('NU database sync completed successfully.');
    await validateSql(outputFilePath);
    console.log('VIP SQL validation completed successfully.');
  } catch (error) {
    console.error(error);
  }
})();
