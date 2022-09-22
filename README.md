# Usage

This web App can be used by people to check:

1. All the twitter accounts he/she is following.
2. Indicate whether the particular twitter account is bot or not.
3. Show the sentiment of the selected twitter account in any day.
4. Track the topic trend of the selected twitter account.

# Implementation architecture

## Frontend

The frontend is implemented using ReactJs, which is one of 3 major cross platform JaveScript library/framework used for fronted development today. ReactJs is originated from Facebook. It's more lightweight comparing to Angular and have large supporting community base, so we choose it to build the frontend of our App.

## Backend

Since we need to do sentiment/topic/bot analysis in our App, we choose Python as our backend programming language. Python has extensive data processing and machine learning libraries, so it's a perfect fit for us. As far as backend framework is concerned, both Django and Flask are based on Python language. As a full-stack web framework, Django has more features and suitable for large web application, but Flask is more lightweight for developing small web applications as ours, so we choose it as our backend framework.

## API

### 1. User register
Usage: Use this endpoint to register to App

Endpoint URL: POST api/users/register/

JSON body parameters:
'username' : <User entered username>
'email': <User entered email>
'password': <User entered password>
'twitter_di': <User's twitter account ID>

JSON Response:
'username' : <Registered User username>
'email': <Registered User email>
'twitter_di': <Registered User twitter account ID>

### 2. User login
Usage: Use this endpoint to login to App

Endpoint URL: POST api/users/login/

JSON body parameters:
'username' : <User entered Username>
'password': <User entered Password>

JSON Response:
'username' : <Registered User username>
'email': <Registered User email>
'twitter_di': <Registered User twitter account ID>

### 3. User Profile
Usage: Use this endpoint to get user profile

Endpoint URL: GET api/users/profile/

Path parameters:
'id': <User ID in backend database>

JSON Response:
'username' : <Registered User username>
'email': <Registered User email>
'twitter_di': <Registered User twitter account ID>

### 4. User profile update
Usage: Use this endpoint to update user profile

Endpoint URL: PUT api/users/profile/update/

JSON body parameters:
'username' : <User entered Username>
'email': <User entered Email>
'password': <User entered Password>
'twitter_di': <User's twitter account ID>

The "Bearer" token is also sent in the "Authorization" field of headers of the request, so the targeted user can be identified by backend authentication system

JSON Response:
'username' : <Registered User latest username>
'email': <Registered User latest email>
'twitter_di': <Registered User latest twitter account ID>

### 5. Twitter accounts
Usage: Use this endpoint to get all twitter accounts the use is following

Endpoint URL: GET api/accounts/

Query parameters:
None

JSON Response:
'id': <Twitter account ID from Twitter API response>
'username': <Twitter account username from Twitter API response>
'created_at': <Twitter account created date (in ISO format) from Twitter API response>
'photoURL': <Twitter account profile image from Twitter API response>
'followers': <Twitter account followers_count from Twitter API response>
'followings': <Twitter account following_count from Twitter API response>
'tweets': <Twitter account tweet_count from Twitter API response>
'isBot': <single integer to indicate whether the Twitter account is bot or not: 0: human; 1: bot>

### 6. Tweets
Usage: Use this endpoint to get the tweets from the specific twitter accounts

Endpoint URL: GET api/tweets/

Query parameters:
'user_id': <The specific twitter account ID to fetch tweets from>
'selected_date' <The specific date (in mm/dd/yyyy format) to fetch tweets from>

JSON Response:
'id': <Tweet ID from Twitter API response>
'text': <Tweet text from Twitter API response>
'created_at': <Tweet created date (in ISO format) from Twitter API response>
'topics': <Topics string created from context_annotations['entity']['name'] field of Twitter API v2 response. Each topic is separated by comma in the string>
'sentiment': <single integer number represents sentiment of this tweet: 1: positive; 0: neutral; -1: negative>

## Major architecture changes made


# Frontend build

This is the Web App frontend built with ReactJs

## Clone the rep from GitHub 


## Install external packages

run `npm install`

## Start the development server

run `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

## Default backend port

The default backend port is specified in the package.jso file as following and can be updated as needed:
"proxy": "http://127.0.0.1:8000",
