const trainingMenu = document.getElementById('training-menu');
const modalTraining = document.getElementById('modal-training');
const trainingChallengeEl = document.getElementById('training-challenge');
const trainingCodeEl = document.getElementById('training-code');
const trainingRunBtn = document.getElementById('training-run');
const trainingOutputEl = document.getElementById('training-output');
const trainingCloseBtn = document.getElementById('training-close');
// Training feature
trainingMenu.onclick = () => {
  showTrainingModal();
};

function showTrainingModal() {
  // Pick a random completed lesson
  const completedLessons = courses[currentCourseIndex].lessons.filter(l => userProgress.completedLessons.includes(l.title));
  if (completedLessons.length === 0) {
    trainingChallengeEl.textContent = 'Complete some lessons to unlock training challenges!';
    trainingCodeEl.value = '';
    trainingRunBtn.style.display = 'none';
    trainingOutputEl.textContent = '';
  } else {
    const lesson = completedLessons[Math.floor(Math.random() * completedLessons.length)];
    trainingChallengeEl.textContent = `Challenge: ${lesson.assignment}`;
    trainingCodeEl.value = lesson.starterCode;
    trainingRunBtn.style.display = 'inline-block';
    trainingOutputEl.textContent = '';
    trainingRunBtn.onclick = async () => {
      let captured = '';
      const origStdout = pyodide._module.stdout;
      pyodide.setStdout({ batched: (s) => { captured += s; } });
      try {
        await pyodide.runPythonAsync(trainingCodeEl.value);
        trainingOutputEl.textContent = captured.trim();
        if (captured.trim() === lesson.expectedOutput.trim()) {
          trainingOutputEl.textContent += '\n🎉 Correct! Bonus XP: 5';
          userProgress.xp += 5;
          userXpEl.textContent = userProgress.xp + ' XP';
          updateAchievements();
          localStorage.setItem('pyplayground:progress', JSON.stringify(userProgress));
        } else {
          trainingOutputEl.textContent += '\n❌ Output does not match expected.';
        }
      } catch (err) {
        trainingOutputEl.textContent = err;
      } finally {
        pyodide.setStdout(origStdout);
      }
    };
  }
  modalOverlay.style.display = 'block';
  modalTraining.style.display = 'flex';
}
trainingCloseBtn.onclick = () => {
  modalOverlay.style.display = 'none';
  modalTraining.style.display = 'none';
};
// PyPlayground - Boot.dev Style Interactive Learning Platform (Local Overhaul)
let pyodide = null;
let editor = null;
const outputEl = document.getElementById('output');
const runBtn = document.getElementById('run');
const hintBtn = document.getElementById('hint');
const userXpEl = document.getElementById('user-xp');
const userStreakEl = document.getElementById('user-streak');
const lessonListEl = document.getElementById('lesson-list');
const courseListEl = document.getElementById('course-list');
const lessonTitleEl = document.getElementById('lesson-title');
const lessonStoryEl = document.getElementById('lesson-story');
const lessonExplanationEl = document.getElementById('lesson-explanation');
const lessonExamplesEl = document.getElementById('lesson-examples');
const lessonAssignmentEl = document.getElementById('lesson-assignment');
const lessonXpEl = document.getElementById('lesson-xp');
const lessonStatusEl = document.getElementById('lesson-status');
const achievementBarEl = document.getElementById('achievement-bar');
const progressFillEl = document.getElementById('progress-fill');
const sidebarAchievementsEl = document.getElementById('sidebar-achievements');
// Modal elements
const modalOverlay = document.getElementById('modal-overlay');
const modalSuccess = document.getElementById('modal-success');
const modalSuccessMsg = document.getElementById('modal-success-message');
const modalSuccessClose = document.getElementById('modal-success-close');
const modalError = document.getElementById('modal-error');
const modalErrorMsg = document.getElementById('modal-error-message');
const modalErrorClose = document.getElementById('modal-error-close');
const modalHint = document.getElementById('modal-hint');
const modalHintMsg = document.getElementById('modal-hint-message');
const modalHintClose = document.getElementById('modal-hint-close');
const prevLessonBtn = document.getElementById('prev-lesson');
const nextLessonBtn = document.getElementById('next-lesson');

