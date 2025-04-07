from mongoDB import MongoDB


if __name__ == "__main__":
    db = MongoDB()

    print(db.insert_user("daniel", "custompassword"))