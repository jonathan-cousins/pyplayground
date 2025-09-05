# PyPlayground

**PyPlayground** is a Boot.dev-style interactive learning platform for Python fundamentals, built as a web app using HTML, CSS, and JavaScript. It leverages [Pyodide](https://pyodide.org/) to run Python code directly in the browser.

## Features

- **Interactive Python Lessons:** Five beginner-friendly lessons covering printing, variables, math, user input, and lists.
- **Live Code Editor:** Write and run Python code in the browser.
- **Progress Tracking:** XP, streaks, and lesson completion are tracked and displayed.
- **Hints & Solutions:** Each lesson provides hints and checks your code output.
- **Modern UI:** Responsive design with a sidebar for lesson navigation and a progress bar.

## Getting Started

1. **Clone the repository:**
   ```sh
   git clone https://github.com/jonathan-cousins/pyplayground.git
   ```
2. **Open `index.html` in your browser.**
   - No server required; all code runs client-side.

## File Structure

- `index.html` — Main HTML file, includes UI and links to Pyodide.
- `styles.css` — Modern, responsive styles.
- `app.js` — App logic, lesson data, code execution, and progress management.

## Technologies Used

- **HTML/CSS/JavaScript**
- **Pyodide** (Python in the browser)
- **LocalStorage** (for saving progress)

## Example Lessons

- Print "Hello, World!"
- Work with variables and strings
- Perform basic math
- Simulate user input
- Use lists and indexing

## License

MIT
