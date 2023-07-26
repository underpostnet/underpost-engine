const globalWidth = 770;
const globalLeftPadding = 13;
const valueGB = 4;
const lineTableBold = valueGB;

const containerWidth = globalWidth;
const containerColSeparator = 400;
const containerRowTop = 70;
const containerHeight = 250;
const containerTop = 35;
const containerRowTextTop = 25;
const containerRowFontSize = 27;

const text = 'Orden de Salida / Referencia';
const textLeftPadding = 70;
const textFontSize = containerRowFontSize;
const textTop = containerRowTextTop;

const text0 = 'Fecha Picking';
const text0LeftPadding = 420;
const text0FontSize = containerRowFontSize;
const text0Top = containerRowTextTop;

const container0Width = globalWidth;
const container0Height = 60;
const container0Top = 300;
const container0RowTextTop = 25;
const container0RowFontSize = 27;

const text1 = 'Destinatario Ship / To';
const text1LeftPadding = 70;
const text1FontSize = container0RowFontSize;
const text1Top = container0RowTextTop;

const container1Width = globalWidth;
const container1Height = 250;
const container1Top = 360;
const container1RowTextTop = 25;
const container1RowFontSize = 27;

const text2 = 'Nombre Cliente OS';
const text2LeftPadding = 70;
const text2FontSize = container1RowFontSize;
const text2Top = container1RowTextTop;

const text3 = 'Direccion Cliente OS';
const text3LeftPadding = 70;
const text3FontSize = container1RowFontSize;
const text3Top = container1RowTextTop + 80;

const text4 = 'Ciudad Cliente OS';
const text4LeftPadding = 70;
const text4FontSize = container1RowFontSize;
const text4Top = container1RowTextTop + 80 * 2;

const container3Width = globalWidth;
const container3Height = 250;
const container3Top = 630;
const container3RowTextTop = 25;
const container3RowFontSize = 27;

const container3ColSeparator = 360;
const container3ColSeparator0 = 550;

const zpl = `
^XA



^FO${containerColSeparator},${containerTop}^GB${valueGB},${containerHeight},${lineTableBold}^FS

^FO${globalLeftPadding},${containerTop}^GB${containerWidth},${containerHeight},${lineTableBold}^FS

^FO${globalLeftPadding},${containerTop + containerRowTop}^GB${containerWidth},${valueGB},${lineTableBold}^FS


   
^FO${textLeftPadding},${containerTop + textTop}^A0N,${textFontSize},${textFontSize}^FD${text}^FS

^FO${text0LeftPadding},${containerTop + text0Top}^A0N,${text0FontSize},${text0FontSize}^FD${text0}^FS


^FO${globalLeftPadding},${container0Top}^GB${container0Width},${container0Height},${lineTableBold}^FS

^FO${text1LeftPadding},${container0Top + text1Top}^A0N,${text1FontSize},${text1FontSize}^FD${text1}^FS


^FO${globalLeftPadding},${container1Top}^GB${container1Width},${container1Height},${lineTableBold}^FS

^FO${text2LeftPadding},${container1Top + text2Top}^A0N,${text2FontSize},${text2FontSize}^FD${text2}^FS
^FO${text3LeftPadding},${container1Top + text3Top}^A0N,${text3FontSize},${text3FontSize}^FD${text3}^FS
^FO${text4LeftPadding},${container1Top + text4Top}^A0N,${text4FontSize},${text4FontSize}^FD${text4}^FS


^FO${globalLeftPadding},${container3Top}^GB${container3Width},${container3Height},${lineTableBold}^FS

^FO${container3ColSeparator},${container3Top}^GB${valueGB},${container3Height},${lineTableBold}^FS

^FO${container3ColSeparator0},${container3Top}^GB${valueGB},${container3Height},${lineTableBold}^FS


^XZ
`;

const render = /*html*/ `
<button class='copy-zpl'>copy</button>
<pre>
        ${zpl}
</pre>
`;

append('body', render);

s('.copy-zpl').onclick = () => copyData(zpl);
