const Module = {
  locateFile (filename) {
    return './public/' + filename
  }
}

let hasSimd
let hasThreads
let yolov5ModuleName

let wasmModuleLoaded = false
const wasmModuleLoadedCallbacks = []

Module.onRuntimeInitialized = function () {
  wasmModuleLoaded = true
  for (let i = 0; i < wasmModuleLoadedCallbacks.length; i++) {
    wasmModuleLoadedCallbacks[i]()
  }
}

wasmFeatureDetect.simd().then(simdSupported => {
  hasSimd = simdSupported

  wasmFeatureDetect.threads().then(threadsSupported => {
    hasThreads = threadsSupported

    if (hasSimd) {
      if (hasThreads) {
        yolov5ModuleName = 'yolov5-simd-threads'
      } else {
        yolov5ModuleName = 'yolov5-simd'
      }
    } else {
      if (hasThreads) {
        yolov5ModuleName = 'yolov5-threads'
      } else {
        yolov5ModuleName = 'yolov5-basic'
      }
    }

    console.log('load ' + yolov5ModuleName)

    const yolov5wasm = 'public/' + yolov5ModuleName + '.wasm'
    const yolov5js = 'public/' + yolov5ModuleName + '.js'

    fetch(yolov5wasm)
      .then(response => response.arrayBuffer())
      .then(buffer => {
        Module.wasmBinary = buffer
        const script = document.createElement('script')
        script.src = yolov5js
        script.onload = function () {
          console.log('Emscripten boilerplate loaded.')
        }
        document.body.appendChild(script)
      })
  })
})

let shouldFaceUser = true
let stream = null
const w = 640
let h = 480

let dst = null
let video
let canvas
let ctx
let switchcamerabtn
window.addEventListener('DOMContentLoaded', function () {
  let isStreaming = false
  switchcamerabtn = document.getElementById('switch-camera-btn')
  video = document.getElementById('video')
  canvas = document.getElementById('canvas')
  ctx = canvas.getContext('2d')

  // Wait until the video stream canvas play
  video.addEventListener('canplay', function (e) {
    if (!isStreaming) {
      // videoWidth isn't always set correctly in all browsers
      if (video.videoWidth > 0) h = video.videoHeight / (video.videoWidth / w)
      canvas.setAttribute('width', w)
      canvas.setAttribute('height', h)
      isStreaming = true
    }
  }, false)

  // Wait for the video to start to play
  video.addEventListener('play', function () {
    // Setup image memory
    const id = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const d = id.data

    if (wasmModuleLoaded) {
      mallocAndCallSFilter()
    } else {
      wasmModuleLoadedCallbacks.push(mallocAndCallSFilter)
    }

    function mallocAndCallSFilter () {
      if (dst != null) {
        _free(dst)
        dst = null
      }

      dst = _malloc(d.length)

      // console.log("What " + d.length);

      sFilter()
    }
  })

  // check whether we can use facingMode
  const supports = navigator.mediaDevices.getSupportedConstraints()
  if (supports.facingMode === true) {
    switchcamerabtn.disabled = false
  }

  switchcamerabtn.addEventListener('click', function () {
    if (stream == null) { return }

    stream.getTracks().forEach(t => {
      t.stop()
    })

    shouldFaceUser = !shouldFaceUser
    capture()
  })

  capture()
})

function capture () {
  const constraints = { audio: false, video: { width: 640, height: 480, facingMode: shouldFaceUser ? 'user' : 'environment' } }
  navigator.mediaDevices.getUserMedia(constraints)
    .then(function (mediaStream) {
      const video = document.querySelector('video')
      stream = mediaStream
      video.srcObject = mediaStream
      video.onloadedmetadata = function (e) {
        video.play()
      }
    })
    .catch(function (err) {
      console.log(err.message)
    })
}

function ncnnYolov5 () {
  const canvas = document.getElementById('canvas')
  const ctx = canvas.getContext('2d')

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const data = imageData.data

  HEAPU8.set(data, dst)

  _yolov5_ncnn(dst, canvas.width, canvas.height)

  const result = HEAPU8.subarray(dst, dst + data.length)
  imageData.data.set(result)
  ctx.putImageData(imageData, 0, 0)
}

// Request Animation Frame function
function sFilter () {
  if (video.paused || video.ended) return

  ctx.fillRect(0, 0, w, h)
  ctx.drawImage(video, 0, 0, w, h)

  ncnnYolov5()

  window.requestAnimationFrame(sFilter)
}
