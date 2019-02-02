/*
 * Concerns
 *  - use of NUMERIC over INTEGER type (performance trade off?)
 *  - if VARCHARs are long enough
 *  - unsure how to do calculated field
 *  - usage of DOMAIN; there might be a better way to do this... like enum types?
 *  - used a varchar in case where there are fixed options... for instance,
 *      for 'alcohol', there are basically 3 possible texts. Could probably optimize.
 */

CREATE TABLE User(
    user_id CHAR(22),
    average_stars NUMERIC(3, 2),  /* 3 == total sig figs, 2 sig figs to right of decimal point */
    cool INTEGER,
    fans INTEGER,
    funny INTEGER,
    user_name VARCHAR(60),   /* Reasonable assumption for a first name. */
    useful INTEGER,
    yelping_since DATE,
    review_count INTEGER,  /* Calculated, but not sure how to do this in PostgreSQL. */
    PRIMARY KEY (user_id)
);

/* Each "friendship" only needs to be stored once; however,
to simplify things, we will store them twice. */
CREATE TABLE FriendsWith(
    owner_of_friend_list CHAR(22),
    on_friend_list CHAR(22),
    PRIMARY KEY (owner_of_friend_list, on_friend_list),
    FOREIGN KEY (owner_of_friend_list) REFERENCES User(user_id),
    FOREIGN KEY (on_friend_list) REFERENCES User(user_id)
);

CREATE TABLE Business(
    business_id CHAR(22),
    business_name VARCHAR(100),  /* Reasonable assumption. */
    business_address VARCHAR(100),  /* Reasonable assumption. */
    business_city VARCHAR(50),
    business_state VARCHAR(50),
    alcohol VARCHAR(20),   /* Reasonable assumption. Only a few different types though -- 'none', 'beer_and_wine', etc. */
    noise_level VARCHAR(20),  /* Same situation as 'alcohol' */
    has_tv BOOLEAN,
    price_range NUMERIC(1, 0),
    review_count INTEGER,  /* Calculated, but not sure how to do this in PostgreSQL. */
    average_stars NUMERIC(2, 1),  /* Calculated, but not sure how to do this in PostgreSQL. */
    postal_code NUMERIC(5, 0),  /* 5 digit code. No decimal point. */
    caters BOOLEAN,
    has_wifi BOOLEAN,
    is_open BOOLEAN,   /* This is a 0 or 1 in the JSON, but change in the actual implementation bc that's dumb. */
    offers_delivery BOOLEAN,
    restaurants_good_for_groups BOOLEAN,
    restaurants_table_service BOOLEAN,
    restaurants_attire VARCHAR(20),  /* Only a few different types... but whatever. */
    takes_reservations BOOLEAN,
    has_outdoor_seating BOOLEAN,
    accepts_credit_cards BOOLEAN,
    has_bike_parking BOOLEAN,
    PRIMARY KEY (business_id)
);

CREATE TABLE Review(
    user_id CHAR(22) NOT NULL,
    business_id CHAR(22) NOT NULL,
    review_id CHAR(22),
    cool INTEGER,
    funny INTEGER,
    useful INTEGER,
    stars_given NUMERIC(1, 0),
    date_written DATE,
    review_text TEXT,
    PRIMARY KEY (review_id),
    FOREIGN KEY (user_id) REFERENCES User(user_id),
    FOREIGN KEY (business_id) REFERENCES Business(business_id)
);

/* Longest day of week is Wednesday, 9 chars */
CREATE DOMAIN day_of_week AS VARCHAR(9)
CHECK(
    VALUE = "Sunday"
    OR VALUE = "Monday"
    OR VALUE = "Tuesday"
    OR VALUE = "Wednesday"
    OR VALUE = "Thursday"
    OR VALUE = "Friday"
    OR VALUE = "Saturday"
);

/* Only need to store the hour of day, so might as well save some space. */
CREATE DOMAIN hour_of_day as SMALLINT
CHECK(
    VALUE >= 0
    AND VALUE <= 23
);

/* You can *uniquely* identify a checkin instance by the business ID,
day of week, and the hour. Simply increment a counter for each
checkin at that time. Reasonable to assume no more than 32767 checkins
within an hour. */
CREATE TABLE CheckIn(
    business_id CHAR(22),
    checkin_day day_of_week,
    checkin_time hour_of_day,
    checkin_count SMALLINT,
    PRIMARY KEY (business_id, checkin_day, hour),
    FOREIGN KEY (business_id) REFERENCES Business(business_id)
);

CREATE TABLE IsDescribedBy(
    business_id CHAR(22),
    restaurant_genre VARCHAR(50),   /* Reasonable Assumption. */
    PRIMARY KEY (business_id),
    FOREIGN KEY (business_id) REFERENCES Business(business_id)
);

CREATE TABLE GoodForMeal(
    business_id CHAR(22),
    brunch BOOLEAN,
    breakfast BOOLEAN,
    dinner BOOLEAN,
    dessert BOOLEAN,
    late_night BOOLEAN,
    lunch BOOLEAN,
    PRIMARY KEY (business_id),
    FOREIGN KEY (business_id) REFERENCES Business(business_id)
);

CREATE TABLE Ambience(
    business_id CHAR(22),
    casual BOOLEAN,
    romantic BOOLEAN,
    intimate BOOLEAN,
    classy BOOLEAN,
    hipster BOOLEAN,
    divey BOOLEAN,
    touristy BOOLEAN,
    trendy BOOLEAN,
    upscale BOOLEAN,
    PRIMARY KEY (business_id),
    FOREIGN KEY (business_id) REFERENCES Business(business_id)
);

CREATE TABLE BusinessParking(
    business_id CHAR(22),
    garage BOOLEAN,
    street BOOLEAN,
    validated BOOLEAN,
    lot BOOLEAN,
    valet BOOLEAN,
    PRIMARY KEY (business_id),
    FOREIGN KEY (business_id) REFERENCES Business(business_id)
);