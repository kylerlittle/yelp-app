# yelp-app

## Developer Usage
Wherever there is a directory with a "package.json", run ```npm i``` to install node modules listed in that file.

To run both the API-Server (for backend) and Webpack Dev Server (frontend), run ```npm start```. The Webpack Dev Server makes it so that changes are instant. Any changes you save will instantly applied, and you can view on localhost, port 3000.

With that said, go to ```http://localhost:3000/``` in any browser to check out the basic React template. I've only done one query as an example so far, but it'll work the same as how we did in the prototype. For starters, I just added the endpoint of ```http://localhost:3000/api/states``` which will just display all of the distinct states in the 'business' table.

## Notes
We're using 'concurrently' so that we don't have to use two separate terminals. It allows us to simulatenously run the backend API server and the Webpack development server. We use the current running process to run the server and fork a child process to run the Webpack development server.

Also, here is a quick explanation of the flow:
- React makes an API request to ```http://localhost:3000```, the Webpack development server.
- The development server simply proxies that request to the API server (```http://localhost:3001```), negating any CORS issues.

## Credits
- [This](https://github.com/fullstackreact/food-lookup-demo) was an awesome guide -- blog post [here](https://www.fullstackreact.com/articles/using-create-react-app-with-a-server/).
