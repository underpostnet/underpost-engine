window.pathfinding = PF;
const finder = new pathfinding.AStarFinder({
  allowDiagonal, // enable diagonal
  dontCrossCorners, // corner of a solid
  heuristic: pathfinding.Heuristic.chebyshev,
});

// get joystick direction from eight direction
// through  x1,y1, to x2, y2 cartesian coordinate in javascript

function getJoystickDirection(x1, y1, x2, y2) {
  // Calculate the angle in radians
  const angle = Math.atan2(y2 - y1, x2 - x1);

  // Convert the angle to degrees
  let degrees = angle * (180 / Math.PI);

  // Adjust the angle to be positive
  if (degrees < 0) {
    degrees += 360;
  }

  // Map the angle to one of the eight directions
  let direction;
  if (degrees >= 337.5 || degrees < 22.5) {
    // direction = 'right';
    direction = 'East';
  } else if (degrees >= 22.5 && degrees < 67.5) {
    // direction = 'up-right';
    direction = 'South East';
  } else if (degrees >= 67.5 && degrees < 112.5) {
    // direction = 'up';
    direction = 'South';
  } else if (degrees >= 112.5 && degrees < 157.5) {
    // direction = 'up-left';
    direction = 'South West';
  } else if (degrees >= 157.5 && degrees < 202.5) {
    // direction = 'left';
    direction = 'West';
  } else if (degrees >= 202.5 && degrees < 247.5) {
    // direction = 'down-left';
    direction = 'North West';
  } else if (degrees >= 247.5 && degrees < 292.5) {
    // direction = 'down';
    direction = 'North';
  } else if (degrees >= 292.5 && degrees < 337.5) {
    // direction = 'down-right';
    direction = 'North East';
  }

  console.error(direction);

  return direction;
}

let currenTimeEffect = 0;
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
      const newTimeEffect = +new Date();
      let validateEffect = false;
      if (newTimeEffect - currenTimeEffect <= 500) {
        validateEffect = true;
        // getDirection(element.render.x, element.render.y, x2, y2).direction;
        element.direction = getJoystickDirection(element.render.x, element.render.y, x2, y2);
        effect(element);
        renderPixiEventElement(element);
      }
      currenTimeEffect = newTimeEffect;
      console.log('validateEffect', validateEffect);
      if (validateEffect) return;
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
