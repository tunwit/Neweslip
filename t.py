import mysql.connector

# Connect
db = mysql.connector.connect(
    url = "mysql://app:1234@db.1ldx.online:3306/db"
)

cursor = db.cursor()

# Insert data
sql = "INSERT INTO users (name, email) VALUES (%s, %s)"
values = ("John Doe", "john@example.com")

cursor.execute(sql, values)
db.commit()

print("Inserted ID:", cursor.lastrowid)

cursor.close()
db.close()
