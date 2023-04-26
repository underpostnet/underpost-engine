const renderStatsGrid = (element) => {
  htmls(
    '.character-stats-grid',
    /*html*/ `

    <div class='in  character-stats-grid-row'>
        <span class='character-stats-grid-label'>
          ${renderLang({ es: 'nombre', en: 'username' }).toUpperCase()} 
        </span>
        ${getDisplayName(element)}
    </div>
    <div class='in  character-stats-grid-row'>
        <span class='character-stats-grid-label'>
          ${renderLang({ es: 'vida maxima', en: 'max life' }).toUpperCase()} 
        </span>
        ${element.maxLife}
    </div>
    <div class='in  character-stats-grid-row'>
        <span class='character-stats-grid-label'>
          ${renderLang({ en: 'attack points', es: 'puntos de ataque' }).toUpperCase()} 
        </span>
        ${element.attackValue}
    </div>
    <div class='in  character-stats-grid-row'>
        <span class='character-stats-grid-label'>
          ${renderLang({ en: 'life regeneration', es: 'regeneración de vida' }).toUpperCase()} 
        </span>
        ${element.passiveHealValue} / s
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
