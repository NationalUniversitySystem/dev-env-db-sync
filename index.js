const fs = require('fs');
const readline = require('readline');
const { spawn, exec } = require('child_process');
// const vipPath = '"C:\\Program Files\\nodejs\\vip.cmd"'; // replace with the actual path to your vip executable

const inputFilePath = 'nu-db.sql';
const outputFilePath = 'nu-db-copy.sql';

const tableNamesToSkip = ['_pantheon_heartbeat', 'wp_gf_entry', 'wp_gf_entry_meta', 'wp_2_gf_entry', 'wp_2_gf_entry_meta'];

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

lineReader.on('line', (line) => {
  if (skipTable) {
    if (/^UNLOCK TABLES;$/.test(line)) {
      skipTable = false;
    }
    return;
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
});

lineReader.on('close', () => {
	console.log('NU database sync completed successfully.');
  
	console.log('Starting VIP SQL validation...');
  
	exec(`vip import validate-sql ${outputFilePath}`, (error, stdout, stderr) => {
	  if (error) {
		console.error(`Error executing VIP command: ${error.message}`);
		return;
	  }
	  if (stderr) {
		console.error(`VIP command failed with error: ${stderr}`);
		return;
	  }
	  console.log('VIP SQL validation completed successfully.');
	});
});
