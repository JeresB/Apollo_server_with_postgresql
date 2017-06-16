/*
 * \file server.js
 * \brief Start the server Apollo
 * \date 16 juin 2017
 * \author Cuistot du coin
 */

// Import of dependency
import express from 'express';
import { apolloServer } from 'graphql-tools';
import Schema from './data/schema';
import Resolvers from './data/resolvers';
//!

const GRAPHQL_PORT = 8080;

const graphQLServer = express();

graphQLServer.use('/', apolloServer({
  graphiql: true,
  pretty: true,
  schema: Schema,
  resolvers: Resolvers
}));

graphQLServer.listen(GRAPHQL_PORT, () => console.log(
  `GraphQL Server is now running on http://localhost:${GRAPHQL_PORT}/graphql`
));
