/*
 * \file schema.js
 * \brief  { Tables statement with Apollo Server
 *           Query and mutation statement as well
 *           schema definition }
 * \date 16 juin 2017
 * \author Cuistot du coin
 */

// Schema use by Apollo and Graphql
const typeDefinitions = `
# new type definition
  scalar Date
  scalar JSON
#! ----------------

# -----------------
# tables definition
# -----------------
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
    longitude: Float
    latitude: Float
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
    longitude: Float
    latitude: Float
    description: String
    user_account: UserAccount
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
#! ----------------
#! ----------------
#! ----------------

# ----------------
# Query definition
# ----------------
  type Query {
    userAccount(user_id: ID, email: String, email_confirmed: Boolean, password_hash: String, security_stamp: String, concurrency_stamp: ID, phone_number: String, phone_number_confirmed: Boolean, two_factor_enabled: Boolean, lockout_end: Date, lockout_enabled: Boolean, access_failed_count: Int): [UserAccount]
    kitchen(kitchen_id: ID, name: String, city: String, cp: String, longitude: Float, latitude: Float): [Kitchen]
    gourmet(gourmet_id: ID, first_name: String, last_name: String, picture: JSON, gender: String, city: String, cp: String, longitude: Float, latitude: Float, description: String): [Gourmet]
    cook(cook_id: ID, is_pro: Boolean, description: String): [Cook]
    reservation(gourmet_id: ID, workshop_id: ID, amount: Int): [Reservation]
    userLogin(name: String, key: String, user_id: ID): [UserLogin]
    workshop(workshop_id: ID, name: String, price: Int, duration: Int, min_gourmet: Int, max_gourmet: Int, description: String, pictures: JSON, kitchen_id: ID, cook_id: ID, workshop_date: Date): [Workshop]
  }

# -------------------
# Mutation definition
# -------------------
  type Mutation {
    addKitchen(
      name: String,
      city: String,
      cp: String,
      longitude: Float,
      latitude: Float
    ): Kitchen
    addUser(
      email: String,
      email_confirmed: Boolean,
      password_hash: String,
      security_stamp: String,
      concurrency_stamp: ID,
      phone_number: String,
      phone_number_confirmed: Boolean,
      two_factor_enabled: Boolean,
      lockout_end: Date,
      lockout_enabled: Boolean,
      access_failed_count: Int,
    ): UserAccount
    addGourmet(
      gourmet_id: ID,
      first_name: String,
      last_name: String,
      picture: JSON,
      gender: String,
      city: String,
      cp: String,
      longitude: Float,
      latitude: Float,
      description: String
    ): Gourmet
    updateKitchen(
      kitchen_id: ID!,
      name: String,
      city: String,
      cp: String,
      longitude: Float,
      latitude: Float
    ): Kitchen
    deleteKitchenAndWorkshopAssociated( kitchen_id: ID!, name: String ): Kitchen
  }

# -----------------
# SCHEMA definition
# -----------------
  schema {
    query: Query
    mutation: Mutation
  }
`;

// Schema of apollo server export
export default [typeDefinitions];
