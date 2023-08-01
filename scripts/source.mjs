import * as fs from 'node:fs';
import archiver from "archiver";

const dirName = "source";
const archiveName = "source.zip";

if (fs.existsSync(dirName)) {
  fs.rmSync(dirName, { recursive: true });
}
if (fs.existsSync(archiveName)) {
  fs.rmSync(archiveName);
}

fs.mkdirSync(dirName);

fs.cpSync("src", `${dirName}/src`, { recursive: true });
fs.cpSync("assets", `${dirName}/assets`, { recursive: true });
fs.cpSync("static_ff", `${dirName}/static_ff`, { recursive: true });

fs.copyFileSync("LICENSE.md", `${dirName}/LICENSE.md`);
fs.copyFileSync("package.json", `${dirName}/package.json`);
fs.copyFileSync("pnpm-lock.yaml", `${dirName}/pnpm-lock.yaml`);
fs.copyFileSync("README.md", `${dirName}/README.md`);
fs.copyFileSync("rollup.config.firefox.mjs", `${dirName}/rollup.config.firefox.mjs`);

const output = fs.createWriteStream(archiveName);
const archive = archiver('zip', {
  zlib: { level: 9 }
});

output.on('close', function () {
  console.info(archive.pointer() + ' total bytes');
  console.info('archive with sources is ready');
  fs.rmSync("source", { recursive: true });
});

archive.on('error', function (err) {
  throw err;
});

archive.pipe(output);

archive.directory(dirName, false);
archive.finalize();