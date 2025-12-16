const express = require('express');

const app = express();
const path = require('path');
const data = require('./data.js');

const session = require("express-session");

app.use(session({
    secret: "bbblog-secret",
    resave: false,
    saveUninitialized: false
}));
app.use(express.static("resources"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set('view engine', 'pug');
app.set('views', "./templates");

// GET REQUESTS

app.get("/", async (req, res) => {
    let posts = await data.getPosts("", 1);

    return res.render("home", { posts, page: 1, user: req.session.user });
});

app.get("/home", async (req, res) => {
    let posts;
    if (req.query.q) {
        posts = await data.getPosts(req.query.q, 1);
    }
    else {
        posts = await data.getPosts("", 1);
    }


    return res.render("home", { posts, page: 1, user: req.session.user });
});

app.get("/home/:page", async (req, res) => {
    let pageNum = Number(req.params.page);
    let posts = await data.getPosts("", pageNum);

    return res.render("home", { posts, page: pageNum, user: req.session.user });
});

app.get("/post/:id", async (req, res) => {
    const id = Number(req.params.id);
    const post = await data.getPost(id);
    const comments = await data.getComments(id);

    res.render("post", { post, comments, user: req.session.user });
});

app.get("/login", (req, res) => {
    return res.render("login", { user: req.session.user });
});

app.get("/register", (req, res) => {
    return res.render("register", { user: req.session.user });
});

app.get("/admin", async (req, res) => {
    if (!req.session.user) {
        return res.render("home", { posts, page: 1 });
    }

    const response = await data.admin(req.session.user);

    if (response.affectedRows === 1) {
        req.session.user.is_admin = 1;
    }

    return res.redirect("/");;
});

app.get("/create", (req, res) => {
    return res.render("create", { user: req.session.user });
});

app.get("/logout", (req, res) => {
    req.session.destroy(e => {
        if (e) {
            return res.status(500).send("error when logging out");
        }

        return res.redirect("/");
    });
});

app.get("/user/:name", async (req, res) => {

    let exists = await data.userExists(req.params.name);

    if (exists) {
        let posts = await data.getUserPosts(req.params.name);

        res.render("user", { posts, person: req.params.name, user: req.session.user });
    }
    else {
        res.render("user", { person: null });
    }
});

// POST REQUESTS

app.post("/create", async (req, res) => {
    if (!req.session.user || req.session.user.is_admin != 1) {
        return res.status(401).json({ status: "error", errors: ["Must Be a Logged-In Admin to Post"] });
    }
    if (!req.body.title || !req.body.content) {
        return res.status(401).json({ status: "error", errors: ["Missing Title or Content"] });
    }

    const response = await data.addPost({ title: req.body.title, content: req.body.content, user: req.session.user.username });

    if (!response) {
        return res.status(500).json({ status: "error", errors: ["Error Fulfilling Request"] });
    }

    return res.status(201).send({ status: "success" });
});

app.post("/comment", async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ status: "error", errors: ["Must Be Logged-In to Comment"] });
    }
    if (!req.body.id || !req.body.content) {
        return res.status(401).json({ status: "error", errors: ["Missing PostId or Content"] });
    }

    const response = await data.addComment({ postId: req.body.id, content: req.body.content, author: req.session.user.username });

    if (!response) {
        return res.status(500).json({ status: "error", errors: ["Error Fulfilling Request"] });
    }

    return res.status(201).send({ status: "success" });
});

app.post("/delete_comment", async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ status: "error", errors: ["Must Be Logged-In to Delete Comments"] });
    }
    if (!req.body.owner) {
        return res.status(401).json({ status: "error", errors: ["Missing Comment Owner"] });
    }
    if (!req.body.id) {
        return res.status(401).json({ status: "error", errors: ["Missing Comment ID"] });
    }
    if (!(req.session.user.is_admin==1) && !(req.session.user.username == req.body.owner)) {
        return res.status(401).json({ status: "error", errors: ["Must Be Admin or Comment-Owner to Delete Comment"] });
    }

    const response = await data.deleteComment(req.body.id);

    if (!response) {
        return res.status(500).json({ status: "error", errors: ["Error Fulfilling Request"] });
    }

    return res.status(201).send({ status: "success" });
});

app.post("/edit", async (req, res) => {
    if (!req.session.user || req.session.user.is_admin != 1) {
        return res.status(401).json({ status: "error", errors: ["Must Be a Logged-In Admin to Edit"] });
    }
    if (!req.body.id) {
        return res.status(401).json({ status: "error", errors: ["Missing Post ID"] });
    }
    if (!req.body.title) {
        return res.status(401).json({ status: "error", errors: ["Missing Post Title"] });
    }
    if (!req.body.content) {
        return res.status(401).json({ status: "error", errors: ["Missing Post Content"] });
    }

    const response = await data.editPost(req.body.id, req.body.title, req.body.content);

    if (!response) {
        return res.status(500).json({ status: "error", errors: ["Error Fulfilling Request"] });
    }


    return res.status(201).send({ status: "success" });
});

app.post("/delete", async (req, res) => {
    if (!req.session.user || req.session.user.is_admin != 1) {
        return res.status(401).json({ status: "error", errors: ["Must Be a Logged-In Admin to Delete Posts"] });
    }
    if (!req.body.id) {
        return res.status(401).json({ status: "error", errors: ["Missing Post ID"] });
    }

    const response = await data.deletePost(req.body.id);

    if (!response) {
        return res.status(500).json({ status: "error", errors: ["Error Fulfilling Request"] });
    }

    return res.status(201).send({ status: "success" });
});

app.post("/login", async (req, res) => {
    if (!req.body.username || !req.body.password) {
        if (!req.body.username && req.body.password) {
            return res.status(401).json({ status: "error", errors: ["Missing Username"] });
        }
        else if (!req.body.password && req.body.username) {
            return res.status(401).json({ status: "error", errors: ["Missing Password"] });
        }
        else {
            return res.status(401).json({ status: "error", errors: ["Missing Username and Password"] });
        }
    }

    const users = await data.validateUser(req.body);

    if (!users || users.length === 0) {
        return res.status(401).json({ status: "error", errors: ["Invalid username or password"] });
    }

    const user = users[0];

    req.session.user = { id: user.id, username: user.username, is_admin: user.is_admin };

    console.log("Logged in as", req.session.user.username);

    return res.status(201).json({ status: "success" });
});

app.post("/register", async (req, res) => {
    if (!req.body.username || !req.body.password) {
        return res.status(400).json({ status: "error", errors: ["Missing Username or Password"] });
    }

    const response = await data.createUser(req.body);

    if (!response) {
        return res.status(400).json({ status: "error", errors: ["Username taken"] });
    }


    return res.status(200).json({ status: "success" });
});


// Error handling to catch malformed JSON found: https://expressjs.com/en/guide/error-handling.html
app.use((err, req, res, next) => {
    if ((err instanceof SyntaxError) && (err.status === 400)) {
        res.status(400).json({ status: "error", errors: ["Invalid json"] });
        return;
    }
});

// 404
app.use((req, res, next) => {
    res.status(404).render("404", { user: req.session.user });
})

app.listen(4131, () => {
    console.log("Running")
})