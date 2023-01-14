const axios = require("axios");

module.exports = {
  
  // Saves a user to the database
  saveUser: function(userData) {
    return axios.post("http://localhost:5000/api/users", userData);
  },

  findAll: function() {
    return axios.get("http://localhost:5000/api/users");
  },

  loginUser: function(userData) {
    return axios.post("http://localhost:5000/api/users/" + userData.username, userData)
  },

  autoLogin: function(userData) {
    return axios.post("http://localhost:5000/api/users/" + userData.username, userData)
  }
};