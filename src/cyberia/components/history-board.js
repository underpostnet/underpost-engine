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
