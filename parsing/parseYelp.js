const fs = require('fs');
const readline = require('readline');

// Parse yelp_review.json and print data to console
function parseReview() {
    console.log("REVIEWS");
    const rl = readline.createInterface({
        input: fs.createReadStream('yelp_review.json')
    });
    
    rl.on('line', (line) => {
        if(line.length < 2) {
            return; // don't parse a blank line
        }
        const review = JSON.parse(line);

        console.log(`review_id: ${review.review_id},`);
        console.log(`user_id: ${review.user_id},`);
        console.log(`business_id: ${review.business_id},`);
        console.log(`Text: ${review.text},`);
        console.log(`Stars: ${review.stars},`);
        console.log(`Date: ${review.date},`);
        console.log(`Funny: ${review.funny},`);
        console.log(`Useful: ${review.useful},`);
        console.log(`Cool: ${review.cool}`);
        console.log();
    });
}

// Parse business.json and print data to console
function parseBusiness() {
    console.log("BUSINESSES");
    const rl = readline.createInterface({
        input: fs.createReadStream('yelp_business.json')
    });
    
    rl.on('line', (line) => {
        if(line.length < 2) {
            return; // don't parse a blank line
        }
        const business = JSON.parse(line);
        
        console.log(`business_id: ${business.business_id},`);
        console.log(`name: ${business.name},`);
        console.log(`address: ${business.address},`);
        console.log(`state: ${business.state},`);
        console.log(`city: ${business.city},`);
        console.log(`postal_code: ${business.postal_code},`);
        console.log(`stars: ${business.stars},`);
        console.log(`review_count: ${business.review_count},`);
        console.log(`is_open: ${business.is_open},`);
        console.log(`Categories: [${business.categories}],`); // Categories
        
        // Attributes
        console.log('Attributes: ');
        parseBusinessAttributes(business.attributes);
        console.log();
        
        // Hours
        for (var day in business.hours) {
            console.log(`${day}: ${business.hours[day]},`);
        }
        console.log();
    });
}

// Recursively parse nested attribute objects
function parseBusinessAttributes(attributes) {
    for (var key in attributes) {
        if (typeof attributes[key] === 'object') {
            parseBusinessAttributes(attributes[key]);
        }
        else {
            process.stdout.write(`(${key},${attributes[key]})`)
        }
    }
}

function parseCheckin() {
    console.log("CHECKINS");
    const rl = readline.createInterface({
        input: fs.createReadStream('yelp_checkin.json')
    });
    
    rl.on('line', (line) => {
        if(line.length < 2) {
            return; // don't parse a blank line
        }
        const checkin = JSON.parse(line);
        console.log(`business_id: ${checkin.business_id},`);
        console.log(`times: `);
        for(var dayOfWeek in checkin.time) {
            console.log(`${dayOfWeek}`);
            for(var time in checkin.time[dayOfWeek]) {
                console.log(`${time}: ${checkin.time[dayOfWeek][time]}`);
            }
        }

        console.log("-----");
    });
}

function parseUser() {
    console.log("USERS");
    const rl = readline.createInterface({
        input: fs.createReadStream('yelp_user.json')
    });
    rl.on('line', (line) => {
        if(line.length < 2) {
            return; // don't parse a blank line
        }
        const user = JSON.parse(line);
        console.log(`Name: ${user.name}`);
        console.log(`user_id: ${user.user_id}`);
        console.log(`review_count: ${user.review_count}`);
        console.log(`useful: ${user.useful}`);
        console.log(`yelping_since: ${user.yelping_since}`);
        console.log(`average_stars: ${user.average_stars}`);
        console.log(`compliment_cool: ${user.compliment_cool}`);
        console.log(`compliment_cute: ${user.compliment_cute}`);
        console.log(`compliment_funny: ${user.compliment_funny}`);
        console.log(`compliment_hot: ${user.compliment_hot}`);
        console.log(`compliment_list: ${user.compliment_list}`);
        console.log(`compliment_more: ${user.compliment_more}`);
        console.log(`compliment_note: ${user.compliment_note}`);
        console.log(`compliment_photos: ${user.compliment_photos}`);
        console.log(`compliment_plain: ${user.compliment_plain}`);
        console.log(`compliment_profile: ${user.compliment_profile}`);
        console.log(`compliment_writer: ${user.compliment_writer}`);
        console.log(`cool: ${user.cool}`);
        console.log(`years elite: `);
        for(var eliteYear in user.elite) {
            console.log(`- ${user.elite[eliteYear]}`);
        }
        console.log(`friends: `);
        for(var friend in user.friends) {
            console.log(`${[friend]}) ${user.friends[friend]}`);
        }
        console.log(`fans: ${user.fans}`);
        console.log(`funny: ${user.funny}`);
        console.log("------");
        


        
    
    });

}


parseReview();
parseBusiness();
parseCheckin();
parseUser();