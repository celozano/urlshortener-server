import { AuthChecker } from 'type-graphql';

interface Context {
  user?: any;
}

export const authChecker: AuthChecker<Context> = ({ context: { user } }) => {
  return user !== null;
};
