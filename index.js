const { rewriteSql } = require('./rewritesql');
const { validateSql } = require('./validatesql');
const { importSql } = require('./importsql');
const { searchReplace } = require('./searchreplace');

const inputFilePath = 'nu-db.sql';
const outputFilePath = 'nu-db-copy.sql';

(async () => {
  try {

	/** Modify SQL file to allow WPVIP import & remove tables we don't need locally, to speed up import process
	 * Removes _pantheon_heartbeat table which is un-used and causes the WPVIP import validation to fail
	 * Removes tables related to gravityforms entry data, which are unnecessary for local dev & make our filesize huge
	 */
    await rewriteSql(inputFilePath, outputFilePath);
    console.log('SQL table modification completed successfully.');

	/** Run WPVIP SQL Validation
	 * via VIP-CLI: vip dev-env import validate-sql command
	 */
    await validateSql(outputFilePath);
    console.log('VIP SQL validation completed successfully.');

	/** Import SQL to dev-env
	 * via VIP-CLI
	 * 
	 * Includes search & replace function to update URLs to local dev env
	 */
    await importSql(outputFilePath);
    console.log('VIP SQL import completed successfully.');

    // await searchReplace();
    // console.log('database search-replace completed succesfully.');

  } catch (error) {
    console.error(error);
  }
})();
