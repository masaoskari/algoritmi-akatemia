"use client";
import usePyodide from "@/hooks/usePyodide";
import Editor, { OnMount } from "@monaco-editor/react";
import { useRef, useState } from "react";
import { editor } from "monaco-editor";

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
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

  const handleEditorDidMount: OnMount = (editor) => {
    editorRef.current = editor;
  };

  const runCode = async () => {
    if (editorRef.current) {
      const code = editorRef.current.getValue();
      const output = await runPythonCode(code);
      setOutput(output);
      if (onCodeExecution) onCodeExecution(output);
    }
  };

  return (
    <div className="rounded shadow-lg flex flex-col">
      <div className="p-4 pr-8" style={{ height: `${height}px` }}>
        <Editor
          onMount={handleEditorDidMount}
          defaultLanguage="python"
          options={{
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            overviewRulerLanes: 0,
            hideCursorInOverviewRuler: true,
          }}
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
              {output && answer && output.trim() === answer.trim()
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
