function execute() {
  console.log(`
============================================================
                📒 NOTES MANAGER CLI
============================================================

USAGE
------------------------------------------------------------
node index.js <command> [options]

============================================================
BASIC COMMANDS
============================================================

Add a note
  node index.js add "Buy groceries"

List all notes
  node index.js list

Update a note
  node index.js update <id> "Updated note"

Delete (Move to Trash)
  node index.js delete <id>

Undo last operation
  node index.js undo

============================================================
NOTE STATUS
============================================================

Mark as completed
  node index.js complete <id>

Mark as pending
  node index.js uncomplete <id>

============================================================
SEARCH
============================================================

Search notes
  node index.js search "keyword"

============================================================
ARCHIVE
============================================================

Archive a note
  node index.js archive <id>

Show archived notes
  node index.js archived

Restore archived note
  node index.js restore <id>

Delete all archived notes
  node index.js clear-archived

============================================================
TRASH
============================================================

View Trash
  node index.js trash

Restore from Trash
  node index.js restore-trash <id>

Empty Trash
  node index.js empty-trash

============================================================
LOCK
============================================================

Lock a note
  node index.js lock <id>

Unlock a note
  node index.js unlock <id>

============================================================
PIN
============================================================

Pin a note
  node index.js pin <id>

Unpin a note
  node index.js unpin <id>

============================================================
FAVORITES
============================================================

Add to favorites
  node index.js favorite <id>

Remove from favorites
  node index.js unfavorite <id>

Show favorite notes
  node index.js favorites

List only favorite notes
  node index.js list --favorite

============================================================
CATEGORIES
============================================================

Assign category
  node index.js category set <id> <category>

List categories
  node index.js categories

Rename category
  node index.js rename-category <old> <new>

Delete category
  node index.js delete-category <category>

============================================================
LIST FILTERS
============================================================

List completed notes
  node index.js list --completed

List pending notes
  node index.js list --pending

Filter by priority
  node index.js list --priority high

Filter by tag
  node index.js list --tag work

Filter by category
  node index.js list --category Personal

Due today
  node index.js list --today

Due this week
  node index.js list --this-week

Overdue notes
  node index.js list --overdue

Upcoming notes
  node index.js list --upcoming

============================================================
SORTING
============================================================

Sort by creation date
  node index.js list --sort created

Sort by priority
  node index.js list --sort priority

Sort by status
  node index.js list --sort status

Sort by due date
  node index.js list --sort due

============================================================
ADD OPTIONS
============================================================

Priority
  node index.js add "Task" --priority high

Category
  node index.js add "Task" --category Work

Tags
  node index.js add "Task" --tag work,office

Due date
  node index.js add "Task" --due 2026-12-31

Recurring (Daily)
  node index.js add "Exercise" --daily

Recurring (Weekly)
  node index.js add "Meeting" --weekly

Recurring (Monthly)
  node index.js add "Pay Rent" --monthly

============================================================
IMPORT / EXPORT
============================================================

Export JSON
  node index.js export json

Export CSV
  node index.js export csv

Export Markdown
  node index.js export md

Import JSON
  node index.js import json notes.json

============================================================
BACKUP
============================================================

Create backup
  node index.js backup

List backups
  node index.js backups

Restore database
  node index.js restore-db <backup-file>

============================================================
CONFIGURATION
============================================================

View configuration
  node index.js config show

Set configuration
  node index.js config set <key> <value>

============================================================
SECURITY
============================================================

Security commands
  node index.js security <action>

============================================================
STATISTICS
============================================================

Show statistics
  node index.js stats

============================================================
HISTORY
============================================================

Show activity history
  node index.js history

============================================================
ALIASES
============================================================

ls       -> list
rm       -> delete
done     -> complete
arc      -> archive
res      -> restore
stat     -> stats
find     -> search

============================================================
HELP
============================================================

Commander Help
  node index.js --help

Custom Help
  node index.js help-custom

Version
  node index.js --version

============================================================
`);
}

module.exports = execute;
