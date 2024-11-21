import React, { useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import * as cocossd from '@tensorflow-models/coco-ssd';
import { Link } from 'react-router-dom';

function ObjRecognition() {
  const [loading, setLoading] = useState(false);
  const [responses, setResponses] = useState([]);
  const [model, setModel] = useState(null);
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  const loadModel = async () => {
    setLoading(true);
    try {
      const loadedModel = await cocossd.load();
      setModel(loadedModel);
      console.log('Model Loaded!');
      setLoading(false);
    } catch (error) {
      console.error('Error loading the model:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadModel();
  }, []);

  useEffect(() => {
    let animationFrameId;

    const detect = async () => {
      if (
        webcamRef.current &&
        webcamRef.current.video.readyState === 4
      ) {
        const video = webcamRef.current.video;
        const videoWidth = webcamRef.current.video.videoWidth;
        const videoHeight = webcamRef.current.video.videoHeight;

        webcamRef.current.video.width = videoWidth;
        webcamRef.current.video.height = videoHeight;
        canvasRef.current.width = videoWidth;
        canvasRef.current.height = videoHeight;

        const context = canvasRef.current.getContext('2d');
        context.clearRect(0, 0, videoWidth, videoHeight);

        try {
          const detections = await model.detect(video);

          setResponses(detections);

          detections.forEach((detection) => {
            const [x, y, width, height] = detection.bbox;
            context.beginPath();
            context.rect(x, y, width, height);
            context.lineWidth = 2;
            context.strokeStyle = 'blue';
            context.fillStyle = 'blue';
            context.stroke();
            context.fillText(
              `${detection.class} (${(detection.score * 100).toFixed(2)}%)`,
              x,
              y > 10 ? y - 5 : 10
            );
          });
        } catch (error) {
          console.error('Error during detection:', error);
        }
      }

      animationFrameId = requestAnimationFrame(detect);
    };

    if (model) {
      animationFrameId = requestAnimationFrame(detect);
    }

    return () => cancelAnimationFrame(animationFrameId);
  }, [model]);

  if (loading) {
    return (
      <div className='w-full flex justify-center items-center p-2 mt-3'>
        <img src="src\assets\aeroplane loading.gif" alt="Loading Model..." className='h-20' />
      </div>
    );
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
    <div className='flex flex-col items-center w-full gap-3'>
      <div className='mt-3'>
        <h2 className="flex flex-row flex-nowrap items-center">
          <span className="flex-grow block border-t border-white"></span>
          <span className="flex-none block mx-4 px-4 py-2.5 text-xl rounded leading-none font-medium bg-gradient-to-t from-indigo-400 to-pink-600 text-white">
            Object Recognition
          </span>
          <span className="flex-grow block border-t border-white"></span>
        </h2>
      </div>
      <div className='relative w-[640px] h-[400px] flex items-center justify-center'>
        <Webcam ref={webcamRef} className='absolute w-full h-full' />
        <canvas ref={canvasRef} className='absolute w-full h-full' />
      </div>
      <div className='w-full flex items-center justify-center'>
        <div className='border-b-2 border-blue-600 p-2'>
          {responses.length > 0 ? (
            responses.map((res, index) => (
              <h3 key={index} className='text-white r'>
                <span className='text-white'>The object is </span>
                <span className='font-semibold text-white'>{`${res.class}`}</span> with confidence: {`${(res.score * 100).toFixed(2)}%`}
              </h3>
            ))
          ) : (
            <h3 className='text-white'>No objects detected.</h3>
          )}
        </div>
      </div>
      <img src="https://assets.website-files.com/63904f663019b0d8edf8d57c/63905b9f809b5c8180ce30c5_pattern-1.svg" alt="" className="absolute bottom-0 left-0 right-auto top-auto -z-10 inline-block md:bottom-1/2 md:left-0 md:right-auto md:top-auto" />
      <img src="https://assets.website-files.com/63904f663019b0d8edf8d57c/63905ba1538296b3f50a905e_pattern-2.svg" alt="" className="absolute bottom-auto left-auto right-0 top-0 -z-10 hidden sm:inline-block" />
    </div>
  );
}

export default ObjRecognition;
