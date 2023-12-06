const createUser = `
  mutation createUser($id: ID!, $email: AWSEmail!, $firstName: String!, $lastName: String) {
   createUser(input: {id: $id, email: $email,firstName: $firstName, lastName: $lastName}) {
      id
      email
      firstName,
      lastName
    }
  }
`;

const createOrganizationUserRole = `
  mutation CreateOrganizationUserRole($userID: ID!, $organizationID: ID!, $role: USER_ROLE!) {
    createOrganizationUserRole(input: {userID: $userID, organizationID: $organizationID, role: $role }) {
      id
      role,
      organizationID
    }
  }
`;

const createOrganizationUsers = `
  mutation CreateOrganizationUsers($userID: ID!, $organizationID: ID!) {
    createOrganizationUsers(input: {userId: $userID, organizationId: $organizationID }) {
      id
      userId
      organizationId
    }
  }
`;

module.exports = {
  createUser,
  createOrganizationUserRole,
  createOrganizationUsers
};
