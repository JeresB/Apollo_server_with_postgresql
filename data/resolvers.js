import GraphQLToolsTypes from "graphql-tools-types"
import { GraphQLScalarType } from 'graphql';
import { Kind } from 'graphql/language';
const uuidV4 = require('uuid/v4');
import {
  Kitchen,
  UserAccount,
  Gourmet,
  Cook,
  Reservation,
  UserLogin,
  Workshop
} from './connectors';


const resolvers = {
  // Resolvers function for custom types
  UUID: GraphQLToolsTypes.UUID({ name: "MyUUID" }),
  Date: GraphQLToolsTypes.Date({ name: "MyDate" }),
  JSON: GraphQLToolsTypes.JSON({ name: "MyJSON" }),
  //!

  // Query resolvers function definition
  Query: {
    userAccount(_, args) {
      return UserAccount.findAndCountAll(/*{attributes: [ 'email' ]},*/{ where: args }
      ).then(function(result) {
        if (!result) {
            return 'User not find !';
        }
        console.log("DataValues of result : " + JSON.stringify(result.rows));
        return result.rows;
      });
    },
    kitchen(_, args) {
      return Kitchen.findAndCountAll({ where: args }).then(function(result) {
        if (!result) {
            return 'Kitchen not find !';
        }
        console.log("DataValues of result : " + JSON.stringify(result.rows));
        return result.rows;
      });
    },
    gourmet(_, args) {
      return Gourmet.findAndCountAll({ where: args }).then(function(result) {
        if (!result) {
            return 'Gourmet not find !';
        }
        console.log("DataValues of result : " + JSON.stringify(result.rows));
        return result.rows;
      });
    },
    cook(_, args) {
      return Cook.findAndCountAll({ where: args }).then(function(result) {
        if (!result) {
            return 'Cook not find !';
        }
        console.log("DataValues of result : " + JSON.stringify(result.rows));
        return result.rows;
      });
    },
    reservation(_, args) {
      return Reservation.findAndCountAll({ where: args }).then(function(result) {
        if (!result) {
            return 'Reservation not find !';
        }
        console.log("DataValues of result : " + JSON.stringify(result.rows));
        return result.rows;
      });
    },
    userLogin(_, args) {
      return UserLogin.findAndCountAll({ where: args }).then(function(result) {
        if (!result) {
            return 'UserLogin not find !';
        }
        console.log("DataValues of result : " + JSON.stringify(result.rows));
        return result.rows;
      });
    },
    workshop(_, args) {
      return Workshop.findAndCountAll({ where: args }).then(function(result) {
        if (!result) {
            return 'Workshop not find !';
        }
        console.log("DataValues of result : " + JSON.stringify(result.rows));
        return result.rows;
      });
    },
  },
  UserAccount: {
    gourmet(user_account) {
      return user_account.getGourmet();
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
    user_account(gourmet) {
      return gourmet.getUserAccount();
    },
  },
  // Mutation resolvers function definition
  Mutation: {
    addKitchen(_, args) {
      return Kitchen.create(args);
    },
    addUser(_, args) {
      return UserAccount.create(args);
    },
    updateKitchen(obj, args) {
      Kitchen.update(args,
        { where: { kitchen_id: args.kitchen_id }});
    },
    deleteKitchenAndWorkshopAssociated(obj, args) {
      Workshop.destroy({ where: { kitchen_id: args.kitchen_id }});
      return Kitchen.destroy({ where: args });
    }
  },
};

export default resolvers;
