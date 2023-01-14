const remote = require('electron').remote;
const API = require("./utils/API");



//close button function
var window = remote.getCurrentWindow();
document.getElementById("close-button").addEventListener("click", function (e) {
    window.close();
}); 




//Enter key script
// document.getElementById("login-body").addEventListener("keyup", function(event) {
//   if (event.keyCode === 13) {
//     let username = document.getElementById("username-input").value;
//     let password = document.getElementById("password-input").value;

//     attemptLogin(username, password);
//   }
// });



function attemptLogin(username, password) {
    let userObject = {
        username: username,
        password: password
    }

    API.loginUser(userObject)
    .then(res => {
        let successful = res.data;
        if(successful) {
            window.close();
        }
    });;
}



API.findAll()
    .then(res => {
    console.log(res);
    });










// DO NOT UNCOMMENT DO NOT UNCOMMENT DO NOT UNCOMMENT DO NOT UNCOMMENT DO NOT UNCOMMENT DO NOT UNCOMMENT DO NOT UNCOMMENT
// 
// let userObject = {
//     username: "username",
//     password: "password"
// }
// 
// API.saveUser(userObject).then(res => console.log(res));
// 
// DO NOT UNCOMMENT DO NOT UNCOMMENT DO NOT UNCOMMENT DO NOT UNCOMMENT DO NOT UNCOMMENT DO NOT UNCOMMENT DO NOT UNCOMMENT
