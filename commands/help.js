function execute() {
  console.log(`
============================================================
                📝 NOTES MANAGER CLI
Professional Command Line Productivity Tool
============================================================

USAGE
------------------------------------------------------------
notes <command> [options]

============================================================
QUICK START
============================================================

Install globally

  npm install -g notes-manager-cli

Create your first note

  notes add "Buy groceries"

View all notes

  notes list

Mark a note complete

  notes complete 1

Need command help?

  notes add --help

Run

  notes help

Check version

  notes --version
============================================================
MOST USED COMMANDS
============================================================

notes add
notes list
notes search
notes complete
notes today
notes next
notes report
notes stats
============================================================
BASIC COMMANDS
============================================================

Add a note
  notes add "Buy groceries"

List all notes
  notes list

Update a note
  notes update 3 "Buy vegetables"

Delete (Move to Trash)
  notes delete 5

Undo last operation
  notes undo

============================================================
NOTE STATUS
============================================================

Mark as completed
  notes complete 4

Mark as pending
  notes uncomplete 4

============================================================
SEARCH
============================================================

Search notes

  notes search Java

or

  notes search "Final Project"


============================================================
ARCHIVE
============================================================

Archive a note
  notes archive 8

Show archived notes
  notes archived

Restore archived note
  notes restore 8

Delete all archived notes
  notes clear-archived

============================================================
TRASH
============================================================

View Trash
  notes trash

Restore from Trash
  notes restore-trash <id>

Empty Trash
  notes empty-trash

============================================================
LOCK
============================================================

Lock a note
  notes lock 6

Unlock a note
  notes unlock <id>

============================================================
PIN
============================================================

Pin a note
  notes pin 2

Unpin a note
  notes unpin <id>

============================================================
FAVORITES
============================================================

Add to favorites
  notes favorite <id>

Remove from favorites
  notes unfavorite <id>

Show favorite notes
  notes favorites

List only favorite notes
  notes list --favorite

============================================================
CATEGORIES
============================================================

Assign category

  notes category set 5 College
List categories
  notes categories

Rename category

  notes rename-category Work Office

Delete category

  notes delete-category Personal

============================================================
LIST FILTERS
============================================================

List completed notes
  notes list --completed

List pending notes
  notes list --pending

Filter by priority
  notes list --priority high

Filter by tag
  notes list --tag work

Filter by category
  notes list --category Personal

Due today
  notes list --today

Due this week
  notes list --this-week

Overdue notes
  notes list --overdue

Upcoming notes
  notes list --upcoming

============================================================
SORTING
============================================================

Sort by creation date
  notes list --sort created

Sort by priority
  notes list --sort priority

Sort by status
  notes list --sort status

Sort by due date
  notes list --sort due

============================================================
ADD OPTIONS
============================================================

Priority
  notes add "Finish DBMS Assignment" --priority high

Category
  notes add "React Project" --category College

Tags
  notes add "Meeting" --tag office,client

Due date
  notes add "Task" --due 2026-12-31

Recurring (Daily)
  notes add "Exercise" --daily

Recurring (Weekly)
  notes add "Meeting" --weekly

Recurring (Monthly)
  notes add "Pay Rent" --monthly

============================================================
IMPORT / EXPORT
============================================================

Export JSON
  notes export json

Export CSV
  notes export csv

Export Markdown
  notes export md

Import JSON
  notes import json notes.json

Import CSV
  notes import csv notes.csv

Import Markdown
  notes import md notes.md

============================================================
BACKUP
============================================================

Create backup
  notes backup

List backups
  notes backups

Restore database

  notes restore-db backup-2026-07-28.db

============================================================
CONFIGURATION
============================================================

View configuration
  notes config show

Set configuration
  notes config set <key> <value>

============================================================
SECURITY
============================================================

Set master PIN

  notes security set

Verify PIN

  notes security verify

Check status

  notes security status

Remove PIN

  notes security remove
============================================================
STATISTICS
============================================================

Show statistics
  notes stats

============================================================
UTILITY COMMANDS
============================================================

Today's notes
  notes today

Next upcoming task
  notes next

Recent notes
  notes recent

Overdue notes
  notes overdue

Project health check
  notes doctor
============================================================
HISTORY
============================================================

Show activity history

  notes history

Today's activity

  notes history --today

Latest 20 actions

  notes history --limit 20


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

  notes --help

Detailed Guide

  notes help

Help for a specific command

  notes add --help

  notes search --help

  notes config --help

Version

  notes --version

============================================================
PROJECT
============================================================

GitHub

  https://github.com/Rudra070707/notes-manager-cli

NPM

  https://www.npmjs.com/package/notes-manager-cli
============================================================
`);
}

module.exports = execute;
