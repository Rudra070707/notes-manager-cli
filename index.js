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

program
  .name('notes')
  .description('Professional Notes Manager CLI')
  .version('1.0.0');

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
  .action((options) => {
    list([], options);
  });

program
  .command('delete <ids...>')
  .alias('rm')
  .description('Delete a note')
  .action((ids) => {
    del(ids);
  });

program
  .command('update <id> <text>')
  .description('Update a note')
  .action((id, text) => {
    update([id, text]);
  });
program
  .command('complete <ids...>')
  .alias('done')
  .description('Mark a note as completed')
  .action((ids) => {
    complete(ids);
  });

program
  .command('uncomplete <ids...>')
  .description('Mark a completed note as pending')
  .action((ids) => {
    uncomplete(ids);
  });

program
  .command('undo')
  .description('Undo the last operation')
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
  .action((keyword, options) => {
    search(keyword, options);
  });
program
  .command('clear')
  .description('Delete all notes')
  .action(async () => {
    await clear();
  });

program
  .command('archive <ids...>')
  .alias('arc')
  .description('Archive a note')
  .action((ids) => {
    archive(ids);
  });

program
  .command('archived')
  .description('List archived notes')
  .action(() => {
    archived([]);
  });
program
  .command('trash')
  .description('List all trashed notes')
  .action(() => {
    trash();
  });
program
  .command('restore-trash <id>')
  .description('Restore a note from Trash')
  .action((id) => {
    restoreTrash([id]);
  });
program
  .command('empty-trash')
  .description('Permanently delete all trashed notes')
  .action(() => {
    emptyTrash();
  });
program
  .command('lock <ids...>')
  .description('Lock a note')
  .action((ids) => {
    lock(ids);
  });
program
  .command('pin <ids...>')
  .description('Pin a note')
  .action((ids) => {
    pin(ids);
  });
program
  .command('unlock <ids...>')
  .description('Unlock a note')
  .action((ids) => {
    unlock(ids);
  });
program
  .command('unpin <ids...>')
  .description('Unpin a note')
  .action((ids) => {
    unpin(ids);
  });
program
  .command('favorite <ids...>')
  .description('Add a note to favorites')
  .action((ids) => {
    favorite(ids);
  });

program
  .command('unfavorite <ids...>')
  .description('Remove a note from favorites')
  .action((ids) => {
    unfavorite(ids);
  });

program
  .command('favorites')
  .description('List all favorite notes')
  .action(() => {
    favorites();
  });
program
  .command('restore <ids...>')
  .alias('res')
  .description('Restore an archived note')
  .action((ids) => {
    restore(ids);
  });

program
  .command('clear-archived')
  .description('Delete all archived notes')
  .action(async () => {
    await clearArchived();
  });

program
  .command('stats')
  .alias('stat')
  .description('Show note statistics')
  .action(() => {
    stats([]);
  });

program
  .command('export <format>')
  .description('Export notes (json | csv | md)')
  .action((format) => {
    exportCommand(format);
  });

program
  .command('import <format> <file>')
  .description('Import notes (json)')
  .action((format, file) => {
    importCommand(format, file);
  });

/* ==========================
   BACKUP & RESTORE COMMANDS
========================== */

program
  .command('backup')
  .description('Create a database backup')
  .action(() => {
    backup();
  });

program
  .command('backups')
  .description('List all available backups')
  .action(() => {
    backups();
  });

program
  .command('restore-db <backupFile>')
  .description('Restore database from a backup')
  .action((backupFile) => {
    restoreBackup([backupFile]);
  });

/* ==========================
   CONFIGURATION COMMANDS
========================== */

program
  .command('config <action> [key] [value]')
  .description('Manage application configuration')
  .action((action, key, value) => {
    config([action, key, value]);
  });
program
  .command('security <action>')
  .description('Manage CLI security')
  .action((action) => {
    security([action]);
  });
program
  .command('help-custom')
  .description('Show your custom help')
  .action(() => {
    help();
  });
program
  .command('categories')
  .description('List all categories')
  .action(() => {
    categories();
  });
program
  .command('rename-category <oldCategory> <newCategory>')
  .description('Rename a category')
  .action((oldCategory, newCategory) => {
    renameCategory([oldCategory, newCategory]);
  });
program
  .command('delete-category <category>')
  .description('Delete a category and move its notes to General')
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
  .action((options) => {
    history(options);
  });
program
  .command('doctor')
  .description('Check database health')
  .action(() => {
    doctor();
  });
program
  .command('today')
  .description('Show notes due today')
  .action(() => {
    today();
  });
program
  .command('overdue')
  .description('Show overdue notes')
  .action(() => {
    overdue();
  });
program
  .command('upcoming')
  .description('Show notes due within the next 7 days')
  .action(() => {
    upcoming();
  });
program
  .command('recent')
  .description('Show the 10 most recently created notes')
  .action(() => {
    recent();
  });
program
  .command('next')
  .description('Show the next task to work on')
  .action(() => {
    next();
  });
program
  .command('report')
  .description('Generate a productivity report')
  .action(() => {
    report();
  });
program.addCommand(categoryCommand);
program.parse();
