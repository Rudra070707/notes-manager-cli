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
const stats = require('./commands/stats');
const exportCommand = require('./commands/export');
const importCommand = require('./commands/import');
const help = require('./commands/help');
const security = require('./commands/security');
const backup = require('./commands/backup');
const backups = require('./commands/backups');
const restoreBackup = require('./commands/restoreBackup');

const config = require('./commands/config');

const program = new Command();

program
  .name('notes')
  .description('Professional Notes Manager CLI')
  .version('1.0.0');

program
  .command('add <text>')
  .description('Add a new note')
  .option('-p, --priority <priority>', 'low | medium | high')
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
  .option('-c, --completed', 'Show completed notes')
  .option('--pending', 'Show pending notes')
  .option('--today', 'Show notes due today')
  .option('--this-week', 'Show notes due this week')
  .option('--overdue', 'Show overdue notes')
  .option('--upcoming', 'Show upcoming notes')
  .action((options) => {
    list([], options);
  });

program
  .command('delete <id>')
  .alias('rm')
  .description('Delete a note')
  .action((id) => {
    del([id]);
  });

program
  .command('update <id> <text>')
  .description('Update a note')
  .action((id, text) => {
    update([id, text]);
  });

program
  .command('complete <id>')
  .alias('done')
  .description('Mark a note as completed')
  .action((id) => {
    complete([id]);
  });

program
  .command('uncomplete <id>')
  .description('Mark a completed note as pending')
  .action((id) => {
    uncomplete([id]);
  });

program
  .command('undo')
  .description('Undo the last operation')
  .action(() => {
    undo();
  });

program
  .command('search <keyword>')
  .alias('find')
  .description('Search notes')
  .action((keyword) => {
    search([keyword]);
  });

program
  .command('clear')
  .description('Delete all notes')
  .action(async () => {
    await clear();
  });

program
  .command('archive <id>')
  .alias('arc')
  .description('Archive a note')
  .action((id) => {
    archive([id]);
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
  .command('lock <id>')
  .description('Lock a note')
  .action((id) => {
    lock([id]);
  });
program
  .command('pin <id>')
  .description('Pin a note')
  .action((id) => {
    pin(id);
  });
program
  .command('unlock <id>')
  .description('Unlock a note')
  .action((id) => {
    unlock([id]);
  });
program
  .command('unpin <id>')
  .description('Unpin a note')
  .action((id) => {
    unpin(id);
  });
program
  .command('restore <id>')
  .alias('res')
  .description('Restore an archived note')
  .action((id) => {
    restore([id]);
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

program.parse();
