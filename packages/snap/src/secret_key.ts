import * as crypto from 'crypto';
import * as elliptic from 'elliptic';
import { getPrivateKey } from './private_key';
import { BIP44Node, getBIP44AddressKeyDeriver } from '@metamask/key-tree';
import { fromPrivateKey } from 'bitcoinjs-lib/types/ecpair';
import { getNodePK } from '../../site/src/utils/snap'

export const getSecretKey = async ( SecondSideKey: string )  => {
  
    const curve = new elliptic.ec('secp256k1');

    // ключ 2 юзера
    const second_user_pair = curve.keyFromPrivate(SecondSideKey, 'hex'); // !!!!
    const second_user_PublicKey = second_user_pair.getPublic()

    // const user_pk = (await getPrivateKey()).privateKeyBytes
    const node_pk = (await getNodePK()).privateKey
    if (typeof node_pk === 'string') {
      //const user_publicKey: any = curve.keyFromPrivate(user_pk).getPublic().encode('hex', true);
      const user_pair = curve.keyFromPrivate(node_pk, 'hex');
      // const user_pk =  user_pair.getPrivate('hex')
      
      const userSharedSecret = user_pair.derive(second_user_PublicKey)
      return userSharedSecret.toString('hex')
    } else {
      console.log("Unexpected error")
    }

}

