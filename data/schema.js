/*
 * \file schema.js
 * \brief  { Tables statement with Apollo Server
 *           Query and mutation statement as well
 *           schema definition }
 * \date 16 juin 2017
 * \author Cuistot du coin
 */

// Import of dependency
const { makeExecutableSchema } = require('graphql-tools');
const { PubSub } = require('graphql-subscriptions');
const { withFilter } = require('graphql-subscriptions');
const GraphQLToolsTypes = require('graphql-tools-types');
const {
	Kitchen,
	UserAccount,
	Gourmet,
	Cook,
	Reservation,
	UserLogin,
	Workshop,
} = require('./models');
// --------------------- //

// Used for subscription
const pubsub = new PubSub();

const typeDefs = [
	`
scalar Date
scalar JSON
scalar Point

type UserAccount {
  user_id: ID
  email: String
  email_confirmed: Boolean
  password_hash: String
  security_stamp: String
  concurrency_stamp: ID
  phone_number: String
  phone_number_confirmed: Boolean
  two_factor_enabled: Boolean
  lockout_end: Date
  lockout_enabled: Boolean
  access_failed_count: Int
  gourmet: Gourmet
  login: UserLogin
}
type Kitchen {
  kitchen_id: ID
  name: String
  city: String
  cp: String
  location: Point
  workshop: [Workshop]
}
type Gourmet {
  gourmet_id: ID
  first_name: String
  last_name: String
  picture: JSON
  gender: String
  city: String
  cp: String
  location: Point
  description: String
  useraccount: UserAccount
  cook: Cook
  reservation: [Reservation]
}
type Cook {
  cook_id: ID
  is_pro: Boolean
  description: String
  gourmet: Gourmet
  workshop: [Workshop]
}
type Reservation {
  gourmet_id: ID
  workshop_id: ID
  amount: Int
  gourmet: [Gourmet]
  workshop: [Workshop]
}
type UserLogin {
  name: String!
  key: String!
  user_id: ID
  account: UserAccount
}
type Workshop {
  workshop_id: ID
  name: String
  price: Int
  duration: Int
  min_gourmet: Int
  max_gourmet: Int
  description: String
  pictures: JSON
  kitchen_id: ID
  cook_id: ID
  workshop_date: Date
  cook: Cook
  kitchen: Kitchen
  reservation: [Reservation]
}

type Query {
  userAccount(user_id: ID, email: String, email_confirmed: Boolean, password_hash: String, security_stamp: String, concurrency_stamp: ID, phone_number: String, phone_number_confirmed: Boolean, two_factor_enabled: Boolean, lockout_end: Date, lockout_enabled: Boolean, access_failed_count: Int): [UserAccount]
  kitchen(kitchen_id: ID, name: String, city: String, cp: String, location: Point): [Kitchen]
  gourmet(gourmet_id: ID, first_name: String, last_name: String, picture: JSON, gender: String, city: String, cp: String, location: Point, description: String): [Gourmet]
  cook(cook_id: ID, is_pro: Boolean, description: String): [Cook]
  reservation(gourmet_id: ID, workshop_id: ID, amount: Int): [Reservation]
  userLogin(name: String, key: String, user_id: ID): [UserLogin]
  workshop(workshop_id: ID, name: String, price: Int, duration: Int, min_gourmet: Int, max_gourmet: Int, description: String, pictures: JSON, kitchen_id: ID, cook_id: ID, workshop_date: Date): [Workshop]
}

type Mutation {
  addUserAccount(
    email: String!, email_confirmed: Boolean, password_hash: String, security_stamp: String,
    concurrency_stamp: ID, phone_number: String, phone_number_confirmed: Boolean,
    two_factor_enabled: Boolean, lockout_end: Date, lockout_enabled: Boolean,
    access_failed_count: Int,
  ): UserAccount
  addUserLogin( name: String!, key: String, user_id: ID! ): UserLogin
  addGourmet(
    gourmet_id: ID!, first_name: String, last_name: String, picture: JSON, gender: String,
    city: String, cp: String, location: Point, description: String
  ): Gourmet
  addCook(cook_id: ID!, is_pro: Boolean, description: String): Cook
  addKitchen(
    name: String!, city: String!, cp: String, location: Point
  ): Kitchen
  addWorkshop(
    workshop_id: ID, name: String!, price: Int!, duration: Int!, min_gourmet: Int!,
    max_gourmet: Int!, description: String!, pictures: JSON, kitchen_id: ID,
    cook_id: ID, workshop_date: Date!
  ): Workshop
  addReservation( gourmet_id: ID!, workshop_id: ID!, amount: Int! ): Reservation

  updateUserAccount(
    user_id: ID!, email: String, email_confirmed: Boolean, password_hash: String,
    security_stamp: String, concurrency_stamp: ID, phone_number: String,
    phone_number_confirmed: Boolean, two_factor_enabled: Boolean, lockout_end: Date,
    lockout_enabled: Boolean, access_failed_count: Int,
  ): UserAccount
  updateUserLogin( name: String, key: String, user_id: ID! ): UserLogin
  updateGourmet(
    gourmet_id: ID!, first_name: String, last_name: String, picture: JSON, gender: String,
    city: String, cp: String, location: Point, description: String
  ): Gourmet
  updateCook(cook_id: ID!, is_pro: Boolean, description: String): Cook
  updateKitchen(
    kitchen_id: ID!, name: String, city: String, cp: String, location: Point): Kitchen
  updateWorkshop(
    workshop_id: ID!, name: String, price: Int, duration: Int, min_gourmet: Int,
    max_gourmet: Int, description: String, pictures: JSON, kitchen_id: ID,
    cook_id: ID, workshop_date: Date
  ): Workshop
  updateReservation( gourmet_id: ID!, workshop_id: ID!, amount: Int ): Reservation

  deleteCook( cook_id: ID! ): Cook
  deleteWorkshop( workshop_id: ID! ): Workshop
  deleteReservation( gourmet_id: ID!, workshop_id: ID! ): Reservation
  deleteUser( user_id: ID! ): UserAccount
  deleteKitchenAndWorkshopAssociated( kitchen_id: ID!, name: String ): Kitchen
}

type Subscription {
  workshopAdded(kitchen_id: ID): Workshop
}

schema {
  query: Query
  mutation: Mutation
  subscription: Subscription
}
`,
];

