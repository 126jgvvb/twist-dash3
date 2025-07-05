import CryptoJS from "crypto-js";

const secret_key = 'dark-jupiter';

const EncryptData = (data) => {
    return CryptoJS.AES.encrypt(JSON.stringify(data), secret_key).toString();
}

export default EncryptData;