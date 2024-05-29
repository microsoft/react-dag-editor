// eslint-disable-next-line import/no-extraneous-dependencies,@typescript-eslint/no-require-imports,@typescript-eslint/no-var-requires
const { paramCase } = require("param-case");

// eslint-disable-next-line no-undef
const dummy = new Proxy(
  {},
  {
    get(target, prop) {
      if (prop === "default") {
        return dummy;
      }
      return paramCase(prop);
    },
  },
);

module.exports = dummy;
