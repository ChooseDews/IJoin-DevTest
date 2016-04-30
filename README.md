




The api and the client are separated, however the /api runtime will serve the client up at localhost:3000
This app uses angular 1.x.x for the client side and express for the api, and conforms to run on node.js v0.10











# Simple Developer Exercise

The savvy cats over at ACME Financial would like to be able to allow users to login to their account, check their balance and update their personal details. Write a simple web application (API and UI) using node.js and lowdb that lets users accomplish those tasks.

Feel free to use any other libraries or tool chains as long as the core code is javascript and node.js. npm (https://www.npmjs.org) is your friend - no need to recreate the wheel.

You will find the base data file in ```/data```

Wireframes: http://app.uxpin.com/2c7e9e216803455e598f8718d1bedb6178719917/12083985cm

## Time limits

This exercise is meant showcase your creativity and talent in problem solving against a real world scenario. To that end it should not consume your every waking moment. We recommend at max spending 3 evenings of time on the exercise.

## Requirements

* Login to the app via email and password
* Restrict access to valid a User
* Once logged in show the details of the user on the page
* Authorized users can check their account balance
* Allow the user to change their details
* lowdb (DB) -> https://github.com/typicode/lowdb
* node.js (v0.10.x) -> http://nodejs.org/

## Bonus Points

* Fully responsive UI
* Unit Tests of the API
* Functional Tests of the UI
