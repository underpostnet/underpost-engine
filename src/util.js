const replaceAll = (str, replaceWhat, replaceTo) => {
  replaceWhat = replaceWhat.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  return str.replace(new RegExp(replaceWhat, 'g'), replaceTo);
};

const renderLang = (langs, req) => {
  const getLang = `${req.acceptsLanguages()[0].split('-')[0]}`.toLowerCase();
  if (Object.keys(langs).includes(getLang)) return langs[getLang];
  return langs['en'];
};

const JSONweb = (data) => 'JSON.parse(`' + JSON.stringify(data) + '`)';

export { renderLang, JSONweb };
