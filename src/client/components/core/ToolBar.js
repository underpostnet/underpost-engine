import { getId } from './CommonJs.js';
import { Themes, Css, darkTheme } from './Css.js';
import { EventsUI } from './EventsUI.js';
import { Modal } from './Modal.js';
import { Responsive } from './Responsive.js';
import { append, htmls, s } from './VanillaJs.js';

const ToolBar = {
  Data: {},
  Render: async function (options = { id: 'ToolBar', tools: [] }) {
    const id = options?.id ? options.id : getId(this.Data, 'ToolBar-');
    this.Data[id] = {};

    const style = {
      height: '40px',
      width: '180px',
      'z-index': 6, // ??
      'font-size': '18px',
      overflow: 'hidden',
      resize: 'none',
      // color: `#d9d9d9`,
      top: '5px',
      // right: '10px',
      // border: '1px solid red',
      'box-shadow': 'none !important',
    };

    const { barConfig } = await Themes[Css.currentTheme]();
    barConfig.buttons.maximize.disabled = true;
    barConfig.buttons.minimize.disabled = true;
    barConfig.buttons.restore.disabled = true;
    barConfig.buttons.menu.disabled = true;
    barConfig.buttons.close.disabled = true;
    await Modal.Render({
      id,
      barConfig,
      html: async () => html` <div class="fl ${id}-render"></div>`,
      titleClass: 'hide',
      style,
      dragDisabled: true,
    });
    Responsive.Event[id] = () => {
      s(`.${id}`).style.left = `${window.innerWidth - (180 + 10)}px`;
    };
    Responsive.Event[id]();
    if (options.tools)
      for (const tool of options.tools) {
        switch (tool.id) {
          case 'theme':
            this.toolBarThemeRender = () =>
              htmls(
                `.toolbar-theme-render`,
                html` <a> ${darkTheme ? html` <i class="fas fa-moon"></i>` : html`<i class="far fa-sun"></i>`}</a>`,
              );
            append(
              `.${id}-render`,
              html`
                <div class="in flr toolbar-slot toolbar-theme">
                  <div class="abs center toolbar-theme-render"></div>
                  <!--
          <i class="fas fa-adjust"></i> 
          -->
                </div>
              `,
            );
            this.toolBarThemeRender();
            EventsUI.onClick(`.toolbar-theme`, () => {
              let theme;
              if (darkTheme) theme = tool.themes.find((t) => !t.dark);
              else theme = tool.themes.find((t) => t.dark);
              Css.renderTheme(theme.theme);
              if (s(`.dropdown-option-${theme.theme}`)) s(`.dropdown-option-${theme.theme}`).click();
            });
            break;
          case 'lang':
            append(
              `.${id}-render`,
              html` <div class="in flr toolbar-slot toolbar-lang">
                <div class="abs center">
                  <div class="abs center"><a>${s('html').lang}</a></div>
                </div>
              </div>`,
            );
            EventsUI.onClick(`.toolbar-lang`, () => {});
            break;

          default:
            break;
        }
      }
  },
};

export { ToolBar };
