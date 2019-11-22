import { getSubscriptions, createSubscription } from '../requests/subscription-requests';
import { Resolvers } from '../__generated__/resolver-types';


interface StringIndexSignatureInterface {
  [index: string]: any;
}

type StringIndexed<T> = T & StringIndexSignatureInterface

const resolvers: StringIndexed<Resolvers> = {
  Query: {
    subscriptions: () => getSubscriptions(),
  },
  Mutation: {
    subscribe: async (__, args) => createSubscription({}, args),
  },
};

export default resolvers;
