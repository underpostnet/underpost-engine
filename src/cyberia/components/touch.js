window.pathfinding = PF;
const finder = new pathfinding.AStarFinder({
  allowDiagonal, // enable diagonal
  dontCrossCorners, // corner of a solid
  heuristic: pathfinding.Heuristic.chebyshev,
});

let currenTimeAttack = 0;
s('touch-layer').onclick = (e, subPath) => {
  // console.log('onClickCanvas', e, subPath);
  let x2 = subPath === undefined ? parseInt(maxRangeMap() * (e.offsetX / dimState().minValue)) : e.offsetX;
  let y2 = subPath === undefined ? parseInt(maxRangeMap() * (e.offsetY / dimState().minValue)) : e.offsetY;

  if (subPath === undefined)
    (() => {
      const type = 'pointer';
      const { color, render } = getParamsType(type);
      const { dim } = render;
      const crossElement = {
        id: id(),
        type,
        color,
        render: {
          x: x2,
          y: y2,
          dim,
        },
      };
      elements[type].push(crossElement);
      renderPixiInitElement(crossElement);
    })();

  const element = elements.user.find((element) => element.id === socket.id);
  if (element) {
    if (subPath === undefined) {
      const newTimeAttack = +new Date();
      let validateAttack = false;
      if (newTimeAttack - currenTimeAttack <= 500) {
        validateAttack = true;
        element.direction = getDirection(element.render.x, element.render.y, x2, y2).direction;
        attack(element);
        renderPixiEventElement(element);
      }
      currenTimeAttack = newTimeAttack;
      console.log('validateAttack', validateAttack);
      if (validateAttack) return;
    }

    if (x2 > maxRangeMap(element.render.dim)) x2 = maxRangeMap(element.render.dim);
    if (y2 > maxRangeMap(element.render.dim)) y2 = maxRangeMap(element.render.dim);
    const x1 = element.render.x;
    const y1 = element.render.y;
    console.log(x1, y1, '->', x2, y2);
    element.path =
      subPath === undefined
        ? finder.findPath(
            x1,
            y1,
            x2,
            y2,
            new pathfinding.Grid(userMatrixCollision.length, userMatrixCollision.length, userMatrixCollision)
          )
        : subPath;
    console.log(element.path);
    if (element.path.length === 0 && subPath === undefined) {
      const dirsArr = {};
      let wArray = [];

      directions.map((dir) => {
        dirsArr[dir] = { x: x2, y: y2 };

        const whileCondition = () =>
          userMatrixCollision[dirsArr[dir].y] &&
          userMatrixCollision[dirsArr[dir].y][dirsArr[dir].x] === 1 &&
          dirsArr[dir].x >= 0 &&
          dirsArr[dir].y >= 0 &&
          dirsArr[dir].x < maxRangeMap() &&
          dirsArr[dir].y < maxRangeMap();

        switch (dir) {
          case 'South East':
            // ↘
            while (whileCondition()) {
              dirsArr[dir].x++;
              dirsArr[dir].y++;
            }
            break;
          case 'East':
            // →
            while (whileCondition()) {
              dirsArr[dir].x++;
            }
            break;
          case 'North East':
            // ↗
            while (whileCondition()) {
              dirsArr[dir].x++;
              dirsArr[dir].y--;
            }
            break;
          case 'South':
            // ↓
            while (whileCondition()) {
              dirsArr[dir].y++;
            }
            break;
          case 'North':
            // ↑
            while (whileCondition()) {
              dirsArr[dir].y--;
            }
            break;
          case 'South West':
            // ↙
            while (whileCondition()) {
              dirsArr[dir].x--;
              dirsArr[dir].y++;
            }
            break;
          case 'West':
            // ←
            while (whileCondition()) {
              dirsArr[dir].x--;
            }
            break;
          case 'North West':
            // ↖
            while (whileCondition()) {
              dirsArr[dir].x--;
              dirsArr[dir].y--;
            }
            break;
        }
        if (userMatrixCollision[dirsArr[dir].y] && userMatrixCollision[dirsArr[dir].y][dirsArr[dir].x] === 0) {
          dirsArr[dir].w = getDistance(x2, y2, dirsArr[dir].x, dirsArr[dir].y);
          dirsArr[dir].path = finder.findPath(
            x1,
            y1,
            dirsArr[dir].x,
            dirsArr[dir].y,
            new pathfinding.Grid(userMatrixCollision.length, userMatrixCollision.length, userMatrixCollision)
          );
          if (dirsArr[dir].path.length > 0) wArray.push(dirsArr[dir]);
        }
      });
      console.log('wArray', wArray);
      if (wArray[0]) {
        const wArrayOrder = orderArrayFromAttrInt(wArray, 'w', 'asc');
        wArray = wArrayOrder.filter((dirObj) => dirObj.w === wArrayOrder[0].w);
        const newPoint = wArray[random(0, wArray.length - 1)];
        console.log('newPoint', newPoint);
        const { x, y, path } = newPoint;
        s('touch-layer').onclick(
          {
            offsetX: x,
            offsetY: y,
          },
          path
        );
      }
    }
  }
};
