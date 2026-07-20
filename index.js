const add = require("./commands/add");
const list = require("./commands/list");
const del = require("./commands/delete");
const update = require("./commands/update");
const complete = require("./commands/complete");
const uncomplete = require("./commands/uncomplete");
const search = require("./commands/search");
const clear = require("./commands/clear");
const stats = require("./commands/stats");
const help = require("./commands/help");

const args = process.argv.slice(2);

const command = args[0];

const commandMap = {
  add,
  list,
  delete: del,
  update,
  complete,
  uncomplete,
  search,
  clear,
  stats,
  help
};

const handler = commandMap[command];

if (handler) {
  handler(args.slice(1));
} else {
  help();
}
