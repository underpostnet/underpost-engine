const quests = [
  {
    title: { es: 'Hueso de floki', en: "Floki's bone" },
    maps: ['orange-over-purple', 'zax-shop'],
    sprite: 'ayleen',
    name: 'Ayleen',
    dialog: { en: `Please find floki's bone`, es: 'Porfavor encuentra el hueso de floki' },
  },
  {
    title: { es: 'Protesis subkishin', en: 'Subkishin Prosthesis' },
    maps: 'all',
    sprite: 'punk',
    name: 'Tim',
    dialog: {
      en: 'KSV (Kishin SubMutant Virus), the target in this quest. Researchers from our lab observed the virus infected an old prosthesis arm that we stop using because it is obsolete. The virus took the DNA of the arm and spread to its host cell. The infected cells produced antibodies, which that instead of killing the parasite itself, it adapts to it. Then I mutate and  now he is a fuck demon that roams the streets of cyberia. Give me a sample of the virus, a reward awaits you',
      es: 'Sub Mutante Kishin conocido como virus KSV (Kishin SubMutant Virus), es el objetivo de esta misión. Investigadores de nuestro laboratorio observaron que el virus infectó una antigua prótesis de brazo que dejamos de usar por obsoleta. El virus tomó el ADN del brazo y se propagó a su célula huésped. Las células infectadas produjeron anticuerpos, que en lugar de matar al propio parásito, se adaptaron a él. Luego muto y ahora es un jodido demonio que deambula por las calles de Cyberia. Consigue una muestra del virus, te espera una recompensa',
    },
  },
  {
    title: { en: 'SCP-2040', es: 'SCP-2040' },
    maps: ['todarp'],
    sprite: 'agent',
    name: 'Kinoshita',
    dialog: {
      es: `SCP-2040 es un robot humanoide compuesto principalmente de hierro, vidrio y plástico. Su diseño es muy simple, posee un sistema electrónico que es tecnológicamente inferior a los equivalentes modernos. Sin embargo, SCP-2040 exhibe una funcionalidad que no es posible con esta estructura. SCP-2040 posee una IA compleja que es casi indistinguible de una inteligencia humana y una fuente de energía aparentemente ilimitada que aún no ha requerido ningún reabastecimiento de combustible obvio. Cuando se le pregunta, SCP-2040 afirma que "está alimentado por energía nuclear" y se niega a dar más detalles. A menudo, SCP-2040 repetirá una frase a la que se refiere como su "mensaje principal" y pedirá una respuesta. Aunque SCP-2040 a menudo es autoritario al solicitar una respuesta, ha mostrado su voluntad de esperar indefinidamente si se le dice que aún se está formulando una respuesta. SCP-2040 generalmente se niega a comunicarse sobre temas que no sean su misión principal, pero puede distraerse cuando se le pregunta sobre su viaje a la Tierra o misiones anteriores. La siguiente es la transcripción del mensaje principal de SCP-2040: "EL UNIVERSO NO DEBIÓ TENER LEYES FÍSICAS; LAS LEYES FÍSICAS RESTRINGEN LA VIDA; LAS LEYES FÍSICAS ESTÁN CORROMPIENDO EL UNIVERSO; ESTAMOS TRATANDO DE CORREGIR ESTO; SOLICITAMOS SU AYUDA EN ESTE ASUNTO; POR FAVOR RESPONDE"`,
      en: `SCP-2040 is a humanoid robot composed primarily of iron, glass, and plastic. Its design is very simplistic, possessing an electronic system which is technologically inferior to modern equivalents. However, SCP-2040 exhibits functionality not possible with this structure. SCP-2040 possesses a complex AI that is almost indistinguishable from a human intelligence, and a seemingly limitless power-source that has not yet required any obvious refueling. When questioned, SCP-2040 claims that it "is powered by nuclear energy" and refuses to elaborate further. Often, SCP-2040 will repeat a phrase it refers to as its "primary message" and ask for a response. Though SCP-2040 is often overbearing in requesting a response, it has shown a willingness to wait indefinitely if told that a response is still being formulated. SCP-2040 usually refuses to communicate about topics other than its primary mission, but can be distracted when questioned about its journey to Earth or previous missions. The following is the transcription of SCP-2040's primary message: "THE UNIVERSE WAS NOT MEANT TO HAVE PHYSICAL LAWS; PHYSICAL LAWS RESTRICT LIFE; PHYSICAL LAWS ARE CORRUPTING THE UNIVERSE; WE ARE ATTEMPTING TO CORRECT THIS; WE REQUEST YOUR ASSISTANCE IN THIS MATTER; PLEASE RESPOND"`,
    },
  },
];

export { quests };
