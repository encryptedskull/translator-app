import React, { useState, useEffect } from "react";

export default function Operation() {
  const [inputValue, setInputValue] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [isCopied, setCopied] = useState(false);

  function changeValue(e) {
    setInputValue(e.target.value);
  }
  // function copyText() {
  //   const text = document.getElementById("result-box");
  //   text.select();
  //   navigator.clipboard.writeText(text);
  // }
  function copyText() {
    const text = document.getElementById("result-box").value;
    navigator.clipboard
      .writeText(text)
      .then(() => {
        console.log("Text copied to clipboard");
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
      });
    setCopied(true);
  }

  function clearText() {
    setInputValue("");
  }

  useEffect(() => {
    let abortController = new AbortController();
    let signal = abortController.signal;

    if (!inputValue) {
      setTranslatedText("");
      return;
    }

    fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
        inputValue
      )}&langpair=en|ur`,
      { signal }
    )
      .then((res) => res.json())
      .then((data) => {
        setTranslatedText(data.responseData.translatedText);

        if (data && data.responseData && data.responseData.translatedText) {
          setTranslatedText(data.responseData.translatedText);
        } else {
          console.error("Translation data not found:", data);
          setTranslatedText("Translation not available");
        }
      })
      .catch((error) => {
        // console.error("Error fetching translation:", error);

        if (error.name === "AbortError") {
          console.log("Fetch aborted");
        } else {
          console.error("Error fetching translation:", error);
          setTranslatedText("Error fetching translation");
        }
      });

    return () => {
      abortController.abort();
      abortController = null;
    };
  }, [inputValue]);

  return (
    <>
      <div className="header">
        <h1 className="title">Translator</h1>
      </div>

      <div className="main-div">
        {" "}
        <div className="main-div-child-1">
          <textarea
            className="input-tag-eng"
            placeholder="Enter text here"
            value={inputValue}
            onChange={changeValue}
            rows={10}
          />
          <div className="ele-div">
            <p className="paragraph">{`Characters ${inputValue.length}/500`}</p>
          </div>
        </div>
        <div className="main-div-child-2">
          <textarea
            rows={10}
            id="result-box"
            className="input-tag-urdu"
            value={translatedText}
            readOnly
          />
          {translatedText && (
            <div className="ele-btns">
              <button className="res-btn" onClick={copyText}>
                {isCopied ? "Copied" : "Copy"}
              </button>
              <button className="res-btn" onClick={clearText}>
                Clear
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
