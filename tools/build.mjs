import { cp, mkdir, rm } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const output = new URL('dist/', root);
// Publish only runtime files; repository docs and local tools stay out of Pages.
const files = [
  'index.html', 'favicon.svg', '_headers',
  'app.js', 'styles.css', 'footer.css', 'footer-scene.js',
  'interpretation.css', 'interpretation.js',
  'page-transition.css', 'page-transition.js',
  'assets', 'icons', 'heroes'
];

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
for (const file of files) {
  await cp(new URL(file, root), new URL(file, output), {
    recursive: true,
    filter: path => !path.split(/[\\/]/).some(part => part.startsWith('.'))
  });
}
console.log('Site pronto em dist/');
