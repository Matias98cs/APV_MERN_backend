import nodemailer, { createTransport } from "nodemailer";
import { google } from "googleapis";
import dotenv from "dotenv";

dotenv.config();
const OAuth2 = google.auth.OAuth2;
const { GOOGLE_URL, GOOGLE_REFRESH, GOOGLE_SECRET, GOOGLE_ID, GOOGLE_USER } =
  process.env;

const sendMailToActivate = async ({ nombre, email, token }) => {
  const client = new OAuth2(GOOGLE_ID, GOOGLE_SECRET, GOOGLE_URL);

  client.setCredentials({
    refresh_token: GOOGLE_REFRESH,
  });

  try {
    const accessToken = await client.getAccessToken();

    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: GOOGLE_USER,
        type: "OAuth2",
        clientId: GOOGLE_ID,
        clientSecret: GOOGLE_SECRET,
        refreshToken: GOOGLE_REFRESH,
        accessToken: accessToken,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
    const mailOptions = {
      from: GOOGLE_USER,
      to: email,
      subject: "Verifica tu Cuenta en APV",
      text: "Comprueba tu cuenta en APV",
      html: `
            <p>Hola: ${nombre}, comprueba tu cuenta en APV Administracion de pacientes</p>
            <p>Tu cuenta ya esta lista, solo debes comprobarla en el siguiente enlace:
            <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Comprobar Cuenta<a/>
            </p>
            <p>Si tu no creaste esta cuenta, puede ignorar este mensaje</p>
        `,
    };

    await transport.sendMail(mailOptions, (error, response) => {
      if (error) {
        console.log(error);
      } else {
        console.log("Correo enviado con exito");
      }
    });
  } catch (error) {
    console.log(error);
  }
};

export default sendMailToActivate;