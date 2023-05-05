const fs = require('fs');
const readline = require('readline');

const tableNamesToSkip = ['_pantheon_heartbeat', 'wp_gf_entry', 'wp_gf_entry_meta', 'wp_2_gf_entry', 'wp_2_gf_entry_meta'];

async function rewriteSql(inputFilePath, outputFilePath) {
  console.log('Starting NU database sync...');

  // Delete the output file if it already exists
  if (fs.existsSync(outputFilePath)) {
    fs.unlinkSync(outputFilePath);
    console.log(`Deleted existing file ${outputFilePath}`);
  }

  const input = fs.createReadStream(inputFilePath);
  const output = fs.createWriteStream(outputFilePath);

  const lineReader = readline.createInterface({
    input,
    crlfDelay: Infinity,
  });

  let skipNextLines = false;
  let tableNameToDelete = '';
  let skipTable = false;

  for await (const line of lineReader) {
    if (skipTable) {
      if (/^UNLOCK TABLES;$/.test(line)) {
        skipTable = false;
      }
      continue;
    }

    if (skipNextLines) {
      if (/^UNLOCK TABLES;$/.test(line)) {
        skipNextLines = false;
        console.log(`Deleted rows in table ${tableNameToDelete}`);
      }
    } else if (/^LOCK TABLES `.+` WRITE;$/.test(line)) {
      for (const tableName of tableNamesToSkip) {
        if (line.includes(tableName)) {
          skipNextLines = true;
          tableNameToDelete = tableName;
          break;
        }
      }
    } else if (/^DROP TABLE IF EXISTS `_pantheon_heartbeat`;$/.test(line) || /^CREATE TABLE `_pantheon_heartbeat`/.test(line)) {
      skipTable = true;
    } else if (/^INSERT INTO `_pantheon_heartbeat`/.test(line)) {
      // Skip insert statements for _pantheon_heartbeat table
    } else {
      output.write(`${line}\n`);
    }
  }
  
  console.log('NU database sync completed.');
}

module.exports = { rewriteSql };
