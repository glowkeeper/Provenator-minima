import { write } from '../../actions'
import {
  AppDispatch,
  MyServices,
  ChainDataProps,
  ChainDataActionTypes,
  TransactionActionTypes,
  GetActionTypes,
  CheckActionTypes,
  FileProps,
  CheckData,
  Coin
} from '../../types'

import { Config, Transaction, File, Misc } from '../../../config'

import { init as initServer, bootstrap } from '../server/actions'

// @ts-ignore
import { Minima } from './minima'

export const initScript = (random: string) => {
  return async (dispatch: AppDispatch, getState: Function) => {

    const state = getState()
    const status = state.chainInfo.data.status
    const fileContract  = `let this=${random} return false`

    //console.log("in initScript: ", fileContract)

    Minima.cmd("newscript \"" + fileContract + "\";", function(respJSON: any) {

         if( Minima.util.checkAllResponses(respJSON) ) {

          let chainData: ChainDataProps = {
            data: {
              scriptAddress: respJSON[0].response.address.hexaddress,
              status: status
            }
          }

          dispatch(write({data: chainData.data})(ChainDataActionTypes.ADD_DATA))

        } else {

          Minima.log("newscript failed")
        }
    })
  }
}

export const init = () => {
    return async (dispatch: AppDispatch, getState: Function) => {

      Minima.init( function( msg: any ) {

        //console.log(msg)

        if ( msg.event == "connected" ) {

          dispatch(initServer())
          dispatch(bootstrap())
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
          const intViewportWidth = window.innerWidth
          if (thisLine.length > intViewportWidth) {
            const regEx = new RegExp(".{1," + intViewportWidth.toString() + "}", "g")
            console.log(regEx)
            const thisStatus = thisLine.match(regEx)
            if ( thisStatus ) {
              for (let i = 0; i < thisStatus.length; i++ ) {
                status += `${thisStatus[i]}<br/>`
              }
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
            if (props.hash == coins[i].data.prevstate[0].data) {
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
      			"txnstate " + txnId + " 0 " + props.hash + ";" +
      			"txnstate " + txnId + " 1 " + props.name + ";" +
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
              if (props.hash == coins[i].data.prevstate[0].data) {
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

        //console.log("blah: ", respJSON, " address: ", scriptAddress)

        if( Minima.util.checkAllResponses(respJSON) ) {


          const coins = respJSON[0].response.coins
          for ( let i = 0; i < coins.length; i++ ) {
            if (coins[i].data.coin.address == scriptAddress) {
              const coin: Coin = {
                hash: coins[i].data.prevstate[0].data,
                name: coins[i].data.prevstate[1].data,
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
