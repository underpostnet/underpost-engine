import fs from 'fs';
import { newInstance } from '../src/common.js';
import { deleteFolderRecursive } from '../src/files.js';

const toDir = '';
const fromDir = '';
const baseSplit = 'modified:   ';

deleteFolderRecursive(toDir);

const data = ` `
  .split('\n')
  .map(
    (x) => (baseDir) =>
      baseDir + '/' + (x.trim().split(baseSplit)[1] ? x.trim().split(baseSplit)[1] : x.trim().split(baseSplit)[0])
  );

data.map((x) => {
  let folder = newInstance(x(toDir)).split('/');
  folder.pop();
  folder = folder.join('/');
  console.log(folder, '|', x(fromDir), '->', x(toDir));
  if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });
  if (x(toDir).split('/').pop() === '') return;
  fs.copyFileSync(x(fromDir), x(toDir));
});
