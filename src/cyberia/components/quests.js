const renderMapsQuests = () => {
  resetNotiCircleQuests();
  htmls(
    'map-quests-render',
    /*html*/ mapMetaData.quests
      .map((questData) => {
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
          eval(questData.eval);
          htmls(`.quest-render-${questData.id}`, questRenderCard({ id: questData.id }));
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
