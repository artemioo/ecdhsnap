import { getBytes, SigningKey } from 'ethers';
import { id } from 'ethers';


export const CreateSecret = async (partnerPubKey: string)  => {

  const entropy = await snap.request({
      method: 'snap_getEntropy',
      params: {
        version: 1,
      }
  
    })

  const UserPrivKey = new SigningKey(id(entropy)) 
  const SharedSecret = UserPrivKey.computeSharedSecret(partnerPubKey)
  
  return SharedSecret
};


export const EnсryptMessage = async (partnerPubKey: string, message: string)  => {

    const SharedSecret = await CreateSecret(partnerPubKey) 

    if (SharedSecret !== undefined && SharedSecret !== null) {
        var CryptoJS = require("crypto-js");
        var ciphertext = CryptoJS.AES.encrypt(message, SharedSecret).toString();
        return ciphertext;
    } else {
        throw new Error('SharedSecret is null');
    }
};


export const DeсryptMessage = async (partnerPubKey: string, ciphertext: string)  => {

  const SharedSecret = await CreateSecret(partnerPubKey) 

    if (SharedSecret !== undefined && SharedSecret !== null) {
        var CryptoJS = require("crypto-js");
        var decrypted  = CryptoJS.AES.decrypt(ciphertext, SharedSecret);
        var text = decrypted.toString(CryptoJS.enc.Utf8);
        return text;
    } else {
        throw new Error('SharedSecret is null');
    }
};
