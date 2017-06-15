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
    UserAccount(obj, args, context) {
      return UserAccount.findAndCountAll(
        //{attributes: [ 'email' ]},
        { where: args }
      ).then(function(user) {
        if (!user) {
            return 'not find';
        }
        console.log("DataValues of user : " + JSON.stringify(user.rows));
        return user.rows;
     });
    },
    kitchen(_, args) {
      return Kitchen.find({ where: args });
    },
    allKitchen(obj, args) {
      Kitchen.findAll({ where: args }).then(kitchen => {
        console.log(kitchen[0].kitchen_id);
        console.log(kitchen[1].kitchen_id);
        const kitchens = [{
          kitchen_id: kitchen[0].kitchen_id,
          name: kitchen[0].name
        }, {
          kitchen_id: kitchen[1].kitchen_id,
          name: kitchen[1].name
        }];
        console.log(kitchens);
        return kitchen;
      })
    },
    gourmet(_, args) {
      return Gourmet.find({ where: args });
    },
    cook(_, args) {
      return Cook.find({ where: args });
    },
    reservation(_, args) {
      return Reservation.find({ where: args });
    },
    userLogin(_, args) {
      console.log("Query UserLogin : " + args);
      return UserLogin.find({ where: args });
    },
    workshop(_, args) {
      return Workshop.find({ where: args });
    },
    // exampleUUID: (root, args, ctx, info) => {
    //   return args.uuid
    // },
  },
  // UserAccount: {
  //   gourmet(useraccount) {
  //     return useraccount.getGourmet();
  //   },
  // },
  // Gourmet: {
  //   Cook(gourmet) {
  //     return gourmet.getCook();
  //   }
  // },
  // Gourmet: {
  //   user_account(gourmet) {
  //     return gourmet.getUserAccount();
  //   }
  // },
  // UserAccount: {
  //   gourmet(user_account) {
  //     return user_account.getGourmet();
  //   },
  // },
  UserAccount: {
    login(account) {
      let login = account.getUserLogin();
      //console.log("UserAccount : " + login[0].name);
      return account.getUserLogin();
    },
  },
  UserLogin: {
    account(login) {
      console.log("UserLogin : " + login.getUserAccount());
      return login.getUserAccount();
    },
  },

  // Mutation resolvers function definition
  Mutation: {
    addKitchen(_, args) {
      return Kitchen.create(args);
    },
    addUser(_, args) {
      console.log(args);
      return UserAccount.create(args);
    },
    updateKitchen(obj, args) {
      Kitchen.update(args,
        {where: {kitchen_id: args.kitchen_id}});
    },
    deleteKitchenAndWorkshopAssociated(obj, args) {
      Workshop.destroy({ where: { kitchen_id: args.kitchen_id }});
      return Kitchen.destroy({ where: args });
    }
  },
};

export default resolvers;
