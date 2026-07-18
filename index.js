const fs = require("fs");

// Read file as text
const data = fs.readFileSync("./notes/notes.json", "utf8");

// Convert JSON text to a JavaScript array
const notes = JSON.parse(data);

// Display the array
console.log(notes);

// Display the first note
console.log(notes[0]);

// Display the total number of notes
console.log("Total Notes:", notes.length);