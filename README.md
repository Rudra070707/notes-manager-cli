# 📝 Notes Manager CLI

> A powerful, feature-rich, and professional command-line Notes Manager built with **Node.js**, **Commander.js**, and **SQLite**.

<p align="center">

![npm](https://img.shields.io/npm/v/notes-manager-cli?style=for-the-badge)
![npm Downloads](https://img.shields.io/npm/dm/notes-manager-cli?style=for-the-badge)
![License](https://img.shields.io/npm/l/notes-manager-cli?style=for-the-badge)
![Node.js](https://img.shields.io/badge/Node.js-20+-339933?style=for-the-badge&logo=node.js)
![SQLite](https://img.shields.io/badge/Database-SQLite-003B57?style=for-the-badge&logo=sqlite)
![Jest](https://img.shields.io/badge/Tested_with-Jest-C21325?style=for-the-badge&logo=jest)

</p>

---

# 📖 Overview

**Notes Manager CLI** is a modern command-line application designed to help developers, students, and professionals manage notes efficiently without leaving the terminal.

Unlike a basic CRUD project, Notes Manager CLI provides a complete productivity toolkit including:

- ✅ Smart note management
- ✅ Categories
- ✅ Favorites
- ✅ Pinning
- ✅ Locking
- ✅ Tags
- ✅ Due dates
- ✅ Recurring notes
- ✅ Advanced searching
- ✅ Statistics
- ✅ Productivity reports
- ✅ History tracking
- ✅ Backup & Restore
- ✅ Import & Export
- ✅ SQLite persistence

The project follows professional software engineering principles and demonstrates clean architecture, modular development, automated testing, and scalable code organization.

---

# 🚀 Why Notes Manager CLI?

Managing notes from the terminal should be fast, intuitive, and reliable.

Notes Manager CLI was built with the following goals:

- Improve developer productivity
- Keep notes stored locally
- No internet connection required
- Fast SQLite database
- Simple yet powerful commands
- Clean architecture
- Easy maintenance
- Open-source

Whether you're managing daily tasks, project ideas, study notes, or reminders, Notes Manager CLI provides an efficient workflow directly from your terminal.

---

# ✨ Highlights

- 🚀 35+ CLI Commands
- 📦 20+ Major Features
- 🗄 SQLite Database
- 📊 Statistics Dashboard
- 📈 Productivity Reports
- 📂 Categories & Tags
- ⭐ Favorites
- 📌 Pin Notes
- 🔒 Lock Notes
- 🗑 Trash Management
- ♻ Undo Operations
- 📜 History Tracking
- 💾 Backup & Restore
- 📤 Import & Export
- 🔍 Advanced Search
- 🧪 117 Automated Tests
- ⚡ Modular Architecture
- 📦 Published on npm

---

# 📸 Demo

```bash
$ notes list

┌────┬──────────────────────────────┬──────────┬──────────┐
│ ID │ Note                         │ Priority │ Status   │
├────┼──────────────────────────────┼──────────┼──────────┤
│ 1  │ Learn Node.js                │ HIGH     │ Pending  │
│ 2  │ Finish React Project         │ MEDIUM   │ Done     │
│ 3  │ Prepare Interview Questions  │ LOW      │ Pending  │
└────┴──────────────────────────────┴──────────┴──────────┘
```

---

# 📦 Installation

## Requirements

Before installing, make sure you have:

- Node.js **20 or later**
- npm
- Windows, macOS, or Linux

Verify your installation:

```bash
node -v
npm -v
```

---

# ⚡ Install from npm (Recommended)

Install globally:

```bash
npm install -g notes-manager-cli
```

Verify installation:

```bash
notes --version
```

Expected output:

```text
1.0.2
```

View all available commands:

```bash
notes --help
```

---

# 🚀 Your First Note

Create a note:

```bash
notes add "Learn Node.js"
```

List notes:

```bash
notes list
```

Complete a note:

```bash
notes complete 1
```

Generate statistics:

```bash
notes stats
```

Generate productivity report:

```bash
notes report
```

Check database health:

```bash
notes doctor
```

---

# 👨‍💻 Developer Installation

If you'd like to contribute or modify the source code:

Clone the repository:

```bash
git clone https://github.com/Rudra070707/notes-manager-cli.git
```

Navigate into the project:

```bash
cd notes-manager-cli
```

Install dependencies:

```bash
npm install
```

Run the application locally:

```bash
node index.js --help
```

Run tests:

```bash
npm test
```

---

# 📁 Data Storage

Notes Manager CLI stores all data **locally** using **SQLite**.

Your notes remain on your computer.

No cloud storage.

No account required.

No internet connection required.

For additional safety, backups can be created anytime:

```bash
notes backup
```

and restored using:

```bash
notes restore-db <backup-file>
```

---

# 🎯 Designed For

Notes Manager CLI is useful for:

- 👨‍💻 Software Developers
- 🎓 Students
- 📚 Self-learners
- 📋 Project Managers
- 💼 Professionals
- 🧑‍💼 Freelancers
- 🧠 Daily Task Management

---

# ⭐ Key Features

Notes Manager CLI is much more than a basic note-taking application. It combines task management, productivity tools, organization features, and database persistence into a single command-line experience.

---

# ✅ Core Note Management

Efficiently create and manage your notes.

### Features

- Create unlimited notes
- Update existing notes
- Delete notes
- List all notes
- Mark notes as completed
- Mark completed notes as pending
- Undo the last operation
- Trash support
- Archive support

### Example

```bash
notes add "Complete Java Assignment"

notes list

notes update 1 "Complete Java Assignment before Friday"

notes complete 1

notes uncomplete 1

notes delete 1

notes undo
```

---

# 📂 Organization

Organize notes exactly the way you want.

## Categories

Group notes into categories.

Examples:

- Personal
- College
- Work
- Projects
- Ideas

```bash
notes add "Finish DBMS Assignment" --category College

notes list --category College

notes categories

notes rename-category College Academics
```

---

## Tags

Attach multiple tags to any note.

Example:

```bash
notes add "Build REST API" --tag backend,nodejs,express
```

Search using tags.

```bash
notes search --tag backend
```

---

## Priority Levels

Every note can have a priority.

Supported priorities:

- Low
- Medium
- High

Example:

```bash
notes add "Finish Project" --priority high
```

Filter:

```bash
notes list --priority high
```

Sort:

```bash
notes list --sort priority
```

---

## Pin Notes

Pin important notes to keep them at the top.

```bash
notes pin 2

notes unpin 2
```

---

## Favorite Notes

Mark frequently used notes as favorites.

```bash
notes favorite 3

notes favorites

notes unfavorite 3
```

---

## Lock Notes

Protect sensitive notes.

```bash
notes lock 5

notes unlock 5
```

---

# 📅 Due Dates

Assign deadlines to notes.

```bash
notes add "Submit Final Report" --due 2026-08-15
```

Filter by due dates.

```bash
notes today

notes upcoming

notes overdue
```

---

# 🔁 Recurring Notes

Create recurring reminders.

Supported recurrence:

- Daily
- Weekly
- Monthly

Examples

```bash
notes add "Drink Water" --daily

notes add "Weekly Team Meeting" --weekly

notes add "Pay Rent" --monthly
```

---

# 📈 Productivity Features

Stay organized and productive with built-in productivity commands.

## Today's Tasks

```bash
notes today
```

---

## Upcoming Tasks

```bash
notes upcoming
```

---

## Overdue Tasks

```bash
notes overdue
```

---

## Recent Notes

```bash
notes recent
```

---

## Next Priority Task

```bash
notes next
```

---

## Statistics Dashboard

View overall statistics.

```bash
notes stats
```

Example output:

```
Total Notes:          18
Completed:             9
Pending:               9
High Priority:         4
Favorites:             6
Archived:              2
Locked:                3
```

---

## Productivity Report

Generate a detailed productivity report.

```bash
notes report
```

The report summarizes:

- Completed tasks
- Pending tasks
- Completion percentage
- Priority distribution
- Category distribution
- Overall productivity

---

# 🔍 Search & Filtering

Quickly find the notes you need.

Search by keyword.

```bash
notes search project
```

Search by priority.

```bash
notes search --priority high
```

Search by category.

```bash
notes search --category Work
```

Search favorites.

```bash
notes search --favorite
```

Search locked notes.

```bash
notes search --locked
```

Search pinned notes.

```bash
notes search --pinned
```

Search completed notes.

```bash
notes search --completed
```

Search pending notes.

```bash
notes search --pending
```

---

# ⚡ Sorting

Sort notes by different fields.

```bash
notes list --sort created

notes list --sort priority

notes list --sort due

notes list --sort status
```

---

# 📊 Feature Summary

| Feature              | Supported |
| -------------------- | --------- |
| Create Notes         | ✅        |
| Update Notes         | ✅        |
| Delete Notes         | ✅        |
| Complete Notes       | ✅        |
| Archive Notes        | ✅        |
| Trash                | ✅        |
| Categories           | ✅        |
| Tags                 | ✅        |
| Favorites            | ✅        |
| Pin Notes            | ✅        |
| Lock Notes           | ✅        |
| Due Dates            | ✅        |
| Recurring Notes      | ✅        |
| Search               | ✅        |
| Sorting              | ✅        |
| Statistics           | ✅        |
| Productivity Reports | ✅        |

---

# 🚀 Quick Start Workflow

A typical workflow looks like this:

```bash
notes add "Learn Node.js" --priority high --category Study

notes add "Finish React Project" --priority medium --due 2026-08-10

notes list

notes complete 1

notes stats

notes report
```

---

# 📚 Complete Command Reference

This section provides a comprehensive overview of every command available in Notes Manager CLI.

---

# ➕ Add Notes

Create a new note.

### Syntax

```bash
notes add "<note>"
```

### Options

| Option       | Description                      |
| ------------ | -------------------------------- |
| `--priority` | Set priority (low, medium, high) |
| `--category` | Assign category                  |
| `--tag`      | Add comma-separated tags         |
| `--due`      | Set due date                     |
| `--daily`    | Repeat daily                     |
| `--weekly`   | Repeat weekly                    |
| `--monthly`  | Repeat monthly                   |

### Examples

```bash
notes add "Learn Node.js"

notes add "Complete Project" --priority high

notes add "Study DBMS" --category College

notes add "Practice DSA" --tag coding,dsa

notes add "Submit Assignment" --due 2026-08-10

notes add "Drink Water" --daily
```

---

# 📋 List Notes

Display all notes.

### Syntax

```bash
notes list
```

Alias

```bash
notes ls
```

### Options

| Option            | Description               |
| ----------------- | ------------------------- |
| `--sort created`  | Sort by creation date     |
| `--sort priority` | Sort by priority          |
| `--sort due`      | Sort by due date          |
| `--sort status`   | Sort by completion status |
| `--priority`      | Filter by priority        |
| `--tag`           | Filter by tag             |
| `--category`      | Filter by category        |
| `--completed`     | Show completed notes      |
| `--pending`       | Show pending notes        |
| `--today`         | Show today's notes        |
| `--this-week`     | Show notes due this week  |
| `--overdue`       | Show overdue notes        |
| `--upcoming`      | Show upcoming notes       |
| `--favorite`      | Show favorites only       |

### Examples

```bash
notes list

notes list --priority high

notes list --category Work

notes list --tag backend

notes list --completed

notes list --sort priority
```

---

# ✏ Update Notes

Update an existing note.

```bash
notes update 2 "Finish React Project"
```

---

# ❌ Delete Notes

Delete one or more notes.

```bash
notes delete 3

notes delete 3 4 5
```

Alias

```bash
notes rm 3
```

---

# ✅ Complete Notes

Mark notes as completed.

```bash
notes complete 2

notes complete 2 3 4
```

Alias

```bash
notes done 2
```

---

# ↩ Mark Pending

Convert completed notes back to pending.

```bash
notes uncomplete 2
```

---

# ♻ Undo

Undo the previous action.

```bash
notes undo
```

---

# 📦 Archive Notes

Archive notes without deleting them.

```bash
notes archive 2
```

Alias

```bash
notes arc 2
```

View archived notes

```bash
notes archived
```

Restore

```bash
notes restore 2
```

Alias

```bash
notes res 2
```

Delete all archived notes

```bash
notes clear-archived
```

---

# 🗑 Trash

View trash

```bash
notes trash
```

Restore

```bash
notes restore-trash 3
```

Empty trash

```bash
notes empty-trash
```

---

# 📌 Pin Notes

Pin important notes.

```bash
notes pin 2
```

Remove pin

```bash
notes unpin 2
```

---

# ⭐ Favorites

Add favorite

```bash
notes favorite 2
```

Remove favorite

```bash
notes unfavorite 2
```

List favorites

```bash
notes favorites
```

---

# 🔒 Lock Notes

Lock

```bash
notes lock 2
```

Unlock

```bash
notes unlock 2
```

---

# 🔍 Search

Search by keyword.

```bash
notes search project
```

Alias

```bash
notes find project
```

Available filters

| Filter        | Description     |
| ------------- | --------------- |
| `--priority`  | Priority filter |
| `--category`  | Category filter |
| `--tag`       | Tag filter      |
| `--favorite`  | Favorites only  |
| `--locked`    | Locked notes    |
| `--pinned`    | Pinned notes    |
| `--completed` | Completed notes |
| `--pending`   | Pending notes   |

Examples

```bash
notes search react

notes search --priority high

notes search --category College

notes search --favorite

notes search --locked
```

---

# 📊 Statistics

Display statistics.

```bash
notes stats
```

Alias

```bash
notes stat
```

---

# 📈 Productivity Report

Generate a productivity report.

```bash
notes report
```

---

# 📅 Productivity Commands

Today's tasks

```bash
notes today
```

Upcoming tasks

```bash
notes upcoming
```

Overdue tasks

```bash
notes overdue
```

Recent notes

```bash
notes recent
```

Next recommended task

```bash
notes next
```

---

# 📂 Categories

View categories

```bash
notes categories
```

Rename category

```bash
notes rename-category College Academics
```

Delete category

```bash
notes delete-category Ideas
```

---

# 📜 History

View activity history.

```bash
notes history
```

Limit records

```bash
notes history --limit 20
```

Search history

```bash
notes history --search update
```

Today's history

```bash
notes history --today
```

Filter by action

```bash
notes history --type ADD
```

Clear history

```bash
notes history --clear
```

---

# 💾 Backup & Restore

Create backup

```bash
notes backup
```

List backups

```bash
notes backups
```

Restore backup

```bash
notes restore-db backup-2026-08-01.db
```

---

# 📤 Export

Supported formats

- JSON
- CSV
- Markdown

Examples

```bash
notes export json

notes export csv

notes export md
```

---

# 📥 Import

Import JSON data.

```bash
notes import json notes.json
```

---

# ⚙ Configuration

View configuration

```bash
notes config show
```

Change configuration

```bash
notes config set theme dark
```

Reset configuration

```bash
notes config reset
```

---

# 🛡 Security

Manage security features.

```bash
notes security enable

notes security disable
```

---

# 🩺 Doctor

Run diagnostics.

```bash
notes doctor
```

The Doctor command checks:

- Database health
- Missing tables
- Corrupted records
- Configuration issues
- Backup status

---

# ❓ Help

Display built-in help.

```bash
notes --help
```

Custom help

```bash
notes help-custom
```

---

# 🏗 Architecture & Project Structure

Notes Manager CLI follows a clean layered architecture that separates responsibilities into independent modules. This makes the project easier to maintain, extend, and test.

The application flow is:

```text
                 User
                   │
                   ▼
        Commander.js CLI Interface
                   │
                   ▼
             Command Layer
                   │
                   ▼
             Service Layer
                   │
                   ▼
          Repository Layer
                   │
                   ▼
            SQLite Database
```

Every layer has a single responsibility and communicates only with the layer below it.

---

# 📂 Project Structure

```text
notes-manager-cli/
│
├── commands/
│   ├── add.js
│   ├── archive.js
│   ├── backup.js
│   ├── categories.js
│   ├── category.js
│   ├── clear.js
│   ├── clearArchived.js
│   ├── complete.js
│   ├── config.js
│   ├── delete.js
│   ├── deleteCategory.js
│   ├── doctor.js
│   ├── emptyTrash.js
│   ├── export.js
│   ├── favorite.js
│   ├── favorites.js
│   ├── help.js
│   ├── history.js
│   ├── import.js
│   ├── list.js
│   ├── lock.js
│   ├── next.js
│   ├── overdue.js
│   ├── pin.js
│   ├── recent.js
│   ├── renameCategory.js
│   ├── report.js
│   ├── restore.js
│   ├── restoreBackup.js
│   ├── restoreTrash.js
│   ├── search.js
│   ├── security.js
│   ├── stats.js
│   ├── today.js
│   ├── trash.js
│   ├── uncomplete.js
│   ├── undo.js
│   ├── unfavorite.js
│   ├── unlock.js
│   ├── unpin.js
│   ├── upcoming.js
│   └── update.js
│
├── database/
│   ├── database.js
│   ├── noteRepository.js
│   ├── logRepository.js
│   ├── configRepository.js
│   ├── securityRepository.js
│   └── undoRepository.js
│
├── services/
│   ├── backupService.js
│   ├── configService.js
│   ├── exportService.js
│   ├── historyService.js
│   ├── importService.js
│   ├── loggerService.js
│   ├── noteService.js
│   ├── securityService.js
│   └── undoService.js
│
├── validators/
├── filters/
├── sorters/
├── helpers/
├── ui/
├── config/
├── tests/
├── package.json
├── index.js
├── README.md
└── LICENSE
```

---

# 📁 Folder Responsibilities

| Folder        | Purpose                     |
| ------------- | --------------------------- |
| `commands/`   | CLI command implementations |
| `database/`   | SQLite database access      |
| `services/`   | Business logic              |
| `validators/` | Input validation            |
| `filters/`    | Search & filtering          |
| `sorters/`    | Sorting algorithms          |
| `helpers/`    | Shared helper functions     |
| `ui/`         | Console formatting          |
| `config/`     | Default configuration       |
| `tests/`      | Automated testing           |

---

# ⚙ Technology Stack

| Technology   | Purpose                |
| ------------ | ---------------------- |
| Node.js      | JavaScript runtime     |
| Commander.js | Command-line interface |
| SQLite       | Local database         |
| sqlite3      | SQLite driver          |
| Jest         | Automated testing      |
| Chalk        | Terminal colors        |
| cli-table3   | Beautiful CLI tables   |
| Prompt Sync  | Interactive prompts    |
| bcrypt       | Security features      |
| Git          | Version control        |
| GitHub       | Source code hosting    |
| npm          | Package distribution   |

---

# 🧠 Design Principles

This project follows several software engineering principles to ensure scalability and maintainability.

## Separation of Concerns

Every module has one responsibility.

Examples:

- Commands execute CLI actions.
- Services contain business logic.
- Repositories communicate with SQLite.
- Validators verify user input.

---

## Layered Architecture

Instead of writing all logic inside commands, the application is divided into multiple layers.

Benefits:

- Easier testing
- Better code organization
- Reusable logic
- Easier debugging
- Simpler maintenance

---

## Repository Pattern

All database operations are isolated inside repository modules.

Instead of:

```
Command
    ↓
SQLite
```

The application uses:

```
Command
    ↓
Service
    ↓
Repository
    ↓
SQLite
```

Advantages:

- Database-independent business logic
- Easier future migrations
- Cleaner codebase

---

## Service Layer

The Service Layer contains all application logic.

Examples include:

- Creating notes
- Completing notes
- Searching
- Statistics generation
- Productivity reports
- Import & export
- Backup management

This keeps command files small and focused.

---

# 🗄 Database

Notes Manager CLI uses **SQLite** as its storage engine.

Benefits include:

- Lightweight
- Fast
- Serverless
- Reliable
- Cross-platform
- No installation required

All data is stored locally on your machine.

---

# 📊 Database Features

The application stores:

- Notes
- Categories
- Tags
- Priority levels
- Due dates
- Recurring schedules
- Favorites
- Pin status
- Lock status
- History logs
- Configuration
- Backup information

---

# 🔒 Security

Several features improve data safety.

Supported features include:

- Password hashing with bcrypt
- Locked notes
- Confirmation prompts before destructive operations
- Backup system
- Undo support
- Restore functionality

---

# 📈 Performance

The application is optimized for fast execution.

Performance characteristics:

- Fast startup
- SQLite indexing
- Lightweight architecture
- Efficient searching
- Minimal memory usage

Even large note collections remain responsive.

---

# 🧪 Code Quality

The project emphasizes maintainable, production-ready code.

Practices include:

- Modular structure
- Reusable functions
- Clear naming conventions
- Input validation
- Error handling
- Automated testing
- Consistent formatting

---

# 🔄 Development Workflow

Development follows a structured workflow.

```text
Feature Idea
      │
      ▼
Implementation
      │
      ▼
Testing
      │
      ▼
Linting
      │
      ▼
Formatting
      │
      ▼
Git Commit
      │
      ▼
GitHub Push
      │
      ▼
npm Publish
```

---

# 📦 Release Process

Each release follows semantic versioning.

Example:

```
1.0.0
│ │ │
│ │ └── Patch
│ └──── Minor
└────── Major
```

Releases are published through npm and tracked with Git.

---

# 🚀 Continuous Integration

The project includes automated quality checks.

Current pipeline includes:

- Code formatting
- Linting
- Automated tests
- Build verification

Every push helps ensure the codebase remains stable and production-ready.

---

# 🧪 Testing & Quality Assurance

Maintaining reliability is a key goal of Notes Manager CLI.

The project uses **Jest** for automated testing to ensure that new features do not break existing functionality.

Current testing includes:

- ✅ CRUD Operations
- ✅ Search
- ✅ Categories
- ✅ Favorites
- ✅ Pinning
- ✅ Locking
- ✅ Import & Export
- ✅ Backup & Restore
- ✅ Statistics
- ✅ Productivity Commands
- ✅ Validation
- ✅ Repository Layer
- ✅ Service Layer

---

# ▶ Running Tests

Run the complete test suite:

```bash
npm test
```

Run tests with coverage:

```bash
npm test -- --coverage
```

Run a specific test:

```bash
npm test -- add.test.js
```

---

# 📊 Project Statistics

| Metric             | Value    |
| ------------------ | -------- |
| CLI Commands       | 35+      |
| Major Features     | 20+      |
| Service Modules    | 10+      |
| Repository Modules | 5+       |
| Validators         | Multiple |
| Tests              | 117+     |
| Database           | SQLite   |
| License            | MIT      |
| Package Manager    | npm      |

---

# 🧹 Code Quality

The project follows professional coding standards.

Quality tools include:

- ESLint
- Prettier
- Husky
- GitHub Actions
- Jest

Run ESLint:

```bash
npm run lint
```

Automatically fix problems:

```bash
npm run lint:fix
```

Format the project:

```bash
npm run format
```

---

# 🚀 CI/CD

GitHub Actions automatically checks every push and pull request.

The workflow verifies:

- Install dependencies
- Run tests
- Check formatting
- Verify project integrity

This helps maintain a stable and production-ready codebase.

---

# 📦 npm Package

Notes Manager CLI is available on npm.

Install globally:

```bash
npm install -g notes-manager-cli
```

Update to the latest version:

```bash
npm update -g notes-manager-cli
```

Check installed version:

```bash
notes --version
```

---

# 🤝 Contributing

Contributions are welcome!

Whether you're fixing bugs, improving documentation, or adding features, your help is appreciated.

## Development Setup

Clone the repository:

```bash
git clone https://github.com/Rudra070707/notes-manager-cli.git
```

Move into the project:

```bash
cd notes-manager-cli
```

Install dependencies:

```bash
npm install
```

Run tests:

```bash
npm test
```

Create a new feature branch:

```bash
git checkout -b feature/my-feature
```

After making your changes:

```bash
git add .

git commit -m "feat: add amazing feature"

git push origin feature/my-feature
```

Finally, open a Pull Request on GitHub.

---

# 📜 Contribution Guidelines

Please follow these guidelines:

- Write clean code
- Follow existing coding style
- Keep commits meaningful
- Add tests for new features
- Update documentation when necessary
- Ensure all tests pass before submitting

---

# 🛣 Roadmap

## ✅ Completed

- CRUD Operations
- SQLite Integration
- Categories
- Favorites
- Pin Notes
- Lock Notes
- Due Dates
- Recurring Notes
- Statistics Dashboard
- Productivity Report
- Advanced Search
- Import
- Export
- Backup
- Restore
- Undo
- History
- Doctor Command
- Configuration System
- npm Publishing
- GitHub Actions CI
- Automated Testing

---

## 🚀 Planned Features

The following improvements are planned for future releases.

### v1.1

- Shell Autocomplete
- Improved Search Filters
- Better CLI Output
- Enhanced History
- Performance Improvements

---

### v1.2

- Markdown Preview
- Rich Text Export
- Theme Support
- Better Configuration Management

---

### v2.0

- Interactive Terminal UI (TUI)
- Plugin System
- Cloud Synchronization
- End-to-End Encryption
- Multi-Profile Support
- Workspace Management

---

# ❓ Frequently Asked Questions

## Is Notes Manager CLI free?

Yes.

It is completely free and open-source under the MIT License.

---

## Does it require an internet connection?

No.

Everything works locally.

---

## Does it use a cloud database?

No.

It uses SQLite stored on your local machine.

---

## Is my data private?

Yes.

Your notes remain on your own computer unless you explicitly export or share them.

---

## Can I back up my notes?

Absolutely.

```bash
notes backup
```

Restore them later:

```bash
notes restore-db <backup-file>
```

---

## Can I import existing notes?

Yes.

```bash
notes import json notes.json
```

---

## Can I export my notes?

Yes.

Supported formats:

- JSON
- CSV
- Markdown

Example:

```bash
notes export json
```

---

# 🐛 Troubleshooting

## Command not found

If `notes` is not recognized:

1. Verify Node.js is installed.
2. Reinstall globally.

```bash
npm install -g notes-manager-cli
```

---

## Wrong Version

Update to the latest version.

```bash
npm install -g notes-manager-cli@latest
```

Verify:

```bash
notes --version
```

---

## Dependency Problems

Delete dependencies:

```bash
rm -rf node_modules
```

Install again:

```bash
npm install
```

---

## Database Problems

Run diagnostics:

```bash
notes doctor
```

If necessary, restore from backup.

---

# 💡 Best Practices

To get the most out of Notes Manager CLI:

- Use categories to organize projects.
- Add priorities to important tasks.
- Use due dates for deadlines.
- Create regular backups.
- Review statistics regularly.
- Use history to track activity.
- Keep the application updated.

---

# ❤️ Acknowledgements

This project is made possible by the excellent open-source ecosystem, including:

- Node.js
- Commander.js
- SQLite
- Jest
- Chalk
- cli-table3
- GitHub
- npm

---

# 📄 License

This project is licensed under the **MIT License**.

The MIT License is a permissive open-source license that allows anyone to:

- ✅ Use the software commercially
- ✅ Modify the source code
- ✅ Distribute copies
- ✅ Use it privately
- ✅ Publish modified versions

See the **LICENSE** file for the complete license text.

---

# 🔖 Versioning

This project follows **Semantic Versioning (SemVer)**.

```
MAJOR.MINOR.PATCH
```

Example:

```
1.0.2
│ │ │
│ │ └── Bug fixes
│ └──── New features (backward compatible)
└────── Breaking changes
```

Examples:

| Version | Meaning         |
| ------- | --------------- |
| 1.0.0   | Initial Release |
| 1.0.1   | Bug Fix         |
| 1.0.2   | Patch Update    |
| 1.1.0   | New Features    |
| 2.0.0   | Major Changes   |

---

# 🌍 Compatibility

Notes Manager CLI is designed to work across multiple operating systems.

| Platform | Supported |
| -------- | --------- |
| Windows  | ✅        |
| Linux    | ✅        |
| macOS    | ✅        |

Requirements:

- Node.js 20+
- npm

---

# 📦 Dependencies

Major dependencies used by the project:

- Commander.js
- SQLite3
- Chalk
- cli-table3
- Prompt Sync
- bcrypt
- Jest

All dependencies are managed using **npm**.

---

# 📚 Learning Objectives

This project demonstrates practical software engineering concepts including:

- Command-Line Interface (CLI) Development
- Node.js Application Development
- SQLite Database Integration
- Repository Pattern
- Service Layer Architecture
- Modular Programming
- Input Validation
- Error Handling
- Unit Testing
- Git Version Control
- GitHub Workflow
- npm Package Publishing
- Software Documentation
- Semantic Versioning

It serves as a strong portfolio project for students and developers looking to showcase backend development skills.

---

# 🎯 Who Should Use This?

Notes Manager CLI is suitable for:

- 👨‍💻 Software Developers
- 🎓 Students
- 📚 Self-Learners
- 💼 Professionals
- 📋 Project Managers
- 🧑‍💼 Freelancers
- 🚀 Open Source Contributors
- 🧠 Productivity Enthusiasts

Whether you're managing personal notes, project tasks, study material, or daily reminders, Notes Manager CLI provides a fast and reliable workflow directly from your terminal.

---

# 💬 Feedback

Found a bug?

Have a feature request?

Want to improve the project?

Please open an issue on GitHub describing:

- The problem
- Steps to reproduce
- Expected behavior
- Actual behavior
- Your operating system
- Node.js version

Constructive feedback is always welcome.

---

# ⭐ Support the Project

If you find this project useful, consider supporting it by:

⭐ Starring the GitHub repository

🍴 Forking the project

🐛 Reporting bugs

💡 Suggesting new features

📢 Sharing it with others

Every contribution helps improve the project.

---

# 👨‍💻 Author

## Rudra Bandekar

Computer Engineering Student • Backend Developer • Open Source Enthusiast

### GitHub

https://github.com/Rudra070707

### npm

https://www.npmjs.com/~rudrabandekar

---

# 📬 Connect

If you'd like to discuss the project, suggest improvements, or collaborate on future development, feel free to reach out through GitHub.

Contributions, feedback, and ideas are always appreciated.

---

# 🚀 Future Vision

The goal of Notes Manager CLI is to evolve into a comprehensive command-line productivity suite.

Future releases aim to include:

- Interactive Terminal UI (TUI)
- Plugin Ecosystem
- Workspace Support
- AI-powered Smart Search
- Markdown Rendering
- Shell Autocomplete
- Cloud Synchronization
- Encryption Enhancements
- Cross-device Synchronization
- Advanced Analytics

The project will continue to focus on simplicity, performance, and developer productivity.

---

# 🙏 Acknowledgements

Special thanks to the creators and maintainers of the open-source technologies that made this project possible.

- Node.js
- Commander.js
- SQLite
- Jest
- Chalk
- cli-table3
- Git
- GitHub
- npm

Their work enables developers around the world to build amazing software.

---

# ⭐ If You Like This Project...

Please consider giving the repository a **Star ⭐** on GitHub.

It helps the project gain visibility and encourages future development.

---

<p align="center">

## 📝 Notes Manager CLI

**Professional • Fast • Reliable • Open Source**

Made with ❤️ using **Node.js**, **Commander.js**, and **SQLite**

© 2026 Rudra Bandekar. All Rights Reserved.

</p>
