const renderStatsGrid = (element) => {
  if (element.itemType === 'currency') return '';
  let SKIN_DATA_RENDER = '';
  let PRE_VALUE_ICON = '+';
  if (element.type === 'user') {
    PRE_VALUE_ICON = '';
    SKIN_DATA_RENDER = /*html*/ `
    <div class='in character-stats-grid-row'>
      <div class='in character-stats-grid-label'>
        ${renderLang({ es: 'skin', en: 'skin' }).toUpperCase()} 
      </div>
      <div class='in value-stat-content'>
        ${element.sprite.toUpperCase()}
      </div>
    </div>
    `;
  }
  return /*html*/ `
       ${SKIN_DATA_RENDER}
      <div class='in character-stats-grid-row'>
        <div class='in character-stats-grid-label'>
          ${renderLang({ es: 'vida maxima', en: 'max life' }).toUpperCase()} 
        </div>
        <div class='in value-stat-content'>
          ${PRE_VALUE_ICON} ${element.maxLife} PT.
        </div>
      </div>
      <div class='in character-stats-grid-row'>
        <div class='in character-stats-grid-label'>
          ${renderLang({ en: 'attack points', es: 'puntos de ataque' }).toUpperCase()} 
        </div>
        <div class='in value-stat-content'>
          ${PRE_VALUE_ICON} ${element.attackValue} PT. / ${element.velAttack}ms
        </div>
      </div>
      <div class='in character-stats-grid-row'>
        <div class='in character-stats-grid-label'>
          ${renderLang({ en: 'life regeneration', es: 'regeneración de vida' }).toUpperCase()} 
        </div>
        <div class='in value-stat-content'>
          ${PRE_VALUE_ICON} ${element.passiveHealValue} PT. / ${element.velPassiveHealValue}ms
        </div>
      </div>
      <div class='in character-stats-grid-row'>
        <div class='in character-stats-grid-label'>
          ${renderLang({ en: 'movement speed', es: 'velocidad de movimiento' }).toUpperCase()} 
        </div>
        <div class='in value-stat-content'>
           ${
             element.type === 'user'
               ? /*html*/ `1 ${renderLang({
                   es: 'Cuadrante',
                   en: 'Quadrant',
                 })} / `
               : ''
           } ${updateTimeInterval * element.velFactor}ms 
        </div>
      </div>

      


  <!--
  <br>

  <pre>
    ${JSON.stringify(element, null, 4)}
  </pre>    
   -->
  
  `;
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
