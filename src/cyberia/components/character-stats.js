const characterSlots = ['skin', 'helmet', 'faction-symbol', 'breastplate', 'weapon', 'legs', 'talisman'];

const skillTypes = ['skill_basic', 'skill_primary', 'skill_secundary'];

const resetCharacterSlots = () => characterSlots.map((cs) => htmls(`.${cs}-equip-content`, ''));

const renderTitleTypeSlot = (itemType) => {
  itemType = itemType.replaceAll('-', '<br>').replaceAll('_', '<br>');
  return /*html*/ `
    <div class='abs center title-type-equip'>
      ${itemType}
    </div>
  `;
};

const renderStatsGrid = (element) => {
  if (element.itemType === 'currency') return '';

  let PRE_VALUE_ICON = '+';
  if (element.type === 'user') {
    PRE_VALUE_ICON = '';
  }
  return /*html*/ `
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
           } ${ceil10(updateTimeInterval * element.velFactor, 0)}ms 
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

                              <div class='in'>
                                   ${characterSlots
                                     .map(
                                       (cs) => /*html*/ `
                              ${cs === 'skin' ? `<div class='in character-stats-img-avatar'>` : ''}
                                   <div class='abs center grid-cell-equip custom-cursor ${cs}-equip-content'>
                                      ${renderTitleTypeSlot(cs)}
                                  
                                   </div>
                              ${cs === 'skin' ? `</div>` : ''}
                                   `
                                     )
                                     .join('')}      
                              </div>    
                              <div class='in skills-equip-content'>
                                ${skillTypes
                                  .map((cs) => {
                                    return /*html*/ `
                                        <div class='inl grid-cell-equip custom-cursor ${cs}-equip-content'>
                                                ${renderTitleTypeSlot(cs)}
                                        </div>
                                        `;
                                  })
                                  .join('')}
                              </div>                   

                          </div>
                          
            </div>
            <br><br><br><br>

      </sub-content-gui>
    </character-stats>
    `;
};
