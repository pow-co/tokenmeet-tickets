import { PeafowlTickets } from '../../src/contracts/peafowlTickets'
import { getDefaultSigner, inputSatoshis } from './utils/txHelper'
import { toByteString, sha256, PubKey } from 'scrypt-ts'

const message = 'hello world, sCrypt!'

async function main() {
    await PeafowlTickets.compile()

    const instance = new PeafowlTickets(
        toByteString('peafowlexcellence.com', true),
        toByteString('7', true),
        PubKey(
            '03abae428d2175299f4e1295a187c3eea59176b520aeec48d8b1b5e3a068af87ae'
        ),
        PubKey(
            '03abae428d2175299f4e1295a187c3eea59176b520aeec48d8b1b5e3a068af87ae'
        )
    )

    // connect to a signer
    await instance.connect(getDefaultSigner())

    // contract deployment
    const deployTx = await instance.deploy(inputSatoshis)
    console.log('PeafowlTickets contract deployed: ', deployTx.id)

    // contract call
    const { tx: callTx } = await instance.methods.unlock(
        toByteString(message, true)
    )
    console.log('PeafowlTickets contract `unlock` called: ', callTx.id)
}

describe('Test SmartContract `PeafowlTickets` on testnet', () => {
    it('should succeed', async () => {
        await main()
    })
})
