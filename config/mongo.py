import os
from mongoengine import connect # type: ignore


MONGO_URI = os.getenv("MONGO_URI", "mongodb://mongo:27018")

connect(
    db=os.getenv("MONGO_DB_NAME", "Q-shaastra_prod_Docker"),
    host=MONGO_URI,
    alias="default",
)
