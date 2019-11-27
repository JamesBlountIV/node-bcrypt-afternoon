const bcrypt = require("bcryptjs");

register = async (req, res) => {
    const {username, password, isAdmin} = req.body;
    const db = req.app.get("db");
    const result = await db.get_user([username]);
    const exisingUser = await result[0];
    if(exisingUser) {
        res.status(409).send("Username Taken")
    } else {
        const salt = await bcrypt.genSaltSync(10);
        const hash = await bcrypt.hashSync(password, salt);
        const registeredUser = await db.register_user([isAdmin, username, hash]);
        const user = registeredUser[0];
        req.session.user = {
            isAdmin: user.is_admin,
            id: user.id,
            username: user.username
        }
        res.status(201).send(req.session.user);
    }
};

login = async (req, res) => {
    const {username, password} = req.body;
    db =req.app.get("db")
    const foundUser = await req.app.get("db").get_user([username]);
    const user = foundUser[0];
    if (!user) {
        return res.status(401).send('User not found. Please register as a new user before logging in.');
    } else {
        const isAuthenticated = bcrypt.compareSync(password, user.hash);
        if (!isAuthenticated) {
            return res.status(403).send('Incorrect Password');
        } else {
            req.session.user = {
                isAdmin: user.isAdmin,
                id: user.id,
                username: user.username
            };
            res.status(200).send(req.session.user);
        }
    }
}

logout = (req,res) => {
    req.session.destroy();
    res.sendStatus(200)
  }

module.exports = {
    register,
    login,
    logout
}