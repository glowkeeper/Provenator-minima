
import React, { useState, useRef, useEffect } from 'react'
import { connect } from 'react-redux'
import { useParams } from 'react-router-dom'

import Markdown from 'react-markdown'

import SparkMD5 from 'spark-md5'

import Tooltip from '@material-ui/core/Tooltip'

import Grid from '@material-ui/core/Grid'
import RightCircleOutlined from '@ant-design/icons/lib/icons/RightCircleOutlined'
import { Okay } from '../../styles'

import { addFile } from '../../store/app/blockchain'
import { initialise as txInitialise } from '../../store/app/tx/actions'

import { getDictEntries } from '../../utils'

import { FormHelpers, GeneralError, Transaction, Local, Misc, File as FileConfig } from '../../config'

import {
    ApplicationState,
    AppDispatch,
    FileProps,
    PayloadProps,
    TxData
} from '../../store/types'

interface FileStateProps {
  info: PayloadProps
}

interface FileDispatchProps {
  initialise: () => void
  handleSubmit: (values: FileProps) => void
}

type Props =  FileDispatchProps & FileStateProps

const getFile = (props: Props) => {

    let isFirstRun = useRef(true)
    const [submitting, setSubmitting] = useState(false)
    const [submitEnabled, setSubmitEnabled] = useState(true)
    const {fileName, hash} = useParams()
    const [info, setInfo] = useState("")

    useEffect(() => {

      if ( isFirstRun.current ) {

        isFirstRun.current = false
        props.initialise()

      } else {

        const txData: TxData = props.info.data as TxData
        if( txData.txId != "" ) {
            const infoData = getDictEntries(props.info)
            setInfo( infoData )
            setSubmitting(false)
            setSubmitEnabled(false)
        }
      }

    }, [props.info])


    const doSubmit = () => {

      setSubmitting(true)
      setSubmitEnabled(false)
      props.initialise()

      const fileInfo: FileProps = {
          hash: hash,
          name: fileName
      }
      props.handleSubmit(fileInfo)

    }

    return (
      <>
        <h2>{FileConfig.headingAddFile}</h2>
        <hr />
        <p>
          <b>{FileConfig.fileName}</b>: {fileName}
        </p>
        <p>
          <b>{FileConfig.hash}</b>: {hash}
        </p>
        <Tooltip title={FileConfig.submitTip}>
          <Okay onClick={doSubmit} variant="contained" disabled={!submitEnabled} endIcon={<RightCircleOutlined spin={submitting}/>}>
            {FileConfig.addFileButton}
          </Okay>
        </Tooltip>
        <hr />
        <Markdown escapeHtml={false} source={info} />
      </>
    )
}

const mapStateToProps = (state: ApplicationState): FileStateProps => {
  //console.log(state.orgReader)
  return {
    info: state.tx as PayloadProps,
  }
}

const mapDispatchToProps = (dispatch: AppDispatch): FileDispatchProps => {
  return {
    initialise: () => dispatch(txInitialise()),
    handleSubmit: (values: FileProps) => dispatch(addFile(values))
  }
}

export const AddCheckedFile = connect<FileStateProps, FileDispatchProps, {}, ApplicationState>(
  mapStateToProps,
  mapDispatchToProps
)(getFile)
