const Exchange = artifacts.require("./Exchange.sol")
const TestToken = artifacts.require("./TestToken.sol")

contract('Exchange.submitOrder() && executeOrder()', accounts => {
  const maker = accounts[0]
  const taker = accounts[1]

  it("submitOrder(), should succeed by adding a new order to the orderBook on-chain.", async () => {
    const exchange = await Exchange.new()
    // Create token and allocate all tokens to the taker
    const tokenContract = await TestToken.new(100000, 18, "test", "test", { from: taker });

    // Order params
    const offerToken = 0
    const offerAmount = 1
    const wantToken = tokenContract.address
    const wantAmount = 100

    const call = await exchange.submitOrder.call(
      offerToken,
      offerAmount,
      wantToken,
      wantAmount,
      {
        from: maker,
        gas : 4e6,
        value: offerAmount
      }
    )

    const tx = await exchange.submitOrder(
      offerToken,
      offerAmount,
      wantToken,
      wantAmount,
      {
        from: maker,
        gas : 4e6,
        value: offerAmount
      }
    )

    assert(call, 'Call response was not true.')

    const log = tx.logs[0]
    assert.equal(log.event, 'logOrderSubmitted', 'Event not emitted')

    const orderId = await exchange.orderIds_(0)
    const order = await exchange.orderBook_(orderId)
    assert.equal(order[0], maker, 'maker incorrect')
    assert.equal(order[1], offerToken, 'offer token incorrect')
    assert.equal(order[2], offerAmount, 'offer amount incorrect')
    assert.equal(order[3], wantToken, 'want token incorrect')
    assert.equal(order[4], wantAmount, 'want amount incorrect')
    assert.equal(order[5], false, 'filled incorrect') // filled
  })
})
