installer :
graphql-tools
graphql-tools-types
sequelize
uuid
pg
pg-hstore
body-parser

CREATE EXTENSION postgis;
CREATE EXTENSION postgis_topology;

Dans la BDD remplacer le type point de location
par le type geometry ( dans les tables kitchen et gourmet)

remplacer les noms created_at par createdAt
et updated_at par updatedAt


query DiscoverWorkshopQuery {
  workshop {
    workshop_id
    name
    price
    duration
    min_gourmet
    max_gourmet
    description
    pictures
    kitchen_id
    cook_id
    workshop_date
    reservation {
      amount
    }
    cook {
      cook_id
      is_pro
      description
      gourmet {
        location
        city
      }
    }
    kitchen {
      kitchen_id
      name
      location
      city
    }
  }
}
