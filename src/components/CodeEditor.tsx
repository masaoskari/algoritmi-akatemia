"use client";
import usePyodide from "@/hooks/usePyodide";
import Editor, { OnMount } from "@monaco-editor/react";
import { useRef, useState } from "react";
import { editor } from "monaco-editor";
import CodeMirror from "@uiw/react-codemirror";
import { vscodeLight } from "@uiw/codemirror-theme-vscode";
import { pythonLanguage } from "@codemirror/lang-python";
import { EditorView } from "@codemirror/view";
import AceEditor from "react-ace-builds";
// Import a mode (language)
import "ace-builds/src-noconflict/mode-python";

// Import a theme
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
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

  const handleEditorDidMount: OnMount = (editor) => {
    editorRef.current = editor;
  };
  const [userInput, setUserInput] = useState<string>("");
  const onCodeChange = (value: string) => {
    setUserInput(value);
    console.log(value);
  };
  const runCode = async () => {
    //if (editorRef.current) {
    //  const code = editorRef.current.getValue();
    //  const output = await runPythonCode(code);
    //  setOutput(output);
    //  if (onCodeExecution) onCodeExecution(output);
    //}
    const output = await runPythonCode(userInput);
    setOutput(output);
  };

  return (
    <div className="rounded shadow-lg flex flex-col">
      <div className="p-4 pr-8" style={{ height: `${height}px` }}>
        {/*         <CodeMirror
          height={`${height - 20}px`}
          theme={vscodeLight}
          //extensions={[pythonLanguage, EditorView.scrollIntoView(0)] as readonly Extension[]}
          onChange={handleCodeMirrorChange}
          basicSetup={{ foldGutter: false }}
        /> */}
        <AceEditor
          mode="python"
          theme="chrome"
          width="100%"
          height={`${height - 20}px`}
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
