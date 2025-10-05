import { ApiPromise, WsProvider } from "@polkadot/api"
import { Keyring } from "@polkadot/keyring"
import { cryptoWaitReady } from "@polkadot/util-crypto"

let api: ApiPromise | null = null

export async function getPolkadotApi(): Promise<ApiPromise> {
  if (api) {
    return api
  }

  // Connect to Polkadot node (use testnet for development)
  const wsProvider = new WsProvider(process.env.POLKADOT_WS_ENDPOINT || "wss://westend-rpc.polkadot.io")

  api = await ApiPromise.create({ provider: wsProvider })

  return api
}

export async function createKeyring() {
  await cryptoWaitReady()
  return new Keyring({ type: "sr25519" })
}

export async function getBalance(address: string): Promise<string> {
  const api = await getPolkadotApi()
  const { data: balance } = await api.query.system.account(address)
  return balance.free.toString()
}

export async function transferDOT(from: string, to: string, amount: string, privateKey: string): Promise<string> {
  const api = await getPolkadotApi()
  const keyring = await createKeyring()

  // Add account from private key
  const sender = keyring.addFromUri(privateKey)

  // Create transfer
  const transfer = api.tx.balances.transferKeepAlive(to, amount)

  // Sign and send
  const hash = await transfer.signAndSend(sender)

  return hash.toString()
}
