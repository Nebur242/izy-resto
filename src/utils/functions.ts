import CryptoJS from 'crypto-js';

export const encryptData = (data: Object, secretKey: string) => {
  const jsonString = JSON.stringify(data);
  return CryptoJS.AES.encrypt(jsonString, secretKey).toString();
};
