import React, { useEffect, useRef, useState } from "react";
import axios from "axios"; 

function Gpt({ textToBeExtracted }) {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [context, setContext] = useState("");
  const [question, setQuestion] = useState("");
  const [retryCount, setRetryCount] = useState(0); 

  const inputRef = useRef(null);

  useEffect(() => {
    if (textToBeExtracted) {
      setContext(textToBeExtracted);
    }
  }, [textToBeExtracted]);

  const handleQuestionSubmit = async () => {
    if (!context || !question) return;

    setLoading(true);
    try {
      const response = await axios.post(
        "https://api-inference.huggingface.co/models/deepset/roberta-base-squad2",
        {
          inputs: {
            question: question,
            context: context,
          },
        },
        {
          headers: {
            Authorization: `Bearer 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`,
          },
        }
      );
      
      const answer = response.data.answer || "No answer found.";
      setResponse(answer);
    } catch (error) {
      console.error("Error finding the answer:", error);
      setResponse("Error Finding Answer. Please elaborate the question.");
    } finally {
      setLoading(false);
      setQuestion('')
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

      {!loading && (
        <div className="space-y-4 w-screen flex flex-col items-center justify-center">
          <div className="w-1/3">
            <textarea
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="Enter context..."
              rows="6"
              className="w-full p-2 bg-gray-950 outline-none text-cyan-100 rounded-lg"
            ></textarea>
          </div>

          <div>
            <input
              ref={inputRef}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask a question..."
              className="w-full p-2 outline-none bg-transparent border-2 border-double border-purple-400 text-cyan-300 rounded-lg"
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
            <div className="p-2 bg-green-200 rounded">
              <p className="font-bold">Answer:</p>
              <p className="first-letter:capitalize">{response}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Gpt;
