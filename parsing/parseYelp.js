const fs = require('fs');
const readline = require('readline');

// Parse yelp_review.json and print data to console
function parseReview() {
    
    const rl = readline.createInterface({
        input: fs.createReadStream('yelp_review.json')
    });
    
    rl.on('line', (line) => {
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
    
    const rl = readline.createInterface({
        input: fs.createReadStream('yelp_business.json')
    });
    
    rl.on('line', (line) => {
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

parseReview();
parseBusiness();