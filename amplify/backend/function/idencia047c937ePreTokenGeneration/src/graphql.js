const updateUser = `
  mutation UpdateUser($id: ID!, $lastLoggedIn: AWSDateTime) {
    updateUser(input: {id: $id, lastLoggedIn: $lastLoggedIn}) {
      id
      email
    }
  }
`;

module.exports = {
  updateUser,
};
