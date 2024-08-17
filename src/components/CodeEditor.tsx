"use client";
import usePyodide from "@/hooks/usePyodide";
import { useState } from "react";
import AceEditor from "react-ace-builds";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-chrome";

type CodeEditorProps = {
  onCodeExecution?: (output: string) => void;
  answer?: string | undefined;
  height?: number; // Height of the editor in pixels
};

export const CodeEditor = ({
  onCodeExecution,
  height = 300,
  answer = undefined,
}: CodeEditorProps) => {
  const { runPythonCode } = usePyodide();
  const [output, setOutput] = useState<string>("");
  const [userInput, setUserInput] = useState<string>("");

  const onCodeChange = (value: string) => {
    setUserInput(value);
    console.log(value);
  };

  const runCode = async () => {
    const output = await runPythonCode(userInput);
    setOutput(output.replace(/\r/g, "").trim());
    if (onCodeExecution) onCodeExecution(output);
  };

  return (
    <div className="rounded shadow-lg flex flex-col">
      <div className="px-4 pb-4">
        <AceEditor
          mode="python"
          theme="chrome"
          width="100%"
          height={`${height}px`}
          onChange={onCodeChange}
          value={userInput}
        />
      </div>
      <button
        className="w-24 bg-blue-600 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded ml-4"
        onClick={runCode}
      >
        Suorita
      </button>
      <div
        style={{ whiteSpace: "pre-wrap" }}
        className="m-4 min-h-[200px] shadow-lg"
      >
        <div className="flex justify-between">
          <p className="font-semibold px-4">Konsoli</p>
          {answer && output ? (
            <p className="font-semibold px-4">
              {output && answer && output === answer.replace(/\r/g, "").trim()
                ? "👍 Oikein"
                : "❌ Väärin"}
            </p>
          ) : null}
        </div>
        <div className="px-4 pb-4">{output}</div>
      </div>
    </div>
  );
};
