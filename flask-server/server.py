from flask import Flask
import tweepy
import requests
import botometer

app = Flask(__name__)

# Twitter API Keys
twitter_app_auth = {
    "consumer_key": "XITkjbGduFhBWYIjSNAwMdMdv",
    "consumer_secret": "XcQ6Uci6asU7dSJjX1gqfP4lciMCrkt564WykIRuzyXEC6qDe3",
    "access_token": "1567970572776402944-zef5UpSs0PEuZUlkSF9hjs23GdujFj",
    "access_token_secret": "4dtozG4r903TixCmck0BzRnM4CNMMBwC95qrz6KvSIZTq",
}
rapidapi_key = "8d87acbeb7mshcec8e86ca13ca54p19a00cjsn57e96609fe78"

auth = tweepy.OAuthHandler(twitter_app_auth["consumer_key"], twitter_app_auth["consumer_secret"])
auth.set_access_token(twitter_app_auth["access_token"], twitter_app_auth["access_token_secret"])
api = tweepy.API(auth)

bom = botometer.Botometer(wait_on_ratelimit=True, rapidapi_key=rapidapi_key,**twitter_app_auth)

sentiment_url = "https://language.googleapis.com/v1beta2/documents:analyzeSentiment?key=AIzaSyD3A_HbhnQ914kekA8BSTZb_Qw8nSAzHy4"
entities_url = "https://language.googleapis.com/v1beta2/documents:analyzeEntities?key=AIzaSyD3A_HbhnQ914kekA8BSTZb_Qw8nSAzHy4"

@app.route("/bot/<string:name>/")
def bot(name):
    return bom.check_account(name)

@app.route("/sentiment/<string:name>/")
def sentiment(name):
    ret = {
        "average": 0.0,
        "magnitude": [],
        "score": [],
        "tweets": [],
        "sentiment": []
    }
    tweets = api.user_timeline(screen_name=name, count=10, include_rts = False,tweet_mode = 'extended')
    for tweet in tweets:
        payload = {
            "document": {
                "type": "PLAIN_TEXT",
                "language": "en",
                "content": tweet.full_text
            },
            "encodingType": "None"
        }
        response = requests.request("POST", sentiment_url, json=payload, headers={}).json()
        ret["tweets"].append(tweet.full_text)
        ret["sentiment"].append(response)
    for obj in ret["sentiment"]:
        ret["magnitude"].append(obj["documentSentiment"]["magnitude"])
        ret["score"].append(obj["documentSentiment"]["score"])
    average = 0
    for i in range(len(ret["score"])):
        average += ret["score"][i] * ret["magnitude"][i]
    ret["average"] = average/sum(ret["magnitude"])
    ret.pop("sentiment")
    return ret

@app.route("/entities/<string:name>/")
def entities(name):
    ret = {
        "most_to_least": [],
        "name": [],
        "salience": [],
        "tweets": [],
        "entities": []
    }
    tweets = api.user_timeline(screen_name=name, count=10, include_rts = False,tweet_mode = 'extended')
    for tweet in tweets:
        payload = {
            "document": {
                "type": "PLAIN_TEXT",
                "language": "en",
                "content": tweet.full_text
            },
            "encodingType": "None"
        }
        response = requests.request("POST", entities_url, json=payload, headers={}).json()
        ret["tweets"].append(tweet.full_text)
        ret["entities"].append(response)

    dict = {}
    for entities in ret["entities"]:
        salience = 0
        name = ""
        for entity in entities["entities"]:
            if entity["name"] in dict:
                dict[entity["name"]] = dict[entity["name"]] + entity["salience"]
            else:
                dict[entity["name"]] = entity["salience"]
            if entity["salience"] > salience:
                salience = entity["salience"]
                name = entity["name"]
        ret["name"].append(name)
        ret["salience"].append(salience)
    keys = sorted(dict, key=dict.get, reverse=True)
    ret["most_to_least"] = keys
    ret.pop("entities")
    return ret

if __name__ == "__main__":
    app.run(debug=True)
