const fs = require("fs");

// Get command-line arguments
const args = process.argv.slice(2);

const command = args[0];
const note = args[1];

// Read notes
const data = fs.readFileSync("./notes/notes.json", "utf8");
const notes = JSON.parse(data);

switch (command) {
  case "add":
    notes.push(note);

    fs.writeFileSync(
      "./notes/notes.json",
      JSON.stringify(notes, null, 2)
    );

    console.log("✅ Note added successfully!");
    break;

  case "list":
    console.log("\n📒 Notes:");

    notes.forEach((item, index) => {
      console.log(`${index + 1}. ${item}`);
    });

    break;

  default:
    console.log("Usage:");
    console.log('node index.js add "Your Note"');
    console.log("node index.js list");
}