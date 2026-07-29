#!/usr/bin/env node
const { Command } = require('commander');

const add = require('./commands/add');
const list = require('./commands/list');
const del = require('./commands/delete');
const update = require('./commands/update');
const complete = require('./commands/complete');
const uncomplete = require('./commands/uncomplete');
const undo = require('./commands/undo');
const search = require('./commands/search');
const clear = require('./commands/clear');
const archive = require('./commands/archive');
const archived = require('./commands/archived');
const restore = require('./commands/restore');
const clearArchived = require('./commands/clearArchived');
const trash = require('./commands/trash');
const restoreTrash = require('./commands/restoreTrash');
const emptyTrash = require('./commands/emptyTrash');
const lock = require('./commands/lock');
const unlock = require('./commands/unlock');
const pin = require('./commands/pin');
const unpin = require('./commands/unpin');
const favorite = require('./commands/favorite');
const unfavorite = require('./commands/unfavorite');
const favorites = require('./commands/favorites');
const stats = require('./commands/stats');
const exportCommand = require('./commands/export');
const importCommand = require('./commands/import');
const help = require('./commands/help');
const security = require('./commands/security');
const backup = require('./commands/backup');
const backups = require('./commands/backups');
const restoreBackup = require('./commands/restoreBackup');
const categoryCommand = require('./commands/category');
const categories = require('./commands/categories');
const renameCategory = require('./commands/renameCategory');
const deleteCategory = require('./commands/deleteCategory');
const history = require('./commands/history');
const config = require('./commands/config');
const doctor = require('./commands/doctor');
const today = require('./commands/today');
const overdue = require('./commands/overdue');
const upcoming = require('./commands/upcoming');
const recent = require('./commands/recent');
const next = require('./commands/next');
const report = require('./commands/report');
const program = new Command();

const packageJson = require('./package.json');

program
  .name('notes')
  .description(
    '📝 A professional, feature-rich Notes Manager CLI for managing notes, tasks, reminders, and productivity.'
  )
  .version(packageJson.version);

program.addHelpText(
  'after',
  `

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🚀 QUICK START

  notes add "Buy groceries"

  notes list

  notes complete 1

  notes stats

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📖 COMMAND HELP

  notes add --help

  notes search --help

  notes report --help

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📚 Documentation

  https://github.com/Rudra070707/notes-manager-cli

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`
);

program
  .command('add <text>')
  .description('Add a new note')
  .option('-p, --priority <priority>', 'low | medium | high')
  .option('--category <category>', 'Category name')
  .option('-t, --tag <tags>', 'Comma-separated tags')
  .option('-d, --due <date>', 'Due date (YYYY-MM-DD)')
  .option('--daily', 'Repeat every day')
  .option('--weekly', 'Repeat every week')
  .option('--monthly', 'Repeat every month')
  .addHelpText(
    'after',
    `
Examples:

  notes add "Buy groceries"

  notes add "Complete Java project" --priority high

  notes add "Study DBMS" --category College

  notes add "Submit assignment"
    --category College
    --priority high
    --due 2026-08-05

  notes add "Exercise" --daily
`
  )
  .action((text, options) => {
    add([text], options);
  });
program
  .command('list')
  .alias('ls')
  .description('List notes')
  .option('-s, --sort <type>', 'created | priority | status | due')
  .option('-p, --priority <priority>', 'low | medium | high')
  .option('-t, --tag <tag>', 'Filter by tag')
  .option('--category <category>', 'Filter by category')
  .option('-c, --completed', 'Show completed notes')
  .option('--pending', 'Show pending notes')
  .option('--today', 'Show notes due today')
  .option('--this-week', 'Show notes due this week')
  .option('--overdue', 'Show overdue notes')
  .option('--upcoming', 'Show upcoming notes')
  .option('-f, --favorite', 'Show only favorite notes')

  .addHelpText(
    'after',
    `
Examples:

  notes list

  notes list --priority high

  notes list --category College

  notes list --today

  notes list --favorite

  notes list --sort due
`
  )
  .action((options) => {
    list([], options);
  });

program
  .command('delete <ids...>')
  .alias('rm')
  .description('Delete one or more notes')
  .addHelpText(
    'after',
    `
Examples:

  notes delete 1

  notes delete 2 3 4
`
  )
  .action((ids) => {
    del(ids);
  });

program
  .command('update <id> <text>')
  .description('Update a note')
  .addHelpText(
    'after',
    `
Examples:

  notes update 3 "Buy vegetables"

  notes update 8 "Finish React project"
`
  )
  .action((id, text) => {
    update([id, text]);
  });
