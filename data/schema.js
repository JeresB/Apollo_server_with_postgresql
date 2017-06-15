const typeDefinitions = `
# new type definition
  scalar UUID
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
    # gourmet: Gourmet
    login: UserLogin
  }
  type kitchen {
    kitchen_id: ID
    name: String
    city: String
    cp: String
    longitude: Float
    latitude: Float
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
    # user_account: UserAccount
    # cook: Cook
  }
  type Cook {
    cook_id: ID
    is_pro: Boolean
    description: String
    # gourmet: Gourmet
  }
  type Reservation {
    gourmet_id: ID
    workshop_id: ID
    amount: Int
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
  }
#! ----------------
#! ----------------
#! ----------------

# ----------------
# Query definition
# ----------------
  type Query {
    UserAccount(user_id: ID, email: String): [UserAccount]
    kitchen(kitchen_id: ID, name: String): kitchen
    allKitchen(kitchen_id: ID, name: String): [kitchen]
    gourmet(gourmet_id: ID, first_name: String): Gourmet
    cook(cook_id: ID, description: String): Cook
    reservation(gourmet_id: ID, workshop_id: ID, amount: Int): Reservation
    userLogin(name: String, key: String, user_id: ID): UserLogin
    workshop(workshop_id: ID, name: String, price: Int): Workshop
    # exampleUUID(uuid: UUID): UUID
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
    ): kitchen
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
    updateKitchen(
      kitchen_id: ID!,
      name: String,
      city: String,
      cp: String,
      longitude: Float,
      latitude: Float
    ): kitchen
    deleteKitchenAndWorkshopAssociated(
      kitchen_id: ID!,
      name: String
    ): kitchen
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
