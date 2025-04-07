from mongoDB import MongoDB
from utils import uri, db_name, users_collection_name

if __name__ == "__main__":
    db = MongoDB(uri, db_name, users_collection_name)
    print(db.insert_user("tyrone", "123456"))