let currentCourseIndex = 0;
let currentLessonIndex = 0;
let userProgress = {
  xp: 0,
  streak: 0,
  completedLessons: [],
  lastCompletedDate: null,
  achievements: []
};

// Expanded course/lesson structure
const courses = [
  {
    id: 1,
    title: "Python Fundamentals",
    lessons: [
      {
        id: 4,
        title: "Scope",
        story: "You enter the Hall of Mirrors, where Boots explains, 'Some magic is local, some is global. Learn the difference to avoid chaos!'",
        explanation: "Variables in Python can be local (inside functions) or global (outside functions). Local variables only exist within their function.",
        examples: "Example: x = 'global'\ndef test():\n    x = 'local'\n    print(x)\ntest()\nprint(x)",
        assignment: "Assignment: Show the difference between local and global variables.",
        xp: 15,
        hint: "x = 'global'\ndef test():\n    x = 'local'\n    print(x)\ntest()\nprint(x)",
        starterCode: "# Demonstrate local and global scope\n",
        solution: "x = 'global'\ndef test():\n    x = 'local'\n    print(x)\ntest()\nprint(x)",
        expectedOutput: "local\nglobal"
      },
      {
        id: 5,
        title: "Testing and Debugging",
        description: "Learn how to test and debug Python code.",
        xp: 15,
        instructions: "Write a function that returns the sum of two numbers and test it.",
        hint: "def add(a, b):\n    return a + b\nprint(add(2, 3))",
        starterCode: "# Write a function and test it\n",
        solution: "def add(a, b):\n    return a + b\nprint(add(2, 3))",
        expectedOutput: "5"
      },
      {
        id: 6,
        title: "Computing",
        description: "Learn the basics of how computers work internally.",
        xp: 10,
        instructions: "Print the result of a simple arithmetic operation.",
        hint: "print(7 * 6)",
        starterCode: "# Print a calculation\n",
        solution: "print(7 * 6)",
        expectedOutput: "42"
      },
      {
        id: 7,
        title: "Comparisons",
        description: "Learn how to compare values and make decisions.",
        xp: 10,
        instructions: "Check if a number is positive, negative, or zero.",
        hint: "n = 0\nif n > 0:\n    print('Positive')\nelif n < 0:\n    print('Negative')\nelse:\n    print('Zero')",
        starterCode: "# Check if n is positive, negative, or zero\nn = 0\n",
        solution: "n = 0\nif n > 0:\n    print('Positive')\nelif n < 0:\n    print('Negative')\nelse:\n    print('Zero')",
        expectedOutput: "Zero"
      },
      {
        id: 8,
        title: "Loops",
        description: "Master the art of reusing code with loops.",
        xp: 15,
        instructions: "Print numbers 1 to 5 using a loop.",
        hint: "for i in range(1, 6):\n    print(i)",
        starterCode: "# Print numbers 1 to 5\n",
        solution: "for i in range(1, 6):\n    print(i)",
        expectedOutput: "1\n2\n3\n4\n5"
      },
      {
        id: 9,
        title: "Lists",
        description: "Learn about Python lists.",
        xp: 10,
        instructions: "Create a list of three fruits and print the second fruit.",
        hint: "fruits = ['apple', 'banana', 'orange']\nprint(fruits[1])",
        starterCode: "# Create a list and print the second item\n",
        solution: "fruits = ['apple', 'banana', 'orange']\nprint(fruits[1])",
        expectedOutput: "banana"
      },
      {
        id: 10,
        title: "Dictionaries",
        description: "Learn about Python dictionaries.",
        xp: 15,
        instructions: "Create a dictionary with two key-value pairs and print one value.",
        hint: "person = {'name': 'Alice', 'age': 30}\nprint(person['name'])",
        starterCode: "# Create a dictionary and print a value\n",
        solution: "person = {'name': 'Alice', 'age': 30}\nprint(person['name'])",
        expectedOutput: "Alice"
      },
      {
        id: 11,
        title: "Sets",
        description: "Master Python sets.",
        xp: 10,
        instructions: "Create a set of three numbers and print its length.",
        hint: "nums = {1, 2, 3}\nprint(len(nums))",
        starterCode: "# Create a set and print its length\n",
        solution: "nums = {1, 2, 3}\nprint(len(nums))",
        expectedOutput: "3"
      },
      {
        id: 12,
        title: "Errors",
        description: "Learn how to handle errors in Python.",
        xp: 15,
        instructions: "Write code that catches and prints an exception.",
        hint: "try:\n    1 / 0\nexcept Exception as e:\n    print(e)",
        starterCode: "# Catch and print an exception\n",
        solution: "try:\n    1 / 0\nexcept Exception as e:\n    print(e)",
        expectedOutput: "division by zero"
      },
      {
        id: 13,
        title: "Practice",
        description: "Practice your skills with a challenge.",
        xp: 20,
        instructions: "Write a function that reverses a string.",
        hint: "def reverse(s):\n    return s[::-1]\nprint(reverse('hello'))",
        starterCode: "# Write a function to reverse a string\n",
        solution: "def reverse(s):\n    return s[::-1]\nprint(reverse('hello'))",
        expectedOutput: "olleh"
      },
      {
        id: 14,
        title: "Quiz",
        description: "Quiz yourself on Python basics.",
        xp: 10,
        instructions: "Print 'True' if 2 + 2 == 4, else 'False'.",
        hint: "print(2 + 2 == 4)",
        starterCode: "# Quiz: is 2 + 2 == 4?\n",
        solution: "print(2 + 2 == 4)",
        expectedOutput: "True"
      },
      {
        id: 15,
        title: "Strings",
        description: "Work with text data in Python.",
        xp: 10,
        instructions: "Concatenate two strings and print the result.",
        hint: "a = 'Hello'\nb = 'World'\nprint(a + ' ' + b)",
        starterCode: "# Concatenate two strings\n",
        solution: "a = 'Hello'\nb = 'World'\nprint(a + ' ' + b)",
        expectedOutput: "Hello World"
      },
      {
        id: 16,
        title: "Input",
        description: "Get input from the user.",
        xp: 10,
        instructions: "Simulate user input by assigning a value to a variable and print it.",
        hint: "color = 'blue'\nprint('Your favorite color is ' + color)",
        starterCode: "# Simulate user input\n",
        solution: "color = 'blue'\nprint('Your favorite color is ' + color)",
        expectedOutput: "Your favorite color is blue"
      },
      {
        id: 17,
        title: "Boolean Logic",
        description: "Learn about boolean values and logic.",
        xp: 15,
        instructions: "Print True if both variables are True.",
        hint: "a = True\nb = True\nprint(a and b)",
        starterCode: "# Print True if both are True\na = True\nb = True\n",
        solution: "a = True\nb = True\nprint(a and b)",
        expectedOutput: "True"
      },
      {
        id: 18,
        title: "Modules",
        description: "Use Python modules.",
        xp: 15,
        instructions: "Import the math module and print the value of pi.",
        hint: "import math\nprint(math.pi)",
        starterCode: "# Import math and print pi\n",
        solution: "import math\nprint(math.pi)",
        expectedOutput: "3.141592653589793"
      },
      {
        id: 19,
        title: "File I/O",
        description: "Read and write files in Python.",
        xp: 20,
        instructions: "Simulate reading a string from a file and print it.",
        hint: "data = 'Hello from file!'\nprint(data)",
        starterCode: "# Simulate file read\n",
        solution: "data = 'Hello from file!'\nprint(data)",
        expectedOutput: "Hello from file!"
      },
      {
        id: 20,
        title: "Final Practice",
        description: "Apply everything you've learned.",
        xp: 25,
        instructions: "Write a function that takes a list and returns the sum of its elements.",
        hint: "def total(lst):\n    return sum(lst)\nprint(total([1,2,3]))",
        starterCode: "# Write a function to sum a list\n",
        solution: "def total(lst):\n    return sum(lst)\nprint(total([1,2,3]))",
        expectedOutput: "6"
      }
    ]
  },
  {
    id: 2,
    title: "Advanced Python",
    lessons: [
      {
        id: 1,
        title: "Functions",
        description: "Define and call functions",
        xp: 20,
        instructions: "Write a function called greet that prints 'Hello from a function!'.",
        hint: "def greet():\n    print('Hello from a function!')\ngreet()",
        starterCode: "# Define a function and call it\n",
        solution: "def greet():\n    print('Hello from a function!')\ngreet()",
        expectedOutput: "Hello from a function!"
      }
    ]
  }
];

