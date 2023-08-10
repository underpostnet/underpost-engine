// canvas dim controller
let lastScreenDimMin;
let lastScreenDimMax;
const execCssController = (screenDim) => {
  lastScreenDimMin = newInstance(screenDim.minValue);
  lastScreenDimMax = newInstance(screenDim.maxValue);
  htmls(
    '.css-controller',
    /*css*/ `
    canvas {
      width: ${screenDim.minValue}px;
      height: ${screenDim.minValue}px;
      top: ${screenDim.maxType === 'height' ? (screenDim.maxValue - screenDim.minValue) / 2 : 0}px;
    }
    touch-layer {
      width: ${screenDim.minValue}px;
      height: ${screenDim.minValue}px;
      top: ${screenDim.maxType === 'height' ? (screenDim.maxValue - screenDim.minValue) / 2 : 0}px;
      left: ${screenDim.maxType === 'height' ? 0 : (screenDim.maxValue - screenDim.minValue) / 2}px;
    }
    gui-layer {
      width: ${screenDim.minValue}px;
      top: 0px;
      left: ${screenDim.maxType === 'height' ? 0 : (screenDim.maxValue - screenDim.minValue) / 2}px;
    }
    pixi-container {
      left: ${screenDim.maxType === 'height' ? 0 : (screenDim.maxValue - screenDim.minValue) / 2}px;
    }
    .close-gui {
      left: ${
        (screenDim.maxType === 'height' ? 0 : (screenDim.maxValue - screenDim.minValue) / 2) +
        (screenDim.minValue - (48 + 10))
      }px;
    }

    .item-modal {
      width: ${screenDim.maxType !== 'height' && screenDim.minValue <= 430 ? 400 : 245}px;
      height:  ${screenDim.maxType !== 'height' && screenDim.minValue <= 430 ? 245 : 400}px;
    }
    
    ${
      screenDim.maxType !== 'height' && screenDim.minValue <= 430
        ? /*css*/ `
      .modal-item-stats {
        width: 50%;
        float: left;
      }
      .modal-item-header {
        width: 30%;
        float: left;
        height: 100%;
      }
      .modal-item-header-col {
        width: 100%;
        height: 48%;
      }
    `
        : /*css*/ `
      .modal-item-header {
        height: 100px;
      }
      .modal-item-header-col {
        width: 48%;
        height: 100%;
      }
        `
    }
    
    .grid-cell {
      width: ${(screenDim.minValue * 0.8) / 6}px;
      height:  ${(screenDim.minValue * 0.8) / 6}px;
    }
    .grid-cell-equip {
      width: ${
        screenDim.maxType === 'height' && screenDim.minValue <= 430
          ? screenDim.minValue / 5
          : (screenDim.minValue * 0.5) / 5
      }px;
      height:  ${
        screenDim.maxType === 'height' && screenDim.minValue <= 430
          ? screenDim.minValue / 5
          : (screenDim.minValue * 0.5) / 5
      }px;
    }
    ${
      screenDim.maxType === 'height' && screenDim.minValue <= 430
        ? /*css*/ `
    .title-type-equip { 
      font-size: 6px;
      top: -14%;
    }
    `
        : /*css*/ `
    .title-type-equip { 
      font-size: 8px;
      top: -2%;
    }
    `
    }
    history-chat {
      height:  ${screenDim.maxType === 'height' ? screenDim.maxValue * 0.65 : screenDim.minValue * 0.65}px;
    }
    event-board {
      width: ${screenDim.minValue * 0.7}px;
    }

    .character-stats-section {
      width: ${screenDim.minValue >= 430 ? 50 : 100}%;
    }
    .config-col, .wiki-key, .wiki-value {
      width: ${screenDim.minValue >= 430 ? 50 : 100}%;
    }
    .map-cell {
      width: ${100 / (1 + rangeMapView * 2)}%;
    }
    .count-item-text {
        font-size:  ${screenDim.minValue >= 430 ? 10 : 8}px;
     }
     .x-count-item-text {
        font-size:  ${screenDim.minValue >= 430 ? 8 : 6}px;
     }
     .item-bag-style-text {
        font-size:  ${screenDim.minValue >= 430 ? 10 : 6}px;
     }
     main-menu {
      height: ${screenDim.maxType === 'height' ? screenDim.maxValue * 0.9 : screenDim.minValue * 0.9}px;
     }

     ${
       screenDim.maxType === 'height'
         ? /*css*/ `
     .tol-0 {
        width: 33.33%;
        height: ${((screenDim.maxValue - screenDim.minValue) / 2) * 0.6}px;
        top: 0%;
        left: 0%;
     }
     .tol-1 {
        width: 33.33%;
        height: ${((screenDim.maxValue - screenDim.minValue) / 2) * 0.6}px;
        top: 0%;
        left: 33.33%;
     }
     .tol-2 {
        width: 33.33%;
        height: ${((screenDim.maxValue - screenDim.minValue) / 2) * 0.6}px;
        top: 0%;
        left: 66.66%;
     }
     .tol-3 {
        width: 33.3%;
        height: ${((screenDim.maxValue - screenDim.minValue) / 2) * 0.6}px;
        top: ${
          screenDim.minValue +
          (screenDim.maxValue - screenDim.minValue) / 2 +
          ((screenDim.maxValue - screenDim.minValue) / 2) * 0.4
        }px;
        left: 0%;
      }
      .tol-4 {
        width: 33.33%;
        height: ${((screenDim.maxValue - screenDim.minValue) / 2) * 0.6}px;
        top: ${
          screenDim.minValue +
          (screenDim.maxValue - screenDim.minValue) / 2 +
          ((screenDim.maxValue - screenDim.minValue) / 2) * 0.4
        }px;
        left: 33.33%;
      }
      .tol-5 {
        width: 33.33%;
        height: ${((screenDim.maxValue - screenDim.minValue) / 2) * 0.6}px;
        top: ${
          screenDim.minValue +
          (screenDim.maxValue - screenDim.minValue) / 2 +
          ((screenDim.maxValue - screenDim.minValue) / 2) * 0.4
        }px;
        left: 66.66%;
      }
      .tol-6 {
        width: 33.33%;
        height: ${
          (screenDim.maxValue - screenDim.minValue) / 2 - ((screenDim.maxValue - screenDim.minValue) / 2) * 0.6
        }px;
        top: ${screenDim.minValue + (screenDim.maxValue - screenDim.minValue) / 2}px;
        left: 66.66%;
      }
      .tol-7 {
        width: 33.33%;
        height: ${
          (screenDim.maxValue - screenDim.minValue) / 2 - ((screenDim.maxValue - screenDim.minValue) / 2) * 0.6
        }px;
        top: ${((screenDim.maxValue - screenDim.minValue) / 2) * 0.6}px;
        left: 0%;
      }
     `
         : /*css*/ `
     .tol-0 {
        left: 0%;
        width: ${((screenDim.maxValue - screenDim.minValue) / 2) * 0.6}px;
        height: 33.33%;
        top: 0%;
     }
     .tol-1 {
        left: 0%;
        width: ${((screenDim.maxValue - screenDim.minValue) / 2) * 0.6}px;
        height: 33.33%;
        top: 33.33%;
     }
     .tol-2 {
        left: 0%;
        width: ${((screenDim.maxValue - screenDim.minValue) / 2) * 0.6}px;
        height: 33.33%;
        top: 66.66%;
     }
     .tol-3 {
        left: ${
          screenDim.maxValue -
          (screenDim.maxValue - screenDim.minValue) / 2 +
          ((screenDim.maxValue - screenDim.minValue) / 2) * 0.4
        }px;
        width: ${((screenDim.maxValue - screenDim.minValue) / 2) * 0.6}px;
        height: 33.33%;
        top: 0%;
     }
     .tol-4 {
        left: ${
          screenDim.maxValue -
          (screenDim.maxValue - screenDim.minValue) / 2 +
          ((screenDim.maxValue - screenDim.minValue) / 2) * 0.4
        }px;
        width: ${((screenDim.maxValue - screenDim.minValue) / 2) * 0.6}px;
        height: 33.33%;
        top: 33.33%;
     }
     .tol-5 {
        left: ${
          screenDim.maxValue -
          (screenDim.maxValue - screenDim.minValue) / 2 +
          ((screenDim.maxValue - screenDim.minValue) / 2) * 0.4
        }px;
        width: ${((screenDim.maxValue - screenDim.minValue) / 2) * 0.6}px;
        height: 33.33%;
        top: 66.66%;
     }
     .tol-6 {
        left: ${screenDim.maxValue - (screenDim.maxValue - screenDim.minValue) / 2}px;
        width: ${((screenDim.maxValue - screenDim.minValue) / 2) * 0.4}px;
        height: 33.33%;
        top: 66.66%;
     }
     .tol-7 {
        left: ${((screenDim.maxValue - screenDim.minValue) / 2) * 0.6}px;
        width: ${((screenDim.maxValue - screenDim.minValue) / 2) * 0.4}px;
        height: 33.33%;
        top: 0%;
     }
     `
     }
      
  `
  );
  Object.keys(logicStorage['css-controller']).map((keyLogic) => logicStorage['css-controller'][keyLogic](screenDim));
};
setInterval(() => {
  const screenDim = dimState();
  if (lastScreenDimMin !== screenDim.minValue || lastScreenDimMax !== screenDim.maxValue) execCssController(screenDim);
}, updateTimeInterval);
