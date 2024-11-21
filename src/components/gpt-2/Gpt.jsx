import React, { useEffect, useRef, useState } from "react";
import * as qna from "@tensorflow-models/qna";
import "@tensorflow/tfjs";

function Gpt({ textToBeExtracted }) {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [model, setModel] = useState(null);
  const [context, setContext] = useState("");
  const [question, setQuestion] = useState("");
  const [retryCount, setRetryCount] = useState(0); // Retry counter

  const inputRef = useRef(null);

  useEffect(() => {
    const loadModel = async () => {
      setLoading(true);
      const cachedModel = localStorage.getItem('model');
      if (cachedModel) {
        setModel(JSON.parse(cachedModel));
        console.log("Model loaded from cache!");
        setLoading(false);
        return;
      }

      try {
        const loadedModel = await qna.load();
        setModel(loadedModel);
        localStorage.setItem('model', JSON.stringify(loadedModel));
        console.log("Model loaded from network!");
      } catch (error) {
        console.error("Error loading model:", error);
        setResponse("Error loading model. Please check your connection.");

        if (retryCount < 3) {
          setRetryCount((prevCount) => prevCount + 1);
          setTimeout(loadModel, 3000);
          return;
        } else {
          setResponse("Failed to load model after multiple attempts.");
        }
      } finally {
        setLoading(false);
      }
    };

    loadModel();
  }, [retryCount]);

  useEffect(() => {
    if (textToBeExtracted) {
      setContext(textToBeExtracted);
    }
  }, [textToBeExtracted]);

  const handleQuestionSubmit = async () => {
    if (!model || !context || !question) return;

    setLoading(true);
    try {
      const answers = await model.findAnswers(question, context);
      setResponse(answers.length > 0 ? answers[0].text : "No answer found.");
    } catch (error) {
      console.error("Error finding the answer:", error);
      setResponse("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-5 space-y-5">
      <h2 className="text-center text-2xl font-bold text-indigo-500">Ask A Question</h2>

      {loading && (
        <div className="flex justify-center">
          <img src="src\assets\aeroplane loading.gif" alt="Loading..." className="h-20 " />
        </div>
      )}

      {!model && !loading && (
        <div className="flex flex-col items-center">
          <p className="text-red-500">Failed to load model. Check your connection.</p>
          <button onClick={() => setRetryCount(0)} className="px-4 py-2 bg-indigo-400 text-white rounded">
            Retry
          </button>
        </div>
      )}

      {model && (
        <div className="space-y-4">
          <div>
            <textarea
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="Enter context..."
              rows="6"
              className="w-full p-2 bg-gray-950 border-2 border-indigo-200 text-cyan-100 rounded-lg"
            ></textarea>
          </div>

          <div>
            <input
              ref={inputRef}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask a question..."
              className="w-full p-2 border rounded-lg"
            />
          </div>

          <div>
            <button
              onClick={handleQuestionSubmit}
              disabled={!context || !question}
              className={`px-4 py-2 w-full rounded ${!context || !question ? "bg-gray-300" : "bg-indigo-500 text-white"}`}
            >
              {loading ? "Finding..." : "Find Answer"}
            </button>
          </div>

          {response && (
            <div className="p-2 bg-green-100 rounded">
              <p className="font-bold">Answer:</p>
              <p>{response}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Gpt;
