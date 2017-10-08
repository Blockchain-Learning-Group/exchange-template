/*
 Initialize web3 instances of blg token, hub and exchange contracts.
 Load all relevant accounts, balances, orders.
 NOTE web3 globally available as linked in in home.html
 */

// Exchange, blgToken, hub contract data
const exchangeAddress = '0x9ec0d5ec757bc14699fd9e7ddf97dde405e7c1c5'
const exchangeJSON = {}

const tokenAddress = '0xfec1266f7e026363be4a7b0d10df790bbd92bff4'
const tokenJSON = {}

const hubAddress = '0x4519b80e842c4e8a9538997c39550dc724c28427'
const hubJSON = {}

$(window).ready(() => {
  // Approved tokens to trade on the exchange, mapping symbol <> address
  window.approvedTokens = {
    'ETH': '0x0000000000000000000000000000000000000000',
    'BLG': tokenAddress
  }

  window.tokenAddressToSymbol = {
    '0x0000000000000000000000000000000000000000': 'ETH',
    '0xfec1266f7e026363be4a7b0d10df790bbd92bff4': 'BLG'
  }

  // Some race conditiion where metamask is slow to be injected wait then connect.
  if (!window.web3) {
    setTimeout(() => {
      // If still no web3 then alert, metamask likely not installed
      if (!window.web3) {
        alert('Please install Metamask to use this application!\n https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en')
      } else {
        loadWeb3()
      }
    }, 500)

  // Metamask is present than connect to it
  } else {
    loadWeb3()
  }
})

function loadWeb3() {
  const web3 = new Web3(window.web3.currentProvider) // Metamask

  if (web3.isConnected()) {
    // Create instance of the exchange, blg token and hub

    // Create relevant listeners for all contracts

    // Load balances for the user as well as the order book contents

    window.defaultAccount = web3.eth.accounts[0]
  }
}

/*
 Utils
 */

/**
 * Append a new order to the order book table.
 * @param  {String} maker  The address of the user who created the order.
 * @param  {String} offerToken  The address of the token contract offered.
 * @param  {Number} offerAmount The amount of tokens offered.
 * @param  {String} wantToken  The address of the token contract wanted.
 * @param  {Number} wantAmount The amount of tokens wanted.
 * when offering ether to transfer the value to the exchange to broker the trade.
 */
function appendOrder(maker, offerToken, offerAmount, wantToken, wantAmount) {
   const offerSymbol = tokenAddressToSymbol[offerToken]
   const wantSymbol = tokenAddressToSymbol[wantToken]
   let offerAmountAdjusted = offerAmount
   let wantAmountAdjusted = wantAmount

   // Convert eth amount from wei
   if (offerSymbol === 'ETH') {
     offerAmountAdjusted = offerAmount / 10**18
   } else if (wantSymbol === 'ETH') {
     wantAmountAdjusted = wantAmount / 10**18
   }

   $('#orderBook').append(
     '<tr id='
       // Sufficient ID for now as only one order can exist with these params at this time.
       + offerToken + offerAmount + wantToken + wantAmount
       +' ><td>'
       + offerSymbol + '</td><td>'
       + offerAmountAdjusted + '</td><td>'
       + wantSymbol + '</td><td>'
       + wantAmountAdjusted + '</td><td>'
       + maker
     + '</td><</tr>'
   )
 }

/**
* Open the successful transaction modal
* @param  {String} tx The transaction hash.
*/
function openTransactionSuccessModal(msg, tx) {
 const href = 'https://kovan.etherscan.io/tx/' + tx
 $('#txHash').empty()
 $('#txHash').append('<p>'+ msg +'</p>')
 $('#txHash').append('</br><p>Here is your transaction hash:</p>')
 $('#txHash').append('<a href='+ href +'>'+ tx +'</a>')
 $('#successModal').modal('show')
}
