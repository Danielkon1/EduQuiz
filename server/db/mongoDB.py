from pymongo import MongoClient

uri = "mongodb+srv://KahootDBUser:danielkon@cluster0.0bmdoqw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
db_name = "mydatabase"
users_collection_name = "users"

class MongoDB:
    def __init__(self):
        self.client = MongoClient(uri)
        self.db = self.client.get_database(db_name)
    
    def get_users_collection(self):
        return self.db.get_collection(users_collection_name)
    
    def insert_user(self, username: str, hash_password: str):
        collection = self.get_users_collection()
        collection.insert_one({"username": username, "password": hash_password})