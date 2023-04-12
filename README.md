# Copilot

**My personal software development copilot.**

Designed to play nicely with the [ScriptBox](https://marketplace.visualstudio.com/items?itemName=cubicle6.scriptbox) extension for VSCode.

## ScriptBox scripts

Presumes the following `package.json` is present in your `~/.scriptbox` directory:

```json
{
  "dependencies": {
    "axios": "^1.3.5",
    "dotenv": "^16.0.3",
    "lodash": "^4.17.15",
    "openai": "^3.2.1"
  }
}
```

Presumes the following `.env` file is present in your `~/.scriptbox` directory:

```
COPILOT=http://localhost:1337
```

### Code Generation

```js
require("dotenv").config();

const axios = require("axios");

module.exports = async (selection) => {
  const result = await axios.post(`${process.env.COPILOT}/generate/v2`, {
    specification: selection,
  });

  return result.data;
};
```

#### Usage

1. Create a new empty file (or use an existing one)
2. Specify the code you want your Copilot to generate. For example:

```
a selector named countOfOthersState in a file named 'scratch.txt' that will
- count the items in three other imported selectors.
- the imported selectors are from 'myOtherSelectors.ts'

generate tests in a file named "mytests.tests.txt".
```

3. If the spec **is not** the only content in your file, then select only the specification.
4. Run your **ScriptBox** code generation script.
