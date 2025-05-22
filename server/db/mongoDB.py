from pymongo import MongoClient
import random
import string
from utils import status_codes

class MongoDB:
    # connects to db and creates instance
    def __init__(self, uri: str, db_name: str, users_collection_name: str, quizzes_collection_name: str):
        self.client = MongoClient(uri)
        self.db = self.client.get_database(db_name)
        self.users_collection_name = users_collection_name
        self.quizzes_collection_name = quizzes_collection_name
    
    # returns the collection that stores user info (usernames, passwords)
    def get_users_collection(self):
        return self.db.get_collection(self.users_collection_name)
    
    # returns the collection that stores the quizzes for specific user
    def get_user_quizzes_collection(self, username: str):
        return self.db.get_collection(username)
    
    # checks if user exists in users collection
    def is_username_in_db(self, username: str):
        collection = self.get_users_collection()
        
        return collection.find_one({"username": username}) is not None
    
    def is_user_in_db(self, username: str, password: str):
        collection = self.get_users_collection()
        
        return collection.find_one({"username": username, "password": password}) is not None

    # get list of quizzes for user
    def get_list_of_quizzes(self, username: str):
        collection = self.get_user_quizzes_collection(username)
        quizzes_cursor = collection.find({}, {"_id": 0, "name": 1})

        quiz_names = [doc["name"] for doc in quizzes_cursor if "name" in doc]
        return quiz_names


    # "creates" a new game, returns code and content (questions)
    def create_game(self, username: str, quiz_name: str):
        collection = self.get_user_quizzes_collection(username)
        chars = string.ascii_uppercase + string.digits
        code = ''.join(random.choices(chars, k=6))

        collection.update_one(
            {"name": quiz_name},
            {"$set": {"code": code, "status": "1"}}
        )

        doc = collection.find_one({"name": quiz_name})
        print(doc.get("code"))

        
        content = doc.get("content")

        return code, content

    # "lets" a player join a game. returns true if the game is currently waiting for players, and false if not
    def join_game(self, gameCode: str):
        for collection_name in self.db.list_collection_names():
            if collection_name == self.users_collection_name:
                continue

            collection = self.db.get_collection(collection_name)
            quiz = collection.find_one({"code": gameCode, "status": "1"})
            if quiz is not None:
                return True
        
        return False

    # returns status of a game (used for example for clients to know if their game has started)
    def get_game_status(self, gameCode: str):
        for collection_name in self.db.list_collection_names():
            if collection_name == self.users_collection_name:
                continue

            collection = self.db.get_collection(collection_name)
            quiz = collection.find_one({"code": gameCode})
            if quiz is not None:
                return quiz.get("status")
        return "not found"

    
    # adds user to users collection
    def insert_user(self, username: str, password: str):
        if self.is_username_in_db(username):
            return "username already in database"

        self.db.create_collection(name=username)
        collection = self.get_users_collection()
        return collection.insert_one({"username": username, "password": password})
    
    # removes user from db
    def remove_user(self, username: str, password: str):
        if not(self.is_user_in_db(username, password)):
            return "username not found in database"

        collection = self.get_users_collection()
        return collection.delete_one({"username": username, "password": password})
    