require('dotenv').config();
const ORIGIN = process.env.ORIGIN!;
const DATABASE_URL = process.env.DATABASE_URL!;
const PORT = process.env.PORT || 8080;

import 'reflect-metadata';
import * as Express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
import { buildSchema } from 'type-graphql';
import { connect } from 'mongoose';

import { authChecker } from './auth/authChecker';
import { LinkModel } from './models/Link';
import { LinkResolver } from './resolvers/link';
import { decodeIDToken } from './firebase';

const main = async () => {
  try {
    await connect(DATABASE_URL);
    console.log('Connected to mongodb.');
  } catch (err) {
    console.log(`Error while connecting to mongodb: ${err}`);
  }

  const schema = await buildSchema({
    resolvers: [LinkResolver],
    authChecker,
  });

  const apolloServer = new ApolloServer({
    schema,
    context: async (req) => {
      const user = await decodeIDToken(req);

      return { ...req, user };
    },
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
  });

  await apolloServer.start();

  const app = Express();

  app.get('/favicon.ico', (_, res) => res.status(204));

  app.get('/not-found', (_, res) => res.send('url not found'));

  app.get('/:hash', async (req, res, next) => {
    if (req.url === '/graphql') {
      return next();
    }

    const link = await LinkModel.findOne({ hash: req.params.hash });

    if (!link) {
      res.redirect(`${ORIGIN}/not-found`);
      return;
    }

    res.redirect(link.url);
  });

  apolloServer.applyMiddleware({ app });

  app.listen(PORT, () => {
    console.log('Server running');
  });
};

main();
