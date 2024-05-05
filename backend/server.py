from flask import Flask, request, abort, jsonify, session, url_for, redirect
from flask_bcrypt import Bcrypt
import os
import openai
from dotenv import load_dotenv
from models import db, User
from config import ApplicationConfig
from flask_session import Session
from flask_cors import CORS, cross_origin
import spotipy
from spotipy.oauth2 import SpotifyOAuth
import base64
import requests
import json
from image import compress
load_dotenv()

spotify_client_id = os.environ["SPOTIFY_CLIENT_ID"]
spotify_client_secret = os.environ["SPOTIFY_CLIENT_SECRET"]
gpt_key = os.environ["GPT_KEY"]

app = Flask(__name__)

app.config.from_object(ApplicationConfig)
bcrypt = Bcrypt(app)
cors = CORS(app, supports_credentials=True)
server_session = Session(app)
db.init_app(app)

with app.app_context():
    db.create_all()


def track_id(token, track, artist):
    sp_oauth = create_spotify_oauth()
    code = token
    trackName = track
    artistName = artist
    tokenInfo = sp_oauth.get_access_token(code)
    spotifyObj = spotipy.Spotify(auth=tokenInfo['access_token'])
    query = spotifyObj.search(q=f'track{trackName} artistL{artistName}')
    trackID = query['tracks']['items'][0]['uri']
    return trackID

def create_playlist(token, name):
    sp_oauth = create_spotify_oauth()
    code = token
    playlist_name = name
    token_info = sp_oauth.get_access_token(code)
    spotify_object = spotipy.Spotify(auth=token_info['access_token'])
    user_id = spotify_object.current_user()['id'] 
    create_playlist = spotify_object.user_playlist_create(user_id,playlist_name,False,False,'An Ai Generated Playlist')
    return create_playlist['id'] 

def update_playlist_cover(token, playlist_id, image_url):
    sp_oauth = create_spotify_oauth()
    code = token
    token_info = sp_oauth.get_access_token(code)
    spotify_object = spotipy.Spotify(auth=token_info['access_token'])
    base64_image = compress(image_url, 60)
    update_picture = spotify_object.playlist_upload_cover_image(playlist_id, base64_image)
    return update_picture

def add_tracks_to_playlist(token, playlist_id, track_list):
    sp_oauth = create_spotify_oauth()
    code = token
    token_info = sp_oauth.get_access_token(code)
    spotify_object = spotipy.Spotify(auth=token_info['access_token'])
    add_to_playlist = spotify_object.playlist_add_items(playlist_id,track_list)
    return add_to_playlist 

def dalle(prompt):
    openai.api_key = gpt_key
    data = {
        "prompt": prompt,
        "num_images": 1,
        "size": "512x512",
        "response_format": "url"
    }
    response = openai.Image.create(**data)
    image_url = response["data"][0]["url"]
    return image_url

@app.route('/spotify-playlist', methods=["POST"])
def createPlaylistController():
    user_id = session.get("user_id")
    user = User.query.filter_by(id=user_id).first()
    json_string = user.playlistInfo
    json_object = json.loads(json_string)
    user_spotify_token = user.spotifyToken
    song_list = []
    art_url = json_object['imageUrl']
    for name in json_object:
        if name != 'imageUrl':
            try:
                song_list.append(track_id(user_spotify_token,name,json_object[name]))
            except:
                print('Exception with getting track id')
    playlist_id = create_playlist(user_spotify_token, 'Your AI Experience')
    add_tracks_to_playlist(user_spotify_token,playlist_id,song_list)
    update_playlist_cover(user_spotify_token,playlist_id,art_url)

    return 'Complete'

@app.route('/preferences', methods=["POST"])
def playlist():
    countSongs = request.json["countSongs"]
    genre = request.json["genre"]
    artist = request.json["artist"]
    type = request.json["type"]
    user_id = request.json['userId']
    song_dictionary = songs(countSongs, genre, artist, type)
    image_url = dalle(f"Album cover of music with {type} vibes and {genre} genre")

    song_dictionary['imageUrl'] = image_url
    json_object = json.dumps(song_dictionary)
    update_user = User.query.filter_by(id=user_id).first()
    update_user.playlistInfo = json_object
    db.session.commit()
    return 'Complete'

