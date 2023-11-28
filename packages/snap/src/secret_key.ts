import * as crypto from 'crypto';
import * as elliptic from 'elliptic';



export const getSecretKey = ({user_pk}: any) => {
  
    const curve = new elliptic.ec('secp256k1');

    const aliceKeys = curve.genKeyPair();
    const alicePublicKey = aliceKeys.getPublic();
/* 
    const user_pk = getPrivateKey() */
    const bobKeys = curve.genKeyPair();

    const userSharedSecret = bobKeys.derive(alicePublicKey)

    return userSharedSecret.toString('hex')
}