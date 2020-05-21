# api-params-crypto

## Example

```sh
npm i api-params-crypto
```

```js
import Crypto from 'api-params-crypto';

/**
 *  
 *  @param {Object|string} pubKey - rsa 公钥.
 *  @param {Object|string} priKey - rsa 私钥.
 *  @param {CryptoJS.mode} mode - aes 加密模式.
 *  @param {CryptoJS.padding} padding - aes 填充模式.
 *  @param {Function} randomMethod - aes 密钥生成方法.
 */
const crypto = new Crypto({...});

/**
 *  加密
 *  @param {Object|string} msg - 原始报文
 *  @return {string} - 加密报文
 */
crypto.encrypt(msg);

/**
 *  解密
 *  @param {string} msg - 加密报文.
 *  @return {Object|string} - 原始报文
 */
encrypt.decrypt(msg);
```
