const {
  executeMutation,
} = require("/opt/nodejs/appQueryHelper.js");
const queries = require("./graphql.js");

async function updateUser(userData) {
  const user = await executeMutation(queries.updateUser, {
    id: userData.id,
    lastLoggedIn: userData.lastLoggedIn,
  });
  if (user.errors) {
    return user;
  }
  return user.data.updateUser;
}

module.exports = {
  updateUser,
};
