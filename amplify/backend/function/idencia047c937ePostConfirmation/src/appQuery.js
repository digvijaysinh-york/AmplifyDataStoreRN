
const {
  executeQuery,
  executeMutation,
} = require('/opt/nodejs/appQueryHelper.js');
const queries = require('./graphql.js');

async function createUser(userData) {
  console.log("post confirmation appquery createuser");
  const user = await executeMutation(queries.createUser, {
    id: userData.id,
    email: userData.email,
    firstName: userData.firstName,
    lastName: userData.lastName
  });
  console.log("query result user", user);
  if (user.errors) {
    return user;
  }
  return user.data.createUser;
}

async function CreateOrganizationUserRole(userID, organizationId, role) {
  console.log("post confirmation appquery createOrganizationRole",userID, organizationId, role);
  const userOrganizationRole = await executeMutation(
    queries.createOrganizationUserRole,
    {
      userID: userID,
      organizationID: organizationId,
      role: role,
    }
  );
  console.log("query result user", userOrganizationRole);
  if (userOrganizationRole.errors) {
    return userOrganizationRole;
  }
  return userOrganizationRole.data;
}

async function CreateOrganizationUsers(userID, organizationId) {
  console.log("post confirmation appquery CreateOrganizationUsers",userID, organizationId);
  const userOrganizationRole = await executeMutation(
    queries.createOrganizationUsers,
    {
      userID: userID,
      organizationID: organizationId,
    }
  );
  console.log("query result user", userOrganizationRole);
  if (userOrganizationRole.errors) {
    return userOrganizationRole;
  }
  return userOrganizationRole.data;
}

module.exports = {
  createUser,
  CreateOrganizationUserRole,
  CreateOrganizationUsers
};

