const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
var salt = bcrypt.genSaltSync(2);

//function to encrypt password
function encryptPassword(password){
    let hash = bcrypt.hashSync(password, salt);
    return hash
}

//function to compare password
function comparePassword(hashed, password){
    let ans = bcrypt.compareSync(hashed, password);
    return ans;
}

//function tp generate token
function tokenGeneration(payload){
    console.log(2)
    console.log(payload)
    let token = jwt.sign({ userId: payload}, 'cool',{ expiresIn: 60 * 2});
    console.log(token)
    return token
}

module.exports = encryptPassword, comparePassword, tokenGeneration

