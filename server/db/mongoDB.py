from pymongo import MongoClient
import random
import string
import json

class MongoDB:
    # connects to db and creates instance
    def __init__(self, uri: str, db_name: str, users_collection_name: str, quizzes_collection_name: str, score_multiplier: int):
        self.client = MongoClient(uri)
        self.db = self.client.get_database(db_name)
        self.users_collection_name = users_collection_name
        self.quizzes_collection_name = quizzes_collection_name
        self.score_multiplier = score_multiplier
    
    # returns the collection that stores user info (usernames, passwords)
    def __get_users_collection(self):
        return self.db.get_collection(self.users_collection_name)
    
    # returns the collection that stores the quizzes for specific user
    def __get_user_quizzes_collection(self, username: str):
        return self.db.get_collection(username)
    
    # checks if user exists in users collection
    def is_username_in_db(self, username: str):
        collection = self.__get_users_collection()
        
        return collection.find_one({"username": username}) is not None
    
    def is_user_in_db(self, username: str, password: str):
        collection = self.__get_users_collection()
        
        return collection.find_one({"username": username, "password": password}) is not None

    # get list of quizzes for user
    def get_list_of_quizzes(self, username: str):
        collection = self.__get_user_quizzes_collection(username)
        quizzes_cursor = collection.find({}, {"_id": 0, "name": 1})

        quiz_names = [doc["name"] for doc in quizzes_cursor if "name" in doc]
        return quiz_names


    # "creates" a new game, returns code and content (questions)
    def create_game_queue(self, username: str, quiz_name: str):
        collection = self.__get_user_quizzes_collection(username)
        chars = string.ascii_uppercase + string.digits
        code = ''.join(random.choices(chars, k=6))

        collection.update_one(
            {"name": quiz_name},
            {"$set": {
                "code": code,
                "status": "-1",
                "next_score": "0",
                "player_amount": "0",
                "winner": "no player played",
                "winner_score": "0",
                "current_answer": "0"
            }}
        )

        doc = collection.find_one({"name": quiz_name})

        
        content = doc.get("content")
        
        return code, json.dumps(content)
    
    # submits an answer for a player competing in a quiz, returns score based on the answer and when answered
    def submit_answer(self, game_code: str, answer: str):
        for collection_name in self.db.list_collection_names():
            if collection_name == self.users_collection_name:
                continue

            collection = self.db.get_collection(collection_name)
            quiz = collection.find_one({"code": game_code})
            if quiz is not None:
                if quiz.get("current_answer") == str(answer):
                    score = quiz.get("next_score")
                    collection.update_one(
                        {"code": game_code},
                        {"$set": {"next_score": str(int(quiz.get("next_score")) - self.score_multiplier)}}
                    )
                    return score
                else:
                    return "0"
        return False

    # submits end-of-quiz user results for database
    def submit_results(self, game_code: str, score: str, name: str):
        for collection_name in self.db.list_collection_names():
            if collection_name == self.users_collection_name:
                continue

            collection = self.db.get_collection(collection_name)
            quiz = collection.find_one({"code": game_code})
            if quiz is not None:
                current_high_score = quiz.get("winner_score")
                if int(score) > int(current_high_score):
                    collection.update_one(
                        {"code": game_code},
                        {"$set": {
                            "winner": name,
                            "winner_score": score
                        }}
                    )
                elif int(score) == int(current_high_score) and int(score) != 0:
                    collection.update_one(
                        {"code": game_code},
                        {"$set": {
                            "winner": (quiz.get("winner") + " and " + name),
                            "winner_score": score
                        }}
                    )
        return False

    # fetches the winner's name
    def fetch_results(self, game_code: str):
        for collection_name in self.db.list_collection_names():
            if collection_name == self.users_collection_name:
                continue

            collection = self.db.get_collection(collection_name)
            quiz = collection.find_one({"code": game_code})
            if quiz is not None:
                return str(quiz.get("winner"))
        
        return False

    # starts a queued game (changes status)
    def start_game(self, quiz_name: str, username: str, first_answer: str):
        collection = self.__get_user_quizzes_collection(username)

        doc = collection.find_one({"name": quiz_name})
        collection.update_one(
            {"name": quiz_name},
            {"$set": {
                "status": "1",
                "next_score": str(self.__get_max_score_for_question(int(doc.get("player_amount")))),
                "current_answer": first_answer
            }}
        )

    # returns the maximum score for a question in the quiz
    def __get_max_score_for_question(self, player_amount: int):
        return self.score_multiplier * player_amount
    
    # changes status of quiz to next question
    def next_question(self, quiz_name: str, username: str, current_answer: str):
        collection = self.__get_user_quizzes_collection(username)

        doc = collection.find_one({"name": quiz_name})
        current_question = str(int(doc.get("status")) + 1)
        collection.update_one(
            {"name": quiz_name},
            {"$set": {
                "status": current_question,
                "next_score": str(self.__get_max_score_for_question(int(doc.get("player_amount")))),
                "current_answer": current_answer
            }}
        )

    # "lets" a player join a game. returns true if the game is currently waiting for players, and false if not
    def join_game(self, gameCode: str):
        for collection_name in self.db.list_collection_names():
            if collection_name == self.users_collection_name:
                continue

            collection = self.db.get_collection(collection_name)
            quiz = collection.find_one({"code": gameCode, "status": "-1"})
            if quiz is not None:
                current_amount = int(quiz.get("player_amount"))
                collection.update_one(
                    {"code": gameCode},
                    {"$set": {"player_amount": str(current_amount + 1)}}
                )
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
    
    # adds a new quiz to a user's profile
    def add_quiz(self, name: string, content: object, username: string):
        collection = self.__get_user_quizzes_collection(username)

        new_quiz = {
            "name": name,
            "content": content,
            "code": "0",
            "status": "-2",
            "next_score": "0",
            "player_amount": "0",
            "winner": "no player played",
            "winner_score": "0",
            "current_answer": "0"
        }

        result = collection.insert_one(new_quiz)
        
        return result
    
    # adds user to users collection
    def insert_user(self, username: str, password: str):
        if self.is_username_in_db(username):
            return "username already in database"

        self.db.create_collection(name=username)
        collection = self.__get_users_collection()
        return collection.insert_one({"username": username, "password": password})
    
    # removes user from db
    def remove_user(self, username: str, password: str):
        if not(self.is_user_in_db(username, password)):
            return "username not found in database"

        collection = self.__get_users_collection()
        return collection.delete_one({"username": username, "password": password})
    