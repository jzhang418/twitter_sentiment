from html import entities
from django.shortcuts import render
from django.contrib.auth.hashers import make_password

# REST framework
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

from .models import CustomUser
from .serializers import UserSerializer, UserSerializerWithToken

import requests

# Twitter API
from tweepy import OAuthHandler
from tweepy import API

# Analysis
from textblob import TextBlob
import re
import numpy as np
import pandas as pd

import botometer

# Sample tweets
from .sample_account import sample_accounts
from .sample_tweets import sample_tweets

# Sample Botometer response
from .sample_bot_response import bot_response

# Config
import configparser

# read config
config = configparser.ConfigParser()
config.read('config.ini')

api_key = config['twitter']['api_key']
api_key_secret = config['twitter']['api_key_secret']

access_token = config['twitter']['access_token']
access_token_secret = config['twitter']['access_token_secret']

rapidapi_key = config['twitter']['rapidapi_key']

google_key = config['google']['api_key']

entities_url = "https://language.googleapis.com/v1beta2/documents:analyzeEntities?key="+google_key

# Twitter account authentication
class TwitterAuthenticator():
    def __init__(self):
        self.twitter_app_auth = {
            "consumer_key": api_key,
            "consumer_secret": api_key_secret,
            "access_token": access_token,
            "access_token_secret": access_token_secret,
        }

    def authenticate(self):
        auth = OAuthHandler(self.twitter_app_auth["consumer_key"], self.twitter_app_auth["consumer_secret"])
        auth.set_access_token(self.twitter_app_auth["access_token"], self.twitter_app_auth["access_token_secret"])
        return auth

class TwitterClient():
    def __init__(self, twitter_user=None):
        self.auth = TwitterAuthenticator().authenticate()
        self.twitter_client = API(self.auth)

        self.twitter_user = twitter_user

    def get_twitter_client_api(self):
        return self.twitter_client

    def get_user_timeline_tweets(self, id, num_tweets=5):
        tweets = self.twitter_client.user_timeline(id=id, count=num_tweets, include_rts = False, tweet_mode = 'extended')
        
        return tweets
    
    def get_friend_list(self, id, num_friends=1):
        friends = self.twitter_client.friends(id=id, count=10)

        return friends

class BotometerClient():
    def __init__(self):
        self.twitter_app_auth = {
            'consumer_key': api_key,
            'consumer_secret': api_key_secret,
            'access_token': access_token,
            'access_token_secret': access_token_secret,
        }
        self.botometer_client = botometer.Botometer(wait_on_ratelimit=True, rapidapi_key=rapidapi_key, **self.twitter_app_auth)
   
    def get_botometer_client_api(self):
       return self.botometer_client

# Twitter data analysis
class TweetAnalyzer():
    def tweets_to_data_frame(self, tweets):
        df = pd.DataFrame(data=[tweet['text'] for tweet in tweets], columns=['text'])
        
        df['id'] = np.array([tweet['id'] for tweet in tweets])
        df['created_at'] = np.array([tweet['created_at'] for tweet in tweets])
        df['topics'] = np.array([tweet['topics'] for tweet in tweets])
        
        return df
    
    def clean_tweet(self, tweet):
        return ' '.join(re.sub("(@[A-Za-z0-9]+)|([^0-9A-Za-z \t])|(\w+:\/\/\S+)", " ", tweet).split())

    def analyze_sentiment(self, tweet):
        analysis = TextBlob(self.clean_tweet(tweet))
        
        if analysis.sentiment.polarity > 0:
            return 1
        elif analysis.sentiment.polarity == 0:
            return 0
        else:
            return -1
    
    def analyze_entity(self, tweet):
        text = self.clean_tweet(tweet['text'])

        payload = {
            "document": {
                "type": "PLAIN_TEXT",
                "language": "en",
                "content": text
            },
            "encodingType": "None"
        }
        entities = requests.request("POST", entities_url, json=payload, headers={}).json()

        dict = {}
        salience = 0
        for entity in entities["entities"]:
            if entity["name"] in dict:
                dict[entity["name"]] = dict[entity["name"]] + entity["salience"]
            else:
                dict[entity["name"]] = entity["salience"]
            if entity["salience"] > salience:
                salience = entity["salience"]

        keys = sorted(dict, key=dict.get, reverse=True)
        max_len = min(len(keys), 3)
        topics = ''
        for i in range(max_len):
            topics += keys[i] + ','
        
        return topics

