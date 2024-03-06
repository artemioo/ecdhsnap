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
