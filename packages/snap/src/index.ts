import type { OnRpcRequestHandler } from '@metamask/snaps-types';
import { heading, panel, text } from '@metamask/snaps-ui';
import { CheckSharedSecret, CreateSharedSecret, DeсryptMessage, EnсryptMessage } from './shared_secret';
import { GenerateNewPair} from './generate_keys';
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
  const requestData = request.params
  switch (request.method) {
    case 'hello': 
      return await snap.request({
        method: 'snap_dialog',
        params: {
          type: 'confirmation',
          content: panel([
            text(`Hello!`),
            text('This custom confirmation is just for display purposes.'),
            text(
              'But you can edit the snap source code to make it do something, if you want to!',
            ),
          ]),
        },
      });

    case 'GenerateKeys':
      return GenerateNewPair()
    case 'CheckSharedSecret':
      return CheckSharedSecret(requestData.partnerName)
    case 'CreateSharedSecret':
     return CreateSharedSecret(requestData.partnerName, requestData.PubKey)
    case 'EnсryptMessage':
    return EnсryptMessage(requestData.partnerName, requestData.message)
    case 'DeсryptMessage':
    return DeсryptMessage(requestData.partnerName, requestData.ciphertext)

    default:
      throw new Error('Method not found.');
  }
};
