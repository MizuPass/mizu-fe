import { defineChain } from 'viem'

// 環境変数からトークンを取得
const token = import.meta.env.VITE_KAIGAN_RPC_TOKEN || 'fe4hYU5C4Q8djb-5kghnnqlzNqdGGDurJ0tbWV93ZAU';

export const kaigan = defineChain({
  id: 5278000,
  name: 'Kaigan',
  nativeCurrency: {
    decimals: 18,
    name: 'J Ether',
    symbol: 'JETH',
  },
  rpcUrls: {
    default: {
      http: [`https://rpc.kaigan.jsc.dev/rpc?token=${token}`],
    },
  },
  blockExplorers: {
    default: { name: 'Explorer', url: 'https://explorer.kaigan.jsc.dev' },
  },
})


// https://rpc.kaigan.jsc.dev/rpc?token=fe4hYU5C4Q8djb-5kghnnqlzNqdGGDurJ0tbWV93ZAU