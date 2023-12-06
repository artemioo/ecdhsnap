import { BIP44Node, getBIP44AddressKeyDeriver } from '@metamask/key-tree';
import { getSecretKey } from './secret_key';
import { copyable, divider, heading, panel, text } from '@metamask/snaps-ui';



/**
 * Derive the single account we're using for this snap.
 * The path of the account is m/44'/1'/0'/0/0.
 */
export const getPrivateKey = async (): Promise<BIP44Node> => {
    const TestNode = await snap.request({
      method: 'snap_getBip44Entropy',
      params: {
        coinType: 1,  
      },
    });

  const deriveTestnetPrivateKey = await getBIP44AddressKeyDeriver(TestNode)
  return deriveTestnetPrivateKey(0)

}