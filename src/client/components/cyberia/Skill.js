import { floatRound, newInstance, range, setPad, timer } from '../core/CommonJs.js';
import { borderChar } from '../core/Css.js';
import { Keyboard } from '../core/Keyboard.js';
import { SocketIo } from '../core/SocketIo.js';
import { append, getProxyPath, htmls, s } from '../core/VanillaJs.js';
import { SkillData, SkillType, Stat } from './CommonCyberia.js';
import { Elements } from './Elements.js';

const Skill = {
  renderMainKeysSlots: async function () {
    append(
      'body',
      html`
        <div class="abs main-skill-container">
          ${range(0, 3)
            .map(
              (i) => html`
                <div class="in fll main-skill-slot main-skill-slot-${i}">
                  <img
                    class="abs center main-skill-background-img main-skill-background-img-${i}"
                    src="${getProxyPath()}assets/joy/btn.png"
                  />
                  <div class="main-skill-img-container-${i}"></div>
                  <div class="abs center main-skill-cooldown main-skill-cooldown-${i}" style="display: none;">
                    <div
                      class="abs center main-skill-cooldown-delay-time-text main-skill-cooldown-delay-time-text-${i}"
                    ></div>
                  </div>
                  <div class="abs center main-skill-key-text main-skill-key-text-${i}"></div>
                </div>
              `,
            )
            .join('')}
        </div>
      `,
    );
  },
  setMainKeysSkill: function () {
    let indexSkillIteration = -1;
    Keyboard.Event['main-skill'] = {};
    Elements.LocalDataScope['user']['main']['skill'] = {};

    for (const skillKey of Object.keys(Elements.Data.user.main.skill.keys)) {
      indexSkillIteration++;
      const indexSkill = indexSkillIteration;
      let triggerSkill = () => null;
      let cooldownActive = false;
      htmls(`.main-skill-key-text-${indexSkill}`, SkillType[skillKey].keyboard);

      if (Elements.Data.user.main.skill.keys[skillKey]) {
        htmls(
          `.main-skill-img-container-${indexSkill}`,
          html` <img class="abs center main-skill-img main-skill-img-${indexSkill}" /> `,
        );
        s(`.main-skill-img-${indexSkill}`).src = `${getProxyPath()}assets/skill/${
          Elements.Data.user.main.skill.keys[skillKey]
        }/animation.gif`;
        triggerSkill = (e, ms, headerRender = '', type) => {
          if (e && e.preventDefault) e.preventDefault();
          if (Elements.Data.user.main.life <= 0 && type !== 'dead') return;
          if (!cooldownActive) {
            cooldownActive = true;
            if (type !== 'dead')
              SocketIo.Emit('skill', {
                status: 'create',
                skillKey,
              });
            const statData = Stat.get[Elements.Data.user.main.skill.keys[skillKey]]();
            let currentCooldown = ms ? newInstance(ms) : newInstance(statData.cooldown);
            s(`.main-skill-cooldown-${indexSkill}`).style.display = 'block';
            const reduceCooldown = async () => {
              const cooldownDisplayValue = currentCooldown / 1000;
              htmls(
                `.main-skill-cooldown-delay-time-text-${indexSkill}`,
                `${headerRender}${setPad(setPad(floatRound(cooldownDisplayValue, 3), '0', 2, true), '0', 2)} s`,
              );
              await timer(50);
              currentCooldown -= 50;
              if (currentCooldown > 0) reduceCooldown();
              else {
                cooldownActive = false;
                s(`.main-skill-cooldown-${indexSkill}`).style.display = 'none';
              }
            };
            reduceCooldown();
          }
        };
      } else {
        htmls(`.main-skill-img-container-${indexSkill}`, '');
      }

      s(`.main-skill-slot-${indexSkill}`).onclick = triggerSkill;
      Keyboard.Event['main-skill'][SkillType[skillKey].keyboard.toLowerCase()] = triggerSkill;
      Keyboard.Event['main-skill'][SkillType[skillKey].keyboard.toUpperCase()] = triggerSkill;
      Elements.LocalDataScope['user']['main']['skill'][indexSkill] = triggerSkill;
    }
  },
  renderDeadCooldown: function ({ type, id }) {
    if (Elements.LocalDataScope[type][id].skill)
      for (const skillKey of Object.keys(Elements.LocalDataScope[type][id].skill)) {
        Elements.LocalDataScope[type][id].skill[skillKey](
          {},
          Elements.Data[type][id].deadTime,
          html`<i class="inl fa-solid fa-ban" style="color: red; top: 10px; ${borderChar(2, 'black')}"></i> <br />`,
          'dead',
        );
      }
  },
};

export { Skill };
