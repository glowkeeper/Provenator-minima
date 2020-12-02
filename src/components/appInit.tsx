import React from 'react'
import { connect } from 'react-redux'

import { init as chainInit } from '../store/app/blockchain/actions'
import { init as serverInit, bootstrap } from '../store/app/server/actions'

import { ApplicationState, AppDispatch } from '../store/types'

interface ChainInitDispatchProps {
    chainInit: () => void
    serverInit: () => void
    bootstrap: () => void
}

const defaultProps: ChainInitDispatchProps = {
    chainInit: () => {},
    serverInit: () => {},
    bootstrap: () => {}
}

const init = ( props: ChainInitDispatchProps = defaultProps ) => {

    props.chainInit()
    props.serverInit()
    props.bootstrap()
    return null
 }

 const mapDispatchToProps = (dispatch: AppDispatch): ChainInitDispatchProps => {
   return {
     chainInit: () => dispatch(chainInit()),
     serverInit: () => dispatch(serverInit()),
     bootstrap: () => dispatch(bootstrap())
   }
 }

 export const AppInit = connect<{}, ChainInitDispatchProps, {}, ApplicationState>(
   null,
   mapDispatchToProps
 )(init)
