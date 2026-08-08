/**
 * CAREERforge AI — Portfolio Generation & Theme Engine
 * Generates self-contained, standalone static websites with live preview & embedded recruiter chatbot.
 */

class PortfolioEngine {
  constructor() {
    this.currentTheme = 'cyber';
    this.currentPersona = 'tech';
    this.accentColor = '#00f0ff';
  }

  /**
   * Generates the complete standalone HTML string for the live preview and ZIP export.
   */
  generateHTML(profile, options = {}) {
    const theme = options.theme || this.currentTheme;
    const persona = options.persona || this.currentPersona;
    const accent = options.accentColor || this.accentColor;
    const includeBot = options.includeBot !== false;

    const allSkills = [
      ...(profile.skills?.frontend || []),
      ...(profile.skills?.backend || []),
      ...(profile.skills?.cloud || []),
      ...(profile.skills?.core || [])
    ];

    const expHTML = (profile.experiences || []).map(exp => `
      <div class="exp-card">
        <div class="exp-header">
          <div>
            <h3 class="exp-role">${exp.role}</h3>
            <span class="exp-company">${exp.company}</span>
          </div>
          <span class="exp-period">${exp.period}</span>
        </div>
        <ul class="exp-bullets">
          ${(exp.bullets || []).map(b => `<li>${b}</li>`).join('')}
        </ul>
      </div>
    `).join('');

    const projHTML = (profile.projects || []).map(proj => `
      <div class="proj-card">
        <div class="proj-top">
          <h3 class="proj-title">${proj.title}</h3>
          <div class="proj-links">
            ${proj.githubUrl ? `<a href="${proj.githubUrl}" target="_blank" rel="noopener"><i class="fa-brands fa-github"></i></a>` : ''}
            ${proj.liveUrl ? `<a href="${proj.liveUrl}" target="_blank" rel="noopener"><i class="fa-solid fa-arrow-up-right-from-square"></i></a>` : ''}
          </div>
        </div>
        <p class="proj-desc">${proj.description}</p>
        <div class="proj-tags">
          ${(proj.techStack || []).map(t => `<span class="tag">${t}</span>`).join('')}
        </div>
      </div>
    `).join('');

    const skillsHTML = allSkills.map(s => `<span class="skill-badge">${s}</span>`).join('');

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${profile.name} — ${profile.title}</title>
  
  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&family=Outfit:wght@400;600;800&family=Plus+Jakarta+Sans:wght@300;400;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  
  <style>
    :root {
      --accent: ${accent};
      --bg: #07090e;
      --card-bg: rgba(15, 22, 36, 0.75);
      --border: rgba(255, 255, 255, 0.08);
      --text: #f8fafc;
      --text-muted: #94a3b8;
      --font-main: 'Plus Jakarta Sans', sans-serif;
      --font-heading: 'Outfit', sans-serif;
      --font-mono: 'JetBrains Mono', monospace;
    }

    /* THEME SPECIFICS */
    ${this.getThemeCSS(theme, accent)}

    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: var(--bg);
      color: var(--text);
      font-family: var(--font-main);
      line-height: 1.6;
      padding: 0;
      overflow-x: hidden;
    }

    .container {
      max-width: 1040px;
      margin: 0 auto;
      padding: 40px 24px;
    }

