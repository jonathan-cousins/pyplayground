# PyPlayground

PyPlayground is a web-based Python code editor and executor that runs entirely in the browser using [Pyodide](https://pyodide.org/) (Python compiled to WebAssembly). It provides a simple, clean interface for writing, executing, and saving Python code without requiring any server-side Python installation.

![PyPlayground Interface](https://github.com/user-attachments/assets/a799149d-320e-4a5b-8ad5-d259ffbad4fa)

## What This Code Does

This application creates an interactive Python programming environment that runs completely in your web browser. Users can:

- **Write Python Code**: Edit Python code in a large text area with syntax highlighting-ready interface
- **Execute Code**: Run Python code instantly in the browser using Pyodide
- **View Output**: See program output, print statements, and error messages in a dedicated output panel
- **Save Work**: Persist code to browser's localStorage for later use
- **Handle Errors**: View Python exceptions and tracebacks formatted clearly

## Features

### Core Functionality
- **Browser-based Python execution** using Pyodide v0.24.1
- **Real-time code execution** with captured stdout and stderr
- **Error handling** with full Python traceback display
- **Local storage persistence** to save and restore code between sessions
- **Clean, responsive UI** with side-by-side editor and output panels

### Technical Highlights
- **No server required** - runs entirely client-side
- **Safe execution environment** with proper stdout/stderr capture
- **Async loading** of Pyodide for optimal performance
- **Exception handling** prevents crashes from invalid Python code

## File Structure

```
pyplayground/
├── index.html      # Main HTML structure and UI layout
├── app.js          # JavaScript application logic and Pyodide integration
├── styles.css      # CSS styling for the interface
└── README.md       # This documentation file
```

## How It Works

### Technical Implementation

1. **Pyodide Integration**: The application loads Pyodide (Python compiled to WebAssembly) from CDN
2. **Code Execution**: User code is executed safely using Python's `exec()` function
3. **Output Capture**: stdout and stderr are captured using Python's `io.StringIO`
4. **Error Handling**: Exceptions are caught and displayed with full tracebacks
5. **State Management**: Code is automatically saved to and restored from localStorage

### Code Flow

```javascript
// Load Pyodide asynchronously
const pyodide = await loadPyodide();

// Execute user code safely
const result = await runAndCapture(pyodide, userCode);

// Display output and errors
displayResults(result.out, result.err);
```

## Usage

### Running the Application

1. **Open in Browser**: Simply open `index.html` in any modern web browser
2. **Wait for Loading**: Pyodide will load automatically (may take a few seconds)
3. **Write Code**: Enter Python code in the text area
4. **Execute**: Click the "Run" button to execute your code
5. **View Output**: Results appear in the black output panel on the right

### Using a Local Server

For best results, serve the files through a local HTTP server:

```bash
# Using Python
python3 -m http.server 8000

# Using Node.js
npx http-server

# Using PHP
php -S localhost:8000
```

Then visit `http://localhost:8000` in your browser.

## Example Usage

Try running this sample code:

```python
# Basic output
print("Hello, Python in the browser!")

# Math operations
import math
result = math.sqrt(16)
print(f"Square root of 16 is: {result}")

# List comprehension
squares = [x**2 for x in range(1, 6)]
print(f"Squares: {squares}")

# Error handling demonstration
try:
    print(10 / 0)
except ZeroDivisionError as e:
    print(f"Caught error: {e}")
```

## Future Enhancements

The code includes a TODO comment indicating planned features:

- **Lesson System**: Load and navigate through programming lessons from a `/lessons` directory
- **Enhanced Editor**: Potential for syntax highlighting and code completion
- **Package Management**: Support for importing additional Python packages
- **Sharing**: Ability to share code snippets via URLs

## Browser Compatibility

PyPlayground works in any modern browser that supports:
- WebAssembly (WASM)
- ES6 modules
- Async/await syntax
- localStorage API

This includes all recent versions of Chrome, Firefox, Safari, and Edge.

## Dependencies

- **Pyodide v0.24.1**: Python runtime compiled to WebAssembly
- **No build tools required**: Pure HTML, CSS, and JavaScript
- **No server-side dependencies**: Runs entirely in the browser

## License

This is an open-source educational project demonstrating client-side Python execution using Pyodide.