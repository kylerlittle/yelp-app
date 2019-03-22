-- --glossary
-- business
-- yelpuser
-- review
-- friendswith
-- checkin
-- categories
-- attributes
-- hours
-- postal_code
-- business_id
-- business_city  (business business_city)
-- business_name   (business business_name)
-- user_id

-- -- haven't replaced below
-- friend_id

-- review_id
-- review_count
-- review_text
-- stars_given
-- date_written

-- review_rating
-- num_checkins
-- checkin_day  
-- checkin_time 
-- checkin_count 


--1.
SELECT COUNT(*) 
FROM  business;
SELECT COUNT(*) 
FROM  yelpuser;
SELECT COUNT(*) 
FROM  review;
SELECT COUNT(*) 
FROM  friendswith;
SELECT COUNT(*) 
FROM  checkin;
SELECT COUNT(*) 
FROM  categories;
SELECT COUNT(*) 
FROM  attributes;
SELECT COUNT(*) 
FROM  hours;



--2. Run the following queries on your business table, checkin table and review table. Make sure to change the attribute business_names based on your schema. 

SELECT postal_code, count(business_id) 
FROM business
GROUP BY postal_code
HAVING count(business_id)>400
ORDER BY postal_code;

SELECT B.postal_code, COUNT(distinct C.category_name)
FROM business as B, categories as C
WHERE B.business_id = C.business_id
GROUP BY B.postal_code
HAVING count(distinct C.category_name)>75
ORDER BY B.postal_code;

SELECT B.postal_code, COUNT(distinct A.attribute_name)
FROM business as B, attributes as A
WHERE B.business_id = A.business_id
GROUP BY B.postal_code
HAVING count(distinct A.attribute_name)>80;


--3. Run the following queries on your business table, checkin table and tips table. Make sure to change the attribute business_names based on your schema. 

SELECT friendswith.owner_of_friend_list, count(friendswith.on_friend_list)
FROM yelpuser, friendswith
WHERE yelpuser.user_id = friendswith.owner_of_friend_list AND 
      friendswith.owner_of_friend_list = 'zvbewosyFz94fSlmoxTdPQ'
GROUP BY friendswith.owner_of_friend_list;

SELECT business_id, business_name, business_city, review_count, num_checkins, review_rating 
FROM business 
WHERE business_id ='6lovZEiwWcRYRhyKd94DRg' ;

-----------

SELECT SUM(checkin_count) 
FROM checkin 
WHERE business_id ='6lovZEiwWcRYRhyKd94DRg';

SELECT count(*), avg(stars_given)
FROM review
WHERE  business_id = '6lovZEiwWcRYRhyKd94DRg';


--4. 
--Type the following statements. Make sure to change the attribute names based on your schema.  Don’t run the update statement before you show the results for steps 1 and 2 to the TA.

-- UPDATE checkin 
-- SET checkin_count = checkin_count + 1 
-- WHERE business_id ='6lovZEiwWcRYRhyKd94DRg'  AND checkin_day ='Friday' AND checkin_time = 15;

-- INSERT INTO checkin (business_id, checkin_day,checkin_time,checkin_count)
-- VALUES ('h_vsOvGHQtEpUroh-5lcHA','Friday',15,1);

-- ------------

-- SELECT business_id,business_name, business_city, num_checkins 
-- FROM business 
-- WHERE business_id ='6lovZEiwWcRYRhyKd94DRg';

-- SELECT * 
-- FROM checkin 
-- WHERE business_id ='6lovZEiwWcRYRhyKd94DRg' and checkin_day='Friday'  AND checkin_time = 15;


-- SELECT business_id,business_name, business_city, num_checkins 
-- FROM business 
-- WHERE business_id ='h_vsOvGHQtEpUroh-5lcHA';

-- SELECT * 
-- FROM checkin 
-- WHERE business_id ='h_vsOvGHQtEpUroh-5lcHA' and checkin_day='Friday';

-- --5.
-- --Type the following statements. Make sure to change the attribute names based on your schema.  Don’t run the insert statement before you show the results for the first query to the TA.

-- INSERT INTO review (review_id, user_id, business_id,review_text,stars_given,date_written,funny,useful,cool)  
-- VALUES ('ZuRjoWuinqWhecT-PRZ-qw','zvbewosyFz94fSlmoxTdPQ', '6lovZEiwWcRYRhyKd94DRg', 'Great!',5,'2019-03-22',0,0,0);

-- SELECT business_id,business_name, business_city, review_count, review_rating 
-- FROM business 
-- WHERE business_id ='6lovZEiwWcRYRhyKd94DRg';

-- SELECT count(*), avg(stars_given) 
-- FROM review
-- WHERE business_id ='6lovZEiwWcRYRhyKd94DRg';

