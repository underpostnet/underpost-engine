// http://labelary.com/viewer.html

const globalWidth = 770;
const globalLeftPadding = 13;
const globalLeftTextPadding = 30;

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
const textLeftPadding = globalLeftTextPadding;
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
const text1LeftPadding = globalLeftTextPadding;
const text1FontSize = container0RowFontSize;
const text1Top = container0RowTextTop;

const container1Width = globalWidth;
const container1Height = 250;
const container1Top = 360;
const container1RowTextTop = 25;
const container1RowFontSize = 27;

const text2 = '${nombreCliente}';
const text2LeftPadding = globalLeftTextPadding;
const text2FontSize = container1RowFontSize;
const text2Top = container1RowTextTop;

const text3 = '${direccionCliente}';
const text3LeftPadding = globalLeftTextPadding;
const text3FontSize = container1RowFontSize;
const text3Top = container1RowTextTop + 80;

const text4 = '${ciudadCliente}';
const text4LeftPadding = globalLeftTextPadding;
const text4FontSize = container1RowFontSize;
const text4Top = container1RowTextTop + 80 * 2;

const container2Width = globalWidth;
const container2Height = 60;
const container2Top = 630;
const container2RowTextTop = 25;
const container2RowFontSize = 27;

const container3Width = globalWidth;
const container3Height = 250;
const container3Top = 690;
const container3RowTextTop = 25;
const container3RowFontSize = 27;

const container3ColSeparator = 360;
const container3ColSeparator0 = 630;

const text5 = '${codigoEmpresa}';
const text5LeftPadding = globalLeftTextPadding;
const text5FontSize = container3RowFontSize;
const text5Top = container3RowTextTop;

const text6 = '${codigoSitio}';
const text6LeftPadding = globalLeftTextPadding;
const text6FontSize = container3RowFontSize;
const text6Top = container3RowTextTop + 60;

const text15 = '${nombreSitio}';
const text15LeftPadding = globalLeftTextPadding;
const text15FontSize = container3RowFontSize;
const text15Top = container3RowTextTop + 80 + 30;

const text7 = '${direccionSitio}';
const text7LeftPadding = globalLeftTextPadding;
const text7FontSize = container3RowFontSize;
const text7Top = container3RowTextTop + 80 * 2;

const text8 = 'Origen / Remitente';
const text8LeftPadding = globalLeftTextPadding;
const text8FontSize = container2RowFontSize;
const text8Top = container2RowTextTop;

const text9 = 'Medida Bulto';
const text9LeftPadding = 380;
const text9FontSize = container2RowFontSize;
const text9Top = container2RowTextTop;

const text10 = 'Bulto';
const text10LeftPadding = 650;
const text10FontSize = container2RowFontSize;
const text10Top = container2RowTextTop;

const paddingLeftContainer3text = 380;

const text11 = 'LARGO: ${largo}';
const text11LeftPadding = paddingLeftContainer3text;
const text11FontSize = container3RowFontSize;
const text11Top = container3RowTextTop + 70;

const text12 = 'ANCHO: ${ancho}';
const text12LeftPadding = paddingLeftContainer3text;
const text12FontSize = container3RowFontSize;
const text12Top = container3RowTextTop + 60 * 2;

const text13 = 'ALTO: ${alto}';
const text13LeftPadding = paddingLeftContainer3text;
const text13FontSize = container3RowFontSize;
const text13Top = container3RowTextTop + 60 * 3;

const text14 = 'PESO: ${peso}';
const text14LeftPadding = paddingLeftContainer3text;
const text14FontSize = container3RowFontSize;
const text14Top = container3RowTextTop + 60 * 4;

const text16 = '${currentBult} /';
const text16LeftPadding = 650;
const text16FontSize = 30;
const text16Top = container3RowTextTop + 60 + 60;

const text17 = '${totalBulto}';
const text17LeftPadding = 650;
const text17FontSize = 30;
const text17Top = container3RowTextTop + 60 + 60 * 2;

const barCodeValue = 'test';
const barCodeTop = 130;
const barCodeLeftPadding = 50;
const barCodeHeight = 100;
const barCodeWidth = 2;

const text18 = '${barCodeValue}';
const text18LeftPadding = 50;
const text18FontSize = 30;
const text18Top = container3RowTextTop + 60 + 60 * 2;

const text19 = '${fechaPicking}';
const text19LeftPadding = 480;
const text19FontSize = 30;
const text19Top = container3RowTextTop + 60 * 2;

const container5Width = globalWidth;
const container5Height = 60;
const container5Top = 955;
const container5RowTextTop = 25;
const container5RowFontSize = 27;

const container6Width = globalWidth;
const container6Height = 60;
const container6Top = 955 + 60;
const container6RowTextTop = 25;
const container6RowFontSize = 27;

