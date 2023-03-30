import {
    assert,
    ByteString,
    PubKey,
    method,
    prop,
    Sig,
    SmartContract,
    hash160,
    Utils,
    hash256,
    toByteString,
} from 'scrypt-ts'

export class PeafowlTickets extends SmartContract {
    // Purchaser or current holder of the ticket
    @prop(true)
    holder: PubKey

    // Host of the show
    @prop()
    host: PubKey

    // Unique identifier for the show
    @prop()
    show: ByteString

    // Unique identifier for the episode of the show
    @prop()
    episode: ByteString

    constructor(
        show: ByteString,
        episode: ByteString,
        holder: PubKey,
        host: PubKey
    ) {
        super(...arguments)
        this.show = show
        this.episode = episode
        this.holder = holder
        this.host = host
    }

    @method()
    public transfer(newHolder: PubKey, sig: Sig) {
        // Only the current token holder can transfer ownership
        assert(this.checkSig(sig, this.holder))

        // While transferring, ensure no satoshis are removed from the token
        const outputs = Utils.buildPublicKeyHashOutput(
            hash160(newHolder),
            this.ctx.utxo.value
        )
        assert(
            this.ctx.hashOutputs === hash256(outputs),
            'check hashOutputs failed'
        )
    }

    @method()
    public withdrawFees() {
        const minimumSatoshis = 1000n

        // Ensure a base value of 1000 satoshis remains in the ticket at all times
        // while allowing the host of the show host of the platform admin to withdraw the
        // satoshis contained above that amount
        const outputs = Utils.buildPublicKeyHashOutput(
            hash160(this.holder),
            minimumSatoshis
        )
        assert(
            this.ctx.hashOutputs === hash256(outputs),
            'check hashOutputs failed'
        )
    }

    @method()
    public liquidate(sig: Sig) {
        // Ensure that only the TokenMeet platform may liquidate the final base satoshis
        assert(
            this.checkSig(
                sig,
                PubKey(
                    toByteString(
                        '03abae428d2175299f4e1295a187c3eea59176b520aeec48d8b1b5e3a068af87ae'
                    )
                )
            )
        )
    }
}
