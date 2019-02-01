CREATE TABLE User(
    user_id CHAR(22),
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
    PRIMARY KEY (business_id)
);

CREATE TABLE Review(
    user_id CHAR(22) NOT NULL,
    business_id CHAR(22) NOT NULL,
    review_id CHAR(22),
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
    PRIMARY KEY (business_id),
    FOREIGN KEY (business_id) REFERENCES Business(business_id)
);

CREATE TABLE GoodForMeal(
    business_id CHAR(22),
    PRIMARY KEY (business_id),
    FOREIGN KEY (business_id) REFERENCES Business(business_id)
);

CREATE TABLE Ambience(
    business_id CHAR(22),
    PRIMARY KEY (business_id),
    FOREIGN KEY (business_id) REFERENCES Business(business_id)
);

CREATE TABLE BusinessParking(
    business_id CHAR(22),
    PRIMARY KEY (business_id),
    FOREIGN KEY (business_id) REFERENCES Business(business_id)
);