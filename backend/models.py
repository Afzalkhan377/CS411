from flask_sqlalchemy import SQLAlchemy
from uuid import uuid4
import json
from sqlalchemy.ext import mutable

db = SQLAlchemy()

def get_uuid():
    return uuid4().hex

class JsonEncodedDict(db.TypeDecorator):
    impl = db.Text

    def process_bind_param(self, value, dialect):
        if value is None:
            return '{}'
        else:
            return json.dumps(value)

    def process_result_value(self, value, dialect):
        if value is None:
            return {}
        else:
            return json.loads(value)

mutable.MutableDict.associate_with(JsonEncodedDict)


class User(db.Model):
    __tablename__ = "users"
    id = db.Column(db.String(32), primary_key=True, unique=True, default=get_uuid)
    email = db.Column(db.String(345), unique=True)
    password = db.Column(db.Text, nullable=False)
    firstName = db.Column(db.String(345), unique=False)
    lastName = db.Column(db.String(345), unique=False)
    spotifyToken = db.Column(db.String(345), unique=False)
    spotifyExpiration = db.Column(db.String(20), unique=False)
    spotifyRefresh = db.Column(db.String(345), unique=False)
    playlistInfo = db.Column(db.String(500), unique=False)