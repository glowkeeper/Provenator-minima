import React, { useState, useRef, useEffect } from 'react'
import { useHistory } from "react-router-dom"
import { connect } from 'react-redux'

import Markdown from 'react-markdown'

import SparkMD5 from 'spark-md5'

import Tooltip from '@material-ui/core/Tooltip'
import FileReaderInput from 'react-file-reader-input'

import Grid from '@material-ui/core/Grid'
import RightCircleOutlined from '@ant-design/icons/lib/icons/RightCircleOutlined'
import { Okay } from '../../styles'

import { checkFile } from '../../store/app/blockchain'
import { initialise as checkInitialise } from '../../store/app/check/actions'

import { getDictEntries } from '../../utils'

import { FormHelpers,
         GeneralError,
         Transaction,
         Local,
         Misc,
         File as FileConfig
} from '../../config'

import {
    ApplicationState,
    AppDispatch,
    FileProps,
    PayloadProps,
    CheckProps,
    CheckData,
    TxData } from '../../store/types'

//import { TxHelper } from '../../components/tx/txHelper'

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
    const [isLoading, setIsLoading] = useState(false)
    const [fileEnabled, setFileEnabled] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [submitEnabled, setSubmitEnabled] = useState(false)
    const [fileName, setFileName] = useState("")
    const [hash, setHash] = useState("")
    const [info, setInfo] = useState("")

    let history = useHistory()

    useEffect(() => {

      if ( isFirstRun.current ) {

        isFirstRun.current = false
        props.initialise()

      } else {

        const checkData: CheckData = props.info.data as CheckData
        const checkBlock = checkData.block
        if( checkBlock != "" ) {

            const infoData = getDictEntries(props.info)
            setInfo( infoData )
            setIsLoading(false)
            setFileEnabled(true)
            setSubmitting(false)
            setSubmitEnabled(false)

            if ( checkBlock == FileConfig.noBlock ) {

              const pathAddFile = `${Local.addChecked}/${fileName}/${hash}`
              setTimeout(() => {
                history.push(`${pathAddFile}`)
              }, Misc.delay)

            }
        }
      }

    }, [props.info])

    const getFile = (e: any, results: any) => {

        const [load, file] = results[0]
        setFileName(file.name)

        const blobSlice = File.prototype.slice
        const chunkSize = Misc.chunkSize                             // Read in chunks of 2MB
        const chunks = Math.ceil(file.size / chunkSize)
        let currentChunk = 0
        let spark = new SparkMD5.ArrayBuffer()
        const fileReader = new FileReader()

        fileReader.onload = function (e) {
            //console.log('read chunk nr', currentChunk + 1, 'of', chunks);
            spark.append(e.target!.result as ArrayBuffer)                   // Append array buffer
            currentChunk++

            if (currentChunk < chunks) {
                loadNext()
            } else {
                // Compute hash
                //const hash = '0x' + spark.end()
                const hash = spark.end()
                setHash(hash)
                setIsLoading(false)
                setFileEnabled(true)
                setSubmitting(false)
                setSubmitEnabled(true)
            }
        }

        fileReader.onerror = () => {
            setIsLoading(false)
            setFileEnabled(true)
            setSubmitting(false)
            setSubmitEnabled(false)
            setInfo(`${FileConfig.loadingError}`)
        }

        const loadNext = () => {

            const start = currentChunk * chunkSize
            const end = ((start + chunkSize) >= file.size) ? file.size : start + chunkSize
            fileReader.readAsArrayBuffer(blobSlice.call(file, start, end))
        }

        loadNext()
    }

    const setLoading = () => {

        setIsLoading(true)
        setFileEnabled(false)
        setFileName("")
        setHash("")
        setInfo("")
    }

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
        <h2>{FileConfig.headingCheckFile}</h2>
        <hr />
        <FileReaderInput
          as="binary"
          id="fileInput"
          onChange={getFile}
        >
            <Tooltip title={FileConfig.fileTip}>
                <Okay onClick={setLoading} variant="contained" disabled={!fileEnabled} endIcon={<RightCircleOutlined spin={isLoading}/>}>
                  {FileConfig.getFile}
                </Okay>
            </Tooltip>
        </FileReaderInput>
        <p>
          <b>{FileConfig.fileName}</b>: {fileName}
        </p>
        <p>
          <b>{FileConfig.hash}</b>: {hash}
        </p>
        <Tooltip title={FileConfig.checkTip}>
          <Okay onClick={doSubmit} variant="contained" disabled={!submitEnabled} endIcon={<RightCircleOutlined spin={submitting}/>}>
            {FileConfig.checkFileButton}
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
    info: state.check as PayloadProps,
  }
}

const mapDispatchToProps = (dispatch: AppDispatch): FileDispatchProps => {
  return {
    initialise: () => dispatch(checkInitialise()),
    handleSubmit: (values: FileProps) => dispatch(checkFile(values))
  }
}

export const CheckFile = connect<FileStateProps, FileDispatchProps, {}, ApplicationState>(
  mapStateToProps,
  mapDispatchToProps
)(getFile)
