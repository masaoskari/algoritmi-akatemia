"use client";
import usePyodide from "@/hooks/usePyodide";
import Editor, { OnMount } from "@monaco-editor/react";
import { useRef } from "react";
import * as monaco from "monaco-editor";

type ExcerciseProps = {
  name: string;
  children: string;
  points: number;
  answer: string;
};

export const Excercise = ({
  name,
  children,
  points,
  answer,
}: ExcerciseProps) => {
  const { runPythonCode, output } = usePyodide();
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  const handleEditorDidMount: OnMount = (editor) => {
    editorRef.current = editor;
  };

  const runCode = async () => {
    if (editorRef.current) {
      const code = editorRef.current.getValue();
      console.log("Running code:", code);
      await runPythonCode(code);
      console.log("Output:", output);
    }
  };
  return (
    <>
      <h2 className="mt-4">Harjoitus</h2>
      <div className="rounded shadow-lg">
        <div className="rounded-tl-md rounded-tr-md bg-blue-600 flex justify-between items-center p-4">
          <p className="text-white">Nimi</p>
          <p className="text-white">Pisteet: 10</p>
        </div>
        <div className="pl-4">{children}</div>

        <Editor
          className="bg-black"
          width={"500px"}
          options={{
            minimap: { enabled: false },
            glyphMargin: false,
            // Disable unnecessary editor features
            scrollBeyondLastLine: false,
            overviewRulerBorder: false, // Hide overview ruler border
            overviewRulerLanes: 0, // Hide overview ruler lanes
            hideCursorInOverviewRuler: true, // Hide cursor in overview ruler
          }}
          height={"200px"}
          defaultLanguage="python"
          onMount={handleEditorDidMount}
        />

        <button
          className="bg-blue-600 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded ml-4"
          onClick={runCode}
        >
          Suorita
        </button>

        <div
          style={{ whiteSpace: "pre-wrap" }}
          className="m-4 min-h-[200px] shadow-lg"
        >
          <p className="font-semibold pl-4">Konsoli</p>
          <div className="px-4 pb-4">{output}</div>
        </div>
        <br />
      </div>
    </>
  );
};
