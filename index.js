#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { Command } = require("commander");

const program = new Command();

// Function templates for supported languages
const templates = {
  javascript: (name, params) =>
    `function ${name}(${params}) {\n    // Your code here\n}\n\nmodule.exports = ${name};\n`,
  python: (name, params) =>
    `def ${name}(${params}):\n    # Your code here\n    pass\n`,
};

program
  .name("code-cli")
  .description("CLI to generate boilerplate code for functions")
  .version("1.0.0")
  .requiredOption("-n, --name <name>", "Name of the function")
  .requiredOption(
    "-l, --language <language>",
    "Programming language (e.g., javascript, python)"
  )
  .requiredOption(
    "-i, --inputs <inputs>",
    "Comma-separated function parameters (e.g., a,b)"
  )
  .action((options) => {
    const { name, language, inputs } = options;

    if (!templates[language]) {
      console.error(`Unsupported language: ${language}`);
      process.exit(1);
    }

    const params = inputs.split(",");
    const content = templates[language](name, params.join(", "));
    const fileExtension = language === "javascript" ? "js" : "py";
    const fileName = `${name}.${fileExtension}`;
    const filePath = path.join(process.cwd(), fileName);

    fs.writeFile(filePath, content, (err) => {
      if (err) {
        console.error("Error writing file:", err);
        process.exit(1);
      }
      console.log(`File created: ${fileName}`);
    });
  });

program.parse(process.argv);
