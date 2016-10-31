const cp = require('child_process');
const p = require('path');
const fs = require('fs');
const _ = require('lodash');

const nodeModules = p.join(process.cwd(), 'node_modules');
const bin = p.join(nodeModules, '.bin');

function createBinFolder() {
  cp.execSync(`mkdir ${bin} || true`);
}

function findAllPackageJsonsFiles() {
  const found = String(cp.execSync(`find ${nodeModules} -type f -name 'package.json'`));
  return _.split(found, '\n');
}

function linkExecutables(packageJsonsFiles) {
  _.forEach(packageJsonsFiles, (pkgFile) => {
    if (fs.existsSync(pkgFile)) {
      const pkg = JSON.parse(fs.readFileSync(pkgFile));
      linkExecutablesFromPackage(pkgFile, pkg);
    }
  });
}

function linkExecutablesFromPackage(pkgJsonFile, pkg) {
  _.forEach(pkg.bin, (pth, name) => {
    if (!_.isString(name)) {
      return;
    }

    const src = p.join(bin, name);
    const dst = p.resolve(p.dirname(pkgJsonFile), pth);
    if (!fs.existsSync(src)) {
      cp.execSync(`ln -s ${dst} ${src} || true`, {stdio: [0, 1, 'ignore']});
    }
  });
}

function run() {
  createBinFolder();
  const packageJsonsFiles = findAllPackageJsonsFiles();
  linkExecutables(packageJsonsFiles);
}

run();