twitter_client = TwitterClient()
botometer_client = BotometerClient()
tweet_analyzer = TweetAnalyzer()

twitter_api = twitter_client.get_twitter_client_api()
botometer_api = botometer_client.get_botometer_client_api()

@api_view(['GET'])
def checkBot(request, name):
    bom = botometer_api.check_account(name)
    bot_score = bom['raw_scores']['english']['overall']

    result = {}
    result['username'] = name
    result['isBot'] = (bot_score > 0.6)
    return Response(result)

@api_view(['GET'])
def getTweets(request):
    user_id = request.GET.get("user_id")
    selected_date = request.GET.get("selected_date")
    
    # fetch tweets from Twitter
    received_tweets = twitter_client.get_user_timeline_tweets(id=user_id, num_tweets=5)
    topics = ''
    tweets = []
    for received_tweet in received_tweets:
        tweet = {}
        tweet['id'] = received_tweet.id
        tweet['text'] = received_tweet.full_text
        tweet['created_at'] = received_tweet.created_at.isoformat()
        tweets.append(tweet)
        topics = tweet_analyzer.analyze_entity(tweet)
        tweet['topics'] = topics
    
    # Sample data
    # topics = 'Economics Computer Python'
    # tweets = sample_tweets[user_id]
    # for tweet in tweets:
    #     tweet['topics'] = topics
    
    # sentiment analysis
    if tweets:
        df = tweet_analyzer.tweets_to_data_frame(tweets)
        df['sentiment'] = np.array([tweet_analyzer.analyze_sentiment(tweet) for tweet in df['text']])

        data = df.agg(list).to_dict(orient="records")
    else:
        data = []

    return Response(data)

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)

        serializer = UserSerializerWithToken(self.user).data
        for key, value in serializer.items():
            data[key] = value

        return data

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

@api_view(['POST'])
def registerUser(request):
    data = request.data

    try:
        user = CustomUser.objects.create(
            username = data['username'],
            email = data['email'],
            password = make_password(data['password']),
            twitter_id = data['twitter_id']
        )
        serializer = UserSerializerWithToken(user, many=False)
        return Response(serializer.data)
    except:
        message = {'message': 'User with this email already exists'}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
def updateUserProfile(request):
    user = request.user
    serializer = UserSerializerWithToken(user, many=False)

    data = request.data

    user.username = data['username']
    user.email = data['email']
    user.twitter_id = data['twitter_id']

    if data['password'] != '':
        user.password = make_password(data['password'])

    user.save()
        
    return Response(serializer.data)

@api_view(['GET'])
def getUserProfile(request):
    user = request.user
    serializer = UserSerializer(user, many=False)
    return Response(serializer.data)

@api_view(['GET'])
def getAccounts(request):
    user = request.user

    # fetch friend list from Twitter
    accounts = []
    friends = twitter_client.get_friend_list(user.twitter_id)
    for friend in friends:
        account = {}
        account['id'] = friend.id
        account['username'] = friend.screen_name
        account['created_at'] = friend.created_at.isoformat()
        account['photoURL'] = friend.profile_image_url_https
        account['followers'] = friend.followers_count
        account['followings'] = friend.friends_count
        account['tweets'] = friend.statuses_count
        account['isBot'] = -1
        accounts.append(account)

    return Response(accounts)

    # Sample data
    # for account in sample_accounts:
    #     account['isBot'] = -1
    # return Response(sample_accounts)
