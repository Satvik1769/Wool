const crypto = require('crypto');
const secret = crypto.randomBytes(32).toString('hex');
console.log("secret: ",secret);
const blockchain_api_key_id = "ut4tggRw3sX2pMm";
const blockchain_api_secret_key = "AqWw3XJZQrRu3ca";
const personal_access_token = "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"


// const solana_secret_phase = 
module.exports = {
    JWT_SECRET : secret,
    BLOCKCHAIN_API_KEY_ID :blockchain_api_key_id ,
    BLOCKCHAIN_API_SECRET_KEY : blockchain_api_secret_key,
    PERSONAL_ACCESS_TOKEN : personal_access_token
}
