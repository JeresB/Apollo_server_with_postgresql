/*
 * \file resolvers.js
 * \brief Use to interact with the database through Apollo
 * \date 16 juin 2017
 * \author Cuistot du coin
 */

// Import of dependency
import GraphQLToolsTypes from "graphql-tools-types"
import {
  Kitchen,
  UserAccount,
  Gourmet,
  Cook,
  Reservation,
  UserLogin,
  Workshop
} from './models';
//!

// RESOLVERS APOLLO
const resolvers = {
  // Resolvers function for custom types
  Date: GraphQLToolsTypes.Date({ name: "MyDate" }),
  JSON: GraphQLToolsTypes.JSON({ name: "MyJSON" }),
  //!


  // ---------------------------------------------------------- //
  // Query resolvers function definition
  // ---------------------------------------------------------- //
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
  //! --------------------------------------------------------- //
  //! --------------------------------------------------------- //
  //! --------------------------------------------------------- //


  // ---------------------------------------------------------- //
  // For Imbricated queries
  // ---------------------------------------------------------- //
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
    addUserAccount  (_, args) { return UserAccount.create(args);  },
    addUserLogin    (_, args) { return UserLogin.create(args);    },
    addGourmet      (_, args) { return Gourmet.create(args);      },
    addCook         (_, args) { return Cook.create(args);         },
    addKitchen      (_, args) { return Kitchen.create(args);      },
    addWorkshop     (_, args) { return Workshop.create(args);     },
    addReservation  (_, args) { return Reservation.create(args);  },

    updateUserAccount(_, args) {
      UserAccount.update(args, {
        where: { user_id: args.user_id }
      }).then(function(result) {
        console.log("Update success !");
        return true;
      }).catch(function(error) {
        console.log("Update failed : " + error);
        return false;
      });
    },
    updateUserLogin(_, args) {
      return UserLogin.update(args, {
        where: { user_id: args.user_id }
      });
    },
    updateGourmet(_, args) {
      return Gourmet.update(args, {
        where: { gourmet_id: args.gourmet_id }
      });
    },
    updateCook(_, args) {
      return Cook.update(args, {
        where: { cook_id: args.cook_id }
      });
    },
    updateKitchen(_, args) {
      return Kitchen.update(args, {
        where: { kitchen_id: args.kitchen_id }
      });
    },
    updateWorkshop(_, args) {
      return Workshop.update(args, {
        where: { workshop_id: args.workshop_id }
      });
    },
    updateReservation (_, args) {
      return Reservation.update(args, {
        where: {
          gourmet_id: args.gourmet_id,
          workshop_id: args.workshop_id
        }
      });
    },



    deleteKitchenAndWorkshopAssociated(obj, args) {
      Workshop.destroy({ where: { kitchen_id: args.kitchen_id }});
      return Kitchen.destroy({ where: args });
    }
  }
  //! --------------------------------------------------------- //
  //! --------------------------------------------------------- //
  //! --------------------------------------------------------- //
};

// Resolvers of apollo server export
export default resolvers;
