import { useContext } from "react";
import { PyodideContext } from "@/context/PyodideProvider";

function usePyodide() {
  const { pyodide } = useContext(PyodideContext);

  const initializePythonEnvironment = async () => {
    await pyodide.runPythonAsync(`
      import sys
      import io
      import json
      import time
      sys.stdout = io.StringIO()
      
      class TimeoutError(Exception):
          pass
      
      execution_start_time = None
      timeout_seconds = 1
      
      def timeout_trace(frame, event, arg):
          global execution_start_time, timeout_seconds
          
          if execution_start_time and time.time() - execution_start_time > timeout_seconds:
              raise TimeoutError("Code execution timed out")
          
          return timeout_trace
      
      def start_timeout_monitoring():
          global execution_start_time
          execution_start_time = time.time()
          sys.settrace(timeout_trace)
      
      def stop_timeout_monitoring():
          sys.settrace(None)
    `);
  };

  const setupMockInput = async (input: string[]) => {
    const predefinedInputs = JSON.stringify(input);
    await pyodide.runPythonAsync(`
      predefined_inputs = json.loads('${predefinedInputs}')
      input_index = 0
  
      def mock_input(prompt=None):
          global input_index
  
          if input_index < len(predefined_inputs):
              response = predefined_inputs[input_index]
              input_index += 1
              print(f"{prompt}{response}")
              return response
          else:
              raise Exception("No more predefined inputs available.")

      # Override the input function
      input = mock_input
      __builtins__.input = mock_input
    `);
  };

  /* https://github.com/pyodide/pyodide/issues/758 */
  const setupPromptInput = async () => {
    await pyodide.runPythonAsync(`
      from js import prompt
      def input_fixed(text):
          return prompt(text)
      input = input_fixed
      __builtins__.input = input_fixed
    `);
  };

  const executePythonCode = async (code: string, timeoutMs: number = 1000) => {
    try {
      await pyodide.runPythonAsync(`
        timeout_seconds = ${timeoutMs / 1000}
        start_timeout_monitoring()
      `);

      await pyodide.runPythonAsync(code);

      await pyodide.runPythonAsync("stop_timeout_monitoring()");

      let result = await pyodide.runPythonAsync("sys.stdout.getvalue()");
      return result;
    } catch (error: any) {
      await pyodide.runPythonAsync("stop_timeout_monitoring()");

      if (error.toString().includes("TimeoutError")) {
        return `Error: Koodin suoritus keskeytettiin, koska se ylitti aikarajan (katso, että koodisi ei sisällä ikuisia silmukoita 🔄)`;
      } else {
        try {
          await pyodide.runPythonAsync(`
            import traceback
            def get_traceback():
                return ''.join(traceback.format_exception(sys.last_type, sys.last_value, sys.last_traceback))
          `);
          let traceback = await pyodide.runPythonAsync("get_traceback()");
          return traceback.toString();
        } catch (tracebackError) {
          return error.toString();
        }
      }
    }
  };

  const runPythonCode = async (code: string, input?: string[]) => {
    await initializePythonEnvironment();

    if (input && input.length > 0) {
      await setupMockInput(input);
    } else {
      await setupPromptInput();
    }

    return await executePythonCode(code);
  };

  return { runPythonCode };
}

export default usePyodide;
