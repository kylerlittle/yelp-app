/* create those amazeballs indexes */
CREATE INDEX business_id_index ON Business(business_id);
CREATE INDEX user_id_index ON YelpUser(user_id);

/* Update average stars given for each user */
UPDATE YelpUser AS user1 SET average_stars = (SELECT AVG(stars_given) FROM Review WHERE user_id = user1.user_id GROUP BY user_id);
/* Update number of reviews for each user */
UPDATE YelpUser AS user1 SET review_count = (SELECT COUNT(*) FROM Review WHERE user_id = user1.user_id);
/* Update number of reviews for each business */
UPDATE Business AS b1 SET review_count = (SELECT COUNT(*) FROM Review WHERE business_id = b1.business_id);

/* Update average stars given for each business (seems like average_stars and review_rating mean the same thing?) */
UPDATE Business AS b1 SET average_stars = (SELECT AVG(stars_given) FROM Review WHERE business_id = b1.business_id);
UPDATE Business AS b1 SET review_rating = (SELECT AVG(stars_given) FROM Review WHERE business_id = b1.business_id);

/* Update number of checkins for each business */
UPDATE Business AS b1 SET num_checkins = (SELECT COUNT(*) FROM Checkin WHERE business_id = b1.business_id);


