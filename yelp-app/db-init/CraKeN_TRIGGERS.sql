/* OLD functions use OLD to refer to a row while NEW functions use NEW to refer to a row
It has to do with what operation the trigger is triggered by */

/* update average user rating */
CREATE OR REPLACE FUNCTION newAverageUserRating() RETURNS trigger AS '
BEGIN 
    UPDATE YelpUser AS user1 SET average_stars = (SELECT AVG(stars_given) FROM Review WHERE user_id = NEW.user_id GROUP BY user_id) WHERE user1.user_id = NEW.user_id;
    RETURN NEW;
END
' LANGUAGE plpgsql; 

CREATE OR REPLACE FUNCTION oldAverageUserRating() RETURNS trigger AS '
BEGIN 
    UPDATE YelpUser AS user1 SET average_stars = (SELECT AVG(stars_given) FROM Review WHERE user_id = OLD.user_id GROUP BY user_id) WHERE user1.user_id = OLD.user_id;
    RETURN NEW;
END
' LANGUAGE plpgsql; 

CREATE TRIGGER deleteUpdateAverageUserRating
AFTER DELETE ON Review
FOR EACH ROW
EXECUTE PROCEDURE oldAverageUserRating();

CREATE TRIGGER insertupdateAverageUserRating
AFTER INSERT ON Review
FOR EACH ROW
EXECUTE PROCEDURE newAverageUserRating();

CREATE TRIGGER updateAverageUserRating
AFTER UPDATE ON Review
FOR EACH ROW
EXECUTE PROCEDURE newAverageUserRating();

/* update average business rating */
CREATE OR REPLACE FUNCTION newAverageBusinessRating() RETURNS trigger AS '
BEGIN 
    UPDATE Business AS b SET average_stars = (SELECT AVG(stars_given) FROM Review WHERE business_id = NEW.business_id GROUP BY business_id) WHERE b.business_id = NEW.business_id;
    UPDATE Business AS b SET review_rating = (SELECT AVG(stars_given) FROM Review WHERE business_id = NEW.business_id GROUP BY business_id) WHERE b.business_id = NEW.business_id;    
    RETURN NEW;
END
' LANGUAGE plpgsql; 

CREATE OR REPLACE FUNCTION oldAverageBusinessRating() RETURNS trigger AS '
BEGIN 
    UPDATE Business AS b SET average_stars = (SELECT AVG(stars_given) FROM Review WHERE business_id = OLD.business_id GROUP BY business_id) WHERE b.business_id = OLD.business_id;
    UPDATE Business AS b SET review_rating = (SELECT AVG(stars_given) FROM Review WHERE business_id = OLD.business_id GROUP BY business_id) WHERE b.business_id = OLD.business_id;
    RETURN NEW;
END
' LANGUAGE plpgsql; 

CREATE TRIGGER deleteUpdateAverageBusinessRating
AFTER DELETE ON Review
FOR EACH ROW
EXECUTE PROCEDURE oldAverageBusinessRating();

CREATE TRIGGER insertupdateAverageBusinessRating
AFTER INSERT ON Review
FOR EACH ROW
EXECUTE PROCEDURE newAverageBusinessRating();

CREATE TRIGGER updateAverageBusinessRating
AFTER UPDATE ON Review
FOR EACH ROW
EXECUTE PROCEDURE newAverageBusinessRating();

/* update user rating count */
CREATE OR REPLACE FUNCTION olduserRatingCount() RETURNS trigger AS '
BEGIN 
    UPDATE YelpUser AS user1 SET review_count = (SELECT count(*) FROM Review WHERE user_id = OLD.user_id GROUP BY user_id) WHERE user1.user_id = OLD.user_id;
    RETURN NEW;
END
' LANGUAGE plpgsql; 

CREATE OR REPLACE FUNCTION newuserRatingCount() RETURNS trigger AS '
BEGIN 
    UPDATE YelpUser AS user1 SET review_count = (SELECT count(*) FROM Review WHERE user_id = NEW.user_id GROUP BY user_id) WHERE user1.user_id = NEW.user_id;
    RETURN NEW;
END
' LANGUAGE plpgsql; 

CREATE TRIGGER deleteUpdateUserRatingCount
AFTER DELETE ON Review
FOR EACH ROW
EXECUTE PROCEDURE olduserRatingCount();

CREATE TRIGGER insertUpdateUserRatingCount
AFTER INSERT ON Review
FOR EACH ROW
EXECUTE PROCEDURE newuserRatingCount();


/* update business rating count */
CREATE OR REPLACE FUNCTION oldBusinessRatingCount() RETURNS trigger AS '
BEGIN 
    UPDATE Business AS b SET review_count = (SELECT count(*) FROM Review WHERE business_id = OLD.business_id GROUP BY business_id) WHERE b.business_id = OLD.business_id;
    RETURN NEW;
END
' LANGUAGE plpgsql; 

CREATE OR REPLACE FUNCTION newBusinessRatingCount() RETURNS trigger AS '
BEGIN 
    UPDATE Business AS b SET review_count = (SELECT count(*) FROM Review WHERE business_id = NEW.business_id GROUP BY business_id) WHERE b.business_id = NEW.business_id;
    RETURN NEW;
END
' LANGUAGE plpgsql; 

CREATE TRIGGER deleteUpdateBusinessRatingCount
AFTER DELETE ON Review
FOR EACH ROW
EXECUTE PROCEDURE oldBusinessRatingCount();

CREATE TRIGGER insertUpdateBusinessRatingCount
AFTER INSERT ON Review
FOR EACH ROW
EXECUTE PROCEDURE newBusinessRatingCount();

/* update business checkin count */
CREATE OR REPLACE FUNCTION oldBusinessCheckinCount() RETURNS trigger AS '
BEGIN 
    UPDATE Business AS b SET num_checkins = (SELECT count(*) FROM Checkins WHERE business_id = OLD.business_id GROUP BY business_id) WHERE b.business_id = OLD.business_id;
    RETURN NEW;
END
' LANGUAGE plpgsql; 

CREATE OR REPLACE FUNCTION newBusinessCheckinCount() RETURNS trigger AS '
BEGIN 
    UPDATE Business AS b SET num_checkins = (SELECT count(*) FROM Checkins WHERE business_id = NEW.business_id GROUP BY business_id) WHERE b.business_id = NEW.business_id;
    RETURN NEW;
END
' LANGUAGE plpgsql; 

CREATE TRIGGER deleteUpdateBusinessCheckinCount
AFTER DELETE ON Checkin
FOR EACH ROW
EXECUTE PROCEDURE oldBusinessCheckinCount();

CREATE TRIGGER insertUpdateBusinessCheckinCount
AFTER INSERT ON Checkin
FOR EACH ROW
EXECUTE PROCEDURE newBusinessCheckinCount();