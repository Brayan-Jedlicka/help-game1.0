import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});
const confirmationEmailTemplate = (username, verificationLink) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: #f5f5f5;
          margin: 0;
          padding: 20px;
        }
        .container {
          background-color: #fbf6e9;
          border-radius: 8px;
          border: 2px solid #e0b955;
          max-width: 600px;
          margin: 0 auto;
          padding: 40px;
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
        }
        .header h1 {
          color: #7a1330;
          margin: 0;
          font-size: 28px;
        }
        .content {
          color: #333;
          line-height: 1.6;
          font-size: 16px;
        }
        .button-container {
          text-align: center;
          margin: 30px 0;
        }
        .button {
          background-color: #e0b955;
          color: #7a1330;
          padding: 12px 30px;
          text-decoration: none;
          border-radius: 4px;
          font-weight: 600;
          display: inline-block;
        }
        .button:hover {
          background-color: #d9a846;
        }
        .link-text {
          word-break: break-all;
          padding: 15px;
          background-color: #f0f0f0;
          border-radius: 4px;
          font-family: 'Courier New', monospace;
          font-size: 12px;
          color: #666;
          margin: 20px 0;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #ddd;
          color: #999;
          font-size: 12px;
        }
        .warning {
          background-color: #fff3cd;
          border: 1px solid #ffc107;
          color: #856404;
          padding: 12px;
          border-radius: 4px;
          margin: 20px 0;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎮 Bem-vindo ao Help Game!</h1>
        </div>
        <div class="content">
          <p>Olá <strong>${username}</strong>,</p>
          <p>Obrigado por se registrar na Help Game! Somos uma comunidade de desenvolvedores GameMaker dedicada a compartilhar conhecimento, código e experiências.</p>
          <p>Para completar seu registro, confirme seu endereço de email clicando no botão abaixo:</p>
          <div class="button-container">
            <a href="${verificationLink}" class="button">Confirmar Email</a>
          </div>
          <p>Ou copie e cole este link no seu navegador:</p>
          <div class="link-text">${verificationLink}</div>
          <div class="warning">
            ⏰ <strong>Este link expira em 1 hora</strong>. Se você não solicitou esta conta, ignore este email.
          </div>
          <p>Se tiver dúvidas, entre em contato conosco através do <strong>fórum Help Game</strong>.</p>
          <p>Boa codificação!<br><strong>A equipe Help Game</strong></p>
        </div>
        <div class="footer">
          <p>Help Game © 2026 | Comunidade de Desenvolvimento GameMaker</p>
          <p><a href="https://helpgame.com" style="color: #7a1330; text-decoration: none;">Visite nosso site</a></p>
        </div>
      </div>
    </body>
    </html>
  `;
};
// Enviar email de confirmação
export const sendVerificationEmail = async (email, username, verificationToken) => {
  try {
    const verificationLink = `${process.env.FRONTEND_URL}/verify-email.html?token=${verificationToken}`;
    const mailOptions = {
      from: process.env.SMTP_FROM || `"Help Game" <${process.env.SMTP_USER}>`,
      to: email,
      subject: '🎮 Confirme seu email - Help Game',
      html: confirmationEmailTemplate(username, verificationLink)
    };
    const info = await transporter.sendMail(mailOptions);
    console.log('✉️ Email enviado:', info.response);
    return true;
  } catch (error) {
    console.error('❌ Erro ao enviar email:', error);
    return false;
  }
};
// Testar conexão SMTP
export const testConnection = async () => {
  try {
    await transporter.verify();
    console.log('✅ Conexão SMTP verificada com sucesso');
    return true;
  } catch (error) {
    console.error('❌ Erro ao verificar conexão SMTP:', error);
    return false;
  }
};

