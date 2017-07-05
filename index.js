/*
 * \file server.js
 * \brief Start the server Apollo
 * \date 16 juin 2017
 * \author Cuistot du coin
 */

// Import of dependency
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { graphqlExpress, graphiqlExpress } = require('graphql-server-express');
const { execute, subscribe } = require('graphql');
const { createServer } = require('http');
const { PubSub } = require('graphql-subscriptions');
const { SubscriptionServer } = require('subscriptions-transport-ws');

const schema = require('./data/schema');
//!

// Port of the server
const PORT = 3020;

// Created Server with express
var app = express();

app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/graphql', graphqlExpress({ schema }));

app.use(
	'/graphiql',
	graphiqlExpress({
		endpointURL: '/graphql',
		subscriptionsEndpoint: 'ws://localhost:3020/subscriptions'
	})
);
//!

const server = createServer(app);

// Server start
server.listen(PORT, () => {
	console.log(`API Server is now running on http://localhost:${PORT}/graphql`);

	new SubscriptionServer(
		{
			execute,
			subscribe,
			schema
		},
		{
			server: server,
			path: '/subscriptions'
		}
	);
});
//!
