const renderChatMsg = (element, msg) => {
  if (element.id !== socket.id && s('chat').style.display === 'none') renderNotiCircleChat();
  append(
    'history-chat',
    /*html*/ `
  
  <div class='in chat-msg-content' ${element.id === socket.id ? `style='text-align: right'` : ''}>
      <span style='font-size: 8px'>${new Date().toISOString().replace('T', ' ').slice(0, -8)}</span>
      <br>
      <img class='inl chat-avatar-icon' src='/sprites/${
        element.sprite
      }/08/0.png'><span style='color: yellow'>${getDisplayName(element)}</span>
      <br>
      ${msg}
  </div>
  
  `
  );
  setTimeout(() => {
    s('history-chat').scrollTop = s('history-chat').scrollHeight;
    // s('history-chat').scrollTop = s('history-chat').offsetTop;
  });
};

const chat = () => {
  setTimeout(() => {
    s('.btn-submit-chat').onclick = (e) => {
      e.preventDefault();
      const msg = s('.chat-input').value;
      // console.log('chat msg', msg);
      if (msg !== undefined && msg !== '') {
        renderChatMsg(
          elements.user.find((element) => element.id === socket.id),
          msg
        );
        socket.emit(
          'event',
          JSON.stringify({
            event: 'chat',
            msg,
          })
        );
        s('.chat-input').value = '';
      }
    };
  });
  return /*html*/ `
    <chat style='display: none'>
        <sub-content-gui class='in'>

            <div class='in title-section'>${renderLang({ es: 'Chat', en: 'Chat' })}</div>
            <history-chat class='in'></history-chat>         
            <form>
                <input type='text' class='chat-input'>
                <button type='submit' class='inl custom-cursor btn-submit-chat'>${renderLang({
                  es: 'Enviar',
                  en: 'Send',
                })}</button>
            </form>
        </sub-content-gui>
    </chat>
    
    `;
};
