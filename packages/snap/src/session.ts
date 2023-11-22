
  import { heading, text, panel } from "@metamask/snaps-ui";
  import { Json } from "@metamask/types";
  import { rpcErrors, providerErrors } from "@metamask/rpc-errors";
  import type { OnRpcRequestHandler } from '@metamask/snaps-types';




export async function handleUserLogin(origin: string): Promise<void> {
    const secretInput = (await snap.request({
      method: "snap_dialog",
      params: {
        type: "prompt",
        content: panel([
          heading("Log in to CubeSigner"),
          text(`**${origin}** is asking you to login with CubeSigner.`),
          text("Your secret API session token:"),
        ]),
        placeholder: "ewog...Q==",
      },
    })) as string;
  
    // user cancelled
    if (secretInput === null) {
      throw providerErrors.userRejectedRequest();
    }
  
    try {
      // parse and validate the token
      const secretApiToken = secretInput;
      // store the parsed token
      await sessionStorage.save(secretApiToken);
    } catch (err) {
      const retry = await snap.request({
        method: "snap_dialog",
        params: {
          type: "confirmation",
          content: panel([
            heading("Bad API token!"),
            text(
              "The session token you entered is not valid. The token should be a base64-encoded JSON object created with CubeSigner: cs token create"
            ),
            text("Try again with another token?"),
          ]),
        },
      });
  
      if (retry == true) {
        return await handleUserLogin(origin);
      }
      throw providerErrors.userRejectedRequest();
    }
  }

