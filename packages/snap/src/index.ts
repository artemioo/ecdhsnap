import type { OnRpcRequestHandler } from '@metamask/snaps-types';
import { heading, panel, text } from '@metamask/snaps-ui';

import { 
  BIP44Node, 
  getBIP44AddressKeyDeriver,  
  deriveBIP44AddressKey,
  JsonBIP44CoinTypeNode, } from '@metamask/key-tree';
import * as crypto from 'crypto';
import * as elliptic from 'elliptic';
import { getSecretKey } from './secret_key';
import { getPrivateKey } from './private_key';
/**
 * Handle incoming JSON-RPC requests, sent through `wallet_invokeSnap`.
 *
 * @param args - The request handler args as object.
 * @param args.origin - The origin of the request, e.g., the website that
 * invoked the snap.
 * @param args.request - A validated JSON-RPC request object.
 * @returns The result of `snap_dialog`.
 * @throws If the request method is not valid for this snap.
 */


export const onRpcRequest: OnRpcRequestHandler = async ({ request }) => {

  switch (request.method) {
    case 'hello':
      const test = await snap.request({
        method: 'snap_getEntropy',
        params: {
          version: 1,
          salt: 'foo', // Optional
        },
  });
      return await snap.request({
        method: 'snap_dialog',
        params: {
          type: 'confirmation',
          content: panel([
            text(`Hello, **${test}**!`),
            text('This custom confirmation is just for display purposes.'),
            text(
              'But you can edit the snap source code to make it do something, if you want to!',
            ),
          ]),
        },
      });

    case 'get_node_private_key':
      return getPrivateKey();


    default:
      throw new Error('tet not found.');
  }
};
