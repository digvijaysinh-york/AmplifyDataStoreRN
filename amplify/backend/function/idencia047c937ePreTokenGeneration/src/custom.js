const queries = require("./appQuery");

exports.handler = async (event, context) => {
  try {
    const user = event.request.userAttributes;
    const userData = {
      id: user.sub,
      lastLoggedIn: new Date().toISOString(),
    };
    if (
      event.triggerSource === "TokenGeneration_RefreshTokens" ||
      event.triggerSource === "TokenGeneration_Authentication"
    ) {

      //update the loggin time for a user
      await queries.updateUser(userData);
      
      event.response = {
        claimsOverrideDetails: {
          claimsToAddOrOverride: {
            firstName: user.given_name,
            lastName: user.family_name,
          },
          claimsToSuppress: ["email", "custom:temppassword"],
        },
      };
    }
  } catch (error) {
    console.log("Error in pre token generation trigger:", error);
  }
  return event;
};
