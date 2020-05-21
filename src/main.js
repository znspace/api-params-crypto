import CryptoJS from 'crypto-js';
import JSEncrypt from 'jsencrypt';

const SESSION_KEY = 'AES_KEY';

function randomGenerateStr() {
  return CryptoJS.MD5(Date.now()).toString().substr(16);
}

// 编码
function utf8_to_b64(str) {
  return window.btoa(unescape(encodeURIComponent(str)));
}

// 解码
function b64_to_utf8(str) {
  return decodeURIComponent(escape(window.atob(str)));
}

class Crypto {
  constructor(opts) {
    const { mode, padding, pubKey, priKey, randomMethod } = opts || {};
    this.res_pri = priKey || ``;
    this.rsa_pub = pubKey || '';

    this.randomMethod = randomMethod || randomGenerateStr;

    // this.key = sessionStorage.getItem(SESSION_KEY)
    //   ? JSON.parse(sessionStorage.getItem(SESSION_KEY)).key
    //   : this.randomMethod();

    this.key = this.randomMethod();

    this.cipherOption = {
      mode: mode || CryptoJS.mode.CBC,
      padding: padding || CryptoJS.pad.Pkcs7,
      iv: CryptoJS.enc.Utf8.parse(this.key),
    };

    this.rsaEncryptor = new JSEncrypt({ log: true });
    this.rsaEncryptor.setPublicKey(this.rsa_pub); //设置公钥
    this.resDecrypt = new JSEncrypt({ log: true });
    this.resDecrypt.setPrivateKey(this.res_pri);
  }

  rsaEncrypt(key) {
    // let rsaKey = '';
    // 缓存公钥
    // if (sessionStorage.getItem(SESSION_KEY)) {
    //   rsaKey = JSON.parse(sessionStorage.getItem(SESSION_KEY)).rsaKey;
    // } else {
    //   rsaKey = this.rsaEncryptor.encrypt(key);
    //   sessionStorage.setItem(SESSION_KEY, JSON.stringify({ rsaKey, key }));
    // }
    return this.rsaEncryptor.encrypt(key);
  }

  rsaDecrypt(key) {
    return this.resDecrypt.decrypt(key);
  }

  encrypt(msg) {
    let srcs = '';
    if (typeof msg === 'string') {
      srcs = CryptoJS.enc.Utf8.parse(msg);
    } else if (typeof msg === 'object') {
      //对象格式的转成json字符串
      const data = JSON.stringify(msg);
      srcs = CryptoJS.enc.Utf8.parse(data);
    }
    const salt = CryptoJS.enc.Utf8.parse(this.key);
    const encrypted = CryptoJS.AES.encrypt(srcs, salt, this.cipherOption);

    return utf8_to_b64(
      JSON.stringify({
        content: encrypted.toString(),
        key: this.rsaEncrypt(this.key),
        ver: 1,
      })
    );
  }

  decrypt(msg) {
    const srcs = b64_to_utf8(msg);
    const { key, content, ver } = JSON.parse(srcs);
    const salt = CryptoJS.enc.Utf8.parse(this.rsaDecrypt(key));
    let baseResult = CryptoJS.enc.Base64.parse(content); // Base64解密
    let ciphertext = CryptoJS.enc.Base64.stringify(baseResult);
    const cipherOption = { ...this.cipherOption, iv: salt };
    const decrypt = CryptoJS.AES.decrypt(ciphertext, salt, cipherOption);
    const decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
    try {
      return JSON.parse(decryptedStr);
    } catch (error) {
      return decryptedStr;
    }
  }
}

export default Crypto;
