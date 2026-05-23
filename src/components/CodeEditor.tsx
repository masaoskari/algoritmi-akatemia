"use client";
import usePyodide from "@/hooks/usePyodide";
import { useState } from "react";
import { checkAnswer } from "@/lib/exerciseUtils";
import { TestSpec, generateTestCode, validateTestSpecs } from "@/lib/testUtils";
import AceEditor from "react-ace-builds";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-chrome";

type CodeEditorProps = {
  onCodeExecution?: (
    output: string,
    testResults: { passed: number; total: number },
  ) => void;
  input?: string[];
  answer?: string | undefined;
  height?: number;
  tests?: TestSpec[];
};

export const CodeEditor = ({
  onCodeExecution,
  height = 300,
  input = [],
  answer = undefined,
  tests,
}: CodeEditorProps) => {
  const { runPythonCode } = usePyodide();
  const [output, setOutput] = useState<string>("");
  const [testResults, setTestResults] = useState<string | null>(null);
  const [userInput, setUserInput] = useState<string>("");

  const onCodeChange = (value: string) => {
    setUserInput(value);
  };

  const runCode = async () => {
    // Validate test specs if they exist
    if (tests && tests.length > 0) {
      const errors = validateTestSpecs(tests);
      if (errors.length > 0) {
        setOutput(`Error in test configuration:\n${errors.join("\n")}`);
        return;
      }

      // Generate and run test code
      const codeToRun = generateTestCode(tests, userInput);
      const result = await runPythonCode(codeToRun, input);
      const passed = (result.match(/✅/g) || []).length;
      setTestResults(result);
      const output = await runPythonCode(userInput, input);
      setOutput(output);
      if (onCodeExecution)
        onCodeExecution(output, { passed: passed, total: tests.length });
      return;
    }

    // Run without tests
    const result = await runPythonCode(userInput, input);
    setOutput(result);
    if (onCodeExecution) onCodeExecution(result, { passed: 0, total: 0 });
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
              {output && answer && checkAnswer(output, answer)
                ? "👍 Oikein"
                : "❌ Väärin"}
            </p>
          ) : null}
        </div>
        <div className="px-4 pb-4">{output}</div>
      </div>
      {testResults && (
        <div
          style={{ whiteSpace: "pre-wrap" }}
          className="m-4 min-h-[200px] shadow-lg"
        >
          <p className="font-semibold px-4">🧪 Testit</p>
          <div className="px-4 pb-4">{testResults}</div>
        </div>
      )}
    </div>
  );
};
