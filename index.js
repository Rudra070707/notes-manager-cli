#!/usr/bin/env node

const { Command } = require("commander");

const add = require("./commands/add");
const list = require("./commands/list");
const del = require("./commands/delete");
const update = require("./commands/update");
const complete = require("./commands/complete");
const uncomplete = require("./commands/uncomplete");
const search = require("./commands/search");
const clear = require("./commands/clear");
const stats = require("./commands/stats");
const exportCommand = require("./commands/export");
const help = require("./commands/help");

const program = new Command();

program.name("notes").description("Professional Notes Manager CLI").version("1.0.0");

program
  .command("add <text>")
  .description("Add a new note")
  .option("-p, --priority <priority>", "low | medium | high")
  .option("-t, --tag <tags>", "Comma-separated tags")
  .option("-d, --due <date>", "Due date (YYYY-MM-DD)")
  .option("--daily", "Repeat every day")
  .option("--weekly", "Repeat every week")
  .option("--monthly", "Repeat every month")
  .action((text, options) => {
    add([text], options);
  });

program
  .command("list")
  .description("List notes")
  .option("-s, --sort <type>", "created | priority | status | due")
  .option("-p, --priority <priority>", "low | medium | high")
  .option("-t, --tag <tag>", "Filter by tag")
  .option("-c, --completed", "Show completed notes")
  .option("--pending", "Show pending notes")
  .option("--today", "Show notes due today")
  .option("--this-week", "Show notes due this week")
  .option("--overdue", "Show overdue notes")
  .option("--upcoming", "Show upcoming notes")
  .action((options) => {
    list([], options);
  });

program
  .command("delete <id>")
  .description("Delete a note")
  .action((id) => {
    del([id]);
  });

program
  .command("update <id> <text>")
  .description("Update a note")
  .action((id, text) => {
    update([id, text]);
  });

program
  .command("complete <id>")
  .description("Mark a note as completed")
  .action((id) => {
    complete([id]);
  });

program
  .command("uncomplete <id>")
  .description("Mark a completed note as pending")
  .action((id) => {
    uncomplete([id]);
  });

program
  .command("search <keyword>")
  .description("Search notes")
  .action((keyword) => {
    search([keyword]);
  });

program
  .command("clear")
  .description("Delete all notes")
  .action(async () => {
    await clear();
  });

program
  .command("stats")
  .description("Show note statistics")
  .action(() => {
    stats([]);
  });

program
  .command("export <format>")
  .description("Export notes (json | csv | md)")
  .action((format) => {
    exportCommand(format);
  });

program
  .command("help-custom")
  .description("Show your custom help")
  .action(() => {
    help();
  });

program.parse();
