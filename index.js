const { rewriteSql } = require('./rewritesql');
const { validateSql } = require('./validatesql');
const { importSql } = require('./importsql');
const { searchReplace } = require('./searchreplace');

const inputFilePath = 'nu-db.sql';
const outputFilePath = 'nu-db-copy.sql';

(async () => {
  try {
    await rewriteSql(inputFilePath, outputFilePath);
    console.log('NU database sync completed successfully.');
    await validateSql(outputFilePath);
    console.log('VIP SQL validation completed successfully.');
    await importSql(outputFilePath);
    console.log('VIP SQL import completed successfully.');
    // await searchReplace();
    // console.log('database search-replace completed succesfully.');
  } catch (error) {
    console.error(error);
  }
})();
