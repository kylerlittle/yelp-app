#!/bin/sh

# db name
DB_NAME=CraKeN_YelpDB

# empty current db
sudo -u postgres dropdb $DB_NAME
sudo -u postgres createdb $DB_NAME

# restore db (before and updates or triggers placed)
psql $DB_NAME < craken_yelpdb.sql