def songs(countSongs, genre, artist, type):
    openai.api_key = gpt_key

    content = f"""Hello! I want a list of {countSongs}. 
    The songs should be of the genre {genre}.
    I want the songs to be {type} and have at least one song by {artist}.
    Each song in the list is represented by a number followed by a period, 
    the song name in single quotes, and the artist name after the "by" keyword"""

    message = [
    {"role": "user", "content": content}
    ]

    completion = openai.ChatCompletion.create(
    model="gpt-3.5-turbo",
    temperature=.8,
    messages= message
    )

    gptmessage = completion.choices[0].message.content

    return parse_songs(gptmessage)

def parse_songs(gptmessage):
    dictionary = {}
    lines = gptmessage.split('\n')
    for line in lines:
        # Check if the line is not empty
        if line and line[0] in '123456789': 
            song_name, artist = line.split(" by ") 
            song_name = song_name[4:-1] 
            dictionary[song_name] = artist 

    return dictionary

def create_spotify_oauth():
    return SpotifyOAuth(
        client_id=spotify_client_id,
        client_secret=spotify_client_secret,
        redirect_uri=url_for('redirectPage', _external=True),
        scope='user-library-read,user-library-modify,playlist-modify-private,ugc-image-upload'
    )
@app.route('/spotifyRedirect')
def redirectPage():
    sp_oauth = create_spotify_oauth()
    user_id = session.get("user_id")
    auth_code = request.args.get('code')
    temp_token_info = sp_oauth.get_access_token(auth_code)
    access_token = temp_token_info['access_token']
    token_expiration = temp_token_info['expires_at']
    refresh_token = temp_token_info['refresh_token']
    update_user = User.query.filter_by(id=user_id).first()
    update_user.spotifyToken = access_token
    update_user.spotifyExpiration = token_expiration
    update_user.spotifyRefresh = refresh_token
    db.session.commit()
    return redirect('http://localhost:3000/ai')

@app.route('/spotifyTest', methods=["POST"])
def test_spotify():
    code = request.json['code']
    art_url = request.json['art']
    playlist_id = request.json['playlistId']
    return update_playlist_cover(code, playlist_id, art_url) 

@app.route('/spotifyLogin')
def login():
    sp_oauth = create_spotify_oauth()
    auth_url = sp_oauth.get_authorize_url()
    return redirect(auth_url)

#User Registration

@app.route("/register", methods=["POST"])
def register_user():
    email = request.json["email"]
    password = request.json["password"]
    firstName = request.json["firstName"]
    lastName = request.json["lastName"]
    spotifyToken = ""
    user_exists = User.query.filter_by(email=email).first() is not None

    if user_exists:
        return jsonify({"error": "User already exists"}),409

    hashed_password = bcrypt.generate_password_hash(password)
    new_user = User(email=email, password = hashed_password, firstName=firstName, lastName=lastName, spotifyToken=spotifyToken)
    db.session.add(new_user)
    db.session.commit()
    session["user_id"] = new_user.id

    return jsonify({
        "id": new_user.id,
        "email": new_user.email,
        "firstName": new_user.firstName,
        "lastName": new_user.lastName,
        "spotify_token" : new_user.spotifyToken
    })

@app.route("/@me")
def get_current_user():
    user_id = session.get("user_id")

    if not user_id:
        return jsonify({"error": "Unauthorized"}),401

    user = User.query.filter_by(id=user_id).first()
    return jsonify({
    "id": user.id,
    "firstName": user.firstName,
    "lastName": user.lastName,
    "spotify_token" : user.spotifyToken,
    "email": user.email,
    "spotify_refresh": user.spotifyRefresh,
    "playlistInfo": user.playlistInfo
})

@app.route("/login", methods=["POST"])
def login_user():
    email = request.json["email"]
    password = request.json["password"]
    user = User.query.filter_by(email=email).first()

    if user is None:
        return jsonify({"error": "Unauthorized"}),401

    if not bcrypt.check_password_hash(user.password, password):
        return jsonify({"error": "Unauthorized"}),401

    session["user_id"] = user.id

    return jsonify({
    "id": user.id,
    "firstName": user.firstName,
    "lastName": user.lastName,
    "spotify_token" : user.spotifyToken,
    "email": user.email
})

@app.route("/logout", methods=["POST"])
def logout_user():
    session.pop("user_id")
    return "200"

if __name__ == "__main__":
    app.run(port=4500,debug=True)