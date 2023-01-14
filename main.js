const path = require("path");
const fs = require("fs");
const API = require("./utils/API");



//Electron Variables
const Electron = require("electron");
const App = Electron.app;
const BrowserWindow = Electron.BrowserWindow;
const url = require("url");
let window;



//Express Variables
const express = require("express");
const PORT = process.env.PORT || 5000;
const routes = require("./routes");
const expressApp = express();



//mongoose
const mongoose = require("mongoose");



//Express Server Initialization
function startServer() {
    // Init Middleware
    expressApp.use(express.urlencoded({ extended: true }));
    expressApp.use(express.json());

    // Serve static assets in production
    if (process.env.NODE_ENV === "production") {
    // Set static folder
    expressApp.use(express.static("client/build"));
    }

    expressApp.use(routes);

    // Setting up mongoose connection
    mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/" + PORT);

    // Starting up the server
    expressApp.listen(PORT, () =>
    console.log(`The server started on http://localhost:${PORT}`)
    );
}



//Check User Login 
function checkUserLogin() {
    fs.readFile('appData', "utf8" , function read(err, data) {
        let appDataJSON = JSON.parse(data);

        if (appDataJSON.loggedIn) {
            autoLogin(appDataJSON.username, appDataJSON.hash);
        }
        
        else {
            createLoginWindow();
            console.log("please log in")
        }
    });
}



//Creates login browser window
function createLoginWindow() {
    window = new BrowserWindow({
        width: 325, 
        height: 450, 
        frame: false, 
        transparent: true, 
        show: true,
        resizable: false,
        webPreferences: {
            nodeIntegration: true
        }
    });

    window.loadURL(url.format({
        pathname: path.join(__dirname, "login.html"),
        protocol: "file",
        slashes: true
    }));
    
    window.webContents.on ('did-finish-load', () => {
    window.focus();
    })

    // window.webContents.openDevTools();

    window.setMenu(null);
    window.on("closed", () => {
        window = null;
    })
}



//Application On-Ready
function launchApp() {
    App.on("ready", checkUserLogin);
    
    App.on("window-all-closed", () => {
        if (process.platform !== "darwin") {
            App.quit();
        }
    });
    
    App.on("activate", () => {
        if (window === null) {
            createWindow();
        }
    });
}


//auto login function
function autoLogin(username, hash) {
    let userObject = {
        username: username,
        hash: hash
    }

    API.autoLogin(userObject).then(res => {
        let successful = res.data;
        if(!successful) {
            createLoginWindow();
        }
    });
}



//Function Calls
startServer();
launchApp();

