const renderStatsGrid = (element) => {
  htmls(
    '.character-stats-grid',
    /*html*/ `

    <div class='in  character-stats-grid-row'>
        <span class='character-stats-grid-label'>
          ${renderLang({ es: 'skin', en: 'skin' }).toUpperCase()} 
        </span>
        ${element.sprite.toUpperCase()}
    </div>
    <div class='in  character-stats-grid-row'>
        <span class='character-stats-grid-label'>
          ${renderLang({ es: 'vida maxima', en: 'max life' }).toUpperCase()} 
        </span>
        ${element.maxLife} PT.
    </div>
    <div class='in  character-stats-grid-row'>
        <span class='character-stats-grid-label'>
          ${renderLang({ en: 'attack points', es: 'puntos de ataque' }).toUpperCase()} 
        </span>
        ${element.attackValue} PT. / ${element.velAttack}ms
    </div>
    <div class='in  character-stats-grid-row'>
        <span class='character-stats-grid-label'>
          ${renderLang({ en: 'life regeneration', es: 'regeneración de vida' }).toUpperCase()} 
        </span>
        ${element.passiveHealValue} PT. / ${element.velPassiveHealValue}ms
    </div>

    <!--
    <br>
  
    <pre>
      ${JSON.stringify(element, null, 4)}
    </pre>    
     -->
    
    `
  );
};

const characterStats = () => {
  return /*html*/ `
    <character-stats style='display: none'>
      <sub-content-gui class='in'>

            <div class='in title-section'>${renderLang({ es: 'Estadistica de Personaje', en: 'Character Stats' })}</div>

            <div class='fl'>
                          <div class='in fll character-stats-section character-stats-grid'>

                          </div>
                          <div class='in fll character-stats-section'>

                                  <img class='in character-stats-img-avatar'>

                          </div>
                          
            </div>
            

      </sub-content-gui>
    </character-stats>
    `;
};
