// PyPlayground - Browser-based Python code executor using Pyodide
// Main application logic for running Python code in the browser

const outputEl = document.getElementById('output');
const codeEl = document.getElementById('code');
const runBtn = document.getElementById('run');
const saveBtn = document.getElementById('save');

// Start loading Pyodide immediately for better performance
const pyodideReady = loadPyodide();

/**
 * Executes Python code safely in Pyodide with captured output
 * @param {PyodideInterface} pyodide - The loaded Pyodide instance
 * @param {string} src - Python source code to execute
 * @returns {Promise<{out: string, err: string}>} - Captured stdout and stderr
 */
async function runAndCapture(pyodide, src) {
  // Create a Python wrapper that captures stdout/stderr safely
  const wrapper = `
import sys, io, traceback
_out = io.StringIO()
_err = io.StringIO()
_old_out, _old_err = sys.stdout, sys.stderr
sys.stdout, sys.stderr = _out, _err
try:
    exec(__USER_CODE__, globals())
except Exception:
    traceback.print_exc()
finally:
    sys.stdout, sys.stderr = _old_out, _old_err
_output = _out.getvalue()
_error = _err.getvalue()
`;
  // Inject the user code safely into the Python environment
  pyodide.globals.set("__USER_CODE__", src);
  await pyodide.runPythonAsync(wrapper);
  const out = pyodide.globals.get("_output") ?? "";
  const err = pyodide.globals.get("_error") ?? "";
  // Clean up global variables to prevent memory leaks
  pyodide.globals.del("__USER_CODE__");
  pyodide.globals.del("_output");
  pyodide.globals.del("_error");
  return { out: String(out), err: String(err) };
}

/**
 * Main application initialization and event handlers
 */
async function main() {
  const pyodide = await pyodideReady;
  // Restore previously saved code from localStorage
  const saved = localStorage.getItem('pyplayground:code');
  if (saved) codeEl.value = saved;

  // Handle code execution
  runBtn.addEventListener('click', async () => {
    outputEl.textContent = "Running…";
    try {
      const res = await runAndCapture(pyodide, codeEl.value);
      outputEl.textContent = (res.out || "") + (res.err ? "\nERROR:\n" + res.err : "");
    } catch (e) {
      outputEl.textContent = String(e);
    }
  });

  // Handle code saving to localStorage
  saveBtn.addEventListener('click', () => {
    localStorage.setItem('pyplayground:code', codeEl.value);
    outputEl.textContent = "Saved to localStorage";
  });

  // TODO: Load lesson list from /lessons directory and expose navigation UI
}
main();