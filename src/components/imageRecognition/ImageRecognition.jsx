import React from 'react'
import { Link } from 'react-router-dom'
import { useRef, useEffect, useState } from 'react'
import * as mobilenet from '@tensorflow-models/mobilenet'
import * as tf from '@tensorflow/tfjs'



function ImageRecognition() {

  const [isModelLoading, setIsModelLoading] = useState(false)
  const [model, setModel] = useState(null)
  const [imageUrl, setImageUrl] = useState(null)
  const [results, setResults] = useState([])


  const imageRef = useRef(null)
  const textInputRef = useRef(null)

  const loadModel = async () => {
    setIsModelLoading(true)
    try {
      const model = await mobilenet.load()
      setModel(model)
      setIsModelLoading(false)
    } catch (error) {
      console.log('ERROR', error)
      setIsModelLoading(false)
    }
  }

  const uploadImage = (e) => {
    const files = e.target.files
    if (files.length > 0) {
      const url = URL.createObjectURL(files[0])
      setImageUrl(url)
    } else {
      setImageUrl(null)
    }
  }

  const identifier = async () => {
    textInputRef.current.value = ''
    const results = await model.classify(imageRef.current)
    setResults(results)
  }

  const handleOnChange = (e) => {
    setImageUrl(e.target.value)
    setResults([])
  }

  useEffect(() => {
    loadModel()
  }, [])

  if (isModelLoading) {
    return (
      <div className='flex items-center justify-center p-2'><img src="src\assets\aeroplane loading.gif" alt="" className='h-20 ' /></div>
    )
  }
  if (!model) {
    return (
      <section className="flex items-center justify-center w-full min-h-screen">
        <div className="container flex flex-col items-center">
          <div className="flex flex-col gap-6 max-w-md text-center">
            <h2 className="font-extrabold text-9xl text-gray-600">
              <span className="sr-only">Error Occurred While Fetching Model</span>404
            </h2>
            <p className="text-2xl md:text-3xl text-gray-600">Sorry, we couldn't load the model.</p>
            <p className="text-2xl md:text-3xl text-gray-600">Please check your internet connection :(</p>
            <Link to='/' className="px-8 py-4 text-xl font-semibold rounded bg-purple-600 text-gray-50 hover:text-gray-200">Back to home</Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <div className='p-2 flex flex-col'>
        <div className='w-full flex gap-2 flex-col p-2 '>
          <h2 class="flex flex-row flex-nowrap items-center">
            <span class="flex-grow block border-t border-white"></span>
            <span class="flex-none block mx-4 px-4 py-2.5 text-xl rounded leading-none font-medium bg-gradient-to-r from-indigo-400 to-pink-600 ">
              Image Recognition
            </span>
            <span class="flex-grow block border-t border-white"></span>
          </h2>
          <div className='p-2 flex flex-row items-center gap-2 w-full'>
            <div class="rounded-md p-2 shadow-md ">
              <label for="upload" class="flex flex-col items-center gap-2 cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 fill-white stroke-indigo-500" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span class="text-gray-600 font-medium">Upload file</span>
              </label>
              <input id="upload" type="file" class="hidden" onChange={uploadImage} />
            </div>

            <span className='font-semibold text-lg'>OR</span>

            <div className="p-4 rounded-lg">
              <div className="relative bg-inherit">
                <input type="text" id="username" name="username" className="peer bg-transparent h-10 w-72 rounded-lg text-gray-200 placeholder-transparent ring-2 px-2 ring-blue-400 focus:ring-sky-600 focus:outline-none focus:border-rose-600" placeholder="Type inside me" ref={textInputRef} onChange={handleOnChange} /><label for="username" className="absolute cursor-text left-0 -top-3 text-sm text-gray-500 bg-inherit mx-1 px-1 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-2 peer-focus:-top-3 peer-focus:text-sky-600 peer-focus:text-sm transition-all">Type inside me</label>
              </div>
            </div>
          </div>
        </div>



        <div className="max-w-screen-xl mx-auto p-5 sm:p-10 md:p-16">

          <div className="rounded overflow-hidden flex flex-col max-w-xl mx-auto">

            {
              imageUrl && (
                <img className="w-full hover:shadow-xl hover:-translate-y-1 hover:transition duration-150" src={imageUrl} ref={imageRef} alt="uploadPreview" crossOrigin='anonymous' />
              )
            }

            <div className="relative -mt-16 px-10 pt-5 pb-3 bg-blue-50 hover:transition duration-150 hover:bg-blue-100 hover:shadow-xl hover:-translate-y-1 shadow-md m-10">

              {
                results && results.length > 0 && (
                  results.map((prediction, index) => {
                    return (
                      <ul className='flex flex-col gap-3 '>
                        {
                          <li key={index} className=' '>
                            <span className='font-semibold text-lg'>Name:</span>
                            <span className='capitalized'>{prediction.className} </span><br />
                            <span className='font-semibold'>{(prediction.probability * 100).toFixed(2)}% Correct</span>

                          </li>
                        }
                      </ul>
                    )
                  })
                )
              }


            </div>

          </div>

        </div>
        <div className='w-full flex items-center justify-center'>

          {
            imageUrl && (
              <button className='p-2 bg-sky-500 md:text-base text-sm -mt-3 text-white w-1/5 shadow-md hover:transition duration-150 hover:-translate-y-1 hover:shadow-xl' onClick={identifier}>Submit</button>
            )
          }
        </div>
      </div>
    </>

  )
}
export default ImageRecognition
