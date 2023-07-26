const containerWidth = 700;
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

const container0Width = 700;
const container0Height = 60;
const container0Top = 300;
const container0RowTextTop = 25;
const container0RowFontSize = 27;

const text1 = 'Destinatario Ship / To';
const text1LeftPadding = 70;
const text1FontSize = container0RowFontSize;
const text1Top = container0RowTextTop;

const container1Width = 700;
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

const zpl = `
^XA



^FO${containerColSeparator},${containerTop}^GB0,${containerHeight},2^FS

^FO50,${containerTop}^GB${containerWidth},${containerHeight},2^FS

^FO50,${containerTop + containerRowTop}^GB${containerWidth},0,2^FS


   
^FO${textLeftPadding},${containerTop + textTop}^A0N,${textFontSize},${textFontSize}^FD${text}^FS

^FO${text0LeftPadding},${containerTop + text0Top}^A0N,${text0FontSize},${text0FontSize}^FD${text0}^FS


^FO50,${container0Top}^GB${container0Width},${container0Height},2^FS

^FO${text1LeftPadding},${container0Top + text1Top}^A0N,${text1FontSize},${text1FontSize}^FD${text1}^FS


^FO50,${container1Top}^GB${container1Width},${container1Height},2^FS

^FO${text2LeftPadding},${container1Top + text2Top}^A0N,${text2FontSize},${text2FontSize}^FD${text2}^FS
^FO${text3LeftPadding},${container1Top + text3Top}^A0N,${text3FontSize},${text3FontSize}^FD${text3}^FS
^FO${text4LeftPadding},${container1Top + text4Top}^A0N,${text4FontSize},${text4FontSize}^FD${text4}^FS



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
