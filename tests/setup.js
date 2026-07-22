const db = require("../database/database");

beforeEach((done) => {
  db.run("DELETE FROM notes", done);
});
