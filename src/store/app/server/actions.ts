import { write } from '../../actions'

import {
  AppDispatch,
  MyServices
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

          Minima.minidapps.reply( msg.replyid, `${MyServices.HELP} ${MyServices.FILES}`)

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

        }  else if ( msg.message == `${MyServices.HELP}` ) {

          Minima.minidapps.reply( msg.replyid, "How can I help you, my son?")

        } else {

          console.error("unknown service")
        }
      }

    })
  }
}

export const bootstrap = () => {
  return async (dispatch: AppDispatch) => {

    Minima.file.load(Config.hasInit, function( resp: any ) {

      //console.log("loadFile: ", resp)

      if(!resp.exists) {

        Minima.file.save("", Config.hasInit, function(resp: any) {

          if(!resp.success) {
            console.error(resp)
          }

          //need to fetch data from previous version
          Minima.minidapps.list( function( listMsg: any ) {

            const miniDapps = listMsg.response.minidapps

            for ( let i = 0; i < miniDapps.length; i++ ) {

              if ( miniDapps[i].name == "Provenator" ) {

                Minima.minidapps.send( miniDapps[i].uid, "/services", function ( msg: any ) {

                  if ( msg.response.reply.includes("/files") ) {

                    Minima.minidapps.send( miniDapps[i].uid, "/files", function ( msg: any ) {

                      console.log("In provenator bootstrap Files: ", msg)

                    })
                  }
                })
              }
            }
          })
        })

      } else {

        // we should already have what we need...
        dispatch(initHex())
      }
    })
  }
}

const initHex = () => {
  return async (dispatch: AppDispatch) => {

    Minima.file.loadHEX(Config.hexFile, function( resp: any ) {

        //console.log("loadFile: ", resp)

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
