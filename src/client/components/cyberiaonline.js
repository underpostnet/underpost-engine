

this.cyberiaonline = {

    init: function () {


        let elements = [];
        const id = () => {
            let _id = 'x' + s4() + s4();
            while (elements.filter(x => x.id === _id).length > 0) {
                _id = 'x' + s4() + s4();
            }
            return _id;
        };
        const containerID = id();
        const minRangeMap = 0;
        const maxRangeMap = 32;
        const pixiAmplitudeFactor = window.innerWidth < (maxRangeMap * 20) ? 10 : 20;
        this.canvasDim = maxRangeMap * pixiAmplitudeFactor;
        const timeIntervalGame = 1;
        const newInstanceBtn = id();




        // ----------------------------------------------------------------
        // ----------------------------------------------------------------

        const validatePosition = (elementClient, attr, fn, elementsCollisions) => {

            let originElementClient = newInstance(elementClient);
            elementClient[attr] = fn(elementClient[attr]);

            // for big dim elements 
            if (elementClient[attr] === minRangeMap)
                elementClient[attr]++;
            if (elementClient[attr] === maxRangeMap)
                elementClient[attr]--;

            if (originElementClient[attr] === minRangeMap)
                originElementClient[attr]++;
            if (originElementClient[attr] === maxRangeMap)
                originElementClient[attr]--;

            if (elementsCollisions) {
                for (element of elements) {
                    if (
                        elementsCollisions.includes(element.type)
                        &&
                        element.id !== elementClient.id
                        &&
                        validateCollision(element, elementClient)
                    ) {
                        return originElementClient[attr];
                    }
                }
            }

            if (elementClient[attr] < (minRangeMap + ((elementClient.dim) / 2))) return originElementClient[attr];
            if (elementClient[attr] > (maxRangeMap - ((elementClient.dim) / 2))) return originElementClient[attr];

            return elementClient[attr];
        };

        const validateCollision = (A, B) => {
            return (
                (A.y - (A.dim / 2)) < (B.y + (B.dim / 2))
                &&
                (A.x + (A.dim / 2)) > (B.x - (B.dim / 2))
                &&
                (A.y + (A.dim / 2)) > (B.y - (B.dim / 2))
                &&
                (A.x - (A.dim / 2)) < (B.x + (B.dim / 2))
            )
        };



        const getAvailablePosition = (elementClient, elementsCollisions) => {

            let x, y, type;

            if (elementsCollisions.x !== undefined && elementsCollisions.y !== undefined) {
                type = 'snail';
                x = parseInt(`${elementsCollisions.x}`);
                y = parseInt(`${elementsCollisions.y}`);
                elementsCollisions = [].concat(elementsCollisions.elementsCollisions);
            } else {
                type = 'random';
                x = random(minRangeMap, maxRangeMap);
                y = random(minRangeMap, maxRangeMap);
            }

            const matrix = range(minRangeMap, maxRangeMap).map(y => {
                return range(minRangeMap, maxRangeMap).map(x => {
                    return elements.filter(element =>
                        elementsCollisions.includes(element.type)
                        &&
                        validateCollision(
                            { x: element.x, y: element.y, dim: element.dim },
                            { x, y, dim: elementClient.dim }
                        )).length > 0
                        || x === maxRangeMap
                        || x === minRangeMap
                        || y === maxRangeMap
                        || y === minRangeMap ? 1 : 0;
                });
            });


            switch (type) {
                case 'random':

                    while (matrix[y][x] === 1) {
                        x = random(minRangeMap, maxRangeMap);
                        y = random(minRangeMap, maxRangeMap);
                    }
                    break;
                case 'snail':
                    const matrixAux = newInstance(matrix);
                    let sum = true;
                    let xTarget = true;
                    let contBreak = 0;
                    let valueChange = 1;
                    let currentChange = 0;
                    let listFindPoint = [];
                    while (matrixAux[y][x] !== 0) {
                        currentChange++;
                        if (sum) {
                            console.log('snail', `${xTarget ? 'x' : 'y'}`, `+`, `${currentChange}/${valueChange}`);
                            if (xTarget) x = x + 1;
                            else y = y + 1;
                        } else {
                            console.log('snail', `${xTarget ? 'x' : 'y'}`, `-`, `${currentChange}/${valueChange}`);
                            if (xTarget) x = x - 1;
                            else y = y - 1;
                        }
                        if (currentChange === valueChange) {
                            currentChange = 0;
                            if (xTarget) xTarget = false;
                            else xTarget = true;
                            contBreak++;
                            if (contBreak === 2) {
                                contBreak = 0;
                                valueChange++;
                                if (sum) sum = false;
                                else sum = true;
                            }
                        }
                        if (!matrixAux[y]) {
                            matrixAux[y] = [];
                        }
                        if (matrixAux[y][x] === 0
                            &&
                            generatePath(elementClient, x === maxRangeMap ? x - 1 : x, y === maxRangeMap ? y - 1 : y).length === 0) {
                            matrixAux[y][x] = 1;
                        }
                        listFindPoint.push({ x, y });
                        // console.log('listFindPoint', listFindPoint, matrixAux[y][x]);
                    }
                    break
                case '*':
                    let contTest = 1;
                    while (matrix[y][x] === 1) {
                        const validPoints = [];
                        if (matrix[y + contTest] && matrix[y + contTest][x] === 0) {
                            validPoints.push([y + contTest, x]);
                        }
                        if (matrix[y - contTest] && matrix[y - contTest][x] === 0) {
                            validPoints.push([y - contTest, x]);
                        }
                        if (matrix[y + contTest] && matrix[y + contTest][x + contTest] === 0) {
                            validPoints.push([y + contTest, x + contTest]);
                        }
                        if (matrix[y + contTest] && matrix[y + contTest][x - contTest] === 0) {
                            validPoints.push([y + contTest, x - contTest]);
                        }
                        if (matrix[y - contTest] && matrix[y - contTest][x + contTest] === 0) {
                            validPoints.push([y - contTest, x + contTest]);
                        }
                        if (matrix[y - contTest] && matrix[y - contTest][x - contTest] === 0) {
                            validPoints.push([y - contTest, x - contTest]);
                        }
                        if (matrix[y] && matrix[y][x + contTest] === 0) {
                            validPoints.push([y, x + contTest]);
                        }
                        if (matrix[y] && matrix[y][x - contTest] === 0) {
                            validPoints.push([y, x - contTest]);
                        }
                        if (validPoints.length > 0) {
                            const newPoint = validPoints[random(0, validPoints.length - 1)];
                            x = newPoint[1];
                            y = newPoint[0];
                        }
                        contTest++;
                    }
                    break;

                default:
                    break;
            }
            return { x, y, matrix };
        };

        const generatePath = (element, newX, newY) => {
            const { x, y, matrix } = getAvailablePosition(element, ['BUILDING']);

            const grid = new PF.Grid(matrix.length, matrix.length, matrix);
            const finder = new PF.AStarFinder({
                allowDiagonal: true, // enable diagonal
                dontCrossCorners: false, // corner of a solid
                heuristic: PF.Heuristic.chebyshev
            });
            return finder.findPath(parseInt(element.x), parseInt(element.y), newX ? newX : x, newY ? newY : y, grid);
        };

        const validatePathLoop = element => {
            if (element.path[0]) {
                element.delayVelPath = element.delayVelPath + element.vel;

                if (element.path[0][0] - element.x > 0) {
                    element.x = element.x + element.vel;
                    if (element.x > element.path[0][0]) element.x = element.path[0][0];
                }
                if (element.path[0][0] - element.x < 0) {
                    element.x = element.x - element.vel;
                    if (element.x < element.path[0][0]) element.x = element.path[0][0];
                }

                if (element.path[0][1] - element.y > 0) {
                    element.y = element.y + element.vel;
                    if (element.y > element.path[0][1]) element.y = element.path[0][1];
                }
                if (element.path[0][1] - element.y < 0) {
                    element.y = element.y - element.vel;
                    if (element.y < element.path[0][1]) element.y = element.path[0][1];
                }

                if (element.delayVelPath > 1) {
                    element.delayVelPath = 0;
                    // element.x = parseInt(element.path[0][0]);
                    // element.y = parseInt(element.path[0][1]);
                    element.path.shift();
                }
            }
            return element;
        };


        // ----------------------------------------------------------------
        // ----------------------------------------------------------------

        // https://pixijs.io/examples
        // https://pixijs.download/release/docs/index.html
        // https://www.w3schools.com/colors/colors_picker.asp

        const pixiContainerId = id();
        const app = new PIXI.Application({ width: maxRangeMap * pixiAmplitudeFactor, height: maxRangeMap * pixiAmplitudeFactor, background: 'gray' });
        const container = new PIXI.Container(); // create container
        this.htmlPixiLayer = id();

        const iteratePixiColors = newInstance(colors);
        const pixiColors = {};
        iteratePixiColors.map(dataColor => {
            pixiColors[dataColor.name.toLowerCase()] = numberHexColor(dataColor.hex);
        });

        console.log('COLORS', colors);

        const PIXI_INIT = () => {


            // https://pixijs.download/dev/docs/PIXI.AnimatedSprite.html
            // /assets/apps/cyberiaonline/clases


            s(pixiContainerId).appendChild(app.view);
            app.stage.addChild(container); // container to pixi app
            container.x = 0;
            container.y = 0;
            container.width = maxRangeMap * pixiAmplitudeFactor;
            container.height = maxRangeMap * pixiAmplitudeFactor;

            append(pixiContainerId, /*html*/`
                <style class='${this.htmlPixiLayer}'></style>

                <${this.htmlPixiLayer} class='abs'>
                    v3.0.0
                </${this.htmlPixiLayer}>
            
                `);

            this.renderHtmlPixiLayer();

            s(this.htmlPixiLayer).onclick = event =>
                elements.map(x =>
                    x.onCanvasClick ? x.onCanvasClick(event)
                        : null);


        };

        let floorLayer1 = {};

        let elementsContainer = {};




        let buildingLayer1 = {};
        let buildingLayer2 = {};
        let buildingLayer3 = {};
        let buildingLayer4 = {};
        let buildingLayer5 = {};


        const components = {
            'background': {
                componentsFunctions: {
                    alertCollision: element => {
                        return (
                            element.type !== 'BUILDING'
                            && element.type !== 'FLOOR'
                            && element.type !== 'TOUCH'
                        ) &&

                            elements.filter(x => (

                                validateCollision(x, element)
                                &&
                                element.id !== x.id
                                &&
                                x.type !== 'FLOOR'
                                &&
                                x.type !== 'TOUCH'
                            )).length > 0;
                    }
                },
                componentsElements: {
                    background: {},
                },
                init: function (element) {

                    container.addChild(elementsContainer[element.id]); // sprite to containers

                    this.componentsElements.background[element.id] = new PIXI.Sprite(PIXI.Texture.WHITE);
                    this.componentsElements.background[element.id].x = 0;
                    this.componentsElements.background[element.id].y = 0;
                    this.componentsElements.background[element.id].width = (element.dim) * pixiAmplitudeFactor;
                    this.componentsElements.background[element.id].height = (element.dim) * pixiAmplitudeFactor;
                    this.componentsElements.background[element.id].tint = pixiColors[element.color];
                    elementsContainer[element.id].addChild(this.componentsElements.background[element.id]);

                    switch (element.type) {
                        case 'USER_MAIN':
                            this.componentsElements.background[element.id].visible = false;
                            break;
                        case 'TOUCH':
                            this.componentsElements.background[element.id].visible = false;
                            break;
                        case 'BULLET':
                            this.componentsElements.background[element.id].visible = false;
                            break;
                        default:
                    };


                },
                loop: function (element) {
                    if (this.componentsFunctions.alertCollision(element)) {
                        this.componentsElements.background[element.id].tint = pixiColors["magenta"];
                    } else if (this.componentsElements.background[element.id].tint !== pixiColors[element.color]) {
                        this.componentsElements.background[element.id].tint = pixiColors[element.color];
                    }
                },
                event: function (element) {


                },
                delete: function (element) {
                    delete this.componentsElements.background[element.id];
                }
            },
            'anon-foots': {
                componentsElements: {
                    footLeft: {},
                    footRight: {},
                    footFramesAnimation: {}
                },
                init: function (element) {


                    this.componentsElements.footFramesAnimation[element.id] = 0;

                    this.componentsElements.footLeft[element.id] = new PIXI.Sprite(PIXI.Texture.WHITE);
                    this.componentsElements.footLeft[element.id].tint = pixiColors['white'];
                    this.componentsElements.footLeft[element.id].width = ((element.dim) * pixiAmplitudeFactor) / 6.5;
                    this.componentsElements.footLeft[element.id].height = ((element.dim) * pixiAmplitudeFactor) / 5;
                    this.componentsElements.footLeft[element.id].x = ((element.dim) * pixiAmplitudeFactor) / 3.25;
                    this.componentsElements.footLeft[element.id].y = element.dim * 0.8 * pixiAmplitudeFactor;
                    elementsContainer[element.id].addChild(this.componentsElements.footLeft[element.id]);

                    this.componentsElements.footRight[element.id] = new PIXI.Sprite(PIXI.Texture.WHITE);
                    this.componentsElements.footRight[element.id].tint = pixiColors['white'];
                    this.componentsElements.footRight[element.id].width = ((element.dim) * pixiAmplitudeFactor) / 6.5;
                    this.componentsElements.footRight[element.id].height = ((element.dim) * pixiAmplitudeFactor) / 5;
                    this.componentsElements.footRight[element.id].x = ((element.dim) * pixiAmplitudeFactor) / 1.75;
                    this.componentsElements.footRight[element.id].y = element.dim * 0.8 * pixiAmplitudeFactor;
                    elementsContainer[element.id].addChild(this.componentsElements.footRight[element.id]);
                },
                loop: function (element) {
                    if ((element.lastX !== parseInt(element.renderX) || element.lastY !== parseInt(element.renderY))) {
                        let direction = element.direction;

                        switch (this.componentsElements.footFramesAnimation[element.id]) {
                            case 0:
                                this.componentsElements.footLeft[element.id].height = ((element.dim) * pixiAmplitudeFactor) * (direction === 'South' || direction === 'North' ? 0 : (1 / 10));
                                this.componentsElements.footRight[element.id].height = ((element.dim) * pixiAmplitudeFactor) / 5;
                                break;
                            case 50:
                                this.componentsElements.footLeft[element.id].height = ((element.dim) * pixiAmplitudeFactor) / 5;
                                this.componentsElements.footRight[element.id].height = ((element.dim) * pixiAmplitudeFactor) * (direction === 'South' || direction === 'North' ? 0 : (1 / 10));
                                break;
                            case 100:
                                this.componentsElements.footFramesAnimation[element.id] = -1;
                                break;
                        }
                        this.componentsElements.footFramesAnimation[element.id]++;
                    } else {
                        const currentElement = newInstance(element);
                        setTimeout(() => {
                            if (element.lastX === parseInt(currentElement.renderX) && element.lastY === parseInt(currentElement.renderY) && elementsContainer[element.id]) {
                                this.componentsElements.footLeft[element.id].height = ((element.dim) * pixiAmplitudeFactor) / 5;
                                this.componentsElements.footRight[element.id].height = ((element.dim) * pixiAmplitudeFactor) / 5;
                            }
                        }, 100);
                    }

                },
                event: function (element) { },
                delete: function (element) {
                    delete this.componentsElements.footFramesAnimation[element.id];
                    delete this.componentsElements.footLeft[element.id];
                    delete this.componentsElements.footRight[element.id];
                }
            },
            'anon-head': {
                componentsElements: {
                    head: {},
                    eyesLeft: {},
                    eyesRight: {}
                },
                init: function (element) {

                    this.componentsElements.head[element.id] = new PIXI.Sprite(PIXI.Texture.WHITE);
                    this.componentsElements.head[element.id].width = ((element.dim) * pixiAmplitudeFactor) / 2;
                    this.componentsElements.head[element.id].height = ((element.dim) * pixiAmplitudeFactor) / 2;
                    this.componentsElements.head[element.id].x = ((element.dim) * pixiAmplitudeFactor) / 4;
                    this.componentsElements.head[element.id].y = 0;
                    elementsContainer[element.id].addChild(this.componentsElements.head[element.id]);

                    this.componentsElements.eyesLeft[element.id] = new PIXI.Sprite(PIXI.Texture.WHITE);
                    this.componentsElements.eyesLeft[element.id].tint = pixiColors['blue'];
                    this.componentsElements.eyesLeft[element.id].width = ((element.dim) * pixiAmplitudeFactor) / 6.5;
                    this.componentsElements.eyesLeft[element.id].height = ((element.dim) * pixiAmplitudeFactor) / 6.5;
                    this.componentsElements.eyesLeft[element.id].x = ((element.dim) * pixiAmplitudeFactor) / 3.25;
                    this.componentsElements.eyesLeft[element.id].y = 0.4 * pixiAmplitudeFactor;
                    elementsContainer[element.id].addChild(this.componentsElements.eyesLeft[element.id]);

                    this.componentsElements.eyesRight[element.id] = new PIXI.Sprite(PIXI.Texture.WHITE);
                    this.componentsElements.eyesRight[element.id].tint = pixiColors['blue'];
                    this.componentsElements.eyesRight[element.id].width = ((element.dim) * pixiAmplitudeFactor) / 6.5;
                    this.componentsElements.eyesRight[element.id].height = ((element.dim) * pixiAmplitudeFactor) / 6.5;
                    this.componentsElements.eyesRight[element.id].x = ((element.dim) * pixiAmplitudeFactor) / 1.75;
                    this.componentsElements.eyesRight[element.id].y = 0.4 * pixiAmplitudeFactor;
                    elementsContainer[element.id].addChild(this.componentsElements.eyesRight[element.id]);


                },
                loop: function (element) {
                    let direction = element.direction;
                    if (direction === 'East'
                        || direction === 'South East'
                        || direction === 'North East') {
                        this.componentsElements.eyesLeft[element.id].visible = false;
                        this.componentsElements.eyesRight[element.id].visible = true;
                    }

                    if (direction === 'West'
                        || direction === 'South West'
                        || direction === 'North West') {
                        this.componentsElements.eyesRight[element.id].visible = false;
                        this.componentsElements.eyesLeft[element.id].visible = true;
                    }

                    if (direction === 'North') {
                        this.componentsElements.eyesRight[element.id].visible = false;
                        this.componentsElements.eyesLeft[element.id].visible = false;
                    }

                    if (direction === 'South') {
                        this.componentsElements.eyesRight[element.id].visible = true;
                        this.componentsElements.eyesLeft[element.id].visible = true;
                    }

                },
                event: function (element) {

                },
                delete: function (element) {
                    delete this.componentsElements.head[element.id];
                    delete this.componentsElements.eyesLeft[element.id];
                    delete this.componentsElements.eyesRight[element.id];
                }
            },
            'cross-effect': {
                componentsElements: {
                    sprite: {}
                },
                init: function (element) { },
                loop: function (element) { },
                delete: function (eventHash) {
                    this.componentsElements.sprite[eventHash].destroy();
                    delete this.componentsElements.sprite[eventHash];
                },
                event: function (element) {
                    const valueAbsDiff = (element.dim) * pixiAmplitudeFactor / 6;
                    range(0, 4).map(i => {
                        const eventHash = 'x' + s4();
                        this.componentsElements.sprite[eventHash] = new PIXI.Sprite(PIXI.Texture.WHITE);
                        this.componentsElements.sprite[eventHash].width = (element.dim) * pixiAmplitudeFactor / 5;
                        this.componentsElements.sprite[eventHash].height = (element.dim) * pixiAmplitudeFactor / 5;
                        const xyCorrection = (this.componentsElements.sprite[eventHash].width / 2);
                        switch (i) {
                            case 0:
                                this.componentsElements.sprite[eventHash].x = ((element.dim) * pixiAmplitudeFactor / 2) - xyCorrection;
                                this.componentsElements.sprite[eventHash].y = ((element.dim) * pixiAmplitudeFactor / 2) - xyCorrection;
                                break;
                            case 1:
                                this.componentsElements.sprite[eventHash].x =
                                    ((element.dim) * pixiAmplitudeFactor / 2) - valueAbsDiff - xyCorrection;
                                this.componentsElements.sprite[eventHash].y =
                                    ((element.dim) * pixiAmplitudeFactor / 2) - valueAbsDiff - xyCorrection;
                                break;
                            case 2:
                                this.componentsElements.sprite[eventHash].x =
                                    ((element.dim) * pixiAmplitudeFactor / 2) + valueAbsDiff - xyCorrection;
                                this.componentsElements.sprite[eventHash].y =
                                    ((element.dim) * pixiAmplitudeFactor / 2) - valueAbsDiff - xyCorrection;
                                break;
                            case 3:
                                this.componentsElements.sprite[eventHash].x =
                                    ((element.dim) * pixiAmplitudeFactor / 2) - valueAbsDiff - xyCorrection;
                                this.componentsElements.sprite[eventHash].y =
                                    ((element.dim) * pixiAmplitudeFactor / 2) + valueAbsDiff - xyCorrection;
                                break;
                            case 4:
                                this.componentsElements.sprite[eventHash].x =
                                    ((element.dim) * pixiAmplitudeFactor / 2) + valueAbsDiff - xyCorrection;
                                this.componentsElements.sprite[eventHash].y =
                                    ((element.dim) * pixiAmplitudeFactor / 2) + valueAbsDiff - xyCorrection;
                                break;
                            default:
                                break;
                        }
                        this.componentsElements.sprite[eventHash].tint = pixiColors['red'];
                        elementsContainer[element.id].addChild(this.componentsElements.sprite[eventHash]);
                        setTimeout(() => {
                            this.delete(eventHash);
                        }, 1000);
                    });
                }
            },
            'random-circle-color': {
                componentsFrames: {
                    circle: {}
                },
                componentsElements: {
                    circle: {}
                },
                init: function (element) {
                    this.componentsElements.circle[element.id] = new PIXI.Graphics();
                    this.componentsElements.circle[element.id].beginFill(randomNumberColor());
                    this.componentsElements.circle[element.id].lineStyle(0);
                    this.componentsElements.circle[element.id].drawCircle(0, 0, 1.5 * pixiAmplitudeFactor); // x,y,radio
                    this.componentsElements.circle[element.id].endFill();
                    this.componentsElements.circle[element.id].width = (element.dim * pixiAmplitudeFactor) / 4;
                    this.componentsElements.circle[element.id].height = (element.dim * pixiAmplitudeFactor) / 4;
                    elementsContainer[element.id].addChild(this.componentsElements.circle[element.id]);
                },
                loop: function (element) {
                    if (!this.componentsFrames.circle[element.id])
                        this.componentsFrames.circle[element.id] = 0;
                    switch (this.componentsFrames.circle[element.id]) {
                        case 0:
                            this.componentsElements.circle[element.id].clear();
                            this.componentsElements.circle[element.id].beginFill(randomNumberColor());
                            this.componentsElements.circle[element.id].lineStyle(0);
                            this.componentsElements.circle[element.id].drawCircle(
                                0,
                                0,
                                2 * pixiAmplitudeFactor
                            ); // x,y,radio
                            this.componentsElements.circle[element.id].endFill();
                            break;
                        case 100:
                            this.componentsElements.circle[element.id].clear();
                            this.componentsElements.circle[element.id].beginFill(randomNumberColor());
                            this.componentsElements.circle[element.id].lineStyle(0);
                            this.componentsElements.circle[element.id].drawCircle(
                                0,
                                0,
                                3 * pixiAmplitudeFactor
                            ); // x,y,radio
                            this.componentsElements.circle[element.id].endFill();
                            break;
                        case 200:
                            this.componentsElements.circle[element.id].clear();
                            this.componentsElements.circle[element.id].beginFill(randomNumberColor());
                            this.componentsElements.circle[element.id].lineStyle(0);
                            this.componentsElements.circle[element.id].drawCircle(
                                0,
                                0,
                                2 * pixiAmplitudeFactor
                            ); // x,y,radio
                            this.componentsElements.circle[element.id].endFill();
                            break;
                        case 300:
                            this.componentsElements.circle[element.id].clear();
                            this.componentsElements.circle[element.id].beginFill(randomNumberColor());
                            this.componentsElements.circle[element.id].lineStyle(0);
                            this.componentsElements.circle[element.id].drawCircle(
                                0,
                                0,
                                1.5 * pixiAmplitudeFactor
                            ); // x,y,radio
                            this.componentsElements.circle[element.id].endFill();
                            break;
                        case 400:
                            this.componentsFrames.circle[element.id] = -1;
                            break;
                    }
                    this.componentsFrames.circle[element.id]++;
                },
                delete: function (element) {
                    delete this.componentsElements.circle[element.id];
                    delete this.componentsFrames.circle[element.id];
                }
            }
        };

        const removeElement = id => {
            if (!elementsContainer[id]) {
                console.error('error delete', id, elements.find(x => x.id === id));
                return
            };
            elementsContainer[id].destroy({ children: true });

            delete floorLayer1[id];

            delete elementsContainer[id];

            delete buildingLayer1[id];
            delete buildingLayer2[id];
            delete buildingLayer3[id];
            delete buildingLayer4[id];
            delete buildingLayer5[id];

            const elementIndex = elements.findIndex(x => x.id === id);
            // logDataManage(elements[elementIndex]);
            if (elementIndex > -1) {
                if (elements[elementIndex].components)
                    elements[elementIndex].components.map(component =>
                        components[component].delete(elements[elementIndex]));
                elements[elementIndex]
                    .clearsIntervals.map(keyInterval => clearInterval(elements[elementIndex][keyInterval]));
            }

            elements = elements.filter(x => x.id !== id);
        };

        const removeAllElements = () =>
            Object.keys(elementsContainer).map(key => removeElement(key));

        const PIXI_INIT_ELEMENT = element => {

            // /assets/apps/cyberiaonline

            // elementsContainer[element.id] = new PIXI.Sprite(PIXI.Texture.WHITE);
            elementsContainer[element.id] = new PIXI.Container();
            elementsContainer[element.id].x = (element.x - (element.dim / 2)) * pixiAmplitudeFactor;
            elementsContainer[element.id].y = (element.y - (element.dim / 2)) * pixiAmplitudeFactor;
            elementsContainer[element.id].width = (element.dim) * pixiAmplitudeFactor;
            elementsContainer[element.id].height = (element.dim) * pixiAmplitudeFactor;
            // elementsContainer[element.id].rotation = -(Math.PI / 2);
            // elementsContainer[element.id].pivot.x = elementsContainer[element.id].width / 2;
            // elementsContainer[element.id].pivot.y = elementsContainer[element.id].width / 2;
            container.addChild(elementsContainer[element.id]); // sprite to containers




            if (element.components) element.components.map(component =>
                components[component].init(element));

            switch (element.type) {

                case 'BUILDING':

                    // buildingLayer1

                    buildingLayer1[element.id] = new PIXI.Sprite(PIXI.Texture.WHITE);
                    buildingLayer1[element.id].tint = pixiColors['zinnwaldite brown'];
                    buildingLayer1[element.id].width = ((element.dim) * pixiAmplitudeFactor) / 1.1;
                    buildingLayer1[element.id].height = ((element.dim) * pixiAmplitudeFactor) / 1.1;
                    buildingLayer1[element.id].x = (((element.dim) * pixiAmplitudeFactor) - buildingLayer1[element.id].width) / 2;
                    buildingLayer1[element.id].y = (((element.dim) * pixiAmplitudeFactor) - buildingLayer1[element.id].height) / 2;
                    elementsContainer[element.id].addChild(buildingLayer1[element.id]);

                    buildingLayer2[element.id] = new PIXI.Sprite(PIXI.Texture.WHITE);
                    buildingLayer2[element.id].tint = pixiColors['cafe noir'];
                    buildingLayer2[element.id].width = ((element.dim) * pixiAmplitudeFactor) / 1.5;
                    buildingLayer2[element.id].height = ((element.dim) * pixiAmplitudeFactor) / 1.5;
                    buildingLayer2[element.id].x = (((element.dim) * pixiAmplitudeFactor) - buildingLayer2[element.id].width) / 2;
                    buildingLayer2[element.id].y = (((element.dim) * pixiAmplitudeFactor) - buildingLayer2[element.id].height) / 2;
                    elementsContainer[element.id].addChild(buildingLayer2[element.id]);
                default:
                    break;
            };

        };

        const PIXI_LOOP_ELEMENT = element => {
            if (!elementsContainer[element.id]) {
                // bug pero si esta en elements
                console.error('!elementsContainer[element.id]');
                return;
            };
            element.renderX = (element.x - (element.dim / 2)) * pixiAmplitudeFactor;
            element.renderY = (element.y - (element.dim / 2)) * pixiAmplitudeFactor;

            if (element.type === 'USER_MAIN') {

                let direction;

                if ((element.lastX !== parseInt(element.renderX) || element.lastY !== parseInt(element.renderY))) {
                    if (element.lastX !== undefined && element.lastY !== undefined) {
                        const x1 = parseInt(`${element.lastX}`);
                        const y1 = parseInt(`${element.lastY}`);
                        const x2 = parseInt(element.renderX);
                        const y2 = parseInt(element.renderY);

                        direction = getDirection(x1, y1, x2, y2);
                        console.log('getDirection', element.type, direction);
                        element.direction = direction;

                    }



                }
            }

            if (element.components) element.components.map(component =>
                components[component].loop(element));



            element.lastX = parseInt(`${element.renderX}`);
            element.lastY = parseInt(`${element.renderY}`);

            elementsContainer[element.id].x = newInstance(element.renderX);
            elementsContainer[element.id].y = newInstance(element.renderY);

        };

        // ----------------------------------------------------------------
        // ----------------------------------------------------------------

        const gen = () => {
            return {
                init: function (options) {
                    this.id = options.id ? options.id : id();
                    this.x = options.x !== undefined ? options.x : random(minRangeMap, maxRangeMap);
                    this.y = options.y !== undefined ? options.y : random(minRangeMap, maxRangeMap);
                    this.container = options.container;
                    this.type = options.type;
                    this.delayVelPath = 0;
                    this.vel = options.vel ? options.vel : 0.1;
                    this.dim = options.dim ? options.dim : 2; // 3; // 1.5
                    this.color = options.color ? options.color : 'red';
                    this.path = [];
                    this.borderRadius = 100;
                    this.clearsIntervals = [];
                    this.shootTimeInterval = 100;
                    this.validateShoot = true;
                    this.direction = 'South';
                    this.components = options.components ? options.components : ['background'];
                    switch (this.type) {
                        case 'BUILDING':
                            this.borderRadius = 0;
                            if (!(options.x !== undefined && options.y !== undefined)) {
                                const BUILDING_getAvailablePosition = getAvailablePosition(this, ['BUILDING']);
                                this.x = BUILDING_getAvailablePosition.x;
                                this.y = BUILDING_getAvailablePosition.y;
                            }
                            this.color = 'black';
                            break;
                        case 'USER_MAIN':
                            if (!(options.x !== undefined && options.y !== undefined)) {
                                const USER_MAIN_getAvailablePosition = getAvailablePosition(this, ['BUILDING']);
                                this.x = USER_MAIN_getAvailablePosition.x;
                                this.y = USER_MAIN_getAvailablePosition.y;
                            }
                            this.color = 'yellow';
                            this.components = this.components.concat(
                                [
                                    'anon-head',
                                    'anon-foots',
                                    'random-circle-color'
                                ]
                            );
                            this.dim = this.dim * 0.8;
                            this.shoot = () => {
                                if (this.validateShoot) {
                                    this.validateShoot = false;
                                    setTimeout(() => {
                                        this.validateShoot = true;
                                    }, this.shootTimeInterval);
                                    let xBullet = 0;
                                    let yBullet = 0;
                                    let direction = this.direction;

                                    if (direction === 'East'
                                        || direction === 'South East'
                                        || direction === 'North East') {
                                        xBullet = this.dim * 2;
                                    }

                                    if (direction === 'West'
                                        || direction === 'South West'
                                        || direction === 'North West') {
                                        xBullet = this.dim * -2;
                                    }

                                    if (direction === 'North') {
                                        yBullet = this.dim * -2;
                                    }

                                    if (direction === 'South') {
                                        yBullet = this.dim * 2;
                                    }

                                    elements.push(gen().init({
                                        id: id(),
                                        type: 'BULLET',
                                        container: containerID,
                                        x: this.x + xBullet,
                                        y: this.y + yBullet
                                    }));
                                }
                            };
                            break;
                        case 'BOT':
                            if (!(options.x !== undefined && options.y !== undefined)) {
                                const BOT_getAvailablePosition = getAvailablePosition(this, ['BUILDING']);
                                this.x = BOT_getAvailablePosition.x;
                                this.y = BOT_getAvailablePosition.y;
                            }
                            this.color = 'electric green';
                            break;
                        case 'BOT_BUG':
                            this.x = maxRangeMap;
                            this.y = minRangeMap;
                            break;
                        case 'BULLET':
                            setTimeout(() => {
                                components['cross-effect'].event(this);
                            });
                            setTimeout(() => {
                                removeElement(this.id);
                            }, 2000);


                            break;
                        default:
                            break;
                    }
                    PIXI_INIT_ELEMENT(this);
                    switch (this.type) {
                        case 'USER_MAIN':
                            this.ArrowLeft = startListenKey({
                                key: 'ArrowLeft',
                                vel: timeIntervalGame,
                                onKey: () => {
                                    this.path = [];
                                    this.delayVelPath = 0;
                                    this.x = validatePosition(this, 'x', pos => pos - this.vel, ['BUILDING']);
                                }
                            });
                            this.clearsIntervals.push('ArrowLeft');
                            this.ArrowRight = startListenKey({
                                key: 'ArrowRight',
                                vel: timeIntervalGame,
                                onKey: () => {
                                    this.path = [];
                                    this.delayVelPath = 0;
                                    this.x = validatePosition(this, 'x', pos => pos + this.vel, ['BUILDING']);
                                }
                            });
                            this.clearsIntervals.push('ArrowRight');
                            this.ArrowUp = startListenKey({
                                key: 'ArrowUp',
                                vel: timeIntervalGame,
                                onKey: () => {
                                    this.path = [];
                                    this.delayVelPath = 0;
                                    this.y = validatePosition(this, 'y', pos => pos - this.vel, ['BUILDING']);
                                }
                            });
                            this.clearsIntervals.push('ArrowUp');
                            this.ArrowDown = startListenKey({
                                key: 'ArrowDown',
                                vel: timeIntervalGame,
                                onKey: () => {
                                    this.path = [];
                                    this.delayVelPath = 0;
                                    this.y = validatePosition(this, 'y', pos => pos + this.vel, ['BUILDING']);
                                }
                            });
                            this.clearsIntervals.push('ArrowDown');

                            ['q', 'Q', 'w', 'W'].map(qKey => {

                                this[`key_${qKey}`] = startListenKey({
                                    key: qKey,
                                    vel: timeIntervalGame,
                                    onKey: () => {
                                        console.log('onKey', this.id);
                                        this.shoot();
                                    }
                                });
                                this.clearsIntervals.push(`key_${qKey}`);

                            });

                            this.onCanvasClick = event => {
                                // off -> this.canvasDim
                                // x -> 50
                                let offsetX = parseInt(((event.offsetX * maxRangeMap) / cyberiaonline.canvasDim)) + 1;
                                let offsetY = parseInt(((event.offsetY * maxRangeMap) / cyberiaonline.canvasDim)) + 1;

                                const { x, y, matrix } = getAvailablePosition(this,
                                    {
                                        x: offsetX,
                                        y: offsetY,
                                        elementsCollisions: ['BUILDING']
                                    }
                                );
                                offsetX = x;
                                offsetY = y;
                                console.log('onCanvasClick', event, offsetX, offsetY);
                                this.path = generatePath(this, offsetX === maxRangeMap ? offsetX - 1 : offsetX, offsetY === maxRangeMap ? offsetY - 1 : offsetY);
                                if (this.path.length === 0) {
                                    // search solid snail -> auto generate click mov
                                    // snail inverse -> pathfinding with snail normal
                                }
                            };
                            break;
                        case 'TOUCH':
                            this.onCanvasClick = event => {

                                let offsetX = parseInt(((event.offsetX * maxRangeMap) / cyberiaonline.canvasDim)) + 1;
                                let offsetY = parseInt(((event.offsetY * maxRangeMap) / cyberiaonline.canvasDim)) + 1;

                                this.x = offsetX;
                                this.y = offsetY;

                                components['cross-effect'].event(this);
                            };

                            break;
                        default:
                            break;
                    }
                    if (options.matrix)
                        range(0, options.matrix.x - 1)
                            .map(x =>
                                range(0, options.matrix.y - 1)
                                    .map(y => {
                                        if (!(x === 0 && y === 0)) {
                                            const replicaOtions = newInstance(options);
                                            delete replicaOtions.matrix;
                                            elements.push(
                                                gen().init({
                                                    ...replicaOtions,
                                                    x: this.x + (this.dim * x),
                                                    y: this.y + (this.dim * y)
                                                })
                                            );
                                        }

                                    })
                            );
                    return this;
                },
                loop: function () {
                    let element;
                    switch (this.type) {
                        case 'BOT':
                            if (this.path.length === 0)
                                this.path = generatePath(this);


                            element = validatePathLoop(this);
                            this.path = element.path;
                            this.x = element.x;
                            this.y = element.y;

                            break;
                        case 'USER_MAIN':
                            element = validatePathLoop(this);
                            this.path = element.path;
                            this.x = element.x;
                            this.y = element.y;

                            break;
                        case 'BOT_BUG':
                            const velBotBug = 1;
                            this.x = validatePosition(this, 'x',
                                pos => random(0, 1) === 0 ? pos + velBotBug : pos - velBotBug);
                            this.y = validatePosition(this, 'y',
                                pos => random(0, 1) === 0 ? pos + velBotBug : pos - velBotBug);

                            break;
                        default:
                            break;
                    }
                    PIXI_LOOP_ELEMENT(this);
                }
            };
        };

        // ----------------------------------------------------------------
        // ----------------------------------------------------------------

        const INSTANCE_GENERATOR = () => {

            removeAllElements();

            elements = elements.concat([
                gen().init({
                    container: containerID,
                    type: 'FLOOR',
                    dim: maxRangeMap,
                    color: 'dark green (x11)',
                    x: maxRangeMap / 2,
                    y: maxRangeMap / 2
                })
            ]);

            elements = elements.concat(
                range(0, 5)
                    .map(() => gen().init({
                        container: containerID,
                        type: 'BUILDING',
                        matrix: { x: 2, y: 3 }
                    }))
            );
            elements = elements.concat(
                range(1, 5)
                    .map(() => gen().init({
                        container: containerID,
                        type: 'BOT'
                    }))
            );
            // mobile friendly
            elements = elements.concat(
                [
                    gen().init({
                        container: containerID,
                        type: 'BUILDING',
                        matrix: { x: 2, y: 2 },
                        x: 0,
                        y: 0
                    }),
                    gen().init({
                        container: containerID,
                        type: 'USER_MAIN',
                        // x: 2,
                        // y: 2
                        // matrix: { x: 1, y: 2 }
                    }),
                    // gen().init({
                    //     container: containerID,
                    //     type: 'BOT'
                    // }),
                    gen().init({
                        container: containerID,
                        type: 'BOT_BUG'
                    }),
                    gen().init({
                        container: containerID,
                        color: 'safety orange'
                    }),
                    gen().init({
                        container: containerID,
                        type: 'TOUCH',
                        x: 1,
                        y: 1
                    }),
                ]
            );

            console.log('elements', elements);


        };

        // ----------------------------------------------------------------
        // ----------------------------------------------------------------

        const BtnQ = id();
        const BtnW = id();

        setTimeout(() => {
            PIXI_INIT();
            disableOptionsClick(pixiContainerId, ['drag', 'menu', 'select']);
            INSTANCE_GENERATOR();

            s(`.${newInstanceBtn}`).onclick = () =>
                INSTANCE_GENERATOR();

            s(`.${BtnQ}`).onclick = () => elements.map(x => x.shoot && x.type === 'USER_MAIN' ? x.shoot() : null);
            s(`.${BtnW}`).onclick = () => elements.map(x => x.shoot && x.type === 'USER_MAIN' ? x.shoot() : null);

            if (this.loopGame) clearInterval(this.loopGame);
            const renderGame = () => elements.map(x => x.loop());
            renderGame();
            this.loopGame = setInterval(() => renderGame(), timeIntervalGame);
        });

        // ----------------------------------------------------------------
        // ----------------------------------------------------------------


        return /*html*/`

            <div class='in container'>
                <style>
                    ${containerID} {
                        height: 450px;
                        width: 450px;
                        background: gray;
                    }

                    ${pixiContainerId} { 
                        cursor: pointer;
                    }

                    canvas {
                       /* transform: scale(-1, 1) rotate(90deg); */
                        display: block;
                        margin: auto;
                    }

                </style>
                <!--
                <${containerID} class='in'></${containerID}>
                -->
                <${pixiContainerId} class='in canvas-cursor'></${pixiContainerId}>
            </div>
            <div class='in container' style='text-align: center'>
                    <br>
                    <button class='inl ${BtnQ}' style='font-size: 30px'>Q</button>
                    <button class='inl ${BtnW}' style='font-size: 30px'>W</button>
                    <br>
                    <button class='inl ${newInstanceBtn}'>${renderLang({ es: 'generar nueva instancia', en: 'new instance' })}</button>
                    <br>
            </div>
        
        `
    },
    renderHtmlPixiLayer: function () {
        if (!s('.' + this.htmlPixiLayer)) return;
        htmls('.' + this.htmlPixiLayer, /*css*/`
                ${this.htmlPixiLayer} {
                    height: ${this.canvasDim}px;
                    width: ${this.canvasDim}px;
                    transform: translate(-50%, 0%);
                    top: 0%;
                    left: 50%;
                    background: rgb(0,0,0,0);
                    color: yellow;
                    ${borderChar(2, 'black')}
                }
            `);
    },
    routerDisplay: function (options) {
        this.renderHtmlPixiLayer();
    }
};