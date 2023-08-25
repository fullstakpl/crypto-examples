const crypto = require('crypto');

function generateRSAKeyPair() {
    const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength: 2048,
        publicKeyEncoding: {
            type: 'spki',
            format: 'pem'
        },
        privateKeyEncoding: {
            type: 'pkcs8',
            format: 'pem'
        }
    });

    return { privateKey, publicKey };
}

const { privateKey, publicKey } = generateRSAKeyPair();
console.log("Private Key:", privateKey);
console.log("\nPublic Key:", publicKey);