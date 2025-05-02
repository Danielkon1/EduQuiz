from pymongo import MongoClient


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
    
    # returns the collection that stores the quizzes for all users
    def get_quizzes_collection(self):
        return self.db.get_collection(self.quizzes_collection_name)
    
    # checks if user exists in users collection
    def is_user_in_db(self, username: str, password: str):
        collection = self.get_users_collection()
        
        return collection.find_one({"username": username, "password": password}) is not None

    # get list of quizzes for user
    def get_list_of_quizzes(self, username: str):
        collection = self.get_quizzes_collection()
        user_doc = collection.find_one({"username": username})

        if not user_doc:
            return []

        quiz_names = [key for key in user_doc.keys() if key not in ["_id", "username"]]
        return quiz_names



    
    # adds user to users collection
    def insert_user(self, username: str, password: str):
        if self.is_user_in_db(username, password):
            return "username already in database"

        collection = self.get_users_collection()
        return collection.insert_one({"username": username, "password": password})
    # removes user from db
    def remove_user(self, username: str, password: str):
        if not(self.is_user_in_db):
            return "username not found in database"

        collection = self.get_users_collection()
        return collection.delete_one({"username": username, "password": password})