const resolvers = {
	// Resolvers function for custom types
	Date: GraphQLToolsTypes.Date({ name: 'MyDate' }),
	JSON: GraphQLToolsTypes.JSON({ name: 'MyJSON' }),
	Point: GraphQLToolsTypes.JSON({
		name: 'Point',
		struct: '{ x: number, y: number }',
	}),
	// --------------------------------------------------------------------------------- //

	// ---------------------------------------------------------- //
	// Query resolvers function definition
	// ---------------------------------------------------------- //
	Query: {
		userAccount(_, args) {
			return UserAccount.findAndCountAll({ where: args }).then(result => {
				if (!result) {
					return 'User not find !';
				}
				// console.log(`DataValues of result : ${JSON.stringify(result.rows)}`);
				return result.rows;
			});
		},
		kitchen(_, args) {
			return Kitchen.findAndCountAll({ where: args }).then(result => {
				if (!result) {
					return 'Kitchen not find !';
				}
				// console.log(`DataValues of result : ${JSON.stringify(result.rows)}`);
				return result.rows;
			});
		},
		gourmet(_, args) {
			return Gourmet.findAndCountAll({ where: args }).then(result => {
				if (!result) {
					return 'Gourmet not find !';
				}
				// console.log(`DataValues of result : ${JSON.stringify(result.rows)}`);
				// console.log("Coordonnée en x : " + JSON.stringify(result.rows[0].location.coordinates[0]));
				return result.rows;
			});
		},
		cook(_, args) {
			return Cook.findAndCountAll({ where: args }).then(result => {
				if (!result) {
					return 'Cook not find !';
				}
				// console.log(`DataValues of result : ${JSON.stringify(result.rows)}`);
				return result.rows;
			});
		},
		reservation(_, args) {
			return Reservation.findAndCountAll({ where: args }).then(result => {
				if (!result) {
					return 'Reservation not find !';
				}
				// console.log(`DataValues of result : ${JSON.stringify(result.rows)}`);
				return result.rows;
			});
		},
		userLogin(_, args) {
			return UserLogin.findAndCountAll({ where: args }).then(result => {
				if (!result) {
					return 'UserLogin not find !';
				}
				// console.log(`DataValues of result : ${JSON.stringify(result.rows)}`);
				return result.rows;
			});
		},
		workshop(_, args) {
			return Workshop.findAndCountAll({ where: args }).then(result => {
				if (!result) {
					return 'Workshop not find !';
				}
				// console.log(`DataValues of result : ${JSON.stringify(result.rows)}`);
				return result.rows;
			});
		},
	},
	//! --------------------------------------------------------- //
	//! --------------------------------------------------------- //
	//! --------------------------------------------------------- //

	// ---------------------------------------------------------- //
	// For Imbricated queries
	// ---------------------------------------------------------- //
	UserAccount: {
		gourmet(useraccount) {
			return useraccount.getGourmet();
		},
		login(account) {
			return account.getUserLogin();
		},
	},
	UserLogin: {
		account(login) {
			return login.getUserAccount();
		},
	},
	Gourmet: {
		useraccount(gourmet) {
			return gourmet.getUserAccount();
		},
		cook(gourmet) {
			return gourmet.getCook();
		},
		reservation(gourmet) {
			return gourmet.getReservation();
		},
	},
	Cook: {
		gourmet(cook) {
			return cook.getGourmet();
		},
		workshop(cook) {
			return cook.getWorkshop();
		},
	},
	Kitchen: {
		workshop(kitchen) {
			return kitchen.getWorkshop();
		},
	},
	Workshop: {
		kitchen(workshop) {
			return workshop.getKitchen();
		},
		cook(workshop) {
			return workshop.getCook();
		},
		reservation(workshop) {
			return workshop.getReservation();
		},
	},
	Reservation: {
		gourmet(reservation) {
			return reservation.getGourmet();
		},
		workshop(reservation) {
			return reservation.getWorkshop();
		},
	},
	//! --------------------------------------------------------- //
	//! --------------------------------------------------------- //
	//! --------------------------------------------------------- //

	// ---------------------------------------------------------- //
	// Mutation resolvers function definition
	// ---------------------------------------------------------- //
	Mutation: {
		addGourmet(_, args) {
			args.location = {
				type: 'Point',
				coordinates: [args.location.x, args.location.y],
			};
			return Gourmet.create(args);
		},
		addUserAccount(_, args) {
			return UserAccount.create(args);
		},
		addUserLogin(_, args) {
			return UserLogin.create(args);
		},
		addCook(_, args) {
			return Cook.create(args);
		},
		addKitchen(_, args) {
			args.location = {
				type: 'Point',
				coordinates: [args.location.x, args.location.y],
			};
			return Kitchen.create(args);
		},
		addWorkshop(_, args) {
			pubsub.publish('workshopAdded', {
				workshopAdded: args,
				kitchen_id: args.kitchen_id,
			});
			return Workshop.create(args);
		},
		addReservation(_, args) {
			return Reservation.create(args);
		},

		updateUserAccount(_, args) {
			UserAccount.update(args, {
				where: { user_id: args.user_id },
			});
			return UserAccount.findById(args.user_id);
		},
		updateUserLogin(_, args) {
			UserLogin.update(args, {
				where: { user_id: args.user_id },
			});
			return UserLogin.findById(args.user_id);
		},
		updateGourmet(_, args) {
			Gourmet.update(args, {
				where: { gourmet_id: args.gourmet_id },
			});
			return Gourmet.findById(args.gourmet_id);
		},
		updateCook(_, args) {
			Cook.update(args, {
				where: { cook_id: args.cook_id },
			});
			return Cook.findById(args.cook_id);
		},
		updateKitchen(_, args) {
			Kitchen.update(args, {
				where: { kitchen_id: args.kitchen_id },
			});
			return Kitchen.findById(args.kitchen_id);
		},
		updateWorkshop(_, args) {
			Workshop.update(args, {
				where: { workshop_id: args.workshop_id },
			});
			return Workshop.findById(args.workshop_id);
		},
		updateReservation(_, args) {
			Reservation.update(args, {
				where: {
					gourmet_id: args.gourmet_id,
					workshop_id: args.workshop_id,
				},
			});
			return Reservation.findById(args.gourmet_id);
		},

		deleteWorkshop(_, args) {
			Reservation.destroy({ where: args });
			return Workshop.destroy({ where: args });
		},
		deleteReservation(_, args) {
			return Reservation.destroy({ where: args });
		},
		deleteCook(_, args) {
			return Cook.destroy({ where: args });
		},

		// This function will erase totaly a user
		// (deletion in : UserAccount, UserLogin, Gourmet, Cook, Reservation)
		// If the account is a cook associated to a workshop, The user will NOT be deleted
		deleteUser(_, args) {
			Cook.destroy({ where: { cook_id: args.user_id } })
				.then(() => {
					Gourmet.destroy({ where: { gourmet_id: args.user_id } });
					Reservation.destroy({ where: { gourmet_id: args.user_id } });
					UserLogin.destroy({ where: args });
					UserAccount.destroy({ where: args });
				})
				.catch(error => {
					console.log(`The user is associate to a workshop : ${error}`);
					return error;
				});
		},
		deleteKitchenAndWorkshopAssociated(_, args) {
			Workshop.destroy({ where: { kitchen_id: args.kitchen_id } });
			return Kitchen.destroy({ where: args });
		},
	},
	Subscription: {
		workshopAdded: {
			subscribe: withFilter(
				() => pubsub.asyncIterator('workshopAdded'),
				(payload, variables) => {
					// The `messageAdded` channel includes events for all channels, so we filter to only
					// pass through events for the channel specified in the query
					return payload.kitchen_id === variables.kitchen_id;
				},
			),
		},
	},
	//! --------------------------------------------------------- //
	//! --------------------------------------------------------- //
	//! --------------------------------------------------------- //
};

// Make executable schema with typeDefs and resolvers
const jsSchema = makeExecutableSchema({
	typeDefs,
	resolvers,
});

// Schema executable export
module.exports = jsSchema;
