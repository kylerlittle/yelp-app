# Databases Group Project

## Description
A basic web application similar to Yelp utilizing Yelp DataSets. Built with React, Express, Node, and PostgreSQL.

## Requirements
- Node ^11.10.1
- npm ^6.7.0
- psql ^11.2

## Usage
Initialize database, set up PostgreSQL user, and insert data.
```
cd yelp-app/db-init
./init_db.sh
```

Change password to basic '12345'.
```
psql CraKeN_YelpDB -tAc "ALTER USER ${USER} WITH PASSWORD '12345'"
```

Install necessary Node modules.
```
cd ../api-server
npm i
cd ../client
npm i
cd ..
npm i
```

Run the app!
```
npm start
```
