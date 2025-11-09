"use client";
import { useCallback, useState, useEffect } from "react";
import AceEditor from "react-ace-builds";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-dracula";
import "ace-builds/src-noconflict/theme-chrome";

type TurtleEditorProps = {
  initialCode?: string;
  height?: number;
  lightMode?: boolean;
};

const exampleCode = `import turtle

turtle.bgcolor("black")
turtle.speed(0)
turtle.hideturtle()

colors = ["red", "orange", "yellow", "lime", "cyan", "blue", "magenta"]

for i in range(100):
    turtle.pencolor(colors[i % 7])
    turtle.circle(i * 1.5)
    turtle.left(45)

turtle.done()
`;

export function TurtleEditor({
  initialCode = exampleCode,
  height = 250,
  lightMode = false,
}: TurtleEditorProps) {
  const [code, setCode] = useState<string>(initialCode);
  const [srcDoc, setSrcDoc] = useState<string>("");
  const [iframeKey, setIframeKey] = useState<number>(0);
  const [consoleOutput, setConsoleOutput] = useState<string>("");

  // Help function to insert timeout checks into Python loops
  const preprocessPythonCode = (pyCode: string) => {
    return pyCode.replace(/(for\s+.*?:|while\s+.*?:)/g, (match) => {
      return `${match}\n    check_timeout()`;
    });
  };

  const buildHtml = useCallback(
    (pyCode: string) => {
      const processedCode = preprocessPythonCode(pyCode);
      const bgColor = lightMode ? "white" : "#282a36"; // Match editor background color
      return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <script src="https://cdn.jsdelivr.net/npm/brython@3.12.1/brython.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/brython@3.12.1/brython_stdlib.min.js"></script>
    <style>
      html, body {
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0;
        padding: 0;
        background-color: ${bgColor};
        height: 100%;
        border-radius: 1rem;
      }
    </style>
  </head>
  <body onload="brython()" style="margin:0; padding:0;">
    <script type="text/python">
from browser import window
import sys
import time

class ConsoleStream:
    def write(self, data):
        window.parent.postMessage(
            { "type": "stdout", "message": data },
            "*"
        )
    def flush(self):
        pass

sys.stdout = ConsoleStream()
sys.stderr = ConsoleStream()

start_time = time.time()
timeout = 5

def check_timeout():
    if time.time() - start_time > timeout:
        raise TimeoutError("Execution timed out after 5 seconds")

try:
    exec("""
${processedCode}
    """)
except Exception as e:
    window.parent.postMessage(
        {
            "type": "error",
            "message": str(e),
            "line": getattr(e, "lineno", 0),
            "column": getattr(e, "offset", 0),
        },
        "*"
    )
    </script>
  </body>
</html>`;
    },
    [lightMode]
  );

  const runCode = useCallback(() => {
    const html = buildHtml(code);
    setSrcDoc(html);
    setIframeKey((prevKey) => prevKey + 1); // Force iframe reload
    setConsoleOutput("");
  }, [buildHtml, code]);

  const stopCode = useCallback(() => {
    setSrcDoc("");
    setConsoleOutput("Suoritus keskeytettiin.");
  }, []);

  const handleIframeMessage = useCallback((event: MessageEvent) => {
    if (event.data?.type === "stdout") {
      setConsoleOutput((prev) => `${prev}${event.data.message}`);
    } else if (event.data?.type === "error") {
      setConsoleOutput(
        (prev) =>
          `${prev}\nError: ${event.data.message} (Line: ${event.data.line}, Column: ${event.data.column})`
      );
    }
  }, []);

  useEffect(() => {
    window.addEventListener("message", handleIframeMessage);
    return () => window.removeEventListener("message", handleIframeMessage);
  }, [handleIframeMessage]);

  return (
    <div
      className={`rounded shadow-lg flex flex-col gap-4 ${
        lightMode ? "bg-white" : "bg-background"
      } p-4`}
    >
      <div>
        <AceEditor
          mode="python"
          theme={lightMode ? "chrome" : "dracula"}
          width="100%"
          height={`${height}px`}
          value={code}
          onChange={(v) => setCode(v)}
        />
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          className="w-24 bg-blue-600 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded"
          onClick={runCode}
        >
          Suorita
        </button>
        <button
          type="button"
          className="w-24 bg-red-600 hover:bg-red-900 text-white font-bold py-2 px-4 rounded"
          onClick={stopCode}
        >
          Pysäytä
        </button>
      </div>

      <div
        style={{ whiteSpace: "pre-wrap" }} // Console output for their own lines
        className={`rounded shadow-lg flex flex-col p-4 gap-4 ${
          lightMode
            ? "bg-white text-black"
            : "bg-dracula_bg text-dracula_highlight"
        }`}
      >
        <p
          className={`font-semibold ${lightMode ? "text-black" : "text-white"}`}
        >
          Kilpikonna ikkuna
        </p>
        <div>{consoleOutput}</div>
        <iframe
          key={iframeKey}
          title="turtle-frame"
          srcDoc={srcDoc}
          style={{
            width: "100%",
            height: `${height + 300}px`, // turtle canvas is 500x500
          }}
        />
      </div>
    </div>
  );
}
