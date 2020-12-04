Minima.minidapps.onReceive( function( msg ) {

  if ( msg.action == "post" && msg.message == "/file .hex" ) {

    Minima.file.loadHEX(".hex", function( resp ) {

      if (resp.exists) {

        Minima.minidapps.reply( msg.replyid, resp.data)

      } else {

        // Safety net - we shouldn't really get here as a hex file should exist.
        Minima.cmd("random;", function( respJSON ) {

          if ( Minima.util.checkAllResponses(respJSON) ) {

            Minima.minidapps.reply( msg.replyid, respJSON[0].response.random)
          }
        })

      }
    })

  }

})
