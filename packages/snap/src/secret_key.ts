import * as crypto from 'crypto';
import * as elliptic from 'elliptic';
import { getPrivateKey } from './private_key';
import { BIP44Node, getBIP44AddressKeyDeriver } from '@metamask/key-tree';
import { fromPrivateKey } from 'bitcoinjs-lib/types/ecpair';
import { getNodePK } from '../../site/src/utils/snap'

import { getBytes, SigningKey } from 'ethers';
import { id } from 'ethers';



export const getSecretKey = async ( SecondSideKey: Uint8Array )  => {

    const node_pk = (await getNodePK()).privateKey
    const sign1 = new SigningKey(id(node_pk)) // передать захешированный приватный текущего юзера
    const bytesValue = getBytes(SecondSideKey);
    const userSharedSecret = sign1.computeSharedSecret(bytesValue) // передать публ 2-ого юзера

    return userSharedSecret
}