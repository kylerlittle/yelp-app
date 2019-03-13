## Dev Usage
Wherever there is a directory with a "package.json", run ```npm i``` to install node modules listed in that file.

To run both the API-Server (for backend) and Webpack Dev Server (frontend), run ```npm start```.

Go to ```http://localhost:3000/``` to check out the basic React template. I've only done one query as an example so far, but it'll work the same as how we did in the prototype. For starters, I just added the endpoint of ```http://localhost:3000/api/business``` which will just display all of the businesses.

## Notes
We're using 'concurrently' so that we don't have to use two separate terminals. It allows us to simulatenously run the backend appi-server and the Webpack development server. We use the current running process to run the server and fork a child process to run the Webpack development server.