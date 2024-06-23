import { useContext, useState } from "react";
import { PyodideContext } from "@/context/PyodideProvider";

function usePyodide() {
  const { pyodide, isPyodideLoading, hasLoadPyodideBeenCalled } =
    useContext(PyodideContext);
  const [output, setOutput] = useState(null);
  const runPythonCode = async (code: string) => {
    await pyodide.runPythonAsync(`
      import sys
      import io
      sys.stdout = io.StringIO()
    `);

    /* https://github.com/pyodide/pyodide/issues/758 */
    await pyodide.runPythonAsync(`
      from js import prompt
      def input_fixed(text):
          return prompt(text)
      input = input_fixed
      __builtins__.input = input_fixed
    `);

    try {
      await pyodide.runPythonAsync(code);
      let result = await pyodide.runPythonAsync("sys.stdout.getvalue()");
      setOutput(result);
    } catch (error) {
      await pyodide.runPythonAsync(`
        import traceback
        def get_traceback():
            return ''.join(traceback.format_exception(sys.last_type, sys.last_value, sys.last_traceback))
      `);
      let traceback = await pyodide.runPythonAsync("get_traceback()");
      setOutput(traceback.toString());
    }
  };

  return { output, runPythonCode };
}

export default usePyodide;
