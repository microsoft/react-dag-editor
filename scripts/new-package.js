const yeoman = require("yeoman-environment");
const env = yeoman.createEnv();

(async () => {
  await env.lookup();

  await env.run("designerux:component");
})();
