"use client";
import { useState, useEffect } from "react";
import { Rajdhani } from "next/font/google";

const angkor = Rajdhani({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export default function Home() {
  const [tokenCount, setTokenCount] = useState("_");
  const [loading, setLoading] = useState(false);
  const [models, setModels] = useState([]);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);

  function toggleDarkMode() {
    // document.documentElement.classList.add
    document.documentElement.classList.toggle("dark");
    document.getElementById("light").classList.toggle("hidden");
    document.getElementById("dark").classList.toggle("hidden");
  }

  function countTokens(e) {
    e.preventDefault();
    if (document.querySelector("textarea").value === "") {
      alert("Please enter some text to count tokens.");
      return;
    }

    if (loading) return;
    setErrorMessage(false);

    document.getElementById("submit").disabled = true;
    document.getElementById("submit").innerText = "Counting Tokens...";
    setLoading(true);
    setTokenCount("Counting...");
    let text = document.querySelector("textarea").value;
    let model = document.querySelector("select").value;
    let url = `https://geminitokencounterapi.vercel.app/tokenize`;
    //let url = `http://127.0.0.1:5000/tokenize`;
    let data = {
      text: text,
      model: model,
    };

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.error) {
          setErrorMessage(data.message);
        }
        setTokenCount(data.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    setLoading(false);

    document.getElementById("submit").disabled = false;
    document.getElementById("submit").innerText = "Count Tokens";
  }

  useEffect(() => {
    const getAllModels = async () => {
      setModelsLoaded(false);
      let url = `https://geminitokencounterapi.vercel.app/listmodels`;
      //let url = `http://127.0.0.1:5000/listmodels`;
      try {
        const response = await fetch(url);
        const data = await response.json();
        // lets remove vision, embedding, audio etc
        const doNotInclude = ["vision", "audio", "veo", "embedding"];
        const fileteredModels = data.models.filter((model) => {
          if (
            !model.model_name.includes("vision") &&
            !model.model_name.includes("embedding") &&
            !model.model_name.includes("audio") &&
            !model.model_name.includes("veo") &&
            !model.model_name.includes("image")
          ) {
            return model;
          }
        });
        setModels(fileteredModels);
        setModelsLoaded(true);
      } catch (error) {
        setModels([]);
        setModelsLoaded(true);
        setErrorMessage("Error Loading Models, Please try again later");
      }
    };
    getAllModels();
  }, []);

  // let models = [
  //   "gemini-1.0-pro",
  //   "gemini-1.0-pro-001",
  //   "gemini-1.0-pro-latest",
  //   "gemini-1.5-pro-latest",
  //   "gemini-pro",
  // ];

  //https://counttokens.vercel.app/tokenize

  return (
    <main
      className={` md:w-[75%] mx-auto w-full flex min-h-[98%] flex-col items-center md:px-24 px-4 py-4 md:gap-y-7 gap-y-3`}
    >
      <div className="self-end">
        <button
          onClick={toggleDarkMode}
          id="light"
          className="p-2 rounded-full"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
            />
          </svg>
        </button>

        <button
          onClick={toggleDarkMode}
          id="dark"
          className="p-2 hidden rounded-full"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
            />
          </svg>
        </button>
      </div>
      <h1
        className={`${angkor.className} text-center md:text-6xl rounded text-4xl font-bold text-white bg-orange-600 p-4`}
      >
        Google Gemini Token Counter
      </h1>
      <p className={`text-2xl  text-justify dark:font-thin`}>
        Simple Tool to count number of tokens in google gemini text based
        models. This is based on count_tokens api from{" "}
        <a
          href="https://ai.google.dev/api/python/google/generativeai/GenerativeModel#count_tokens"
          target="_blank"
          className="font-bold underline"
        >
          Google{" "}
        </a>
      </p>
      {!modelsLoaded && (
        <div className="mx-auto md:w-[500px] rounded-md border border-gray-300 p-4">
          <p className="text-xl text-center p-4">Loading Models....</p>
          <div className="flex  animate-pulse space-x-4">
            <div className="flex-1 space-y-6 py-1 justify-center">
              <div className="h-[50px] rounded bg-gray-200"></div>
              <div className="h-[250px] rounded bg-gray-200"></div>

              <div className="h-[40px] rounded bg-gray-200"></div>
            </div>
          </div>
        </div>
      )}
      {modelsLoaded && (
        <form onSubmit={countTokens} className="md:w-[500px]">
          <h2 className={`md:text-4xl text-center  text-2xl`}>Select Model</h2>

          <p className="text-center  pb-4">
            ( Models Available : {models.length})
          </p>

          <select
            className={`rounded-md p-2 w-full outline-none  h-10 md:h-12 focus:ring-2 dark:text-black text-base dark:bg-gray-100 bg-white text-black ring-1 ring-gray-400  ring-offset-gray-400 dark:placeholder:text-white placeholder:text-gray-500 mb-4 `}
          >
            {models?.map((item, index) => (
              <option key={index} value={item.model_name}>
                {item.model_name.split("/")[1]}
              </option>
            ))}
          </select>

          <textarea
            className={`rounded-md p-2 w-full outline-none  h-52 md:h-64 focus:ring-2 dark:text-black text-base dark:bg-gray-100 bg-white text-black ring-1 ring-gray-400 dark:ring-indigo-600  ring-offset-indigo-600 dark:placeholder:text-gray-500 placeholder:text-gray-500 `}
            placeholder="Start typing... or paste some text here."
            onChange={(e) => {
              let charCount = e.target.value.length;
              document.getElementById(
                "charcount"
              ).innerText = `Characters: ${charCount}`;
              let wordCount = e.target.value.trim().split(" ").length;
              document.getElementById(
                "wordcount"
              ).innerText = `Words: ${wordCount}`;
              setTokenCount("_");
            }}
          />
          <div className="flex justify-between">
            <p className={`md:text-2xl text-xl `} id="charcount">
              Characters:{" "}
            </p>
            <p className={`md:text-2xl text-xl `} id="wordcount">
              Words :{" "}
            </p>
            <p className={`md:text-2xl text-xl `}>
              Tokens :<span className="text-orange-500"> {tokenCount}</span>
            </p>
          </div>
          {errorMessage && (
            <div className="flex justify-center border- [0.5px] border-red-800">
              <span className="font-semibold text-red-700 text-xl">
                {errorMessage}
              </span>
            </div>
          )}
          <button
            type="submit"
            className="bg-orange-600 text-white p-2 rounded-md flex justify-center w-full mt-4"
            disabled={loading}
            id="submit"
          >
            Count Tokens
          </button>
        </form>
      )}
      <h2 className={`md:text-4xl text-center text-2xl`}>Why Count Tokens?</h2>
      <blockquote className="italic text-center text-2xl">
        An understanding of tokens is central to using the Gemini API.
      </blockquote>{" "}
      <p className="text-2xl dark:font-thin text-justify">
        <br />
        As of now the documentation states :{" "}
        <span className="font-sans underline underline-offset-4">
          For Gemini models, a token is equivalent to about 4 characters. 100
          tokens are about 60-80 English words.
        </span>
        <br />
        <br />
        More and more LLM models are being used in production. The number of
        tokens is crucial for cost estimation and for understanding the
        capabilities of the model. Also, the pricing is not linear.{" "}
        <span className="underline underline-offset-4">
          More tokens mean more cost.
        </span>
        <br />
        <br />
        Using this simple tool you can get a quick estimate of the cost of your
        prompts and tweak your prompts accordingly.
      </p>
    </main>
  );
}
