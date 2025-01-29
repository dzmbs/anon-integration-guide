import { Address } from 'viem';
import { withdrawFromHyperliquid } from '../functions';
import { HYPERLIQUID_BRIDGE_ADDRESS, USDC_ADDRESS, MIN_BRIDGE_AMOUNT, ARBITRUM_CHAIN_ID } from '../constants';
import { toResult, TransactionReturn } from '@heyanon/sdk';
import { TransactionParams } from '@heyanon/sdk/dist/blockchain/types';

const account = '0x92CC36D66e9d739D50673d1f27929a371FB83a67' as Address;

describe('withdrawFromHyperliquid', () => {
    const mockNotify = jest.fn((message: string) => {
        console.log(message);
        return Promise.resolve();
    });

    const mockProvider = jest.fn().mockReturnValue({
        readContract: jest.fn(),
        simulateContract: jest.fn(),
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    const props = {
        chainName: 'arbitrum-one',
        account,
        amount: '100',
    };

    it('should prepare and send withdraw transaction correctly', async () => {
        const mockSignTypedDatas = jest.fn((...args: unknown[]) => {
            console.log('Signing typed datas:', args);
            return Promise.resolve(['0x5ab40c899edec6de87fce05f2babe8ba378981d6e7e77324c64c5cd58c6af6d2'] as `0x${string}`[]);
        });

        jest.spyOn(require('@heyanon/sdk'), 'getChainFromName').mockImplementation((...args: unknown[]) => {
            const chainName = args[0] as string;
            if (chainName === 'arbitrum-one') return ARBITRUM_CHAIN_ID;
            if (chainName === 'ethereum') return 1;
            return null;
        });

        const result = await withdrawFromHyperliquid(props, {
            notify: mockNotify,
            signTypedDatas: mockSignTypedDatas,
            getProvider: mockProvider,
            sendTransactions: jest.fn(),
        });

        expect(result.success).toEqual(true);
        expect(result.data).toContain('Successfully initiated withdraw of 100 USDC from Hyperliquid to Arbitrum');

        expect(mockNotify).toHaveBeenCalledWith('Preparing to withdraw USDC from Hyperliquid...');
    });
});