const text20 = 'Transporte / Courier: ${medioEnvioOs}';
const text20LeftPadding = globalLeftTextPadding;
const text20FontSize = container5RowFontSize;
const text20Top = container5RowTextTop;

const text21 = 'RUTA: ${codigoRutaOS} - ${nombreRutaOs}';
const text21LeftPadding = globalLeftTextPadding;
const text21FontSize = container6RowFontSize;
const text21Top = container6RowTextTop;

const barCode0Value = 'test';
const barCode0Top = 1085;
const barCode0LeftPadding = 50;
const barCode0Height = 80;
const barCode0Width = 4;

const text22 = '${barCodeValue}';
const text22LeftPadding = globalLeftTextPadding + 50;
const text22FontSize = container6RowFontSize;
const text22Top = 1170;

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


^FO${globalLeftPadding},${container2Top}^GB${container2Width},${container2Height},${lineTableBold}^FS

^FO${globalLeftPadding},${container3Top}^GB${container3Width},${container3Height},${lineTableBold}^FS

^FO${container3ColSeparator},${container2Top}^GB${valueGB},${container2Height + container3Height},${lineTableBold}^FS

^FO${container3ColSeparator0},${container2Top}^GB${valueGB},${container2Height + container3Height},${lineTableBold}^FS


^FO${text8LeftPadding},${container2Top + text8Top}^A0N,${text8FontSize},${text8FontSize}^FD${text8}^FS
^FO${text9LeftPadding},${container2Top + text9Top}^A0N,${text9FontSize},${text9FontSize}^FD${text9}^FS
^FO${text10LeftPadding},${container2Top + text10Top}^A0N,${text10FontSize},${text10FontSize}^FD${text10}^FS


^FO${text2LeftPadding},${container3Top + text5Top}^A0N,${text5FontSize},${text5FontSize}^FD${text5}^FS
^FO${text3LeftPadding},${container3Top + text6Top}^A0N,${text6FontSize},${text6FontSize}^FD${text6}^FS
^FO${text4LeftPadding},${container3Top + text7Top}^A0N,${text7FontSize},${text7FontSize}^FD${text7}^FS
^FO${text15LeftPadding},${container3Top + text15Top}^A0N,${text15FontSize},${text15FontSize}^FD${text15}^FS


^FO${text11LeftPadding},${container2Top + text11Top}^A0N,${text11FontSize},${text11FontSize}^FD${text11}^FS
^FO${text12LeftPadding},${container2Top + text12Top}^A0N,${text12FontSize},${text12FontSize}^FD${text12}^FS
^FO${text13LeftPadding},${container2Top + text13Top}^A0N,${text13FontSize},${text13FontSize}^FD${text13}^FS
^FO${text14LeftPadding},${container2Top + text14Top}^A0N,${text14FontSize},${text14FontSize}^FD${text14}^FS

^FO${text16LeftPadding},${container2Top + text16Top}^A0N,${text16FontSize},${text16FontSize}^FD${text16}^FS
^FO${text17LeftPadding},${container2Top + text17Top}^A0N,${text17FontSize},${text17FontSize}^FD${text17}^FS


^FO${barCodeLeftPadding}, ${barCodeTop}^BY${barCodeWidth},
${barCodeWidth},${barCodeWidth}^BCN,${barCodeHeight},N,N,N^FD${barCodeValue}^FS

^FO${text18LeftPadding},${containerTop + text18Top}^A0N,${text18FontSize},${text18FontSize}^FD${text18}^FS

^FO${text19LeftPadding},${containerTop + text19Top}^A0N,${text19FontSize},${text19FontSize}^FD${text19}^FS


^FO${globalLeftPadding},${container5Top}^GB${container5Width},${container5Height},${lineTableBold}^FS

^FO${globalLeftPadding},${container6Top}^GB${container6Width},${container6Height},${lineTableBold}^FS

^FO${text20LeftPadding},${container5Top + text20Top}^A0N,${text20FontSize},${text20FontSize}^FD${text20}^FS
^FO${text21LeftPadding},${container6Top + text21Top}^A0N,${text21FontSize},${text21FontSize}^FD${text21}^FS

^FO${barCode0LeftPadding}, ${barCode0Top}^BY${barCode0Width},
${barCode0Width},${barCode0Width}^BCN,${barCode0Height},N,N,N^FD${barCode0Value}^FS

^FO${text22LeftPadding},${text22Top}^A0N,${text22FontSize},${text22FontSize}^FD${text22}^FS


^XZ
`;

append(
  'body',
  /*html*/ `
<button class='copy-zpl'>copy</button>
<pre>
        ${zpl}
</pre>
`
);

s('.copy-zpl').onclick = () => copyData(zpl);
