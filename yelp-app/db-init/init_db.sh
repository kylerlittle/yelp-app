#!/usr/bin/bash

# Variables
DB_NAME=CraKeN_YelpDB

# Create a role for yourself with same name as login name if doesn't exist
if [ "$(psql postgres -tAc "SELECT 1 FROM pg_roles WHERE rolname='$USER'")" ]; then
    echo 'Nice work! PostgreSQL role '$USER' exists already';
else
    echo 'Creating postgres role '$USER' with superuser permissions'; \
    sudo -u postgres createuser --superuser $USER
fi

# Create db
sudo -u postgres createdb $DB_NAME

# Create tables.
psql -U $USER -d $DB_NAME -a -f CraKeN_RELATIONS_v2.sql

# Insert data.
echo "TODO -- insert data"