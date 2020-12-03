import { write } from '../../actions'

import {
  AppDispatch,
  MyServices,
  Config as MiniDappConfig
} from '../../types'

import { initScript } from '../blockchain'

import { Config, GeneralError, File, Misc } from '../../../config'

// @ts-ignore
import { Minima } from '../blockchain/minima'

export const init = () => {
  return async (dispatch: AppDispatch) => {

    Minima.minidapps.listen( function( msg: any ) {

      if ( msg.action == "post" ) {

        if ( msg.message == `${MyServices.SERVICES}` ) {

          Minima.minidapps.reply( msg.replyid, `${MyServices.HELP} ${MyServices.FILE} ${MyServices.FILES}`)

        } else if ( msg.message == `${MyServices.FILE} ${Config.hexFile}` ) {

          Minima.file.loadHEX(Config.hexFile, function( resp: any ) {

            if (resp.exists) {

              console.log("loading hex: ", resp.data)
              Minima.minidapps.reply( msg.replyid, resp.data)

            } else {

              // Safety net - we shouldn't really get here as a hex file should exist.
              Minima.cmd("random;", function(respJSON: any) {

                if ( Minima.util.checkAllResponses(respJSON) ) {

                  //console.log("generating hex: ", respJSON[0].response.random)
                  Minima.minidapps.reply( msg.replyid, respJSON[0].response.random)
                }
              })

            }
          })

        } else if ( msg.message == `${MyServices.FILES}` ) {

          Minima.file.list( ".", function( resp: any ) {
            //console.log("file listing: ", resp)
            const files = resp.files.map( (item: any) => {
              return {
                name: item.name,
                size: item.size
              }
            })
            const myFiles = {
              root: resp.filepath,
              files: files
            }
            //console.log("my files: ", myFiles)
            const myFilesJSON = JSON.stringify(myFiles)
            Minima.minidapps.reply( msg.replyid, myFilesJSON)
          })

        } else if ( msg.message == `${MyServices.HELP}` ) {

          Minima.minidapps.reply( msg.replyid, "Help")

        } else {

          console.error("Unknown service")
        }
      }

    })
  }
}

export const bootstrap = () => {
  return async (dispatch: AppDispatch) => {

    Minima.file.load(Config.hasInit, function( resp: any ) {

      if(!resp.exists) {

        // must be first run
        Minima.file.load(Config.myConfig, function( resp: any ) {

          //console.log("my config: ", resp)

          if(resp.exists) {

            const myConfig: MiniDappConfig = JSON.parse(resp.data)
            const lastKey = myConfig.lastKey

            console.log("lastkey: ", lastKey)

            //need to fetch data from previous version
            Minima.minidapps.list( function( listMsg: any ) {

              const miniDapps = listMsg.response.minidapps

              let hasInit = false
              for ( let i = 0; i < miniDapps.length; i++ ) {

                if ( miniDapps[i].uid == lastKey ) {

                  console.log("Made it here: ", miniDapps[i].uid, lastKey)

                  Minima.minidapps.send( miniDapps[i].uid, `${MyServices.FILE} ${Config.hexFile}`, function ( fileMsg: any ) {

                    console.log("reply: ", fileMsg)

                    if( fileMsg.response.hasOwnProperty('reply') ) {

                      console.log("replied hex: ", fileMsg.response.reply)

                      Minima.file.saveHEX(fileMsg.response.reply, Config.hexFile, function(resp: any) {

                        if(!resp.success) {

                          console.error(resp)

                        } else {

                          Minima.file.save("", Config.hasInit, function(resp: any) {

                            if(!resp.success) {
                              console.error(resp)
                            }
                          })

                        }

                        dispatch(initHex())
                      })

                    } else {

                      dispatch(initHex())

                    }

                  })
                }
              }
            })

          } else {

            // minidapp.conf should awlays exist, but just in case
            dispatch(initHex())

          }

        })

      } else {

          dispatch(initHex())
      }
    })
  }
}

const initHex = () => {
  return async (dispatch: AppDispatch) => {

    Minima.file.loadHEX(Config.hexFile, function( resp: any ) {

      if(resp.exists) {

        //console.log("loading hex: ", resp)
        dispatch(initScript(resp.data))

      } else {

        Minima.cmd("random;", function(respJSON: any) {

          if( Minima.util.checkAllResponses(respJSON) ) {

            //console.log("generating hex: ", respJSON[0].response.random)
            Minima.file.saveHEX(respJSON[0].response.random, Config.hexFile, function(resp: any) {

              if(!resp.success) {
                console.error(resp)
              }
            })

            dispatch(initScript(respJSON[0].response.random))

          } else {

            // should never get here, but just in case...
            console.log(GeneralError.random)
            dispatch(initScript(""))

          }
        })
      }
    })
  }
}
