const {
  importJson,
  importCsv,
  importMarkdown,
} = require("../services/importService");

function handleImportCommand(format, file) {
  if (!format || !file) {
    console.log("\nUsage:");
    console.log("notes import json <file>");
    console.log("notes import csv <file>");
    console.log("notes import md <file>");
    return;
  }

  switch (format.toLowerCase()) {
    case "json":
      importJson(file);
      break;

    case "csv":
      importCsv(file);
      break;

    case "md":
    case "markdown":
      importMarkdown(file);
      break;

    default:
      console.log("Unsupported import format.");
  }
}

module.exports = handleImportCommand;
