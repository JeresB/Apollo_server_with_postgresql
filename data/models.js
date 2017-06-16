/*
 * \file models.js
 * \brief  Tables statement with Sequelize
 * \date 16 juin 2017
 * \author Cuistot du coin
 */

// Import of dependency
import Sequelize from 'sequelize';
const uuidV1 = require('uuid/v1');
import db from './connectors';
//!

// ---------------------------------------------------------- //
// Models statement of every tables present in the database
// ---------------------------------------------------------- //

// Kitchen Model
const KitchenModel = db.define('kitchen', {
  kitchen_id: {
    type: Sequelize.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: function() {
      return uuidV1()
    }
  },
  name: { type: Sequelize.STRING(100) },
  city: { type: Sequelize.STRING(100) },
  cp: { type: Sequelize.STRING(10) },
  longitude: { type: Sequelize.REAL },
  latitude: { type: Sequelize.REAL }
},
{
  timestamps: false,
  freezeTableName: true,
  tableName: 'kitchen'
});
//!


// UserAccount Model
const UserAccountModel = db.define('user_account', {
  user_id: {
    type: Sequelize.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: function() {
      return uuidV1()
    }
  },
  email: {
    type: Sequelize.STRING,
    unique: true
  },
  email_confirmed: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  password_hash: { type: Sequelize.STRING(100) },
  security_stamp: { type: Sequelize.STRING(100) },
  concurrency_stamp: {
    type: Sequelize.UUID,
    allowNull: false,
    defaultValue: function() {
      return uuidV1()
    }
  },
  phone_number: { type: Sequelize.STRING(50) },
  phone_number_confirmed: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  two_factor_enabled: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  lockout_end: { type: Sequelize.DATEONLY },
  lockout_enabled: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  access_failed_count: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0
  }
},
{
  timestamps: false,
  freezeTableName: true,
  tableName: 'user_account'
});
//!


// Gourmet Model
const GourmetModel = db.define('gourmet', {
  gourmet_id: {
    type: Sequelize.UUID,
    primaryKey: true,
    allowNull: false,
    references: {
      model: "user_account",
      key: "user_id"
    }
  },
  first_name: { type: Sequelize.STRING(100) },
  last_name: { type: Sequelize.STRING(100) },
  picture: { type: Sequelize.JSON },
  gender: { type: Sequelize.STRING(50) },
  city: { type: Sequelize.STRING(100) },
  cp: { type: Sequelize.STRING(10) },
  longitude: { type: Sequelize.REAL },
  latitude: { type: Sequelize.REAL },
  description: { type: Sequelize.TEXT }
},
{
  freezeTableName: true,
  tableName: 'gourmet'
});

const CookModel = db.define('cook', {
  cook_id: {
    type: Sequelize.UUID,
    primaryKey: true,
    allowNull: false,
    references: {
      model: "gourmet",
      key: "gourmet_id"
    }
  },
  is_pro: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  description: { type: Sequelize.TEXT }
},
{
  timestamps: false,
  freezeTableName: true,
  tableName: 'cook'
});
//!


// Reservation Model
const ReservationModel = db.define('reservation', {
  gourmet_id: {
    type: Sequelize.UUID,
    primaryKey: true,
    allowNull: false,
    references: {
      model: "gourmet",
      key: "gourmet_id"
    }
  },
  workshop_id: {
    type: Sequelize.UUID,
    primaryKey: true,
    allowNull: false,
    references: {
      model: "workshop",
      key: "workshop_id"
    }
  },
  amount: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 1
  }
},
{
  timestamps: false,
  freezeTableName: true,
  tableName: 'reservation'
});
//!


// UserLogin Model
const UserLoginModel = db.define('user_login', {
  name: {
    type: Sequelize.STRING,
    primaryKey: true,
    allowNull: false
  },
  key: {
    type: Sequelize.STRING,
    primaryKey: true,
    allowNull: false
  },
  user_id: {
    type: Sequelize.UUID,
    allowNull: false,
    references: {
      model: "user_account",
      key: "user_id"
    }
  },
},
{
  timestamps: false,
  freezeTableName: true,
  tableName: 'user_login'
});
//!


// Workshop Model
const WorkshopModel = db.define('workshop', {
  workshop_id: {
    type: Sequelize.UUID,
    primaryKey: true,
    allowNull: true,
    defaultValue: function() {
      return uuidV1()
    }
  },
  name: { type: Sequelize.STRING(100) },
  price: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  duration: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  min_gourmet: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  max_gourmet: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  description: { type: Sequelize.TEXT },
  pictures: { type: Sequelize.JSON },
  kitchen_id: {
    type: Sequelize.UUID,
    allowNull: true,
    references: {
      model: "kitchen",
      key: "kitchen_id"
    }
  },
  cook_id: {
    type: Sequelize.UUID,
    allowNull: false,
    references: {
      model: "cook",
      key: "cook_id"
    }
  },
  workshop_date: {
    type: Sequelize.DATEONLY,
    allowNull: false,
  }
},
{
  timestamps: false,
  freezeTableName: true,
  tableName: 'workshop'
});
//! --------------------------------------------------------- //
//! --------------------------------------------------------- //
//! --------------------------------------------------------- //


// ---------------------------------------------------------- //
// Combination between tables
// ---------------------------------------------------------- //

// One kitchen has multiple workshop AND one workshop belongs to one kitchen
KitchenModel.hasMany(WorkshopModel, { as: 'Workshop', foreignKey: 'kitchen_id' });
WorkshopModel.belongsTo(KitchenModel, { foreignKey: 'kitchen_id' });

// One cook has one workshop AND one workshop belongs to one cook
CookModel.hasMany(WorkshopModel, { as: 'Workshop', foreignKey: 'cook_id' });
WorkshopModel.belongsTo(CookModel, { foreignKey: 'cook_id' });

// One user account --- one user login
UserAccountModel.hasOne(UserLoginModel, { as: 'UserLogin', foreignKey: 'user_id' });
UserLoginModel.belongsTo(UserAccountModel, { as: 'UserAccount', foreignKey: 'user_id' });

// One user account --- one gourmet
UserAccountModel.hasOne(GourmetModel, { foreignKey: 'gourmet_id' });
GourmetModel.belongsTo(UserAccountModel, { foreignKey: 'gourmet_id' });

// A cook is also a gourmet
CookModel.belongsTo(GourmetModel, { foreignKey: 'cook_id' });
GourmetModel.hasOne(CookModel, { foreignKey: 'cook_id' });

// Link between Workshop and Gourmet through Reservation
WorkshopModel.belongsToMany(GourmetModel, {through: 'reservation', as: 'Reservation', foreignKey: 'workshop_id' });
GourmetModel.belongsToMany(WorkshopModel, {through: 'reservation', as: 'Reservation', foreignKey: 'gourmet_id' });
ReservationModel.hasMany(GourmetModel, { as: 'Gourmet', foreignKey: 'gourmet_id' });
ReservationModel.hasMany(WorkshopModel, { as: 'Workshop', foreignKey: 'workshop_id' });
//! --------------------------------------------------------- //
//! --------------------------------------------------------- //
//! --------------------------------------------------------- //

// Models preparation
const Kitchen = db.models.kitchen;
const UserAccount = db.models.user_account;
const Gourmet = db.models.gourmet;
const Cook = db.models.cook;
const Reservation = db.models.reservation;
const UserLogin = db.models.user_login;
const Workshop = db.models.workshop;
//!

// All models tables export
export {
  Kitchen,
  UserAccount,
  Gourmet,
  Cook,
  Reservation,
  UserLogin,
  Workshop
};