// Monaco Editor loader
require.config({ paths: { 'vs': 'https://cdn.jsdelivr.net/npm/monaco-editor@0.44.0/min/vs' } });
require(['vs/editor/editor.main'], function () {
  editor = monaco.editor.create(document.getElementById('monaco-editor'), {
    value: courses[0].lessons[0].starterCode,
    language: 'python',
    theme: 'vs-dark',
    automaticLayout: true
  });
});

// Pyodide loader
async function initPyodide() {
  pyodide = await loadPyodide();
}
initPyodide();

function renderCourseList() {
  courseListEl.innerHTML = '';
  courses.forEach((course, idx) => {
    const li = document.createElement('li');
    li.textContent = course.title;
    li.className = idx === currentCourseIndex ? 'active' : '';
    li.onclick = () => {
      currentCourseIndex = idx;
      renderCourseList();
      renderLessonList();
      loadLesson(0);
    };
    courseListEl.appendChild(li);
  });
}

function renderLessonList() {
  lessonListEl.innerHTML = '';
  const lessons = courses[currentCourseIndex].lessons;
  lessons.forEach((lesson, idx) => {
    const li = document.createElement('li');
    li.textContent = lesson.title;
    li.className = idx === currentLessonIndex ? 'active' : '';
    if (userProgress.completedLessons.includes(lesson.title)) {
      li.innerHTML += ' <span style="color:#10b981;font-weight:bold;">✔</span>';
    }
    li.onclick = () => {
      loadLesson(idx);
      renderLessonList();
    };
    lessonListEl.appendChild(li);
  });
  updateProgressBar();
}

