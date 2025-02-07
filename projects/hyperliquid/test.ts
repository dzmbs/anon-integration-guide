import * as dotenv from 'dotenv';
dotenv.config();
import { createWalletClient, createPublicClient, http, Hex } from 'viem';
import { arbitrum } from 'viem/chains';

import { SendTransactionProps, TransactionReturn, TransactionReturnData } from '@heyanon/sdk';
import { privateKeyToAccount } from 'viem/accounts';
import { closePerp } from './functions/closePerp';
import { openPerp } from './functions';
import { transferToSpot } from './functions/transferToSpot';
import { transferToPerpetual } from './functions/transferToPerpetual';

const privateKey = process.env.WALLET_PRIVATE_KEY;

const localAccount = privateKeyToAccount(privateKey as `0x${string}`);
const walletClient = createWalletClient({
    chain: arbitrum,
    transport: http('https://arb1.arbitrum.io/rpc'),
    account: localAccount,
});

const publicClient = createPublicClient({
    chain: arbitrum,
    transport: http('https://arb1.arbitrum.io/rpc'),
});

async function signTypedDatas(args: Array<{ primaryType: string; types: any; message: any; domain?: any }>): Promise<`0x${string}`[]> {
    const signatures: `0x${string}`[] = [];
    for (const arg of args) {
        const { primaryType, types, message, domain } = arg;
        const signature = await walletClient.account.signTypedData({
            domain,
            types,
            message,
            primaryType,
        });
        signatures.push(signature);
    }
    return signatures;
}

async function signMessages(messages: string[]): Promise<`0x${string}`[]> {
    const signatures: `0x${string}`[] = [];
    for (const message of messages) {
        const signature = await walletClient.signMessage({ message });
        signatures.push(signature);
    }
    return signatures;
}

async function sendTransactions({ transactions }: SendTransactionProps): Promise<TransactionReturn> {
    const txReturnData: TransactionReturnData[] = [];
    for (const tx of transactions) {
        const hash = await walletClient.sendTransaction({
            to: tx.target,
            value: tx.value,
            data: tx.data
        });
        txReturnData.push({
            message: 'Transaction successfully sent',
            hash: hash as Hex,
        });
    }
    return { isMultisig: false, data: txReturnData };
}

function getProvider(chainId: number) {
    console.log(chainId);
    console.log(arbitrum.id);
    if (chainId === arbitrum.id) {
        return publicClient;
    }
    throw new Error('Unsupported chainId');
}

async function notify(message: string) {
    console.log('Notify:', message);
}
/*closePerp({ account: localAccount.address, asset: 'BTC' }, { notify, getProvider, sendTransactions, signMessages, signTypedDatas })
    .then((result) => {
        console.log('Open result:', result);
    })
    .catch((error) => {
        console.error('Error during open:');
        console.error(error);
    });*/
/*openPerp(
    { account: localAccount.address, asset: 'BTC', size: '20', sizeUnit: 'USD', leverage: 50, short: true },
    { notify, getProvider, sendTransactions, signMessages, signTypedDatas },
)
    .then((result) => {
        console.log('Open result:', result);
    })
    .catch((error) => {
        console.error('Error during open:');
        console.error(error);
    });*/
/*
withdrawFromHyperliquid(
    {
        chainName: 'arbitrum-one',
        account: localAccount.address,
        amount: '2'
    },
    {
        notify,
        getProvider,
        sendTransactions,
        signMessages,
        signTypedDatas,
    },
)
    .then((result) => {
        console.log('Transfer result:', result);
    })
    .catch((error) => {
        console.error('Error during transfer:');
        console.error(error);
    });*/

transferToPerpetual(
    {
        amount: '0.01',
    },
    {
        notify,
        getProvider,
        sendTransactions,
        signMessages,
        signTypedDatas,
    },
)
    .then((result) => {
        console.log('Transfer result:', result);
    })
    .catch((error) => {
        console.error('Error during transfer:');
        console.error(error);
    });
