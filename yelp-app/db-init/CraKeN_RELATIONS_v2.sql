/*
 * Concerns
 *  - use of NUMERIC over INTEGER type (performance trade off?)
 *  - if VARCHARs are long enough
 *  - unsure how to do calculated field
 *  - usage of DOMAIN; there might be a better way to do this... like enum types?
 *  - used a varchar in case where there are fixed options... for instance,
 *      for 'alcohol', there are basically 3 possible texts. Could probably optimize.
 */

CREATE TABLE YelpUser(
    user_id CHAR(22),
    average_stars NUMERIC(3, 2),  /* 3 == total sig figs, 2 sig figs to right of decimal point */
    cool INTEGER DEFAULT 0,
    fans INTEGER DEFAULT 0,
    funny INTEGER DEFAULT 0,
    user_name VARCHAR(60),   /* Reasonable assumption for a first name. */
    useful INTEGER DEFAULT 0,
    yelping_since DATE,
    review_count INTEGER DEFAULT 0,  /* Calculated Field */
    PRIMARY KEY (user_id)
);

/* Each "friendship" only needs to be stored once; however,
to simplify things, we will store them twice. */
CREATE TABLE FriendsWith(
    owner_of_friend_list CHAR(22),
    on_friend_list CHAR(22),
    PRIMARY KEY (owner_of_friend_list, on_friend_list),
    FOREIGN KEY (owner_of_friend_list) REFERENCES YelpUser(user_id),
    FOREIGN KEY (on_friend_list) REFERENCES YelpUser(user_id)
);

CREATE TABLE Business(
    business_id CHAR(22),
    business_name VARCHAR(100),  /* Reasonable assumption. */
    business_address VARCHAR(100),  /* Reasonable assumption. */
    business_city VARCHAR(50),
    business_state VARCHAR(50),
    review_count INTEGER DEFAULT 0,  /* Calculated Field */
    review_rating NUMERIC(2, 1) DEFAULT 0.0,  /* Calculated Field */
    average_stars NUMERIC(2, 1),
    num_checkins INTEGER DEFAULT 0,   /* Calculated Field */
    postal_code NUMERIC(5, 0),  /* 5 digit code. No decimal point. */
    is_open BOOLEAN,   /* This is a 0 or 1 in the JSON, but change in the actual implementation bc that's dumb. Also I guess this is calculated... */
    PRIMARY KEY (business_id)
);

CREATE TABLE Review(
    user_id CHAR(22) NOT NULL,
    business_id CHAR(22) NOT NULL,
    review_id CHAR(22),
    cool INTEGER DEFAULT 0,
    funny INTEGER DEFAULT 0,
    useful INTEGER DEFAULT 0,
    stars_given NUMERIC(1, 0) DEFAULT 0,
    date_written DATE,
    review_text TEXT,
    PRIMARY KEY (review_id),
    FOREIGN KEY (user_id) REFERENCES YelpUser(user_id),
    FOREIGN KEY (business_id) REFERENCES Business(business_id)
);

/* Longest day of week is Wednesday, 9 chars */
CREATE DOMAIN day_of_week AS VARCHAR(9)
CHECK(
    VALUE = 'Sunday'
    OR VALUE = 'Monday'
    OR VALUE = 'Tuesday'
    OR VALUE = 'Wednesday'
    OR VALUE = 'Thursday'
    OR VALUE = 'Friday'
    OR VALUE = 'Saturday'
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
    checkin_count SMALLINT DEFAULT 0,
    PRIMARY KEY (business_id, checkin_day, checkin_time),
    FOREIGN KEY (business_id) REFERENCES Business(business_id)
);

/* These are like 'tags' to describe the restaurant. */
CREATE TABLE Categories(
    business_id CHAR(22),
    category_name VARCHAR(80),   /* Reasonable Assumption. */
    PRIMARY KEY (category_name, business_id),
    FOREIGN KEY (business_id) REFERENCES Business(business_id)
);

/*
 * Includes every business attribute
*/
CREATE TABLE Attributes(
    business_id CHAR(22),
    attribute_name VARCHAR(80),   /* Reasonable Assumption. */
    attribute_value VARCHAR(80),   /* Reasonable Assumption. */
    PRIMARY KEY (attribute_name, business_id),
    FOREIGN KEY (business_id) REFERENCES Business(business_id)
);

CREATE TABLE Hours(
    business_id CHAR(22),
    day_open day_of_week,
    opens_at hour_of_day NOT NULL,
    closes_at hour_of_day NOT NULL,
    PRIMARY KEY (day_open, business_id),
    FOREIGN KEY (business_id) REFERENCES Business(business_id)
);

CREATE TABLE Favorite(
    business_id CHAR(22),
    user_id CHAR(22),
    PRIMARY KEY (business_id, user_id),
    FOREIGN KEY (business_id) REFERENCES Business(business_id),
    FOREIGN KEY (user_id) REFERENCES YelpUser(user_id)
);
