## Usage
Please install ```node``` and ```npm``` if you haven't already.
```
sudo apt-get install nodejs npm
```

Now, change your password to '12345'.
```
psql Milestone1DB -U $USER
```
Enter ```\password``` command and follow along.

Next, install the dependencies listed in package.json.
```
npm install
```

Now, you'll be able to run the backend server.
```
node index.js
```

If server is running, you can run the tests like:
```
python test/api_tests.py
```