program
  .command('complete <ids...>')
  .alias('done')
  .description('Mark notes as completed')
  .addHelpText(
    'after',
    `
Examples:

  notes complete 1

  notes complete 2 3 4
`
  )
  .action((ids) => {
    complete(ids);
  });

program
  .command('uncomplete <ids...>')
  .description('Mark a completed note as pending')
  .addHelpText(
    'after',
    `
Example:

  notes uncomplete 3
`
  )
  .action((ids) => {
    uncomplete(ids);
  });

program
  .command('undo')
  .description('Undo the last operation')
  .addHelpText(
    'after',
    `
Example:

  notes undo
`
  )
  .action(() => {
    undo();
  });

program
  .command('search [keyword]')
  .alias('find')
  .description('Advanced search notes')
  .option('-p, --priority <priority>', 'Filter by priority')
  .option('-t, --tag <tag>', 'Filter by tag')
  .option('--category <category>', 'Filter by category')
  .option('-f, --favorite', 'Favorite notes only')
  .option('--locked', 'Locked notes only')
  .option('--pinned', 'Pinned notes only')
  .option('-c, --completed', 'Completed notes only')
  .option('--pending', 'Pending notes only')

  .addHelpText(
    'after',
    `
Examples:

  notes search Java

  notes search "Final Project"

  notes search --priority high

  notes search --category College

  notes search --favorite

  notes search --completed
`
  )
  .action((keyword, options) => {
    search(keyword, options);
  });
program
  .command('clear')
  .description('Delete all notes')
  .addHelpText(
    'after',
    `
Example:

  notes clear
`
  )
  .action(async () => {
    await clear();
  });

program
  .command('archive <ids...>')
  .alias('arc')
  .description('Archive a note')
  .addHelpText(
    'after',
    `
Example:

  notes archive 3
`
  )
  .action((ids) => {
    archive(ids);
  });

program
  .command('archived')
  .description('List archived notes')
  .addHelpText(
    'after',
    `
Example:

  notes archived
`
  )
  .action(() => {
    archived([]);
  });
program
  .command('trash')
  .description('List all trashed notes')
  .addHelpText(
    'after',
    `
Example:

  notes trash
`
  )
  .action(() => {
    trash();
  });
program
  .command('restore-trash <id>')
  .description('Restore a note from Trash')
  .addHelpText(
    'after',
    `
Example:

  notes restore-trash 5
`
  )
  .action((id) => {
    restoreTrash([id]);
  });
program
  .command('empty-trash')
  .description('Permanently delete all trashed notes')
  .addHelpText(
    'after',
    `
Example:

  notes empty-trash
`
  )
  .action(() => {
    emptyTrash();
  });
program
  .command('lock <ids...>')
  .description('Lock a note')
  .addHelpText(
    'after',
    `
Example:

  notes lock 2
`
  )
  .action((ids) => {
    lock(ids);
  });
program
  .command('pin <ids...>')
  .description('Pin a note')
  .addHelpText(
    'after',
    `
Example:

  notes pin 4
`
  )
  .action((ids) => {
    pin(ids);
  });
program
  .command('unlock <ids...>')
  .description('Unlock a note')
  .addHelpText(
    'after',
    `
Example:

  notes unlock 2
`
  )
  .action((ids) => {
    unlock(ids);
  });
program
  .command('unpin <ids...>')
  .description('Unpin a note')
  .addHelpText(
    'after',
    `
Example:

  notes unpin 4
`
  )
  .action((ids) => {
    unpin(ids);
  });
program
  .command('favorite <ids...>')
  .description('Add a note to favorites')
  .addHelpText(
    'after',
    `
Example:

  notes favorite 6
`
  )
  .action((ids) => {
    favorite(ids);
  });

program
  .command('unfavorite <ids...>')
  .description('Remove a note from favorites')
  .addHelpText(
    'after',
    `
Example:

  notes unfavorite 6
`
  )
  .action((ids) => {
    unfavorite(ids);
  });

program
  .command('favorites')
  .description('List all favorite notes')
  .addHelpText(
    'after',
    `
Example:

  notes favorites
`
  )
  .action(() => {
    favorites();
  });
program
  .command('restore <ids...>')
  .alias('res')
  .description('Restore an archived note')
  .addHelpText(
    'after',
    `
Example:

  notes restore 4
`
  )
  .action((ids) => {
    restore(ids);
  });

program
  .command('clear-archived')
  .description('Delete all archived notes')
  .addHelpText(
    'after',
    `
Example:

  notes clear-archived
`
  )
  .action(async () => {
    await clearArchived();
  });

program
  .command('stats')
  .alias('stat')
  .description('Show note statistics')
  .addHelpText(
    'after',
    `
Example:

  notes stats
`
  )
  .action(() => {
    stats([]);
  });

