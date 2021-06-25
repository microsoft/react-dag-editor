const path = require("path");
const execa = require("execa");
const fs = require('fs').promises;
const fse = require('fs-extra');

const enginePath = path.resolve(__dirname, "../packages/ReactDagEditor");
const demoSrc = path.join(enginePath, '.static-demo');
const demoDist = path.resolve(__dirname, '../docs');
const gitIgnorePath = path.resolve(__dirname, '../.gitignore');

async function buildDemo() {
  console.log('Build started.');
  await execa(`yarn --cwd ${enginePath} build:demo`, [], { stdio: "inherit", shell: true });
  console.log('Build done.');
}

async function copyDocs() {
  console.log('Copy started.');
  await fse.ensureDir(demoDist);
  await fse.copy(demoSrc, demoDist);
  console.log('Copy done.');
}

async function rewriteGitIgnore() {
  console.log('Rewrite gitignore started.');
  const gitIgnore = await fs.readFile(gitIgnorePath);
  const gitIgnoreContent = gitIgnore.toString();
  const lines = gitIgnoreContent.split(/\r?\n/);
  const newGitIgnoreContent = lines.filter(x => x.trim() !== 'docs/').join('\n');
  await fs.writeFile(gitIgnorePath, newGitIgnoreContent)
  console.log('Rewrite gitignore done.');
}

async function main () {
  await buildDemo();
  await copyDocs();
  await rewriteGitIgnore();
}

main().then(() => {
  console.log('All done.');
});