function execute() {
  console.log(`
📒 Notes Manager CLI

Usage:

node index.js add "Your Note"
node index.js list
node index.js delete <id>
node index.js update <id> "New Note"
node index.js complete <id>
node index.js uncomplete <id>
node index.js search "keyword"
node index.js clear
node index.js stats
node index.js help
`);
}

module.exports = execute;
