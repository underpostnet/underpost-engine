import gifFrames from 'gif-frames';
import fs from 'fs';
import { getAllFiles, deleteFolderRecursive } from '../src/files.js';
const pathSrcSprites = './src/assets/sprites';

if (fs.existsSync(`${pathSrcSprites}`)) deleteFolderRecursive(`${pathSrcSprites}`);

const paths = getAllFiles('./private-engine/express-ywork/cyberia/assets/clases').map(
  (path) => './' + path.replaceAll('\\', '/')
);

console.log(paths);
const namesDir = ['08', '06', '04', '02', '18', '16', '14', '12'];
paths.map((path) => {
  gifFrames({ url: path, frames: 'all', outputType: 'png' }).then(function (frameData) {
    const nameSprite = path.slice(0, -7).split('/').pop();
    const typeSprite = path.split('/').pop().split('.')[0];
    if (!namesDir.includes(typeSprite)) return;

    if (!fs.existsSync(`${pathSrcSprites}/${nameSprite}`)) {
      namesDir.map((dir) => {
        fs.mkdirSync(`${pathSrcSprites}/${nameSprite}/${dir}`, { recursive: true });
      });
    }

    console.log('load nameSprite', nameSprite, typeSprite);

    frameData.map((fd, i) => {
      fd.getImage().pipe(fs.createWriteStream(`${pathSrcSprites}/${nameSprite}/${typeSprite}/${i}.png`));
    });
  });
});