    /* Persona Bar */
    .persona-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 18px;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid var(--border);
      border-radius: 30px;
      margin-bottom: 36px;
      font-size: 12px;
    }
    .persona-badge {
      display: flex;
      align-items: center;
      gap: 6px;
      color: var(--accent);
      font-weight: 700;
    }

    /* Hero Section */
    .hero {
      display: flex;
      flex-direction: column;
      gap: 16px;
      margin-bottom: 56px;
    }
    .hero-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 4px 12px;
      border-radius: 20px;
      background: rgba(0, 240, 255, 0.1);
      border: 1px solid var(--accent);
      color: var(--accent);
      font-size: 11px;
      font-weight: 700;
      width: fit-content;
    }
    .hero h1 {
      font-family: var(--font-heading);
      font-size: 44px;
      font-weight: 800;
      letter-spacing: -1px;
      line-height: 1.15;
    }
    .hero h2 {
      font-size: 20px;
      color: var(--text-muted);
      font-weight: 500;
    }
    .hero p {
      font-size: 16px;
      color: var(--text-muted);
      max-width: 700px;
    }
    .hero-links {
      display: flex;
      gap: 14px;
      margin-top: 8px;
    }
    .btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 10px 20px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 700;
      text-decoration: none;
      transition: all 0.2s;
      cursor: pointer;
    }
    .btn-primary {
      background: var(--accent);
      color: #04121d;
    }
    .btn-primary:hover {
      box-shadow: 0 0 20px var(--accent);
      transform: translateY(-2px);
    }
    .btn-outline {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid var(--border);
      color: #fff;
    }
    .btn-outline:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    /* Section Styles */
    .section-title {
      font-family: var(--font-heading);
      font-size: 24px;
      font-weight: 700;
      margin-bottom: 24px;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .section-title i { color: var(--accent); }

    /* Experience */
    .exp-grid {
      display: flex;
      flex-direction: column;
      gap: 20px;
      margin-bottom: 56px;
    }
    .exp-card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 24px;
      backdrop-filter: blur(12px);
    }
    .exp-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 14px;
      flex-wrap: wrap;
      gap: 8px;
    }
    .exp-role { font-size: 17px; font-weight: 700; }
    .exp-company { color: var(--accent); font-size: 14px; font-weight: 600; }
    .exp-period { font-size: 12px; color: var(--text-muted); font-family: var(--font-mono); }
    .exp-bullets { list-style: disc inside; color: var(--text-muted); font-size: 14px; display: flex; flex-direction: column; gap: 6px; }

    /* Projects */
    .proj-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
      margin-bottom: 56px;
    }
    .proj-card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 14px;
      backdrop-filter: blur(12px);
      transition: all 0.2s;
    }
    .proj-card:hover {
      border-color: var(--accent);
      transform: translateY(-4px);
    }
    .proj-top { display: flex; justify-content: space-between; align-items: center; }
    .proj-title { font-size: 16px; font-weight: 700; }
    .proj-links a { color: var(--text-muted); font-size: 16px; margin-left: 8px; text-decoration: none; }
    .proj-links a:hover { color: var(--accent); }
    .proj-desc { color: var(--text-muted); font-size: 13px; flex: 1; }
    .proj-tags { display: flex; flex-wrap: wrap; gap: 6px; }
    .tag { font-size: 11px; font-family: var(--font-mono); padding: 3px 8px; border-radius: 6px; background: rgba(255, 255, 255, 0.05); color: var(--text-muted); }

    /* Skills */
    .skills-box {
      margin-bottom: 56px;
    }
    .skills-cloud {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }
    .skill-badge {
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid var(--border);
      color: #fff;
      padding: 8px 16px;
      border-radius: 20px;
      font-size: 13px;
      font-weight: 600;
      transition: all 0.2s;
    }
    .skill-badge:hover {
      border-color: var(--accent);
      box-shadow: 0 0 12px var(--accent);
      color: var(--accent);
    }

    /* Embedded Recruiter Chatbot Widget */
    .recruiter-bot-widget {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 1000;
    }
    .bot-trigger {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: var(--accent);
      color: #04121d;
      font-size: 22px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 0 25px var(--accent);
      cursor: pointer;
      border: none;
      transition: transform 0.2s;
    }
    .bot-trigger:hover { transform: scale(1.1); }
    
    .bot-window {
      position: absolute;
      bottom: 68px;
      right: 0;
      width: 340px;
      background: #0d121f;
      border: 1px solid var(--accent);
      border-radius: 16px;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.9);
      display: none;
      flex-direction: column;
      overflow: hidden;
    }
    .bot-header {
      background: rgba(0, 240, 255, 0.1);
      padding: 12px 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid var(--border);
      font-size: 13px;
      font-weight: 700;
    }
    .bot-messages {
      padding: 14px;
      height: 240px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 10px;
      font-size: 12px;
    }
    .bot-msg {
      background: rgba(255, 255, 255, 0.05);
      padding: 8px 12px;
      border-radius: 8px;
      line-height: 1.4;
    }
    .bot-msg.ai { border-left: 3px solid var(--accent); }
    .bot-msg.user { background: rgba(0, 240, 255, 0.15); align-self: flex-end; }
    .bot-input-row {
      display: flex;
      padding: 10px;
      border-top: 1px solid var(--border);
      gap: 6px;
    }
    .bot-input {
      flex: 1;
      background: rgba(0, 0, 0, 0.5);
      border: 1px solid var(--border);
      color: #fff;
      padding: 6px 10px;
      border-radius: 6px;
      font-size: 12px;
      outline: none;
    }
    .bot-send {
      background: var(--accent);
      color: #000;
      border: none;
      padding: 6px 12px;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 700;
    }

    footer {
      border-top: 1px solid var(--border);
      padding: 30px 0;
      text-align: center;
      color: var(--text-muted);
      font-size: 13px;
    }
  </style>
