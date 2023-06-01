const questsLogicsStorage = {};

const getInitStateSucessQuest = (input, setSuccessQuest) => {
  if (elements['user'].find((e) => e.id === socket.id).successQuests.includes(input.id)) {
    setSuccessQuest(input);
    return true;
  }
  return false;
};

const endNotiUpdateElementQuestValidator = (input, successQuest) => {
  if (!successQuest) {
    renderQuestNotification(input);
    socket.emit(
      'event',
      JSON.stringify({
        event: 'success-quest',
        id: input.id,
        elementFromQuest: { sprite: input.sprite, username: input.name },
      })
    );
  }
};

const renderQuestInfoGUI = (input, instructions) => {
  return /*html*/ `
  <div class='in quest-section-info'>
    <span style='color: yellow'>
      ${renderLang({ en: 'INSTRUCTIONS:', es: 'INSTRUCCIONES:' })}
    </span>
    <br><br>
    ${instructions}
  </div>
  <div class='in quest-section-info'>
    <span style='color: yellow'>
      ${renderLang({ en: 'REWARDS:', es: 'RECOMPENSAS:' })}
    </span>
    <br><br>
    <div class='fl'>
        ${input.reward.items
          .map((item) => {
            setTimeout(async () => {
              let result;
              if (item.id == 'koyn') {
                result = renderKoynLogo(item.count, false, 'bag-koyn-indicator');
              } else if (item.id == 'cryptokoyn') {
                result = renderKoynLogo(item.count, 'crypto', 'bag-cryptokoyn-indicator');
              } else {
                result = await getItemData(item);
              }
              htmls(`.box-reward-${input.id}-${item.id}`, renderItemBox(result, item.count));
              s(`.box-reward-${input.id}-${item.id}`).onclick = () =>
                renderItemModal({
                  ...result.data,
                  count: () => item.count,
                  active: () => false,
                  typeModal: 'reward',
                });
            });
            return /*html*/ `
              <div class="inl fll grid-cell custom-cursor box-reward-${input.id}-${item.id}"> </div>
          `;
          })
          .join('')}
    </div>
  </div>
  `;
};

const renderQuestNotification = (input) => {
  const idNotiQuest = 'noti-quest' + s4() + s4();
  append(
    'body',
    /*html*/ `
    <div class='fix center quest-noti-content ${idNotiQuest}'>
        <div class='abs center'>
            <img class='noti-quest-sprite-img' src='/sprites/${input.sprite}/08/0.png'>
            <br><br>
            ${renderLang(input.successDialog)}
        </div>
    </div>
  `
  );
  setTimeout(() => {
    s(`.${idNotiQuest}`).remove();
  }, 2000);
};

const renderMapsQuests = () => {
  resetNotiCircleQuests();
  htmls(
    'map-quests-render',
    /*html*/ mapMetaData.quests
      .map((questData) => {
        if (!elements['user'].find((e) => e.id === socket.id).successQuests.includes(questData.id))
          renderNotiCircleQuests();
        let openQuest = false;
        const hashQuest = 'quest-' + s4() + s4();

        setTimeout(() => {
          s(`.qmbsm-${hashQuest}`).onclick = () => {
            openQuest = true;

            htmls(`.qmbd-${hashQuest}`, renderLang(questData.dialog) + '.');
            s(`.qmbsm-${hashQuest}`).style.display = 'none';
            s(`.qmbsl-${hashQuest}`).style.display = 'inline-table';
          };
          s(`.qmbsl-${hashQuest}`).onclick = () => {
            openQuest = false;
            htmls(`.qmbd-${hashQuest}`, `${renderLang(questData.dialog).split('.')[0]}.`);
            s(`.qmbsl-${hashQuest}`).style.display = 'none';
            s(`.qmbsm-${hashQuest}`).style.display = 'inline-table';
          };
          let questRenderCard;
          let setSuccessQuest;
          eval(questData.eval);
          htmls(`.quest-render-${questData.id}`, questRenderCard(questData, setSuccessQuest));
        });
        return /*html*/ `
        <div class='fl custom-cursor quest-menu-btn-content ${hashQuest}'>
            <div class='in fll quest-menu-btn-cell-0'>
                <div class='in quest-menu-btn-cell'>
                  <img class='in quest-menu-sprite-img' src='/sprites/${questData.sprite}/08/0.png'>
                </div> 
            </div>
            <div class='in fll quest-menu-btn-cell-1'>
                <div class='in quest-menu-btn-cell'>
                      <br>
                      <div class='in quest-menu-btn-name-npc'>
                          ${questData.name}
                      </div>
                      <div class='in quest-menu-btn-title' style='${borderChar(2, 'yellow')}'>
                          "${renderLang(questData.title)}"
                      </div>                      
                      <div class='in quest-menu-btn-dialog qmbd-${hashQuest}'>
                          ${renderLang(questData.dialog).split('.')[0]}.
                      </div>
                      <div class='in quest-btn-see-content'>
                          <button class='inl quest-menut-btn-see custom-cursor qmbsm-${hashQuest}'>
                              ${renderLang({ es: 'Ver más', en: 'See more' })}...
                          </button>
                          <button class='inl quest-menut-btn-see custom-cursor qmbsl-${hashQuest}' style='display: none'>
                              ${renderLang({ es: 'Ver menos', en: 'See Less' })}.
                          </button>
                      </div>
                      <div class='in quest-render-logic quest-render-${questData.id}'>
                      </div>
                </div>
            </div>
            <div class='abs success-quest-content success-quest-content-${
              questData.id
            }' style='display: none; ${borderChar(1, 'black')}'>
              <div class='abs center'>
                [ <span style='font-size: 20px'>&check;</span> ${renderLang({ es: 'COMPLETADO', en: 'COMPLETED' })} ]
              </div>
            </div>
        </div>
        `;
      })
      .join('')
  );
};

const quests = () => {
  return /*html*/ `
    <quests style='display: none'>
      <sub-content-gui class='in'>

            <div class='in title-section'>${renderLang({ es: 'Logros', en: 'Achievements' })}</div>
            
            <map-quests-render></map-quests-render>

      </sub-content-gui>
    </quests>
    `;
};
