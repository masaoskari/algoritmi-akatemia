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
        {children}

        <Editor
          className="bg-black"
          width={"500px"}
          options={{
            minimap: { enabled: false },
          }}
          height={"200px"}
          defaultLanguage="python"
          onMount={handleEditorDidMount}
        />

        <button
          className="bg-blue-600 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded"
          onClick={runCode}
        >
          Suorita
        </button>

        <p style={{ whiteSpace: "pre-wrap" }}>{output}</p>
      </div>
    </>
  );
};
