const crypto = require("crypto");

let decodingUsingCrypto = async (text = "") => {
    const key = Buffer.from(
        "xNRxA48aNYd33PXaODSutRNFyCu4cAe/InKT/Rx+bw0=",
        "base64"
    );
    const iv = Buffer.from("81dFxOpX7BPG1UpZQPcS6w==", "base64");
    const algorithm = "aes-256-cbc";

    let encryptedText = Buffer.from(text, "hex");
    let decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv);

    let decrypted = decipher.update(encryptedText);


    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return decrypted.toString();
};


const jwksClient = require('jwks-rsa');



let hashingUsingCrypto = async (text = "") => {
    const key = Buffer.from(
        "xNRxA48aNYd33PXaODSutRNFyCu4cAe/InKT/Rx+bw0=",
        "base64"
    );

    if (typeof (text) !== "string") text = text.toString();


    const iv = Buffer.from("81dFxOpX7BPG1UpZQPcS6w==", "base64");
    const algorithm = "aes-256-cbc";

    // Creating Cipheriv with its parameter
    let cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);

    // Updating text
    let encrypted = cipher.update(text);

    // Using concatenation
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return encrypted.toString("hex");
};




module.exports = {
    decodingUsingCrypto,
    hashingUsingCrypto
   
}