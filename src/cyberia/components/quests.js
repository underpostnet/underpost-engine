const renderMapsQuests = () => {
  htmls(
    'map-quests-render',
    /*html*/ mapMetaData.quests
      .map((questData) => {
        return /*html*/ `
        <div class='fl custom-cursor quest-menu-btn-content'>
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
                      <div class='in quest-menu-btn-dialog'>
                          ${renderLang(questData.dialog).split('.')[0]}.
                      </div>
                      <div class='in'>
                          <button class='inl quest-menut-btn-see-more custom-cursor'>
                              ${renderLang({ es: 'Ver más', en: 'See more' })}
                          </button>
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

            <div class='in title-section'>${renderLang({ es: 'Misiones', en: 'Quests' })}</div>
            
            <map-quests-render></map-quests-render>

      </sub-content-gui>
    </quests>
    `;
};
