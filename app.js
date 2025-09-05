const outputEl = document.getElementById('output');
const codeEl = document.getElementById('code');
const runBtn = document.getElementById('run');
const saveBtn = document.getElementById('save');

// start loading pyodide immediately
const pyodideReady = loadPyodide();

async function runAndCapture(pyodide, src) {
  // create a runner in the pyodide namespace that captures stdout/stderr
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
  // inject the user code safely
  pyodide.globals.set("__USER_CODE__", src);
  await pyodide.runPythonAsync(wrapper);
  const out = pyodide.globals.get("_output") ?? "";
  const err = pyodide.globals.get("_error") ?? "";
  // clean up
  pyodide.globals.del("__USER_CODE__");
  pyodide.globals.del("_output");
  pyodide.globals.del("_error");
  return { out: String(out), err: String(err) };
}

async function main() {
  const pyodide = await pyodideReady;
  // restore last saved code
  const saved = localStorage.getItem('pyplayground:code');
  if (saved) codeEl.value = saved;

  runBtn.addEventListener('click', async () => {
    outputEl.textContent = "Running…";
    try {
      const res = await runAndCapture(pyodide, codeEl.value);
      outputEl.textContent = (res.out || "") + (res.err ? "\nERROR:\n" + res.err : "");
    } catch (e) {
      outputEl.textContent = String(e);
    }
  });

  saveBtn.addEventListener('click', () => {
    localStorage.setItem('pyplayground:code', codeEl.value);
    outputEl.textContent = "Saved to localStorage";
  });

  // TODO: load lesson list from /lessons and expose navigation
}
main();