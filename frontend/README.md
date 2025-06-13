This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# MetaMask Payment Configuration

## Environment Variables for Testnet Deployment

To configure the MetaMask payment component for testnet environments, create a `.env.local` file in the frontend directory with the following variables:

```bash
# Payment receiver address (the address that will receive the payments)
NEXT_PUBLIC_PAYMENT_RECEIVER_ADDRESS=0x123456789abcdef123456789abcdef123456789a

# MetaMask project ID (optional)
NEXT_PUBLIC_METAMASK_PROJECT_ID=your-metamask-project-id

# Supported chains (comma-separated chain IDs)
NEXT_PUBLIC_SUPPORTED_CHAINS=1,5,11155111

# Token addresses for different networks
# Sepolia Testnet addresses
NEXT_PUBLIC_ETH_ADDRESS=0x0000000000000000000000000000000000000000
NEXT_PUBLIC_USDC_ADDRESS=0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238
NEXT_PUBLIC_USDT_ADDRESS=0x7169D38820dfd117C3FA1f22a697dBA58d90BA06
NEXT_PUBLIC_DAI_ADDRESS=0x68194a729C2450ad26072b3D33ADaCbcef39D574
```

## Token Address Configuration

The MetaMask payment component now supports loading token addresses from environment variables, which enables easy switching between different networks:

### Default Addresses (Mainnet)

If environment variables are not set, the following default addresses will be used:

```javascript
const DEFAULT_ADDRESSES = {
  ETH: '0x0000000000000000000000000000000000000000', // Native ETH (zero address)
  USDC: '0xA0b86a33E6441c297f5Bb8e8511d25F9C3C57fA4', // Mainnet USDC
  USDT: '0xdAC17F958D2ee523a2206206994597C13D831ec7', // Mainnet USDT
  DAI: '0x6B175474E89094C44Da98b954EedeAC495271d0F',  // Mainnet DAI
};
```

### Testnet Configuration

For testnet deployment, you should set the appropriate addresses for your chosen testnet. Here are some examples:

#### Sepolia Testnet

```bash
NEXT_PUBLIC_ETH_ADDRESS=0x0000000000000000000000000000000000000000
NEXT_PUBLIC_USDC_ADDRESS=0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238
NEXT_PUBLIC_USDT_ADDRESS=0x7169D38820dfd117C3FA1f22a697dBA58d90BA06
NEXT_PUBLIC_DAI_ADDRESS=0x68194a729C2450ad26072b3D33ADaCbcef39D574
```

#### Goerli Testnet

```bash
NEXT_PUBLIC_ETH_ADDRESS=0x0000000000000000000000000000000000000000
NEXT_PUBLIC_USDC_ADDRESS=0xD87Ba7A50B2E7E660f678A895E4B72E7CB4CCd9C
NEXT_PUBLIC_USDT_ADDRESS=0x509Ee0d083DdF8AC028f2a56731412edD63223B9
NEXT_PUBLIC_DAI_ADDRESS=0x73967c6a0904aA032C103b4104747E88c566B1A2
```

> **Note:** The ETH address should always be the zero address: `0x0000000000000000000000000000000000000000`

## How to Get Testnet Tokens

1. **ETH**: Get testnet ETH from faucets:
   - Sepolia: https://sepoliafaucet.com/
   - Goerli: https://goerlifaucet.com/

2. **ERC-20 Tokens**: Many testnet tokens can be obtained from:
   - Compound Faucet: https://app.compound.finance/ (has testnet UI)
   - Aave Faucet: https://app.aave.com/faucet/
   - Uniswap Testnet: Use the testnet version to swap for tokens

## Testing Payment Flow

To test the full payment flow:

1. Configure your environment with testnet addresses
2. Connect a wallet with testnet ETH and tokens
3. Make a payment using any of the supported tokens
4. The transaction will be sent to the testnet network
5. Monitor the transaction using a testnet block explorer

## Important Notes

- Always verify token addresses before deployment to avoid issues
- Ensure your MetaMask wallet is connected to the correct testnet
- Remember that the payment receiver address must be valid for the chosen network
- Use the development tools in the browser to debug any environment variable issues
