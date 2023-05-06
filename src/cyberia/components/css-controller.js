// canvas dim controller
let lastScreenDimMin;
let lastScreenDimMax;
setInterval(() => {
  const screenDim = dimState();
  if (lastScreenDimMin !== screenDim.minValue || lastScreenDimMax !== screenDim.maxValue) {
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
        height: 100%;
        top: 0px;
        left: ${screenDim.maxType === 'height' ? 0 : (screenDim.maxValue - screenDim.minValue) / 2}px;
      }
      

      
      .grid-cell {
        width: ${(screenDim.minValue * 0.8) / 6}px;
        height:  ${(screenDim.minValue * 0.8) / 6}px;
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
        width: ${screenDim.maxType === 'height' ? 33 : 25}%;
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
    `
    );
  }
}, updateTimeInterval);
