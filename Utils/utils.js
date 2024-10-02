const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
var salt = bcrypt.genSaltSync(2);

//function to encrypt password
async function encryptPassword(password){
    let hash = await bcrypt.hash(password, salt);
    return hash
}

//function to compare password
async function comparePassword(hashed, password){
    return  await bcrypt.compare(password, hashed);
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

