# 📝 Notes Manager CLI

> A professional, feature-rich command-line Notes Manager built with **Node.js**, **Commander.js**, and **SQLite**.

![Node.js](https://img.shields.io/badge/Node.js-20+-green?logo=node.js)
![SQLite](https://img.shields.io/badge/Database-SQLite-blue)
![Commander.js](https://img.shields.io/badge/CLI-Commander.js-orange)
![Jest](https://img.shields.io/badge/Tested_with-Jest-red)
![License](https://img.shields.io/badge/License-MIT-yellow)

---

## 📖 Overview

Notes Manager CLI is a modern command-line application that allows you to manage notes directly from the terminal.

Unlike a simple CRUD application, this project includes productivity tools, history tracking, favorites, categories, recurring notes, backups, import/export, reporting, statistics, and many additional features while maintaining a clean modular architecture.

This project demonstrates professional backend development practices including:

- Modular Architecture
- Repository Pattern
- Service Layer
- SQLite Database
- Command Line Interfaces (CLI)
- Input Validation
- Automated Testing
- Git Version Control

---

## 🎬 Demo

```bash
> node index.js list

┌────┬──────────────────────┬──────────┬──────────┐
│ ID │ Note                 │ Priority │ Status   │
├────┼──────────────────────┼──────────┼──────────┤
│ 1  │ Learn Node.js        │ HIGH     │ Pending  │
│ 2  │ Build REST API       │ MEDIUM   │ Done     │
└────┴──────────────────────┴──────────┴──────────┘
```

---

## 📊 Project Statistics

- 🚀 30+ CLI Commands
- 📦 15+ Major Features
- 🗄 SQLite Database
- 🧪 Jest Test Suite
- 🏗 Layered Architecture
- 📁 Modular Project Structure

---

## ✨ Features

### ✅ Core Features

- Create Notes
- Update Notes
- Delete Notes
- List Notes
- Complete / Uncomplete Notes
- Archive / Restore Notes
- Trash Management

### 📂 Organization

- Favorites
- Pin Notes
- Lock Notes
- Categories
- Tags
- Priority Levels
- Due Dates
- Recurring Notes

### 📈 Productivity

- Today
- Upcoming
- Overdue
- Next Task
- Recent Notes
- Statistics Dashboard
- Productivity Report

### 🔍 Search & Filtering

- Advanced Search
- Multi-field Filtering
- Sorting
- Category Filtering

### 💾 Data Management

- Backup
- Restore
- Import
- Export
- Undo
- History

### 🛠 Developer Features

- Doctor Command
- Configuration
- Logging
- Jest Tests
- SQLite Database
- Modular Architecture

---

## 🚀 Installation

### Prerequisites

- Node.js **20+**
- npm
- Git

### Clone Repository

```bash
git clone https://github.com/Rudra070707/notes-manager-cli.git
```

```bash
cd notes-manager-cli
```

### Install Dependencies

```bash
npm install
```

### Run the Application

```bash
node index.js --help
```

---

## ⚡ Quick Start

Create your first note

```bash
node index.js add "Learn Node.js"
```

List notes

```bash
node index.js list
```

Complete a note

```bash
node index.js complete 1
```

View statistics

```bash
node index.js stats
```

Generate report

```bash
node index.js report
```

Run diagnostics

```bash
node index.js doctor
```

---

## 📸 Screenshots

Screenshots will be added in future releases showcasing:

- Dashboard
- Statistics
- Productivity Report
- Search
- Doctor Command
- History
- Categories
- Favorites

---

## 📂 Project Structure

```text
notes-manager-cli/
│
├── commands/
├── database/
├── services/
├── validators/
├── filters/
├── sorters/
├── ui/
├── tests/
├── data/
│
├── index.js
├── package.json
└── README.md
```

Project contains:

- 35+ command files
- 10+ service modules
- SQLite persistence
- Automated testing
- Modular architecture

---

## 🛠 Tech Stack

| Technology       | Purpose              |
| ---------------- | -------------------- |
| Node.js          | Runtime              |
| Commander.js     | CLI Framework        |
| SQLite           | Database             |
| Jest             | Testing              |
| JavaScript (ES6) | Programming Language |
| Git              | Version Control      |
| GitHub           | Repository Hosting   |

---

## 📚 Command Reference

### Notes

| Command                | Description       |
| ---------------------- | ----------------- |
| `add "<note>"`         | Create a new note |
| `list`                 | Display all notes |
| `update <id> "<note>"` | Update a note     |
| `delete <id>`          | Delete a note     |

### Status

| Command           | Description              |
| ----------------- | ------------------------ |
| `complete <id>`   | Mark a note as completed |
| `uncomplete <id>` | Mark a note as pending   |
| `archive <id>`    | Archive a note           |
| `restore <id>`    | Restore an archived note |
| `trash`           | View trashed notes       |
| `undo`            | Undo the previous action |

### Organization

| Command           | Description         |
| ----------------- | ------------------- |
| `pin <id>`        | Pin a note          |
| `unpin <id>`      | Remove pin          |
| `favorite <id>`   | Mark as favorite    |
| `unfavorite <id>` | Remove favorite     |
| `favorites`       | View favorite notes |
| `lock <id>`       | Lock a note         |
| `unlock <id>`     | Unlock a note       |

### Productivity

| Command    | Description                  |
| ---------- | ---------------------------- |
| `today`    | Show today's tasks           |
| `upcoming` | Show upcoming tasks          |
| `overdue`  | Show overdue tasks           |
| `recent`   | Show recent notes            |
| `next`     | Show next priority task      |
| `stats`    | Display statistics           |
| `report`   | Generate productivity report |

### Data

| Command          | Description          |
| ---------------- | -------------------- |
| `backup`         | Create backup        |
| `restore-backup` | Restore backup       |
| `import`         | Import notes         |
| `export`         | Export notes         |
| `history`        | View history         |
| `doctor`         | Run diagnostics      |
| `config`         | Manage configuration |

---

## 🏗 Architecture

The project follows a layered architecture.

```text
          User
            │
            ▼
     Commander CLI
            │
            ▼
        Commands
            │
            ▼
         Services
            │
            ▼
        Repository
            │
            ▼
      SQLite Database
```

### Directory Responsibilities

| Directory     | Responsibility              |
| ------------- | --------------------------- |
| `commands/`   | CLI command implementations |
| `services/`   | Business logic              |
| `database/`   | SQLite access layer         |
| `validators/` | Input validation            |
| `filters/`    | Searching and filtering     |
| `sorters/`    | Sorting logic               |
| `ui/`         | Console formatting          |
| `tests/`      | Automated tests             |

---

## 🧪 Testing

Run all tests:

```bash
npm test
```

Run tests with coverage:

```bash
npm test -- --coverage
```

The project uses **Jest** for automated testing.

---

## 🗺 Roadmap

### ✅ Completed

- CRUD Operations
- SQLite Database
- Categories
- Favorites
- Pin Notes
- Lock Notes
- Advanced Search
- Import / Export
- Backup / Restore
- Statistics Dashboard
- Productivity Report
- Doctor Command

### 🚀 Future Improvements

- GitHub Actions (CI/CD)
- npm Package Publishing
- Expanded Test Coverage
- Interactive Shell
- Additional Search Enhancements

---

## 🤝 Contributing

Contributions, suggestions, and bug reports are welcome.

If you'd like to contribute:

1. Fork the repository.
2. Create a feature branch.
3. Commit your changes.
4. Push your branch.
5. Open a Pull Request.

---

## 📄 License

This project is licensed under the **MIT License**.

---

## 👨‍💻 Author

**Rudra Bandekar**

GitHub: [https://github.com/Rudra070707](https://github.com/Rudra070707)

---

⭐ If you found this project useful, consider giving it a **Star** on GitHub.
