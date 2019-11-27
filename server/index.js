require("dotenv").config();
const express = require("express");
const session = require("express-session");
const massive = require("massive");
const authCtrl = require("./controllers/authController");
const treasureCtrl = require("./controllers/treasureController");
const auth = require("./middleware/authMiddleware");

const {CONNECTION_STRING, SESSION_SECRET} = process.env;


const app = express();



massive(CONNECTION_STRING).then(db => {
    app.set("db", db);
    console.log('Database Now Connected');
});


app.use(session({
    resave: true,
    saveUninitialized: false,
    secret: SESSION_SECRET,
}));

app.use(express.json());


app.post("/auth/register", authCtrl.register);
app.post("/auth/login", authCtrl.login);
app.get("/auth/logout",authCtrl.logout);

app.get('/api/treasure/dragon', treasureCtrl.dragonTreasure);
app.get('/api/treasure/user', auth.userOnly, treasureCtrl.getUserTreasure);
app.post('/api/treasure/user', auth.userOnly, treasureCtrl.addUserTreasure);
app.get('/api/treasure/all', auth.userOnly, auth.adminsOnly, treasureCtrl.getAllTreasure);


const PORT = 4000;
app.listen(PORT, () => {
    console.log(`live on server port: ${PORT}`);
})