import { AiTool, getChainName } from '@heyanon/sdk';
import { supportedChains } from './constants';

export const tools: AiTool[] = [
    {
        name: 'bridgeToHyperliquid',
        description: 'Bridges USDC tokens from Arbitrum to Hyperliquid.',
        required: ['chainName', 'account', 'amount'],
        props: [
            {
                name: 'chainName',
                type: 'string',
                enum: supportedChains.map(getChainName),
                description: 'Chain name where the bridge transaction is executed. (must be Arbitrum)',
            },
            {
                name: 'account',
                type: 'string',
                description: 'Account address that will execute transaction.',
            },
            {
                name: 'amount',
                type: 'string',
                description: 'Amount of USDC tokens to bridge. (minimum 5 USDC)',
            },
        ],
    },
    {
        name: 'withdrawFromHyperliquid',
        description: 'Withdraws USDC tokens from Hyperliquid to Arbitrum.',
        required: ['chainName', 'account', 'amount'],
        props: [
            {
                name: 'chainName',
                type: 'string',
                enum: supportedChains.map(getChainName),
                description: 'Chain name where the withdraw transaction is executed. (must be Hyperliquid)',
            },
            {
                name: 'account',
                type: 'string',
                description: 'Account address that will execute transaction.',
            },
            {
                name: 'amount',
                type: 'string',
                description: 'Amount of USDC tokens to withdraw. (minimum 2 USDC)',
            },
        ],
    },
    {
        name: 'spotPerpTransfer',
        description: "Transfers funds between the user's spot and perp balances on Hyperliquid.",
        required: ['amount', 'toPerp'],
        props: [
            {
                name: 'amount',
                type: 'string',
                description: 'Amount of USDC tokens to transfer. (must be greater than 0)',
            },
            {
                name: 'toPerp',
                type: 'boolean',
                description: 'If true, transfers funds from spot to perp balance; if false, transfers funds from perp to spot balance.',
            },
        ],
    },
    {
        name: 'openPerp',
        description: 'Opens a new perp position on Hyperliquid.',
        required: ['account', 'asset', 'size', 'sizeUnit', 'leverage', 'short'],
        props: [
            {
                name: 'account',
                type: 'string',
                description: 'User wallet address that will open the perp position.',
            },
            {
                name: 'asset',
                type: 'string',
                enum: ['ETH', 'BTC', 'HYPE', 'PURR', 'LINK', 'ARB'],
                description: 'Name of the underlying asset for the perp position.',
            },
            {
                name: 'size',
                type: 'string',
                description: 'Size of the position (interpreted in asset units or USD, depending on sizeUnit).',
            },
            {
                name: 'sizeUnit',
                type: 'string',
                enum: ['ASSET', 'USD'],
                description: 'Specifies whether "size" is denominated in the asset or in USD.',
            },
            {
                name: 'leverage',
                type: 'number',
                description: 'Leverage multiplier for the position.',
            },
            {
                name: 'short',
                type: 'boolean',
                description: 'If true, opens a short position; if false, opens a long position.',
            },
        ],
    },
    {
        name: 'closePerp',
        description: 'Closes an existing perp position on Hyperliquid.',
        required: ['account', 'asset'],
        props: [
            {
                name: 'account',
                type: 'string',
                description: 'User wallet address that will close the perp position.',
            },
            {
                name: 'asset',
                type: 'string',
                enum: ['ETH', 'BTC', 'HYPE', 'PURR', 'LINK', 'ARB'],
                description: 'Name of the underlying asset whose perp position should be closed.',
            },
        ],
    },
];
