CREATE TABLE Users (
    id INTEGER AUTO_INCREMENT,
    username VARCHAR(255) UNIQUE,
    pass VARCHAR(255),
    is_admin BOOLEAN,

    PRIMARY KEY(id)
);

CREATE TABLE Posts (
    id INTEGER AUTO_INCREMENT,
    author VARCHAR(255) NOT NULL,
    title VARCHAR(255),
    content LONGTEXT,
    published DATETIME,

    PRIMARY KEY(id),
    FOREIGN KEY(author) REFERENCES Users(username) ON DELETE CASCADE
);

CREATE TABLE Comments (
    id INTEGER AUTO_INCREMENT,
    post_id INTEGER NOT NULL,
    content LONGTEXT,
    author VARCHAR(255) NOT NULL,
    published DATETIME,

    PRIMARY KEY(id),
    FOREIGN KEY(post_id) REFERENCES Posts(id) ON DELETE CASCADE
);