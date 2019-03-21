#!/bin/sh

# Ensure PostgreSQL is installed.
if [ -x "$(command -v psql)" ]; then
    echo "Good job. You got PostgreSQL installed."
else
    echo "RIP. PostgreSQL is not installed. Please install."; \
    exit 1
fi

# Variables
DB_NAME=CraKeN_YelpDB

# Create a role for yourself with same name as login name if doesn't exist
if [ "$(psql postgres -tAc "SELECT 1 FROM pg_roles WHERE rolname='$USER'")" ]; then
    echo 'Nice work! PostgreSQL role '$USER' exists already';
else
    echo 'Creating PostgreSQL role '$USER' with superuser permissions'; \
    sudo -u postgres createuser --superuser $USER
fi

# Drop db if exists... Then create db.
sudo -u postgres dropdb $DB_NAME
sudo -u postgres createdb $DB_NAME

# Create tables.
psql -U $USER -d $DB_NAME -a -f CraKeN_RELATIONS_v2.sql

# If we add the triggers before we start inserting, calculated fields should be correct when insert is finished
psql -U $USER -d $DB_NAME -a -f CraKeN_TRIGGERS.sql


# Insert data.
node insert.js 


