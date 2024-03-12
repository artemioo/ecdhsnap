import { SigningKey, id } from 'ethers';



export const GenerateNewPair = async (): Promise<string> => {
  const entropy = await snap.request({
    method: 'snap_getEntropy',
    params: {
      version: 1,
    }

  })
  const newPair = new SigningKey(id(entropy)) // передать захешированный приватный текущего юзера

  return newPair.publicKey
}


export const GetPublicKey = async (): Promise<string> => {
  const testPublickKey = await snap.request({
    method: 'snap_getBip32PublicKey',
    params: {
      path: [ "m", "44'", "1'", "0'", "0", "0"],
      curve: "secp256k1",
      compressed: false,
    }

  })

  return testPublickKey
}