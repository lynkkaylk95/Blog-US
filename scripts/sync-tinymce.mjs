import { cp, mkdir, realpath, rm } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const source = await realpath(resolve(root, "node_modules", "tinymce"));
const target = resolve(root, "public", "tinymce");

await mkdir(resolve(root, "public"), { recursive: true });
await rm(target, { recursive: true, force: true });
await cp(source, target, {
  recursive: true,
  filter: (path) => {
    if (/([\\/])(README\.md|CHANGELOG\.md|LICENSE\.TXT|package\.json)$/i.test(path)) return false;
    if (/\.(js|css)$/i.test(path)) return /\.min\.(js|css)$/i.test(path);
    return true;
  },
});
console.log("TinyMCE self-hosted assets synced to public/tinymce.");
