import React from 'react'
import { connect } from 'react-redux'

import { init  } from '../store/app/blockchain/actions'

import { ApplicationState, AppDispatch } from '../store/types'

interface ChainInitDispatchProps {
    init: () => void
}

const defaultProps: ChainInitDispatchProps = {
    init: () => {}
}

const app = ( props: ChainInitDispatchProps = defaultProps ) => {

    props.init()
    return null
 }

 const mapDispatchToProps = (dispatch: AppDispatch): ChainInitDispatchProps => {
   return {
     init: () => dispatch(init())
   }
 }

 export const AppInit = connect<{}, ChainInitDispatchProps, {}, ApplicationState>(
   null,
   mapDispatchToProps
 )(app)
