let hashIdEventBoards = [];
let contDisplayBoard = 0;
const renderEventBoard = (dataBoard) => {
  contDisplayBoard++;
  const contDisplayBoardInstance = newInstance(contDisplayBoard);
  const hashId = 'event-board-' + s4();
  const render = /*html*/ `
      <div class='fl content-event-board ${hashId}'>
          [ <span style='color: yellow'>
            ${dataBoard.tag} 
          </span> ]
          ${getDateFormat(new Date())}
          <br>
          ${dataBoard.msg}
      </div>
  `;
  if (dataBoard.history) prepend('event-history-render', render);

  hashIdEventBoards.push(hashId);

  prepend('event-board', render);

  switch (hashIdEventBoards.length) {
    case 1:
      s('event-board').style.height = 67.5 + 'px';
      break;
    case 2:
      s('event-board').style.height = 67.5 * 2 + 'px';
      break;
    default:
      // s('event-board').style.height = 45 * 3 + 'px';
      break;
  }

  if (hashIdEventBoards.length === 3) {
    s(`.${hashIdEventBoards[0]}`).remove();
    hashIdEventBoards = hashIdEventBoards.filter((i) => i != hashIdEventBoards[0]);
  }

  s('event-board').style.display = 'block';
  setTimeout(() => {
    if (contDisplayBoardInstance === contDisplayBoard) {
      s('event-board').style.display = 'none';
      contDisplayBoard = 0;
    }
  }, 3000);
};

const resetEventBoard = () => {
  htmls('event-history-render', '');
  htmls('event-board', '');
  contDisplayBoard = 0;
  hashIdEventBoards = [];
};

const historyBoard = () => {
  return /*html*/ `
    
  <history-board style='display: none'>
    <sub-content-gui class='in'>

          <div class='in title-section'>${renderLang({ es: 'Historial de Eventos', en: 'Event History' })}</div>
          
          <event-history-render></event-history-render>

    </sub-content-gui>
  </history-board>
    
    `;
};
