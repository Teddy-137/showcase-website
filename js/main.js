// Mobile menu toggle
const menuToggle = document.getElementById("menu-toggle");
const mobileMenu = document.getElementById("mobile-menu");
if (menuToggle && mobileMenu) {
  menuToggle.addEventListener("click", () => {
    mobileMenu.classList.toggle("hidden");
  });
}
// Close mobile menu when a link is clicked
const mobileLinks = document.querySelectorAll("#mobile-menu a");
mobileLinks.forEach((link) => {
  link.addEventListener("click", () => {
    if (mobileMenu) mobileMenu.classList.add("hidden");
  });
});

// Dark/light mode toggle
const themeToggle = document.getElementById("themeToggle");
const mobileThemeToggle = document.getElementById("mobileThemeToggle");

function applyTheme(theme) {
  if (theme === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}

function toggleTheme() {
  const currentTheme =
    localStorage.getItem("color-theme") === "dark" ? "light" : "dark";
  localStorage.setItem("color-theme", currentTheme);
  applyTheme(currentTheme);
}

if (themeToggle) themeToggle.addEventListener("click", toggleTheme);
if (mobileThemeToggle) mobileThemeToggle.addEventListener("click", toggleTheme);

// Check for saved theme preference or use system preference on load
const savedTheme =
  localStorage.getItem("color-theme") ||
  (window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light");
applyTheme(savedTheme);

// Scroll to top button
const scrollTopBtn = document.getElementById("scrollTop");
if (scrollTopBtn) {
  window.addEventListener("scroll", () => {
    if (window.pageYOffset > 300) {
      scrollTopBtn.classList.add("active");
    } else {
      scrollTopBtn.classList.remove("active");
    }
  });

  scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// Smooth scrolling for anchor links and active nav link highlighting
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll('nav a[href^="#"]');

function updateActiveLink() {
  let index = sections.length;
  while (--index && window.scrollY + 100 < sections[index].offsetTop) {}

  navLinks.forEach((link) => link.classList.remove("active"));
  if (index > -1) {
    const activeLink = document.querySelector(
      `nav a[href="#${sections[index].id}"]`
    );
    if (activeLink) activeLink.classList.add("active");
  }
}

navLinks.forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const targetId = this.getAttribute("href");
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth" });
    }
  });
});

// Section fade-in effect on scroll
const sectionFades = document.querySelectorAll(".section-fade");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
      }
    });
  },
  { threshold: 0.1 }
);

sectionFades.forEach((section) => {
  observer.observe(section);
});

window.addEventListener("scroll", updateActiveLink);
updateActiveLink(); // Set initial state

// --- Gemini AI Chat Logic ---
// --- Gemini AI Chat Logic ---
const aiChatForm = document.getElementById("aiChatForm");
const aiPromptInput = document.getElementById("ai-prompt");
const aiResponseContainer = document.getElementById("ai-response");
const aiLoader = document.getElementById("ai-loader");
const aiError = document.getElementById("ai-error");
const aiSubmitBtn = document.getElementById("ai-submit-btn");

if (aiChatForm) {
  aiChatForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const userPrompt = aiPromptInput.value.trim();
    if (!userPrompt) return;

    aiLoader.classList.remove("hidden");
    aiResponseContainer.innerHTML = ""; // Clear previous response
    aiError.classList.add("hidden");
    aiSubmitBtn.disabled = true;
    aiSubmitBtn.classList.add("opacity-50");

    // This is the context for the AI about Tewodros
    const context = `
                    You are an AI assistant for Tewodros Anteneh's portfolio. Answer questions based on the following information about him. Be friendly and professional.

                    Name: Tewodros Anteneh
                    Role: Third-Year Electrical and Computer Engineering (ECE) Student & Aspiring Software Engineer.
                    Location: Addis Ababa, Ethiopia
                    
                    Education:
                    - Bachelor of Science in Electrical and Computer Engineering at Addis Ababa Science and Technology University (Expected Graduation: June 2027).
                    - Completed a course on Backend Web Development with Django from the Google Developers Club.

                    Skills:
                    - Programming Languages: Python, Java, C++, SQL, HTML/CSS
                    - Frameworks & Libraries: Django, Fast API, Bootstrap
                    - Developer Tools: Docker, Git, GitHub, VS Code, IntelliJ IDEA

                    Projects:
                    1. MediHelp Plus: A comprehensive healthcare platform using Django, PostgreSQL, Docker, and Google Gemini API. It features symptom checking and doctor consultations.
                    2. Terminal Chat: A Java-based client-server chat system using Sockets and multi-threading for concurrent users.

                    Awards:
                    - First Place Winner at AASTU Tech Fest 2025 Hackathon (for MediHelp Plus).
                    - Nationwide Top Scorer in the IYMC Final Round.
                    - Silver Honour at IYMC.

                    What I like: 
                    - I enjoy solving complex mathematical problems like abstract algebra and number theory, differential equations, and linear algebra.
                    - I also love solving code forces problems and participating in competitive programming contests.
                    - I have a passion for learning new technologies and applying them to real-world problems.
                    - I am interested in AI and machine learning, and I am currently exploring these fields.
                    - I am also interested in Rust programming language and its applications in systems programming.
                    - I really like to play chess and travel to new places.

                    Additional Information:
                    - I am a member of International Young Mathematicians Challenge(IYMC).
                    - I can speek Amharic, English, Geez, and Arabic.
    


                    Contact: tewodrosanteneh10@gmail.com, Phone: +251930858695
                `;

    const fullPrompt = `${context}\n\nUser's question: "${userPrompt}"\n\nAnswer:`;

    try {
      // ADDED YOUR API KEY HERE
      require("dotenv").config({ path: ".env.local" });
      const apiKey = process.env.API_KEY;
      // const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: fullPrompt,
                },
              ],
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const result = await response.json();

      // Extract and display the response
      if (
        result.candidates &&
        result.candidates[0] &&
        result.candidates[0].content
      ) {
        const text = result.candidates[0].content.parts[0].text;
        aiResponseContainer.innerText = text;
      } else {
        throw new Error("No valid response from API");
      }
    } catch (error) {
      console.error("Gemini API call failed:", error);
      aiError.textContent = `Error: ${error.message}`;
      aiError.classList.remove("hidden");
    } finally {
      aiLoader.classList.add("hidden");
      aiSubmitBtn.disabled = false;
      aiSubmitBtn.classList.remove("opacity-50");
    }
  });
}

// main.js - Add scroll progress indicator
const scrollProgress = document.getElementById("scroll-progress");
window.addEventListener("scroll", () => {
  const scrollHeight =
    document.documentElement.scrollHeight - window.innerHeight;
  const scrolled = (window.scrollY / scrollHeight) * 100;
  scrollProgress.style.width = `${scrolled}%`;
});
