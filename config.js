const crypto = require('crypto');
const secret = crypto.randomBytes(32).toString('hex');
console.log("secret: ",secret);



// const solana_secret_phase = 
module.exports = {
    JWT_SECRET : secret,
  
}