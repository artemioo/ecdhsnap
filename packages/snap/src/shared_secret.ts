import { getBytes, SigningKey } from 'ethers';
import { id } from 'ethers';
;

export const CheckSharedSecret = async ( PartnerName: string)  => {
    const Data = await snap.request({
        method: 'snap_manageState',
        params: { operation: 'get'},
      });

    if (Data && Data[PartnerName]) {
        return true
    } else {
        return false
    }
}


export const SaveSharedSecret = async ( PartnerName: string, SharedSecret: string )  => {
    const currentStore = await snap.request({
        method: 'snap_manageState',
        params: { operation: 'get'},
      });

    const UpdateStore = { ...currentStore, [PartnerName]: SharedSecret };

    await snap.request({
        method: 'snap_manageState',
        params: { operation: 'update', newState: UpdateStore },
      });

}

export const CreateSharedSecret = async ( PartnerName: string, SecondSidePubKey: string )  => {

    const entropy = await snap.request({
        method: 'snap_getEntropy',
        params: {
          version: 1,
        }
    
      })

    const UserPrivKey = new SigningKey(id(entropy)) // write some comments
    const SharedSecret = UserPrivKey.computeSharedSecret(SecondSidePubKey)


    SaveSharedSecret(PartnerName, SharedSecret)

}

export const EnсryptMessage = async (PartnerName: string, message: string)  => {
    const data = await snap.request({
        method: 'snap_manageState',
        params: { operation: 'get'}
    });

    if (data !== null ) {
        const SharedSecret = data[PartnerName]?.toString();
    
    if (SharedSecret !== undefined && SharedSecret !== null) {
        var CryptoJS = require("crypto-js");
        var key = SharedSecret.startsWith("0x") ? SharedSecret.slice(2) : SharedSecret;
        var ciphertext = CryptoJS.AES.encrypt(message, key).toString();
        return ciphertext;
    } else {
        throw new Error('SharedSecret is null');
    }}
};


export const DeсryptMessage = async (PartnerName: string, ciphertext: string)  => {
    const data = await snap.request({
        method: 'snap_manageState',
        params: { operation: 'get'}
    });

    if (data !== null ) {
    const SharedSecret = data[PartnerName]?.toString();

    if (SharedSecret !== undefined && SharedSecret !== null) {
        var CryptoJS = require("crypto-js");
        var key = SharedSecret.startsWith("0x") ? SharedSecret.slice(2) : SharedSecret;
        var decrypted  = CryptoJS.AES.decrypt(ciphertext, key);
        var text = decrypted.toString(CryptoJS.enc.Utf8);
        return text;
    } else {
        throw new Error('SharedSecret is null');
    }}
};
