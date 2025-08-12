import { email } from "zod";

export const OTPVerificationEmail = ({ email, otp }: { email: string; otp: string }) => (
  <html>
    <head>
      <title>Localink – Vérification de votre compte</title>
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <style type="text/css">
        {`
          body {
            margin: 0;
            padding: 0;
            width: 100% !important;
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            line-height: 1.6;
            color: #333333;
            background-color: #f7f7f7;
            -webkit-font-smoothing: antialiased;
          }

          .email-container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }

          .email-header {
            text-align: center;
            padding: 20px 0;
            border-bottom: 1px solid #eeeeee;
          }

          .email-header h1 {
            color: #2c3e50;
            margin: 0;
            font-size: 24px;
          }

          .email-body {
            padding: 20px 0;
            background: #ffffff;
            border-radius: 4px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
          }

          .email-content {
            padding: 0 30px;
          }

          .otp-code {
            background: #f0f7ff;
            color: #2c3e50;
            font-size: 28px;
            font-weight: bold;
            text-align: center;
            padding: 15px 0;
            margin: 25px 0;
            border-radius: 4px;
            letter-spacing: 3px;
          }

          .email-footer {
            text-align: center;
            padding: 20px 0;
            color: #7f8c8d;
            font-size: 12px;
            border-top: 1px solid #eeeeee;
          }

          a {
            color: #3498db;
            text-decoration: none;
          }

          @media only screen and (max-width: 600px) {
            .email-content {
              padding: 0 15px;
            }

            .otp-code {
              font-size: 24px;
            }
          }
        `}
      </style>
    </head>
    <body>
      <div className="email-container">
        <div className="email-header">
          <h1>Bienvenue chez Localink</h1>
        </div>

        <div className="email-body">
          <div className="email-content">
            <p>Bonjour {email},</p>

            <p>Merci de vous être inscrit sur Localink ! Pour activer votre compte en toute sécurité, veuillez utiliser le code de vérification ci-dessous :</p>

            <div className="otp-code">{otp}</div>

            <p>Ce code est valable pendant <strong>5 minutes</strong>. Veuillez le saisir rapidement pour finaliser votre inscription.</p>

            <p>Si vous n’avez pas fait cette demande, vous pouvez ignorer cet e-mail. Aucun changement ne sera apporté à votre compte.</p>

            <p>Besoin d’aide ? Contactez notre équipe support à l’adresse : <a href="mailto:support@staboost.com">support@staboost.com</a></p>

            <p>Cordialement,<br />L’équipe Localink</p>
          </div>
        </div>

        <div className="email-footer">
          <p>&copy; {new Date().getFullYear()} Localink. Tous droits réservés.</p>
        </div>
      </div>
    </body>
  </html>
);
