/* Create the business table. */
CREATE TABLE business(
    business_name VARCHAR(100),
    business_state CHAR(2),
    business_city VARCHAR(100),
    PRIMARY KEY (business_name, business_state, business_city)
);

/* Insert the data. */
\copy business (business_name,business_state,business_city) FROM 'milestone1DB.csv' DELIMITER ',' CSV;