import { expect, use } from 'chai'
import { MethodCallOptions, PubKey, sha256, toByteString } from 'scrypt-ts'
import { PeafowlTickets } from '../../src/contracts/peafowlTickets'
import { getDummySigner, getDummyUTXO } from './utils/txHelper'
import chaiAsPromised from 'chai-as-promised'
use(chaiAsPromised)

describe('Test SmartContract `PeafowlTickets`', () => {
    let instance: PeafowlTickets

    before(async () => {
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
        await instance.connect(getDummySigner())
    })

    it('should pass the public method unit test successfully.', async () => {
        const { tx: callTx, atInputIndex } = await instance.methods.unlock(
            toByteString('hello world', true),
            {
                fromUTXO: getDummyUTXO(),
            } as MethodCallOptions<PeafowlTickets>
        )

        const result = callTx.verifyScript(atInputIndex)
        expect(result.success, result.error).to.eq(true)
    })

    it('should throw with wrong message.', async () => {
        return expect(
            instance.methods.unlock(toByteString('wrong message', true), {
                fromUTXO: getDummyUTXO(),
            } as MethodCallOptions<PeafowlTickets>)
        ).to.be.rejectedWith(/Hash does not match/)
    })
})
