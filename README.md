# NU Local Database Sync Tool

Streamlines the process of importing our production database to your local dev env.

Ongoing work-in-progress. Still somewhat experimental.

**This will overwrite your existing database. Do not do this if you have local database changes that have not yet launched**
(Code is unaffected)

### Requirements/caveats:
- Works on Windows, untested on Mac
- Requires you to be running a VIP dev-env, and have the VIP-CLI installed locally
- Requires your local env to be configured as a multisite
- Requires your local env URL to be: http://nu-edu.vipdev.lndo.site [if yours differs, change line 7 in importsql.js]

### Steps:
- Generate backup SQL from WPVIP dashboard and download it locally
- Unzip the download file until you have the .sql file
- Rename SQL file to 'nu-db.sql' and move the file to this folder (i.e. same folder path as this readme file)
- Start your vip dev-env
- npm install [if needed]
- node index.js
- wait and hope
	- Script will end by throwing a handful of errors: Site 'nu-edu.vipdev.lndo.site/' not found. Verify DOMAIN_CURRENT_SITE matches an existing site or use `--url=<url>` to override.
		- That's... okay?
	- If successful, login with your PRODUCTION username/password
	- www.nu-edu.vipdev.lndo.site
	- info.nu-edu.vipdev.lndo.site

### Current features/process:
1) Rewrite SQL: This script will take the .sql file and delete sections that we don't need locally. This includes our gravityforms entries & metadata tables, which aren't necessary for local dev and add a ton of bloat. This also removes _pantheon_heartbeat table which is an unused legacy table from a long time ago that WPVIP doesn't like. This saves a **copy** of the sql file which we then use for further processing.
2) Validate SQL: SQL file is checked against WPVIP's validate-sql function, to make sure it is valid & compatiable with VIP environments.
3) Import SQL: SQL file is then imported to our dev env's database via WPVIP's sql import function
4) Search-replace is then performed on the new database to update URLs from production to local.