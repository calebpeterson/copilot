import chalk from "chalk-template";

const indent = (text) =>
  text
    .split("\n")
    .map((line) => "  " + line)
    .join("\n");

export const logSpecification = (specification) => {
  console.log();
  console.log(chalk`{underline {white Specification}}\n`);
  console.log(indent(specification));
};

export const logFileIntents = (fileIntents) => {
  fileIntents.forEach(({ filename, content }) => {
    console.log();
    console.log(chalk`{underline {white ${filename}}}\n`);
    console.log(indent(content));
  });

  // Extra empty line
  console.log();
};

export const logRefactorIntent = (refactorIntent) => {
  console.log();
  console.log(chalk`{underline {white Refactoring}}\n`);
  console.log(indent(refactorIntent.content));
};

export const logError = (error) => {
  console.error(chalk`{underline {red Encountered an error}}\n`);
  console.error(chalk`{red ${indent(error.stack)}}\n`);
};
