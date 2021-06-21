const path = require("path");
const execa = require("execa");
const glob = require("glob").sync;
const fs = require('fs').promises;
const fsSync = require('fs');

const enginePath = path.resolve(__dirname, "../packages/ReactDagEditor");
const demoSrc = path.join(enginePath, '.static-demo');
const demoDist = path.resolve(__dirname, '../docs');
const gitIgnorePath = path.resolve(__dirname, '../.gitignore');

async function buildDemo() {
  console.log('Build start');
  // await execa(`yarn --cwd ${enginePath} build:demo`, [], { stdio: "inherit", shell: true });
  console.log('Build done');
}

async function copyDocs() {
  console.log('Copy start');
  if (!fsSync.existsSync(demoDist)) {
    await fs.mkdir(demoDist);
  }

  const files = glob(`${demoSrc}/*`);
  for (const file of files) {
    await fs.copyFile(file, path.join(demoDist, path.basename(file)));
  }
  console.log('Copy done');
}

async function rewriteGitIgnore() {
  console.log('Rewrite gitignore start');
  const gitIgnore = await fs.readFile(gitIgnorePath);
  const gitIgnoreContent = gitIgnore.toString();
  const lines = gitIgnoreContent.split(/\r?\n/);
  const newGitIgnoreContent = lines.filter(x => x.trim() !== 'docs/').join('\n');
  await fs.writeFile(gitIgnorePath, newGitIgnoreContent)
  console.log('Rewrite gitignore done');
}

async function main () {
  await buildDemo();
  await copyDocs();
  await rewriteGitIgnore();
}

main();