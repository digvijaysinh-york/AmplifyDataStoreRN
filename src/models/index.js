// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';

const UserRole = {
  "WORKER": "WORKER",
  "MANAGER": "MANAGER",
  "ADMIN": "ADMIN",
  "SUPERADMIN": "SUPERADMIN"
};

const { Todo } = initSchema(schema);

export {
  Todo,
  UserRole
};