program
  .command('export <format>')
  .description('Export notes (json | csv | md)')
  .addHelpText(
    'after',
    `
Examples:

  notes export json

  notes export csv

  notes export md
`
  )
  .action((format) => {
    exportCommand(format);
  });

program
  .command('import <format> <file>')
  .description('Import notes (json)')
  .addHelpText(
    'after',
    `
Example:

  notes import json notes.json
`
  )
  .action((format, file) => {
    importCommand(format, file);
  });

/* ==========================
   BACKUP & RESTORE COMMANDS
========================== */

program
  .command('backup')
  .description('Create a database backup')
  .addHelpText(
    'after',
    `
Examples:

  notes backup

  notes backups

  notes restore-db backup.db
`
  )
  .action(() => {
    backup();
  });

program
  .command('backups')
  .description('List all available backups')
  .addHelpText(
    'after',
    `
Example:

  notes backups
`
  )
  .action(() => {
    backups();
  });

program
  .command('restore-db <backupFile>')
  .description('Restore database from a backup')
  .addHelpText(
    'after',
    `
Example:

  notes restore-db backup-2026-07-28.db
`
  )
  .action((backupFile) => {
    restoreBackup([backupFile]);
  });

/* ==========================
   CONFIGURATION COMMANDS
========================== */

program
  .command('config <action> [key] [value]')
  .description('Manage application configuration')
  .addHelpText(
    'after',
    `
Examples:

  notes config list

  notes config get theme

  notes config set theme dark
`
  )
  .action((action, key, value) => {
    config([action, key, value]);
  });
program
  .command('security <action>')
  .description('Manage CLI security')
  .addHelpText(
    'after',
    `
Examples:

  notes security enable

  notes security disable

  notes security status
`
  )
  .action((action) => {
    security([action]);
  });
program
  .command('categories')
  .description('List all categories')
  .addHelpText(
    'after',
    `
Example:

  notes categories
`
  )
  .action(() => {
    categories();
  });
program
  .command('rename-category <oldCategory> <newCategory>')
  .description('Rename a category')
  .addHelpText(
    'after',
    `
Example:

  notes rename-category College Study
`
  )
  .action((oldCategory, newCategory) => {
    renameCategory([oldCategory, newCategory]);
  });
program
  .command('delete-category <category>')
  .description('Delete a category and move its notes to General')
  .addHelpText(
    'after',
    `
Example:

  notes delete-category College
`
  )
  .action((category) => {
    deleteCategory([category]);
  });
program
  .command('history')
  .description('Show note activity history')
  .option('-l, --limit <number>', 'Show only the latest N history records')
  .option(
    '-t, --type <type>',
    'Filter by action type (ADD, UPDATE, DELETE, COMPLETE, etc.)'
  )
  .option('-s, --search <keyword>', 'Search history')
  .option('--today', "Show only today's history")
  .option('--clear', 'Clear all history')
  .addHelpText(
    'after',
    `
Examples:

  notes history

  notes history --today

  notes history --limit 20

  notes history --type ADD
`
  )
  .action((options) => {
    history(options);
  });
program
  .command('doctor')
  .description('Check database health')
  .addHelpText(
    'after',
    `
Example:

  notes doctor
`
  )
  .action(() => {
    doctor();
  });
program
  .command('today')
  .description('Show notes due today')
  .addHelpText(
    'after',
    `
Example:

  notes today
`
  )
  .action(() => {
    today();
  });
program
  .command('overdue')
  .description('Show overdue notes')
  .addHelpText(
    'after',
    `
Example:

  notes overdue
`
  )
  .action(() => {
    overdue();
  });
program
  .command('upcoming')
  .description('Show notes due within the next 7 days')
  .addHelpText(
    'after',
    `
Example:

  notes upcoming
`
  )
  .action(() => {
    upcoming();
  });
program
  .command('recent')
  .description('Show the 10 most recently created notes')
  .addHelpText(
    'after',
    `
Example:

  notes recent
`
  )
  .action(() => {
    recent();
  });
program
  .command('next')
  .description('Show the next task to work on')
  .addHelpText(
    'after',
    `
Example:

  notes next
`
  )
  .action(() => {
    next();
  });
program
  .command('report')
  .description('Generate a productivity report')
  .addHelpText(
    'after',
    `
Example:

  notes report
`
  )
  .action(() => {
    report();
  });
program
  .command('help')
  .description('Show the complete Notes Manager CLI guide')
  .addHelpText(
    'after',
    `
Example:

  notes help
`
  )
  .action(() => {
    help();
  });
program.addCommand(categoryCommand);

program.showSuggestionAfterError(true);

program.showHelpAfterError();

program.parse(process.argv);
