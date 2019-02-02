#!/usr/bin/bash

# Variables
DB_NAME=Milestone1DB

# Create a role for yourself with same name as login name
sudo -u postgres createuser --superuser $USER

# Create db
sudo -u postgres createdb $DB_NAME

# Save history.
touch .psql_history

# Create table and insert data.
psql -U $USER -d $DB_NAME -a -f init_business.sql