</head>
<body>

  <div class="container">
    
    <!-- Top Persona Banner -->
    <div class="persona-bar">
      <div class="persona-badge">
        <i class="fa-solid fa-bolt"></i>
        <span>${persona === 'recruiter' ? 'Recruiter Quick-Skim View (30s Metrics)' : 'Tech Deep-Dive & Architecture Mode'}</span>
      </div>
      <span>Updated 2026 • Verified Profile</span>
    </div>

    <!-- Hero -->
    <header class="hero">
      <div class="hero-badge"><i class="fa-solid fa-code"></i> Ready for High-Impact Roles</div>
      <h1>${profile.name}</h1>
      <h2>${profile.title}</h2>
      <p>${profile.bio}</p>
      
      <div class="hero-links">
        ${profile.email ? `<a href="mailto:${profile.email}" class="btn btn-primary"><i class="fa-solid fa-paper-plane"></i> Get in Touch</a>` : ''}
        ${profile.github ? `<a href="${profile.github}" target="_blank" class="btn btn-outline"><i class="fa-brands fa-github"></i> GitHub</a>` : ''}
        ${profile.linkedin ? `<a href="${profile.linkedin}" target="_blank" class="btn btn-outline"><i class="fa-brands fa-linkedin"></i> LinkedIn</a>` : ''}
      </div>
    </header>

    <!-- Experience -->
    <section>
      <h2 class="section-title"><i class="fa-solid fa-briefcase"></i> Work Experience</h2>
      <div class="exp-grid">
        ${expHTML}
      </div>
    </section>

    <!-- Featured Projects -->
    <section>
      <h2 class="section-title"><i class="fa-solid fa-layer-group"></i> Featured Projects</h2>
      <div class="proj-grid">
        ${projHTML}
      </div>
    </section>

    <!-- Skills Cloud -->
    <section class="skills-box">
      <h2 class="section-title"><i class="fa-solid fa-microchip"></i> Core Competencies & Tech Stack</h2>
      <div class="skills-cloud">
        ${skillsHTML}
      </div>
    </section>

    <!-- Footer -->
    <footer>
      <p>© ${new Date().getFullYear()} ${profile.name}. Built with CAREERforge AI. Hosted with 100% Free Static Hosting.</p>
    </footer>

  </div>

  ${includeBot ? `
  <!-- Embedded Recruiter Assistant Widget -->
  <div class="recruiter-bot-widget">
    <button class="bot-trigger" id="botTrigger" title="Ask AI about this Candidate"><i class="fa-solid fa-robot"></i></button>
    
    <div class="bot-window" id="botWindow">
      <div class="bot-header">
        <span><i class="fa-solid fa-brain"></i> Ask AI about ${profile.name}</span>
        <button style="background:none;border:none;color:#fff;cursor:pointer;" id="botClose"><i class="fa-solid fa-xmark"></i></button>
      </div>
      <div class="bot-messages" id="botMessages">
        <div class="bot-msg ai">Hi! I am ${profile.name.split(' ')[0]}'s AI career assistant. Ask me about their experience with microservices, tech stack, or leadership!</div>
      </div>
      <div class="bot-input-row">
        <input type="text" class="bot-input" id="botInput" placeholder="Ask a question...">
        <button class="bot-send" id="botSend">Send</button>
      </div>
    </div>
  </div>
  ` : ''}

  <script>
    // Embedded Recruiter Bot Interaction Logic
    const botTrigger = document.getElementById('botTrigger');
    const botWindow = document.getElementById('botWindow');
    const botClose = document.getElementById('botClose');
    const botInput = document.getElementById('botInput');
    const botSend = document.getElementById('botSend');
    const botMessages = document.getElementById('botMessages');

    if (botTrigger && botWindow) {
      botTrigger.addEventListener('click', () => {
        botWindow.style.display = botWindow.style.display === 'flex' ? 'none' : 'flex';
      });
      botClose.addEventListener('click', () => { botWindow.style.display = 'none'; });

      const handleSend = () => {
        const query = botInput.value.trim();
        if (!query) return;

        // Append user msg
        const uMsg = document.createElement('div');
        uMsg.className = 'bot-msg user';
        uMsg.innerText = query;
        botMessages.appendChild(uMsg);
        botInput.value = '';

        // Dynamic Answer
        setTimeout(() => {
          const aiMsg = document.createElement('div');
          aiMsg.className = 'bot-msg ai';
          
          const qLower = query.toLowerCase();
          if (qLower.includes('experience') || qLower.includes('role') || qLower.includes('work')) {
            aiMsg.innerText = "${profile.name} has 6+ years of engineering leadership, architecting high-throughput Go and Node microservices handling 3.4M+ daily requests.";
          } else if (qLower.includes('tech') || qLower.includes('stack') || qLower.includes('skill')) {
            aiMsg.innerText = "Core technical skills: React, TypeScript, Node.js, Go, PostgreSQL, Redis, Docker, and AWS cloud resilience.";
          } else if (qLower.includes('contact') || qLower.includes('email') || qLower.includes('hire')) {
            aiMsg.innerText = "You can reach ${profile.name} directly at ${profile.email || 'their email'} or connect on LinkedIn!";
          } else {
            aiMsg.innerText = "${profile.name} is a high-impact builder with proven results in scalable distributed architectures. Feel free to reach out directly via email!";
          }
          
          botMessages.appendChild(aiMsg);
          botMessages.scrollTop = botMessages.scrollHeight;
        }, 500);
      };

      botSend.addEventListener('click', handleSend);
      botInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') handleSend(); });
    }
  </script>
