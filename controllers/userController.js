const db = require("../models");
const bcrypt = require("bcryptjs");
const saltRounds = 13;
const Electron = require("electron");
const BrowserWindow = Electron.BrowserWindow;
const url = require("url");
const path = require("path");
const fs = require("fs");
let window;


//Browser Window declaration and serving index.html
function createApplicationWindow() {
    window = new BrowserWindow({ frame: false, webPreferences: { nodeIntegration: true } });
    window.loadURL(url.format({
        pathname: path.join(__dirname, "../client.html"),
        protocol: "file",
        slashes: true
    }));

    window.webContents.openDevTools();

    window.maximize();
    window.setMenu(null);
    window.on("closed", () => {
        window = null;
    })
}



// Defining methods for the userController
module.exports = {
    findAll: function (req, res) {
        db.User.find(req.query)
            .sort({ date: -1 })
            .then(dbModel => res.json(dbModel))
            .catch(err => res.status(422).json(err));
    },



    findById: function (req, res) {
        db.User.findById(req.params.id)
            .then(dbModel => res.json(dbModel))
            .catch(err => res.status(422).json(err));
    },



    login: function (req, res) {
        if(req.body.hash) {
            db.User.findOne({ username: req.body.username })
                .then(dbModel => {
                    if (dbModel.password == req.body.hash) {
                        createApplicationWindow();
                        res.json(true);
                    }
                })
        }


        else {
        db.User.findOne({ username: req.body.username })
            .then(dbModel =>
                bcrypt.compare(req.body.password, dbModel.password, (err, result) => {


                    //login success
                    if (result === true) {
                        fs.readFile('appData', "utf8", function read(err, data) {
                            let appDataJSON = JSON.parse(data);
                            appDataJSON.loggedIn = true;
                            appDataJSON.username = req.body.username;
                            appDataJSON.hash = dbModel.password;
                            fs.writeFile('appData', JSON.stringify(appDataJSON), () => {});
                        });
                        createApplicationWindow();
                        res.json(true);
                    }


                    //login fail
                    else {
                        res.json(false)
                    }
                })
            )
            .catch(err => res.send(false));
        }
    },



    create: function (req, res) {
        bcrypt.genSalt(saltRounds, function (err, salt) {
            bcrypt.hash(req.body.password, salt, function (err, hash) {
                // Store hash in your password DB.
                let newUser = {
                    username: req.body.username,
                    password: hash,
                };
                db.User.create(newUser)
                    .then(dbModel => res.json(dbModel))
                    .catch(err => res.status(422).json(err));
            });
        });
    },



    update: function (req, res) {
        db.User.findOneAndUpdate({ _id: req.params.id }, req.body)
            .then(dbModel => res.json(dbModel))
            .catch(err => res.status(422).json(err));
    },



    remove: function (req, res) {
        db.User.findById({ _id: req.params.id })
            .then(dbModel => dbModel.remove())
            .then(dbModel => res.json(dbModel))
            .catch(err => res.status(422).json(err));
    },



    autoLogin: function (req, res) {
        db.User.findOne({ username: req.body.username })
            .then((dbModel) => {
                if(dbModel.password == req.body.hash) {
                    createApplicationWindow();
                    res.json(true);
                }

                else {
                    res.json(false);
                }
            })
    }
};