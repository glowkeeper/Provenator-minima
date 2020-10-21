import { write } from '../../actions'
import {
  AppDispatch,
  ChainDataProps,
  ChainDataActionTypes,
  TransactionActionTypes,
  GetActionTypes,
  CheckActionTypes,
  FileProps,
  GetProps,
  CheckProps,
  CheckData,
  Coin
} from '../../types'

import { Transaction, File, Misc } from '../../../config'

// @ts-ignore
import { Minima } from './minima'

export const init = () => {
    return async (dispatch: AppDispatch, getState: Function) => {

      Minima.init()
      //Minima.logging = true

      const state = getState()
      const status = state.chainInfo.data.status

      Minima.cmd("random;", function(respJSON: any) {
          //console.log("random: ", respJSON)

          if( Minima.util.checkAllResponses(respJSON) ) {

            const rand = respJSON[0].response.random
            const fileContract  = `let this=${rand} return false`

            //console.log(fileContract)

            Minima.cmd("newscript \"" + fileContract + "\";", function(respJSON: any) {

                /*Minima.log("In newscript")
                console.log(respJSON)*/

                 if( Minima.util.checkAllResponses(respJSON) ) {

                  let chainData: ChainDataProps = {
                    data: {
                      scriptAddress: respJSON[0].response.address.hexaddress,
                      status: status
                    }
                  }

                  //Minima.log("Init Script address: "+ chainData.data.scriptAddress)
                  dispatch(write({data: chainData.data})(ChainDataActionTypes.ADD_DATA))
                } else {

                  Minima.log("newscript failed")
                }
            })
          }
     	})
  }
}

export const status = () => {
  return async (dispatch: AppDispatch, getState: Function) => {

    const state = getState()
    const scriptAddress = state.chainInfo.data.scriptAddress

    Minima.cmd("status", function(respJSON: any) {

        let status: string = ''
        const delimiter = ': '
        for (const [key, value] of Object.entries(respJSON.response)) {
          const thisValue: string = value as string
          const thisKey: string = key as string
          const thisLine =  `**${thisKey}** ${delimiter} ${thisValue}`
          if (thisLine.length > 25) {
            const thisStatus = thisLine.match(/.{1,25}/g)
            if ( thisStatus ) {
              for (let i = 0; i < thisStatus.length; i++ ) {
                status += `${thisStatus[i]}<br/>`
              }
            } else {
                // should never get here
                // check for 'thisStatus' is just to satisfy Typescript
                status += `<br/>`
            }
          } else {
            status += `${thisLine}<br/>`
          }
        }

        let chainData:  ChainDataProps = {
          data: {
            scriptAddress: scriptAddress,
            status: status
          }
        }

        dispatch(write({data: chainData.data})(ChainDataActionTypes.ADD_DATA))
    })
  }
}

export const addFile = (props: FileProps) => {
  return async (dispatch: AppDispatch, getState: Function) => {

    const state = getState()
    const scriptAddress = state.chainInfo.data.scriptAddress
    const txAmount = 0.01
		const txnId = Math.floor(Math.random()*1000000000)

    //Minima.log("Script address: "+ scriptAddress)

    let txData = {
        txId: txnId,
        summary: Transaction.unnecessary,
        time: new Date(Date.now()).toString()
    }

    Minima.cmd("coins relevant address:"+ scriptAddress + ";", function(respJSON: any) {

      let checkData: CheckData = {
        in: false,
        block: `${File.noBlock}`
      }

      if( Minima.util.checkAllResponses(respJSON) ) {

        const coins = respJSON[0].response.coins
        for ( let i = 0; i < coins.length; i++ ) {
          if (coins[i].data.coin.address == scriptAddress) {
            if (props.fileHash == coins[i].data.prevstate[0].data) {
              checkData = {
                in: true,
                block: coins[i].data.inblock
              }
              break
            }
          }
        }
      }

      if(checkData.in) {

        txData.summary += " block: " + checkData.block
        dispatch(write({data: txData})(TransactionActionTypes.TRANSACTION_FAILURE))

      } else {

          const addFileScript =
      			"txncreate "+ txnId + ";" +
      			"txnstate " + txnId + " 0 " + props.fileHash + ";" +
            "txnauto " + txnId + " " + txAmount + " " + scriptAddress + ";" +
            "txnpost " + txnId + ";" +
      			"txndelete " + txnId + ";";

          //Minima.log("Going to add!"+ addFileScript)

      		Minima.cmd( addFileScript , function(respJSON: any) {
              if( !Minima.util.checkAllResponses(respJSON) ) {

                  txData.summary = Transaction.failure
                  dispatch(write({data: txData})(TransactionActionTypes.TRANSACTION_FAILURE))

              } else {

                  txData.summary = Transaction.success
                  dispatch(write({data: txData})(TransactionActionTypes.TRANSACTION_SUCCESS))
    	        }
    		  })
      }
  	})
  }
}

export const checkFile = (props: FileProps) => {
  return async (dispatch: AppDispatch, getState: Function) => {

      const state = getState()
      const scriptAddress = state.chainInfo.data.scriptAddress

      let checkData: CheckData = {
        in: false,
        block: `${File.noBlock}`
      }

      Minima.cmd("coins relevant address:"+ scriptAddress + ";", function(respJSON: any) {

        let checkData: CheckData = {
          in: false,
          block: `${File.noBlock}`
        }

        if( Minima.util.checkAllResponses(respJSON) ) {

          const coins = respJSON[0].response.coins
          for ( let i = 0; i < coins.length; i++ ) {
            if (coins[i].data.coin.address == scriptAddress) {
              if (props.fileHash == coins[i].data.prevstate[0].data) {
                checkData = {
                  in: true,
                  block: coins[i].data.inblock
                }
                break
              }
            }
          }
        }

        let actionType = CheckActionTypes.CHECK_FAILURE
        if ( checkData.in ) {
          actionType = CheckActionTypes.CHECK_SUCCESS
        }
        dispatch(write({data: checkData})(actionType))
    	})
  }
}

export const getFiles = () => {
  return async (dispatch: AppDispatch, getState: Function) => {

      const state = getState()
      const scriptAddress = state.chainInfo.data.scriptAddress

      var fileData: Coin[] = []

      Minima.cmd("coins relevant address:"+ scriptAddress + ";", function(respJSON: any) {
      //Minima.cmd("coins;", function(respJSON: any) {

        console.log("blah: ", respJSON, " address: ", scriptAddress)

        if( Minima.util.checkAllResponses(respJSON) ) {


          const coins = respJSON[0].response.coins
          for ( let i = 0; i < coins.length; i++ ) {
            if (coins[i].data.coin.address == scriptAddress) {
              const coin: Coin = {
                hash: coins[i].data.prevstate[0].data,
                block: coins[i].data.inblock
              }
              fileData.push(coin)
            }
          }
        }

        dispatch(write({data: fileData})(GetActionTypes.GET_SUCCESS))
    	})
  }
}
