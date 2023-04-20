const renderToggleSwitch = (options) => {
  const factor = options && options.factor ? options.factor : 25;
  const wFactor = 2.3;
  const roundFactor = 0.7;
  setTimeout(() => {
    s(`.ts-container-${options.id}`).onclick = () => {
      if (s(`.${options.id}`).checked) {
        s(`.${options.id}`).checked = false;
        s(`.ts-round-${options.id}`).style.left = factor * 0.1 + 'px';
        htmls(`.ts-label-${options.id}`, options.label[0]);
        s('.ts-round-' + options.id).style.background = 'gray';
      } else {
        s(`.${options.id}`).checked = true;
        s(`.ts-round-${options.id}`).style.left = factor * wFactor - factor * 0.1 - factor * roundFactor + 'px';
        htmls(`.ts-label-${options.id}`, options.label[1]);
        s('.ts-round-' + options.id).style.background = options.activeColor ? options.activeColor : 'green';
      }
      if (options && options.onChange) options.onChange(s(`.${options.id}`).checked);
    };

    if (options && options.checked == true) s(`.ts-container-${options.id}`).click();
  });
  return /*html*/ `
    <style>
        .ts-container-${options.id} {
            width: ${factor * wFactor}px;
            height: ${factor}px;
            background: #121212;
            border-radius: ${factor * 0.1}px;
            cursor: pointer;
        }
        .ts-round-${options.id} {
            border-radius: 50%;
            height: ${factor * roundFactor}px;
            width: ${factor * roundFactor}px;
            background: gray;
            transition: .3s;
        }
        .ts-label-${options.id} {
            font-size: ${factor * 0.5}px;
            ${borderChar(factor * 0.5, 'black')};
        }
    </style>
    <input type='checkbox' class='${options.id}' style='display: none'>        
    <div class='in flr ts-label-${options.id}'>${options.label[0]}</div>
    <div class='in flr ts-container-${options.id}'>
        <div class='abs ts-round-${options.id}' style='top: ${factor * 0.2}px; left: ${factor * 0.2}px;'>
        </div>
    </div> 
    `;
};
