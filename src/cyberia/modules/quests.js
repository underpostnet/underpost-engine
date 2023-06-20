const quests = [
  {
    id: 'floki-bone',
    title: { es: 'Hueso de floki', en: "Floki's bone" },
    maps: 'all', // ['zax-shop'],
    sprite: 'ayleen',
    name: 'Ayleen',
    dialog: {
      es: `Estoy buscando su ayuda para localizar el hueso perdido de mi amada mascota. Es importante para mí, y no puedo soportar ver a mi amigo sin él. Por favor, ayúdame a encontrar este hueso`,
      en: `I am seeking your help to locate the lost bone of my beloved pet. It important for me, and I can't bear to see my friend without it. Please assist me in finding this bone`,
    },
    successDialog: {
      es: `Muchas gracias !!`,
      en: `Thanks very much !! `,
    },
    reward: {
      stats: {},
      items: [
        { id: 'koyn', count: 10 },
        { id: 'ice-cream', count: 1 },
      ],
    },
    setSuccessQuest: (input) => {
      htmls(`.quest-count-${input.id}`, 1);
      s(`.success-quest-content-${input.id}`).style.display = 'block';
    },
    logic: (input, setSuccessQuest) => {
      setTimeout(() => {
        let successQuest = getInitStateSucessQuest(input, setSuccessQuest);

        if (hashIntervals[socket.id][input.id]) clearInterval(hashIntervals[socket.id][input.id]);
        // if (successQuest === true) return;

        hashIntervals[socket.id][input.id] = setInterval(() => {
          if (!elements['user'].find((e) => e.id === socket.id)) return;
          if (elements['user'].find((e) => e.id === socket.id).successQuests.includes(input.id)) successQuest = true;
          if (
            (input.maps !== 'all' && !input.maps.includes(mapMetaData.map)) ||
            !elements['object'].find((e) => e.id === input.id)
          )
            return clearInterval(hashIntervals[socket.id][input.id]);

          const userElement = elements['user'].find((e) => e.id === socket.id);
          const boneElement = elements['object'].find((e) => e.id === input.id);

          if (userElement.render.x === boneElement.render.x && userElement.render.y === boneElement.render.y) {
            removePixiElement(boneElement);
            elements[boneElement.type].splice(
              elements[boneElement.type].findIndex((element) => element.id === boneElement.id),
              1
            );
            endNotiUpdateElementQuestValidator(input, successQuest);
            return clearInterval(hashIntervals[socket.id][input.id]);
          }
        }, 100);
      });
      return renderQuestInfoGUI(
        input,
        /*html*/ `
        ${renderLang({ en: "Find floki's bone", es: 'Encuentra el hueso de floki' })}
        <br><br>
        <div class='in' style='color: yellow'>
          [ <span class='quest-count-${input.id}'>0</span> / 1 ]
        </div>
            `
      );
    },
  },
  {
    id: 'subkishin-prosthesis',
    title: { es: 'Protesis subkishin', en: 'Subkishin Prosthesis' },
    maps: 'all', // ['orange-over-purple'],
    sprite: 'punk',
    name: 'Tim',
    dialog: {
      en: 'KSV (Kishin SubMutant Virus), the target in this quest. Researchers from our lab observed the virus infected an old prosthesis arm that we stop using because it is obsolete. The virus took the DNA of the arm and spread to its host cell. The infected cells produced antibodies, which that instead of killing the parasite itself, it adapts to it. Then I mutate and  now he is a fuck demon that roams the streets of cyberia. Give me a sample of the virus, a reward awaits you',
      es: 'Sub Mutante Kishin conocido como virus KSV (Kishin SubMutant Virus), es el objetivo de esta misión. Investigadores de nuestro laboratorio observaron que el virus infectó una antigua prótesis de brazo que dejamos de usar por obsoleta. El virus tomó el ADN del brazo y se propagó a su célula huésped. Las células infectadas produjeron anticuerpos, que en lugar de matar al propio parásito, se adaptaron a él. Luego muto y ahora es un jodido demonio que deambula por las calles de Cyberia. Consigue una muestra del virus, te espera una recompensa',
    },
    successDialog: {
      es: `Excelente trabajo, toma unas monedas.`,
      en: `Excellent work, take some coins.`,
    },
    reward: {
      stats: {},
      items: [{ id: 'koyn', count: 20 }],
    },
    setSuccessQuest: (input) => {
      htmls(`.quest-count-${input.id}`, 1);
      s(`.success-quest-content-${input.id}`).style.display = 'block';
    },
    logic: (input, setSuccessQuest) => {
      setTimeout(() => {
        let successQuest = getInitStateSucessQuest(input, setSuccessQuest);
        if (successQuest === true) return;
        questsLogicsStorage[input.id] = {
          type: 'kill-element',
          checkStatusQuest: (eventElement) => {
            const { fromElmement, toElement } = eventElement;
            if (
              'kishins' === toElement.sprite &&
              'orange-over-purple' === toElement.map &&
              fromElmement.id === socket.id
            ) {
              endNotiUpdateElementQuestValidator(input, successQuest);
              questsLogicsStorage[input.id] = undefined;
              delete questsLogicsStorage[input.id];
            }
          },
          input,
        };
      });
      return renderQuestInfoGUI(
        input,
        /*html*/ `
        ${renderLang({ en: 'Defeat one SubKishin.', es: 'Derrota a un SubKishin.' })}
        <br><br>
        <div class='in' style='color: yellow'>
          [ <span class='quest-count-${input.id}'>0</span> / 1 ]
        </div>
            `
      );
    },
  },
  {
    id: 'scp-2040',
    title: { en: 'SCP-2040', es: 'SCP-2040' },
    maps: 'all', // ['todarp'],
    sprite: 'agent',
    name: 'Kinoshita',
    dialog: {
      es: `SCP-2040 es un robot humanoide compuesto principalmente de hierro, vidrio y plástico. Su diseño es muy simple, posee un sistema electrónico que es tecnológicamente inferior a los equivalentes modernos. Sin embargo, SCP-2040 exhibe una funcionalidad que no es posible con esta estructura. SCP-2040 posee una IA compleja que es casi indistinguible de una inteligencia humana y una fuente de energía aparentemente ilimitada que aún no ha requerido ningún reabastecimiento de combustible obvio. Cuando se le pregunta, SCP-2040 afirma que "está alimentado por energía nuclear" y se niega a dar más detalles. A menudo, SCP-2040 repetirá una frase a la que se refiere como su "mensaje principal" y pedirá una respuesta. Aunque SCP-2040 a menudo es autoritario al solicitar una respuesta, ha mostrado su voluntad de esperar indefinidamente si se le dice que aún se está formulando una respuesta. SCP-2040 generalmente se niega a comunicarse sobre temas que no sean su misión principal, pero puede distraerse cuando se le pregunta sobre su viaje a la Tierra o misiones anteriores. La siguiente es la transcripción del mensaje principal de SCP-2040: "EL UNIVERSO NO DEBIÓ TENER LEYES FÍSICAS; LAS LEYES FÍSICAS RESTRINGEN LA VIDA; LAS LEYES FÍSICAS ESTÁN CORROMPIENDO EL UNIVERSO; ESTAMOS TRATANDO DE CORREGIR ESTO; SOLICITAMOS SU AYUDA EN ESTE ASUNTO; POR FAVOR RESPONDE"`,
      en: `SCP-2040 is a humanoid robot composed primarily of iron, glass, and plastic. Its design is very simplistic, possessing an electronic system which is technologically inferior to modern equivalents. However, SCP-2040 exhibits functionality not possible with this structure. SCP-2040 possesses a complex AI that is almost indistinguishable from a human intelligence, and a seemingly limitless power-source that has not yet required any obvious refueling. When questioned, SCP-2040 claims that it "is powered by nuclear energy" and refuses to elaborate further. Often, SCP-2040 will repeat a phrase it refers to as its "primary message" and ask for a response. Though SCP-2040 is often overbearing in requesting a response, it has shown a willingness to wait indefinitely if told that a response is still being formulated. SCP-2040 usually refuses to communicate about topics other than its primary mission, but can be distracted when questioned about its journey to Earth or previous missions. The following is the transcription of SCP-2040's primary message: "THE UNIVERSE WAS NOT MEANT TO HAVE PHYSICAL LAWS; PHYSICAL LAWS RESTRICT LIFE; PHYSICAL LAWS ARE CORRUPTING THE UNIVERSE; WE ARE ATTEMPTING TO CORRECT THIS; WE REQUEST YOUR ASSISTANCE IN THIS MATTER; PLEASE RESPOND"`,
    },
    successDialog: {
      es: `Hasta la fecha, es la información más útil proporcionada por SCP-2040 sin cambiar el tema de su Mensaje principal.`,
      en: `To date, it is the most useful information given by SCP-2040 without it changing the subject to its Primary Message.`,
    },
    reward: {
      stats: {},
      items: [{ id: 'control2040', count: 1 }],
    },
    setSuccessQuest: (input) => {
      htmls(`.quest-count-${input.id}`, 1);
      s(`.success-quest-content-${input.id}`).style.display = 'block';
    },
    logic: (input, setSuccessQuest) => {
      setTimeout(() => {
        let successQuest = getInitStateSucessQuest(input, setSuccessQuest);
        // if (successQuest === true) return;

        const dataDialog = [
          [
            `I am not responding to your primary message. I will not respond to your primary message for the duration of this interaction. I would just like to ask you a few questions.`,
            `No estoy respondiendo a tu mensaje principal. No responderé a su mensaje principal durante la duración de esta interacción. Sólo me gustaría hacerle algunas preguntas.`,
          ],
          [`State your inquiries.`, `Indique sus consultas.`],
          [
            `Can you explain your primary message and tell us some information about who sent it?`,
            `¿Puede explicar su mensaje principal y darnos información sobre quién lo envió?`,
          ],
          [
            `To prevent a Messenger from affecting a response, it is against protocol for a Messenger to reveal classified information about a Primary Message and the Primary Message's senders. All inquiries must be addressed directly to the sender.`,
            `Para evitar que un Mensajero afecte una respuesta, es contra el protocolo que un Mensajero revele información clasificada sobre un Mensaje principal y los remitentes del Mensaje principal. Todas las consultas deben dirigirse directamente al remitente.`,
          ],
          [
            `I see. In that case, can you tell us anything about yourself, such as how were you built and how do you function?`,
            `Ya veo. En ese caso, ¿puede decirnos algo sobre usted, por ejemplo, cómo se formó y cómo funciona?`,
          ],
          [
            `I cannot explain my design or function. It is classified. However, it is publicly available information that I underwent upgrades specifically for this mission. I am now one of the few entities that can safely inhabit the Restricted Zone.`,
            `No puedo explicar mi diseño o función. Está clasificado. Sin embargo, es información disponible públicamente que realicé actualizaciones específicamente para esta misión. Ahora soy una de las pocas entidades que pueden habitar con seguridad la Zona restringida.`,
          ],
          [
            `Restricted Zone? Can you tell me more about this Restricted Zone?`,
            `¿Zona restringida? ¿Puedes contarme más sobre esta Zona Restringida?`,
          ],
          [
            `My emotion circuits show surprise that you inquire that. However, my emotion circuits show surprise that you exist at all. With all the strict requirements, it was thought that life could not exist here, until very recently. Outside the Zone, the requirements for life are much less strict. Outside the Zone, life is much more plentiful and varied. Your ignorance about the Universe reminds me of the Addisonhers, which I encountered after crash landing on their home planet.`,
            `Mis circuitos emocionales muestran sorpresa de que preguntes eso. Sin embargo, mis circuitos emocionales muestran sorpresa de que existas. Con todos los requisitos estrictos, se pensó que la vida no podría existir aquí, hasta hace muy poco tiempo. Fuera de la Zona, los requisitos para la vida son mucho menos estrictos. Fuera de la Zona, la vida es mucho más abundante y variada. Tu ignorancia sobre el Universo me recuerda a los Addisonher, a los que encontré después de un aterrizaje forzoso en su planeta de origen.`,
          ],
          [
            `Tell me more about life outside the Restricted Zone.`,
            `Cuéntame más sobre la vida fuera de la Zona restringida.`,
          ],
          [
            `To prevent a Messenger from affecting a response, it is against protocol for a Messenger to reveal classified information about a Primary Message and the Primary Message's senders. All inquiries must be addressed directly to the sender.`,
            `Para evitar que un Mensajero afecte una respuesta, es contra el protocolo que un Mensajero revele información clasificada sobre un Mensaje principal y los remitentes del Mensaje principal. Todas las consultas deben dirigirse directamente al remitente.`,
          ],
          [
            `What? How is that related to your Primary Message?`,
            `¿Qué? ¿Cómo se relaciona eso con su mensaje principal?`,
          ],
          [
            `To prevent a Messenger from affecting a response, it is against protocol for a Messenger to reveal classified information about a Primary Message and the Primary Message's senders. All inquiries must be addressed directly to the sender.`,
            `Para evitar que un Mensajero afecte una respuesta, es contra el protocolo que un Mensajero revele información clasificada sobre un Mensaje principal y los remitentes del Mensaje principal. Todas las consultas deben dirigirse directamente al remitente.`,
          ],
          [
            `Fine. I thought we were finally getting somewhere. I suppose this interview is over.`,
            `Bien. Pensé que finalmente estábamos llegando a alguna parte. Supongo que esta entrevista ha terminado.`,
          ],
          [`Human. I have a statement to make.`, `Humano. Tengo una declaración que hacer.`],
          [`Oh? What is that?`, `Ah? ¿Qué es eso?`],
          [
            `Please inform your leaders: Time passes differently in the Restricted Zone. Therefore, I am able to wait for a response. However, I cannot wait forever. We need your help.`,
            `Informe a sus líderes: el tiempo pasa de manera diferente en la Zona Restringida. Por lo tanto, puedo esperar una respuesta. Sin embargo, no puedo esperar para siempre. Necesitamos tu ayuda.`,
          ],
        ];

        if (hashIntervals[socket.id][input.id]) clearInterval(hashIntervals[socket.id][input.id]);
        hashIntervals[socket.id][input.id] = setInterval(() => {
          const userElement = elements['user'].find((e) => e.id === socket.id);
          const zoneElement = elements['safe-zone'].find((e) => e.render.x === 8 && e.render.y === 10);

          if (userElement && zoneElement) {
            const src = `/icons/200x200/safe-quest-zone.png`;
            if (
              userElement.render.x === zoneElement.render.x &&
              userElement.render.y === zoneElement.render.y &&
              userElement.path.length === 0
            ) {
              if (pixi[zoneElement.type][zoneElement.id][src].visible === true)
                pixi[zoneElement.type][zoneElement.id][src].visible = false;
              let currentIndexDialog = 0;
              if (!s(`${input.id}`) && s('gui-layer').style.display === 'none') {
                mainCloseGUI();
                prepend(
                  'gui-layer',
                  /*html*/ `
                 <${input.id}>
                  <sub-content-gui class='in modal-${input.id}'>

                    <style>
                      .cell-quest-${input.id} {
                        width: 50%;
                      }
                      .img-quest-${input.id} {
                        width: 90%;
                        height: auto;
                        margin: auto;
                        max-width: 200px;
                      }
                      .content-text-${input.id} {
                        padding: 10px;
                        background: white;
                        color: black;
                        border-radius: 10px;
                        font-size: 10px;
                        min-height: 100px;
                      }
                      .content-btns-${input.id} {
                          width: 220px;
                          padding: 3px;
                          /* border: 2px solid yellow; */
                          margin: 3px;
                      }
                      /* http://apps.eky.hk/css-triangle-generator/ */
                      .triangle-bubble-a-${input.id} {
                        border-width: 15px 0px 15px 30px;                        
                        border-color: transparent transparent transparent white;
                        top: 20px;
                        right: -24px;
                      }
                      .triangle-bubble-b-${input.id} {
                        border-width: 15px 30px 15px 0px;
                        border-color: transparent white transparent transparent;
                        top: 20px;
                        left: -24px;
                      }
                      .triangle-bubble-${input.id} {
                        width: 0;
                        height: 0;
                        border-style: solid;
                      }
                    </style>

                    <div class='in quest-menu-btn-name-npc'>  
                      ${renderLang({ es: 'Logro', en: 'Achievement' })}
                    </div> 
                    <div class='in title-section'>
                      "${renderLang(input.title)}"
                    </div>
                    <div class='in'>                          
                          <div class='fl'>
                            <div class='in fll cell-quest-${input.id}'>
                              <div class='in content-text-${input.id} bubble-${input.id}-a'>  

                                  <div class='abs triangle-bubble-${input.id} triangle-bubble-a-${input.id}'>
                                  </div>
                                  <span class='bubble-${input.id}-a-text'>
                                    ${renderLang({
                                      es: dataDialog[currentIndexDialog][1],
                                      en: dataDialog[currentIndexDialog][0],
                                    })}
                                  </span>
                              </div>
                            </div>
                            <div class='in fll cell-quest-${input.id}'>
                                  <img src='/sprites/agent/04/0.png' class='in img-quest-${input.id}'>
                            </div>
                          </div>
                          <div class='fl'>
                            <div class='in fll cell-quest-${input.id}'>
                                <img src='/sprites/scp-2040/06/0.png' class='in img-quest-${input.id}'>
                            </div>
                            <div class='in fll cell-quest-${input.id}'>
                              <div class='in content-text-${input.id} bubble-${input.id}-b'>  
                                <div class='abs triangle-bubble-${input.id} triangle-bubble-b-${input.id}'>
                                </div>
                                <span class='bubble-${input.id}-b-text'>
                                </span>
                              </div>
                            </div>
                          </div>
                          <div class='in content-btns-${input.id}'>
                            <button class='inl fll custom-cursor btn-${input.id}-back'>
                                <
                            </button>
                            <button class='inl flr custom-cursor btn-${input.id}-next'>
                                ${renderLang({ es: 'Siguiente >', en: 'Next >' })}
                            </button>
                          </div>
                    </div>

                  </sub-content-gui>
                </${input.id}>
                  `
                );

                const btnActiveValidator = () => {
                  if (currentIndexDialog <= 0) s(`.btn-${input.id}-back`).style.display = 'none';
                  else s(`.btn-${input.id}-back`).style.display = 'inline-table';

                  if (currentIndexDialog >= dataDialog.length - 1) s(`.btn-${input.id}-next`).style.display = 'none';
                  else s(`.btn-${input.id}-next`).style.display = 'inline-table';

                  if (currentIndexDialog < 0) currentIndexDialog = 0;
                  if (currentIndexDialog > dataDialog.length - 1) currentIndexDialog = dataDialog.length - 1;

                  if (currentIndexDialog % 2 == 0) {
                    htmls(
                      `.bubble-${input.id}-a-text`,
                      renderLang({
                        es: dataDialog[currentIndexDialog][1],
                        en: dataDialog[currentIndexDialog][0],
                      })
                    );
                    s(`.bubble-${input.id}-b`).style.opacity = 0;
                    s(`.bubble-${input.id}-a`).style.opacity = 1;
                  } else {
                    htmls(
                      `.bubble-${input.id}-b-text`,
                      renderLang({
                        es: dataDialog[currentIndexDialog][1],
                        en: dataDialog[currentIndexDialog][0],
                      })
                    );
                    s(`.bubble-${input.id}-a`).style.opacity = 0;
                    s(`.bubble-${input.id}-b`).style.opacity = 1;
                  }
                };

                btnActiveValidator();

                s(`.btn-${input.id}-back`).onclick = () => {
                  currentIndexDialog--;
                  btnActiveValidator();
                };
                s(`.btn-${input.id}-next`).onclick = () => {
                  currentIndexDialog++;
                  btnActiveValidator();
                  if (
                    elements['user'].find((e) => e.id === socket.id) &&
                    !elements['user'].find((e) => e.id === socket.id).successQuests.includes(input.id)
                  ) {
                    if (currentIndexDialog === dataDialog.length - 1) {
                      endNotiUpdateElementQuestValidator(input, successQuest);
                      if (hashIntervals[socket.id][input.id]) clearInterval(hashIntervals[socket.id][input.id]);
                    }
                  }
                };

                tempGuiSections.push(input.id);
              }
            } else {
              if (s(`${input.id}`)) {
                s(`${input.id}`).remove();
                s('gui-layer').style.display = 'none';
              }
              if (pixi[zoneElement.type][zoneElement.id][src].visible === false)
                pixi[zoneElement.type][zoneElement.id][src].visible = true;
            }
          }
        }, 100);
      });
      return renderQuestInfoGUI(
        input,
        /*html*/ `       
           ${renderLang({
             en: 'Find Kinoshita dialogue with SCP 2040 in Todarp.',
             es: 'Encuentra el diálogo de Kinoshita con SCP 2040 en Todarp.',
           })}
           <br><br>
           <div class='in' style='color: yellow'>
             [ <span class='quest-count-${input.id}'>0</span> / 1 ]
           </div>
               `
      );
    },
  },
  {
    id: 'anon-a',
    title: { en: 'test-quest-a', es: 'test-quest-a' },
    maps: [],
    sprite: 'anon',
    name: 'Anon',
    dialog: {
      es: `Test`,
      en: `Test`,
    },
  },
  {
    id: 'anon-b',
    title: { en: 'test-quest-b', es: 'test-quest-b' },
    maps: [],
    sprite: 'anon',
    name: 'Anon',
    dialog: {
      es: `Test`,
      en: `Test`,
    },
  },
];

export { quests };
