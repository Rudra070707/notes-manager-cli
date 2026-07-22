const prompts = require("prompts");

async function confirm(message) {
  const response = await prompts({
    type: "confirm",
    name: "value",
    message,
    initial: false,
  });

  return response.value;
}

module.exports = {
  confirm,
};
