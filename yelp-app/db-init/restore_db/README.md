delete the current db:
```sudo -u postgres dropdb CraKeN_YelpDB```

create an empty db:
```sudo -u postgres createdb CraKeN_YelpDB```

restore the db (before any updates or triggers were placed);
```psql CraKeN_YelpDB < craken_yelpdb.sql```