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

Since we need to do sentiment/topic/bot analysis in our App, we choose Python as our backend programming language. Python has extensive data extraction, data processing and machine learning libraries, so it's a perfect fit for us. As far as backend framework is concerned, both Django and Flask are based on Python language. Flask is lightweitht for quickly developing small and simple application, however our App needs user sign in and login capabilities and Django as a full-stack web framework already have infrastruture for authentication, so we choose it as our backend framework.

## Analysis

### Bot analysis
We use Botometer API to do Bot analysis.

### Sentiment analysis
We tried both Python NLTK and Google natural language API. In order to reduce the total API call latency to reduce the impact on frontend user experience, we use Python NLTK libary for sentiment analysis now but we can easily switch to Google natural language API if needed.

### Entity (topic) analysis
We use Google natural language API for entity/topic analysis

## API

### 1. User register
Usage: Use this endpoint to register to App

Endpoint URL: POST api/users/register/

JSON body parameters:  
'username': User entered username  
'email': User entered email  
'password': User entered password  
'twitter_id': User's twitter account ID  

JSON Response:  
'username': Registered User username  
'email': Registered User email  
'twitter_id': Registered User twitter account ID  

### 2. User login
Usage: Use this endpoint to login to App

Endpoint URL: POST api/users/login/

JSON body parameters:  
'username': User entered Username  
'password': User entered Password  

JSON Response:  
'username': Registered User username  
'email': Registered User email  
'twitter_id': Registered User twitter account ID  

### 3. User Profile  
Usage: Use this endpoint to get user profile

Endpoint URL: GET api/users/profile/

Path parameters:  
'id': User ID in backend database  

JSON Response:
'username': Registered User username  
'email': Registered User email  
'twitter_id': Registered User twitter account ID  

### 4. User profile update
Usage: Use this endpoint to update user profile

Endpoint URL: PUT api/users/profile/update/

JSON body parameters:  
'username': User entered Username  
'email': User entered Email  
'password': User entered Password  
'twitter_id': User's twitter account ID  

The "Bearer" token is also sent in the "Authorization" field of headers of the request, so the targeted user can be identified by backend authentication system

JSON Response:  
'username': Registered User latest username  
'email': Registered User latest email  
'twitter_id': Registered User latest twitter account ID  

### 5. Twitter accounts
Usage: Use this endpoint to get all twitter accounts the use is following

Endpoint URL: GET api/accounts/

Query parameters:  
None

JSON Response:  
'id': Twitter account ID from Twitter API response  
'username': Twitter account username from Twitter API response  
'created_at': Twitter account created date (in ISO format) from Twitter API response  
'photoURL': Twitter account profile image from Twitter API response  
'followers': Twitter account followers_count from Twitter API response  
'followings': Twitter account following_count from Twitter API response  
'tweets': Twitter account tweet_count from Twitter API response  
'isBot': single integer to indicate whether the Twitter account is bot or not: 0: human; 1: bot  

### 6. Tweets
Usage: Use this endpoint to get the tweets from the specific twitter accounts

Endpoint URL: GET api/tweets/

Query parameters:  
'user_id': The specific twitter account ID to fetch tweets from  
'selected_date' The specific date (in mm/dd/yyyy format) to fetch tweets from  

JSON Response:  
'id': Tweet ID from Twitter API response  
'text': Tweet text from Twitter API response  
'created_at': Tweet created date (in ISO format) from Twitter API response  
'topics': Topics string created from context_annotations['entity']['name'] field of Twitter API v2 response. Each topic is separated by comma in the string  
'sentiment': single integer number represents sentiment of this tweet: 1: positive; 0: neutral; -1: negative  

### 7. Bot check
Usage: Use this endpoint to check whether a twitter account is bot or not

Endpoint URL: GET accounts/checkbot/[twitter account screenname]/

Path parameters:  
'name': The specific twitter account screenname  

JSON Response:  
'username': The specific twitter account screenname  
'isBot': single integer number represents whether it is bot or not: 0: human; 1: bot  

## Issues encounterred
1. Initially we coded our frontend to use Google firebase/firestore as backend authentication and storage engine. However soon we noticed that it's not easier to quickly setup backend infrastruture in Google Cloud to call Twitter API. Therefore we switched to Python backend framework because Python has the tweepy library which is very easy to use to access Twitter API.

2. The Botometer library we used to do bot checking is using old version of tweepy which cannot use new V2 version of Twitter API. This means we cannot use some feateurs provided by Twitter API V2.

3. Since we need to call Twitter API to grab tweets first, then we need to call other APIs, such as Google natural language and Botometer, to do sentiment/entity/bot analysis, this introduces noticable delay which forces us to redesign some of our frontend UI/feature to improve user experience.

# Frontend build

This is the Web App frontend built with ReactJs

## Clone the rep from GitHub 


## Install external packages

`cd frontend`
run `npm install`

## Start the development server

run `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

## Default backend port

The default backend port is specified in the package.json file as following and can be updated as needed:\
"proxy": "http://127.0.0.1:8000",

# Backend build

The backend framework used is Django.

## Create virtual environment

`pip install virtualenv`  
`virtualenv myenv`

## Activate virtual environment

`myenv\Scripts\activate`

## Install extra packages

`pip install django`  
`pip install djangorestframework`  
`pip install djangorestframework-simplejwt`  
`pip install django-cors-headers`  
`pip install requests`  
`pip install textblob`  
`pip install numpy`  
`pip install pandas`  
`pip install botometer`  

## Start Django server

`cd backend`  
`python manage.py runserver`
