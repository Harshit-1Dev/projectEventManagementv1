import mysql.connector
from mysql.connector import pooling
import os
from dotenv import load_dotenv

load_dotenv()

_pool = pooling.MySQLConnectionPool(
    pool_name="gt_pool",
    pool_size=5,
    host=os.getenv("DB_HOST", "localhost"),
    port=int(os.getenv("DB_PORT", 3306)),
    user=os.getenv("DB_USER", "root"),
    password=os.getenv("DB_PASS", "root"),
    database=os.getenv("DB_NAME", "groupthink_events"),
    autocommit=True,
)


def get_conn():
    return _pool.get_connection()


def init_db():

    raw = mysql.connector.connect(
        host=os.getenv("DB_HOST", "localhost"),
        port=int(os.getenv("DB_PORT", 3306)),
        user=os.getenv("DB_USER", "root"),
        password=os.getenv("DB_PASS", "root"),
    )
    cur = raw.cursor()
    db  = os.getenv("DB_NAME", "groupthink_events")

    cur.execute(f"CREATE DATABASE IF NOT EXISTS `{db}`")
    cur.execute(f"USE `{db}`")


    cur.execute("""
        CREATE TABLE IF NOT EXISTS attendees (
            id            INT AUTO_INCREMENT PRIMARY KEY,
            reg_id        VARCHAR(12)   NOT NULL UNIQUE,
            name          VARCHAR(100)  NOT NULL,
            email         VARCHAR(150)  NOT NULL UNIQUE,
            phone         VARCHAR(15)   NOT NULL,
            company       VARCHAR(150)  NOT NULL,
            city          VARCHAR(50)   NOT NULL,
            checked_in    BOOLEAN       DEFAULT FALSE,
            registered_at DATETIME      DEFAULT NOW()
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    """)


    cur.execute("""
        CREATE TABLE IF NOT EXISTS admins (
            id         INT AUTO_INCREMENT PRIMARY KEY,
            username   VARCHAR(50)  NOT NULL UNIQUE,
            password   VARCHAR(255) NOT NULL,
            created_at DATETIME     DEFAULT NOW()
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    """)

    raw.commit()
    cur.close()
    raw.close()
    print("Database and tables ready")
