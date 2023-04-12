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

export const logError = (error) => {
  console.error(chalk`{underline {orange Encountered an error}}\n`);
  console.error(indent(error.message));
};