function loadLesson(idx) {
  currentLessonIndex = idx;
  const lesson = courses[currentCourseIndex].lessons[idx];
  lessonTitleEl.textContent = lesson.title;
  lessonStoryEl.textContent = lesson.story || '';
  lessonExplanationEl.textContent = lesson.explanation || '';
  lessonExamplesEl.textContent = lesson.examples || '';
  lessonAssignmentEl.textContent = lesson.assignment || '';
  lessonXpEl.textContent = `XP: ${lesson.xp}`;
  lessonStatusEl.textContent = userProgress.completedLessons.includes(lesson.title) ? '✅ Completed' : '⏳ Incomplete';
  if (editor) editor.setValue(lesson.starterCode);
  outputEl.textContent = '';
  updateNavControls();
}

function updateNavControls() {
  prevLessonBtn.disabled = currentLessonIndex === 0;
  const lessons = courses[currentCourseIndex].lessons;
  nextLessonBtn.disabled = currentLessonIndex === lessons.length - 1;
}

runBtn.onclick = async () => {
  if (!pyodide || !editor) return;
  const code = editor.getValue();
  let captured = '';
  const lesson = courses[currentCourseIndex].lessons[currentLessonIndex];
  // Redirect stdout
  const origStdout = pyodide._module.stdout;
  pyodide.setStdout({
    batched: (s) => { captured += s; }
  });
  try {
    await pyodide.runPythonAsync(code);
    outputEl.textContent = captured.trim();
    // XP logic and feedback
    if (captured.trim() === lesson.expectedOutput.trim()) {
      if (!userProgress.completedLessons.includes(lesson.title)) {
        userProgress.xp += lesson.xp;
        userProgress.completedLessons.push(lesson.title);
        userXpEl.textContent = userProgress.xp + ' XP';
        lessonStatusEl.textContent = '✅ Completed';
        updateAchievements();
        localStorage.setItem('pyplayground:progress', JSON.stringify(userProgress));
        showModal('success', `Lesson complete! XP earned: ${lesson.xp}`);
      } else {
        showModal('success', '✅ Already completed.');
      }
    } else {
      showModal('error', '❌ Output does not match expected.');
    }
  } catch (err) {
    showModal('error', err);
  } finally {
    pyodide.setStdout(origStdout);
  }
};

hintBtn.onclick = () => {
  const lesson = courses[currentCourseIndex].lessons[currentLessonIndex];
  showModal('hint', lesson.hint);
};

