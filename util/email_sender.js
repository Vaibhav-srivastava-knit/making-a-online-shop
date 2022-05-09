exports.mailSender=(To,Message)=>{
    const nodemailer = require('nodemailer');
   const { google } = require('googleapis');
  //  const Message_to_send ='<h1>'+Message+'</h1>'
   // These id's and secrets should come from .env file.
   const CLIENT_ID = '138894089153-4hi9p5o13rrdcqi03qrbg3rh32nqtcft.apps.googleusercontent.com';
   const CLEINT_SECRET = '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';
   const REDIRECT_URI = 'https://developers.google.com/oauthplayground';
   const REFRESH_TOKEN = '1//04aDRAMCK68yaCgYIARAAGAQSNwF-L9Irzw2YHh7A2SX-yrEIrH533rGRxclOEI82d17xIbym-HLijkYFsJ1x0Ce0Ja8c5GMoszg';
   
   const oAuth2Client = new google.auth.OAuth2(
     CLIENT_ID,
     CLEINT_SECRET,
     REDIRECT_URI
   );
   oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
   
   async function sendMail() {
     try {
       const accessToken = await oAuth2Client.getAccessToken();
       const transport = nodemailer.createTransport({
         service: 'gmail',
         auth: {
           type: 'OAuth2',
           user: 'yevaibhav20@gmail.com',
           clientId: CLIENT_ID,
           clientSecret: CLEINT_SECRET,
           refreshToken: REFRESH_TOKEN,
           accessToken: accessToken,
         },
       });
   
       const mailOptions = {
         from: 'yevaibhav20@gmail',
         to: To,
         subject: '',
         text: Message,
         html: Message,
       };
   
       const result = await transport.sendMail(mailOptions);
       return result;
     } catch (error) {
       return error;
     }
   }
   
   sendMail()
     .then((result) => console.log('Email sent...', result))
     .catch((error) => console.log(error.message));
   }