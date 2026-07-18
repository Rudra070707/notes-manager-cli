const args = process.argv.slice(2);

const operation = args[0];
const a = Number(args[1]);
const b = Number(args[2]);

let result;

switch (operation) {
  case "add":
    result = a + b;
    break;

  case "sub":
    result = a - b;
    break;

  case "mul":
    result = a * b;
    break;

  case "div":
    result = a / b;
    break;

  default:
    console.log("Usage:");
    console.log("node index.js add 10 20");
    process.exit();
}

console.log("Result =", result);