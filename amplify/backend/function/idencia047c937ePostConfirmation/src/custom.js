const queries = require("./appQuery");

exports.handler = async (event) => {
  // insert code to be executed by your lambda trigger
  console.log(event);
  var email = event.request.userAttributes.email;
  const user = event.request.userAttributes;
  var id = event.userName;
  console.log(email);
  console.log(id);
  const userData = {
    id: id,
    email: email,
    firstName: user.given_name,
    lastName: user.family_name || '',
    role: user['custom:role'],
    organizationIDs: JSON.parse(user['custom:organization']) || []
  }
  try{
    console.log("post confirmation call", userData);
    let user = await queries.createUser(userData);
    console.log('user::',user);

    if(user){
      if(userData.organizationIDs.length > 0){
        for (const organizationId of userData.organizationIDs) {
          await queries.CreateOrganizationUsers(id, organizationId);
          await queries.CreateOrganizationUserRole(id, organizationId, userData.role);
        }
      }
    }

    // callback(null, event);
    return event;
  } catch (e) {
    console.log('error::',e);
    // callback(Error(e))
    return e;
  }
};
