const fs = require('fs');
const readline = require('readline');
const Pool = require('pg').Pool;

// Connect to database
const pool = new Pool({
  user: process.env.USER,
  host: 'localhost',
  database: 'CraKeN_YelpDB',
  password: '12345',
  port: 5432,
});

var business_count = 0, user_count = 0, review_count = 0,  checkin_count = 0;

function readFileLines(file, func) {
    console.log(file);
    const rl = readline.createInterface({
        input: fs.createReadStream(file)
    });
    
    return new Promise(function(resolve, reject){
        rl.on('line', (line) => {
            if(line.length < 2) {
                return; // don't parse a blank line
            }
            func(line);
        });
        rl.on('close', () => resolve())
        .on('error', reject);
    });
}

function insertBusiness(line) {

    const business = JSON.parse(line);
    const is_open = (business.is_open == 1);  // convert to bool
    
    // build query
    const query = {
        text: 'INSERT INTO business(business_id, business_name, business_address, business_state, ' + 
        'business_city, review_count, postal_code, is_open) ' + 
            'VALUES($1, $2, $3, $4, $5, $6, $7, $8)',
        values: [business.business_id, business.name, business.address, business.state,
            business.city, business.review_count, business.postal_code, is_open],
    };
    // execute INSERT
    pool.query(query)
    .then(res => insertBusinessCategories(res, business.business_id, business.categories))
    .then(res => insertBusinessHours(res, business.business_id, business.hours))
    /* TODO: attributes doesnt match db schema */
    // .then(res => insertBusinessAttributes(res, business.business_id, business.attributes)) 
    .catch(e => console.error(e.stack));
}

function insertBusinessCategories(res, business_id, categories) {
    for (var i = 0; i < categories.length; i++) {
        // build query
        const query = {
            text: 'INSERT INTO categories(business_id, category_name) VALUES($1, $2)',
            values: [business_id, categories[i]],
        };
        // execute INSERT
        pool.query(query)
        .catch(e => console.error(err.stack));
    }
    return res;
}

function insertBusinessHours(res, business_id, hours) {
    for (var day in hours) {
        var time = hours[day].split('-');
        var opentime, closetime;
        opentime = time[0].split(':')[0];
        closetime = time[1].split(':')[0];

        // build query
        const query = {
            text: 'INSERT INTO hours(business_id, day_open, opens_at, closes_at) VALUES($1, $2, $3, $4)',
            values: [business_id, day, opentime, closetime],
        };
        // execute INSERT
        pool.query(query)
        //.then(res => console.log(res.rows[0]))
        .catch(e => console.error(err.stack));
    }
    return res;
}

// Recursively parse nested attribute objects
function insertBusinessAttributes(res, business_id, attributes) {
    for (var key in attributes) {
        if (typeof attributes[key] === 'object') {
            insertBusinessAttributes(attributes[key]);
        }
        else {
            // build query
            const query = {
                text: 'INSERT INTO attributes(business_id, attribute_name, attribute_value) VALUES($1, $2, $3)',
                values: [business_id, key, attributes[key]],
            };
            // execute INSERT
            pool.query(query)
            //.then(res => console.log(res.rows[0]))
            .catch(e => console.error(err.stack));
        }
    }
    return res;
}

function insertUser(line) {
    const user = JSON.parse(line);

    // build query
    const query = {
        text: 'INSERT INTO yelpuser(user_id, average_stars, cool, fans, funny, user_name, useful, ' + 
        'yelping_since) VALUES($1, $2, $3, $4, $5, $6, $7, $8)',
        values: [user.user_id, user.average_stars, user.cool, user.fans, user.funny, user.name, 
                user.useful, user.yelping_since],
    };
    // execute INSERT
    pool.query(query)
    //.then(res => console.log('user'))
    .catch(e => console.error(e.stack));
}

function insertFriends(line) {
    const user = JSON.parse(line);

    for(var i = 0; i < user.friends.length; i++) {
        // build query
        const query = {
            text: 'INSERT INTO friendswith(owner_of_friend_list, on_friend_list) VALUES($1, $2)',
            values: [user.user_id, user.friends[i]],
        };
        // execute INSERT
        pool.query(query)
        .catch(e => console.error(e.stack));
    }
}

function insertReview(line) {
    const review = JSON.parse(line);

    // build query
    const query = {
        text: 'INSERT INTO review(user_id, business_id, review_id, cool, funny, useful, stars_given, ' + 
        'date_written, review_text) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)',
        values: [review.user_id, review.business_id, review.review_id, review.cool, review.funny,
                review.useful, review.stars, review.date, review.text],
    };
    // execute INSERT
    pool.query(query)
    .catch(e => console.error(e.stack));    
}

function insertCheckin(line) { 
    const checkin = JSON.parse(line);

    for(var dayOfWeek in checkin.time) {
        for(var time in checkin.time[dayOfWeek]) {
            var time_int = time.split(':')[0];

            // build query
            const query = {
                text: 'INSERT INTO checkin(business_id, checkin_day, checkin_time, checkin_count) ' +  
                'VALUES($1, $2, $3, $4)',
                values: [checkin.business_id, dayOfWeek, time_int, checkin.time[dayOfWeek][time]],
            };
            // execute INSERT
            pool.query(query)
            .catch(e => console.error(e.stack));
        }
    }
}

async function executeInsert() {
    await readFileLines('yelp_business.JSON', insertBusiness);
    await readFileLines('yelp_user.JSON', insertUser);
    await readFileLines('yelp_review.JSON', insertReview);   
    readFileLines('yelp_checkin.JSON', insertCheckin);
        
    /* Parsing too many files causes memory heap limit */
    //readFileLines('yelp_user.JSON', insertFriends);
}

executeInsert();