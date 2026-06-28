document.addEventListener("DOMContentLoaded", () => {
    // -----------------------------------------------------------------
    // 1. DOM Elements
    // -----------------------------------------------------------------
    const terminalInput = document.getElementById("terminal-input");
    const terminalHistory = document.getElementById("terminal-history");
    const terminalScreen = document.getElementById("terminal-screen");
    const terminalWindow = document.getElementById("hero-terminal");
    const currentDateSpan = document.getElementById("current-date");

    // No quote components (philosophy section replaced by LeetCode)

    const navLinks = document.querySelectorAll("#navigation-list a");
    const sections = document.querySelectorAll("main section");

    // Set the terminal's date display to the current date/time
    if (currentDateSpan) {
        currentDateSpan.textContent = new Date().toUTCString();
    }

    // -----------------------------------------------------------------
    // 2. Interactive Terminal Commands Database
    // -----------------------------------------------------------------
    const commandResponses = {
        help: `
Available commands:
  <span class="highlight">about</span>    - Short biography and technical background
  <span class="highlight">projects</span> - Detailed description of major builds
  <span class="highlight">skills</span>   - Technical proficiency matrix (terminal bars)
  <span class="highlight">leetcode</span> - LeetCode profile link and problem solving stats
  <span class="highlight">contact</span>  - SSH details and contact link channels
  <span class="highlight">clear</span>    - Clear terminal screen history
  <span class="highlight">help</span>     - Display this assistance message
`,
        about: `
<h4 class="highlight" style="margin-top: 5px;">Hicham | Systems Engineer</h4>
--------------------------------------------
Student at <span class="highlight-um6p">UM6P</span> & the <span class="highlight-42">1337 Coding School</span> (42 Network).
Focus areas: Systems programming, customized memory management, and network architecture in C and C++98.
Actively seeking a professional software engineering internship beginning in the next 3 months.
`,
        projects: `
<h4 class="highlight" style="margin-top: 5px;">Major Builds & Codebases</h4>
--------------------------------------------
1. <span class="highlight">ft_irc</span> (C++98)
   A fully functional IRC server implementing RFC 1459.
   Features: Non-blocking socket I/O, custom poll() event loop, client/channel states.
   
2. <span class="highlight">Inception</span> (Docker Compose / Alpine)
   Multi-container secure network architecture.
   Features: Nginx (SSL TLSv1.3), WordPress with php-fpm, MariaDB, FTP (vsftpd), Adminer.
   
3. <span class="highlight">Algorithm Visualizer</span> (JS / Math)
   Interactive visualization of the Ford-Johnson sorting algorithm.
   Features: Comparison minimization utilizing the Jacobsthal sequence.
`,
        skills: `
<h4 class="highlight" style="margin-top: 5px;">Technical Competence Matrix</h4>
--------------------------------------------
C/C++98             [████████████████████] 100%
Memory Management   [████████████████████] 100%
Socket Programming  [██████████████████░░]  90%
Docker/Docker-Comp  [██████████████████░░]  90%
Algorithms & DS     [████████████████░░░░]  80%
Python / Assembly   [██████████████░░░░░░]  70%
`,
        contact: `
<h4 class="highlight" style="margin-top: 5px;">Establish Connection</h4>
--------------------------------------------
SSH:      <span class="highlight">ssh guest@hicham.dev</span>
Email:    <span class="highlight-amber">hicham@example.com</span>
GitHub:   <span class="highlight">https://github.com/fibonnacc</span>
LinkedIn: <span class="highlight">https://linkedin.com/in/hichamelfatihi</span>
`,
        leetcode: `
<h4 class="highlight" style="margin-top: 5px;">LeetCode Profile Summary</h4>
--------------------------------------------
Profile: <span class="highlight">https://leetcode.com/u/Hicham1244/</span>
Problems Solved:
  Easy:   [██████████████░░░░░░] 14
  Medium: [████████░░░░░░░░░░░░] 8
  Hard:   [░░░░░░░░░░░░░░░░░░░░] 0
`
    };

    // -----------------------------------------------------------------
    // 3. Interactive Terminal Functionality
    // -----------------------------------------------------------------
    if (terminalInput) {
        // Keep focus on terminal input when clicking the terminal screen
        terminalWindow.addEventListener("click", () => {
            terminalInput.focus();
        });

        terminalInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                const rawInput = terminalInput.value;
                const command = rawInput.trim().toLowerCase();
                
                // Add the user command to screen history
                const promptLine = document.createElement("div");
                promptLine.className = "terminal-line";
                promptLine.innerHTML = `
                    <span class="user">guest</span><span class="at">@</span><span class="host">hicham.dev</span><span class="colon">:</span><span class="path">~</span><span class="char">$</span>
                    <span class="command-run">${escapeHTML(rawInput)}</span>
                `;
                terminalHistory.appendChild(promptLine);

                // Command parser execution
                if (command === "clear") {
                    terminalHistory.innerHTML = "";
                    // Clear default intro contents as well to look fully reset
                    const introOutput = terminalScreen.querySelector(".intro-output");
                    if (introOutput) introOutput.style.display = "none";
                } else if (command !== "") {
                    const outputLine = document.createElement("div");
                    outputLine.className = "terminal-output";

                    if (commandResponses.hasOwnProperty(command)) {
                        outputLine.innerHTML = commandResponses[command];
                    } else if (command === "secret" || command === "matrix") {
                        outputLine.innerHTML = `
<span class="highlight">SYSTEM OVERRIDE DETECTED...</span>
Initiating memory leak check...
0 bytes leaked in 10 blocks.
Vim is superior. Emacs is bloated.
Spinoza's God is pleased.
`;
                    } else {
                        outputLine.innerHTML = `bash: command not found: <span style="color:#ff5f56">${escapeHTML(command)}</span>. Type <span class="highlight">help</span> for assistance.`;
                    }
                    terminalHistory.appendChild(outputLine);
                }

                // Reset input field and scroll to bottom
                terminalInput.value = "";
                terminalScreen.scrollTop = terminalScreen.scrollHeight;
            }
        });
    }

    function escapeHTML(str) {
        return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
    }

    // -----------------------------------------------------------------
    // 4. LeetCode Stats / Navigation
    // -----------------------------------------------------------------
    // Quote switcher removed; replaced by LeetCode widget

    // -----------------------------------------------------------------
    // 5. Scroll Spy & Smooth Scrolling
    // -----------------------------------------------------------------
    // Smooth scrolling navigation
    navLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const targetId = link.getAttribute("href");
            const targetSec = document.querySelector(targetId);

            if (targetSec) {
                const headerHeight = document.getElementById("main-header").offsetHeight;
                const targetPos = targetSec.offsetTop - headerHeight;

                window.scrollTo({
                    top: targetPos,
                    behavior: "smooth"
                });
            }
        });
    });

    // IntersectionObserver to spy scroll and update current section link
    const spyOptions = {
        root: null,
        rootMargin: "-45% 0px -45% 0px", // triggers when section is in viewport center
        threshold: 0
    };

    const spyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute("id");
                
                // Add active state to section
                entry.target.classList.add("active");

                // Update navigation active state
                navLinks.forEach(link => {
                    if (link.getAttribute("href") === `#${id}`) {
                        link.classList.add("active");
                    } else {
                        link.classList.remove("active");
                    }
                });
            }
        });
    }, spyOptions);

    sections.forEach(section => spyObserver.observe(section));
});