// Modal logic
function showModal(type, message) {
  modalOverlay.style.display = 'block';
  if (type === 'success') {
    modalSuccessMsg.textContent = message;
    modalSuccess.style.display = 'flex';
  } else if (type === 'error') {
    modalErrorMsg.textContent = message;
    modalError.style.display = 'flex';
  } else if (type === 'hint') {
    modalHintMsg.textContent = message;
    modalHint.style.display = 'flex';
  }
}
function closeModal() {
  modalOverlay.style.display = 'none';
  modalSuccess.style.display = 'none';
  modalError.style.display = 'none';
  modalHint.style.display = 'none';
}
modalSuccessClose.onclick = closeModal;
modalErrorClose.onclick = closeModal;
modalHintClose.onclick = closeModal;
modalOverlay.onclick = closeModal;

prevLessonBtn.onclick = () => {
  if (currentLessonIndex > 0) {
    loadLesson(currentLessonIndex - 1);
    renderLessonList();
  }
};
nextLessonBtn.onclick = () => {
  const lessons = courses[currentCourseIndex].lessons;
  if (currentLessonIndex < lessons.length - 1) {
    loadLesson(currentLessonIndex + 1);
    renderLessonList();
  }
};

// Achievements logic
function updateAchievements() {
  let achievements = [];
  if (userProgress.xp >= 50) achievements.push('🏅 50 XP!');
  if (userProgress.completedLessons.length === courses[currentCourseIndex].lessons.length) achievements.push('🎓 Course Complete!');
  achievementBarEl.textContent = achievements.join(' | ');
  sidebarAchievementsEl.textContent = achievements.join(' | ');
  userProgress.achievements = achievements;
}

function updateProgressBar() {
  const lessons = courses[currentCourseIndex].lessons.length;
  const completed = userProgress.completedLessons.filter(l => courses[currentCourseIndex].lessons.some(lsn => lsn.title === l)).length;
  const percent = lessons ? Math.round((completed / lessons) * 100) : 0;
  if (progressFillEl) progressFillEl.style.width = percent + '%';
}

function loadProgress() {
  const saved = localStorage.getItem('pyplayground:progress');
  // Dropdown click-to-toggle fallback for mobile/touch
  document.querySelectorAll('.menu-item').forEach(item => {
    const dropdown = item.querySelector('.dropdown');
    if (dropdown) {
      item.addEventListener('click', function (e) {
        // Only toggle if not hovering (for mobile/touch)
        if (window.matchMedia('(hover: none)').matches) {
          e.stopPropagation();
          // Close other open dropdowns
          document.querySelectorAll('.dropdown').forEach(d => {
            if (d !== dropdown) d.style.display = 'none';
          });
          dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
        }
      });
    }
  });

  // Close dropdowns when clicking outside (mobile/touch)
  document.body.addEventListener('click', () => {
    if (window.matchMedia('(hover: none)').matches) {
      document.querySelectorAll('.dropdown').forEach(d => d.style.display = 'none');
    }
  });
  if (saved) {
    userProgress = { ...userProgress, ...JSON.parse(saved) };
    userXpEl.textContent = userProgress.xp + ' XP';
    updateAchievements();
  }
}

loadProgress();
renderCourseList();
renderLessonList();
renderMenuDropdowns();
loadLesson(0);
const chapterDropdown = document.getElementById('chapter-dropdown');
const lessonDropdown = document.getElementById('lesson-dropdown');

function renderMenuDropdowns() {
  // Chapters dropdown
  chapterDropdown.innerHTML = '';
  courses.forEach((course, idx) => {
    const li = document.createElement('li');
    li.textContent = course.title;
    li.onclick = () => {
      currentCourseIndex = idx;
      renderCourseList();
      renderLessonList();
      loadLesson(0);
    };
    chapterDropdown.appendChild(li);
  });
  // Lessons dropdown
  lessonDropdown.innerHTML = '';
  const lessons = courses[currentCourseIndex].lessons;
  lessons.forEach((lesson, idx) => {
    const li = document.createElement('li');
    li.textContent = lesson.title;
    li.onclick = () => {
      loadLesson(idx);
      renderLessonList();
    };
    lessonDropdown.appendChild(li);
  });
}