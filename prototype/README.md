## Usage
Install postgresql if not installed.
```
sudo apt-get install postgresql
```

Create a role and database.
```
bash init_db.sh
```

If successful, you should be able to start the interactive session.
```
psql Milestone1DB
```
You can check to see if the initialization worked correctly by running a few queries.
```
SELECT DISTINCT business_state FROM business ORDER BY business_state;
SELECT DISTINCT business_city FROM business WHERE business_state='AZ' ORDER BY business_city;
SELECT business_name FROM business WHERE business_city='Anthem' AND business_state='AZ' ORDER BY business_name;
```

Type ```\q``` to exit.