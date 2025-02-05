import { parseSignature, PrivateKeyAccount } from "viem";
import { _actionHash } from "./_actionHash";

/**
 * Signs an action on Hyperliquid chain using agent wallet
 */
export async function _signL1Action(action: any, nonce: number, isMainnet: boolean, agentWallet: PrivateKeyAccount): Promise<any> {
    const hash = _actionHash(action, nonce);
    const phantomAgent = { source: isMainnet ? 'a' : 'b', connectionId: hash };
    const domain = {
        chainId: 1337,
        name: 'Exchange',
        verifyingContract: '0x0000000000000000000000000000000000000000' as `0x${string}`,
        version: '1',
    };
    const types = {
        Agent: [
            { name: 'source', type: 'string' },
            { name: 'connectionId', type: 'bytes32' },
        ],
    };
    const message = phantomAgent;

    try {
        const signature = await agentWallet.signTypedData({ domain, types, message, primaryType: 'Agent' });

        const signatureParsed = parseSignature(signature);
        let signatureSerializable;
        if (signatureParsed.v) {
            signatureSerializable = { r: signatureParsed.r, s: signatureParsed.s, yParity: signatureParsed.yParity, v: Number(signatureParsed.v) };
        } else {
            signatureSerializable = { r: signatureParsed.r, s: signatureParsed.s, yParity: signatureParsed.yParity };
        }
        return signatureSerializable;
    } catch (error) {
        console.log(error);
        return { r: '', s: '', v: 0 };
    }
}