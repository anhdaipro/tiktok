import React, { FC, memo, useState,useRef } from 'react'

// @ts-ignore
// @ts-ignore
import RecordRTC, {
  // @ts-ignore
  RecordRTCPromisesHandler,
} from 'recordrtc'
import { saveAs } from 'file-saver'

const MainRecorder= () => {
  const [recorder, setRecorder] = useState(null)
  const [stream, setStream] = useState(null)
  const [videoBlob, setVideoUrlBlob] = useState(null)
  const [type, setType] = useState('video')
  const video = useRef(null);
  const startRecording = async () => {
    const mediaDevices = navigator.mediaDevices
    const stream =
      type === 'video'
        ? await mediaDevices.getUserMedia({
            video: true,
            audio: true,
          })
        : await (mediaDevices).getDisplayMedia({
            video: true,
            audio: false,
          })
    const recorder = new RecordRTCPromisesHandler(stream, {
      type: 'video',
    })
    video.current.muted = true;
    video.current.volume = 0;
    video.current.srcObject = stream;
    await recorder.startRecording()
    setRecorder(recorder)
    setStream(stream)

        const blob = await recorder.getBlob()
        setVideoUrlBlob(blob)
        setStream(null)
        setRecorder(null)
      
  }


  const downloadVideo = () => {
    if (videoBlob) {
      const mp4File = new File([videoBlob], 'demo.mp4', { type: 'video/mp4' })
      saveAs(mp4File, `Video-${Date.now()}.mp4`)
      // saveAs(videoBlob, `Video-${Date.now()}.webm`)
    }
  }

  const changeType = () => {
    if (type === 'screen') {
      setType('video')
    } else {
      setType('screen')
    }
  }

  return (
    <div>
      <div
        display="flex"
        justifyContent="center"
        flexDirection={[
          'column', // 0-30em
          'row', // 30em-48em
          'row', // 48em-62em
          'row', // 62em+
        ]}
      >
        <button
          m="1"
          
          size="lg"
          aria-label="start recording"
          color="white"
          onClick={changeType}
        >
          {type === 'screen' ? 'Record Screen' : 'Record Video'}
        </button>
        <span  onClick={startRecording}>hhhhhhhhhh</span>
        <span  >stop</span>
        <span   onClick={downloadVideo}>dowload</span>
      </div>
      <div display="flex" justifyContent="center">
        <div
          bg={!!videoBlob ? 'inherit' : 'blue.50'}
          h="50vh"
          width={[
            '100%', // 0-30em
            '100%', // 30em-48em
            '50vw', // 48em-62em
            '50vw', // 62em+
          ]}
        >
          
            <video ref={video}  />
          
        </div>
      </div>
    </div>
  )
}

export default MainRecorder