/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
const AWS = require("aws-sdk");
const ses = new AWS.SES();

exports.handler = async (event) => {
  // insert code to be executed by your lambda trigger
  const { request, response } = event;
  console.log("eventtt", event);
  try {
    const password = request.userAttributes['custom:temppassword'];
    const email = request.userAttributes.email;
    const firstName = request.userAttributes.given_name;
    if (email) {
      try {
        response.autoConfirmUser = true;
        response.autoVerifyEmail = true;
        await sendInviteEmail(email, password, firstName);
        console.log("Invite email sent successfully.");
      } catch (error) {
        response.autoConfirmUser = false;
        response.autoVerifyEmail = false;
        console.error("Error sending invite email:", error);
      }
    }
    return event;
  } catch (error) {
    console.log("presign up error", error);
    return;
  }
};

async function sendInviteEmail(email, password, firstName) {
  try {

    const emailIdentity = {
      EmailAddress: email,
    };

    const portalUrl = "https://localhost:3000";
    const logInUrl = portalUrl + '/login';

    const verifiedEntity = await ses.verifyEmailIdentity(emailIdentity);
    console.log("verifiedEntity", verifiedEntity);
  
    // if(verifiedEntity.data){
      const params = {
        Destination: {
          ToAddresses: [email],
        },
        Message: {
          Body: {
            Html: {
              Data: getEmailTemplate({firstName, password, portalUrl, logInUrl, email})
            },
          },
          Subject: {
            Data: "Your Idencia Portal Account - Get Started Today!",
          },
        },
        Source: "avani@york.ie", // Replace with your SES sender email address
      };
      // Send the invite email
      const emailSent = await ses.sendEmail(params).promise();
      console.log("email sent", emailSent);
    // }
  } catch (error) {
    console.error("Error sending invite email:", error);
  }
}

const getEmailTemplate = (props) => {
  const { firstName, password, logInUrl, portalUrl, email } = props;
  console.log("props", props);
  return `
  <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Idencia</title>

  <style>
    body,
    html {
      font-family: Arial, sans-serif;
    }
    p {
      font-size: 15px;
      line-height: 22px;
      color: #161616;
    }
  </style>
</head>
<body topmargin="0">
<p>Dear ${firstName},</p>

<p>We are excited to inform you that your Idencia portal account has been created!🎉</p>

<p>You can now log in using the following details:</p>

<p><strong>Username:</strong> ${email}</p>

<p><strong>Password:</strong> ${password}</p>

<p><strong>Portal URL:</strong> <a href="${logInUrl}" target="_blank"> ${logInUrl} </a></p>

<p>Please keep your login details secure. If you ever forget your password, you can reset it using the &quot;Forgot Password&quot; option on the login page.</p>

<p><strong>Getting Started:</strong></p>

<ol>
  <li>Visit the Idencia portal at <a href="${portalUrl}" target="_blank">${portalUrl}</a>.</li>
  <li>Enter your username and password.</li>
  <li>Explore the various features and functionalities available to you.</li>
</ol>

<p><strong>Note:</strong> This is a system-generated email. Please do not reply to this message. If you encounter any issues or have questions about the portal, contact our support team</p>

<p>Regards, </p>

<p> Idencia Support Team</p>

</body>
</html>
`;
};
