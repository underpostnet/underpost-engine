import { BtnIcon } from './BtnIcon.js';
import { Translate } from './Translate.js';
import { htmls, s } from './VanillaJs.js';

const LogOut = {
  Event: {},
  Trigger: async function (options) {
    for (const eventKey of Object.keys(this.Event)) await this.Event[eventKey](options);
    if (s(`.session`))
      htmls(
        `.session`,
        html`<style>
          .session-in-log-out {
            display: block;
          }
          .session-inl-log-out {
            display: inline-table;
          }
          .session-in-log-in {
            display: none;
          }
          .session-inl-log-in {
            display: none;
          }
        </style>`,
      );
  },
  Render: async function () {
    setTimeout(() => {
      s('.btn-log-out').onclick = (e) => {
        e.preventDefault();
        LogOut.Trigger();
      };
    });
    // Translate.Render('confirm-logout')
    return html` <form class="in">
      <div class="in">
        ${await BtnIcon.Render({
          class: 'section-mp btn-custom btn-log-out',
          label: html`<i class="fa-solid fa-power-off"></i> ${Translate.Render('log-out')}`,
          type: 'submit',
        })}
      </div>
    </form>`;
  },
};

export { LogOut };
