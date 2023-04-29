import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { renderLang } from '../../core/modules/common.js';

dotenv.config();

const renderConfirmEmail = (hostWebSrc, req, sendData) => /*html*/ `
<div style='
  display: block;
  position: relative;
  width: 500px;
  padding: 20px;
  background: black;
  color: white;
  font-size: 20px;
  font-family: sans-serif;
'>
  <br>
  <img src='${hostWebSrc}/images/cyberia-banner.png'>
  <br> <br>
  ${renderLang(
    {
      en: /*html*/ `Hello ${sendData.username}, welcome to <b>CYBERIA</b>. <br><br>
  Thanks for registering, enjoy this new world. <br><br>
  Please confirm your email address:`,
      es: /*html*/ `Hola ${sendData.username}, bienvenido a <b>CYBERIA</b>. <br><br>
    Gracias por registrarte, esperamos que disfrutes este nuevo mundo. <br><br>
    Por favor confirme su dirección de email:`,
    },
    req
  )}
  <br> <br> <br>
  <a style='text-decoration: none;' href='${hostWebSrc}${process.env.API_BASE}/auth/confirm/email/${sendData.token}'>
  <div style='
      display: block;
      position: relative;
      width: 300px;
      padding: 20px;
      margin: auto;
      background: white;
      color: black;
      font-size: 20px;
      font-family: sans-serif;
      text-align: center;
  '>
  <b>${renderLang({ es: 'CONFIRMAR', en: 'CONFIRM' }, req)} EMAIL</b>
      <br>
      <span style='font-size: 14px;'>
          ${sendData.email}
      </span>
      </div></a>
  <br> <br> <br>
  <div style='text-align: right;'>
      <a style='
      color: white;
      text-decoration: underline;
      font-size: 14px;
      '
      href='https://underpost.net/'
      >
          Powered by <b>UNDER</b>post.net
      </a>
  </div>
<br>
</div>
`;

// async..await is not allowed in global scope, must use a wrapper
async function sendMail(sendData, req, internalApi) {
  console.log('sendMail', sendData);
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  // let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: process.env.MAILER_HOST,
    port: process.env.MAILER_PORT,
    secure: JSON.parse(process.env.MAILER_SECURE), // true for 465, false for other ports
    auth: {
      user: process.env.MAILER_USER, // testAccount.user, // generated ethereal user
      pass: process.env.MAILER_PASS, // testAccount.pass, // generated ethereal password
    },
  });

  let subject = 'Hello ✔';
  let html = '<b>Hello world?</b>';

  // https://github.com/underpostnet/gen/blob/master/data/mailer/pass_email.js
  // https://github.com/underpostnet/gen/blob/master/data/mailer/confirm_email.js
  switch (sendData.type) {
    case 'confirm-email':
      html = renderConfirmEmail(internalApi.getHost(), req, sendData);
      subject = renderLang({ es: 'Confirmar Email', en: 'Confirm Email' }, req);
      break;

    default:
      break;
  }

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: `"C Y B E R I A" <${process.env.MAILER_USER}>`, // '"Fred Foo 👻" <foo@example.com>', // sender address
    to: sendData.email, // 'bar@example.com, baz@example.com', // list of receivers
    subject, // Subject line
    // text: 'Hello world?', // plain text body
    html, // html body
  });

  console.log('Message sent: %s', info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

const mailerApi = (internalApi) => {
  internalApi.sendMail = async (req, sendData) => await sendMail(sendData, req, internalApi);
};

export { mailerApi };