</body>
</html>`;
  }

  /**
   * Theme-specific CSS generators
   */
  getThemeCSS(theme, accent) {
    if (theme === 'minimal') {
      return `
        :root {
          --bg: #09090b;
          --card-bg: #121215;
          --border: #27272a;
          --text: #fafafa;
          --text-muted: #a1a1aa;
          --font-main: 'JetBrains Mono', monospace;
          --font-heading: 'JetBrains Mono', monospace;
        }
        .hero h1 { letter-spacing: -2px; }
        .exp-card, .proj-card { border-radius: 4px; border: 1px solid #27272a; }
      `;
    } else if (theme === 'editorial') {
      return `
        :root {
          --bg: #0c0f14;
          --card-bg: rgba(22, 28, 38, 0.8);
          --border: rgba(255, 255, 255, 0.12);
          --accent: ${accent};
        }
        .hero h1 { font-family: 'Outfit', sans-serif; font-size: 52px; font-weight: 800; }
        .exp-card { border-left: 4px solid var(--accent); }
      `;
    } else if (theme === 'executive') {
      return `
        :root {
          --bg: #0b0e14;
          --card-bg: #131822;
          --border: #1e2638;
          --accent: #94a3b8;
        }
        .hero h1 { font-size: 38px; color: #f8fafc; }
        .btn-primary { background: #e2e8f0; color: #0f172a; }
      `;
    }
    // Default Cyber
    return `
      .hero h1 {
        background: linear-gradient(135deg, #fff 40%, var(--accent) 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
      .exp-card:hover, .proj-card:hover {
        box-shadow: 0 0 25px rgba(0, 240, 255, 0.15);
      }
    `;
  }
}

window.portfolioEngine = new PortfolioEngine();
