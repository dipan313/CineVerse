/**
 * CAREERforge AI — Master Application Controller & 3D Interactive Suite
 */

class AppController {
  constructor() {
    this.currentProfile = window.SampleProfiles.fullstack;
    this.init();
  }

  init() {
    this.setupCanvas();
    this.setup3DTilt();
    this.setupNavigation();
    this.setupEventListeners();
    this.renderAll();
  }

  /**
   * 3D Particle Constellation on HTML5 Canvas
   */
  setupCanvas() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const particleCount = 45;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 2 + 1,
        color: i % 2 === 0 ? 'rgba(0, 240, 255, 0.4)' : 'rgba(139, 92, 246, 0.4)'
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 130) {
            ctx.strokeStyle = `rgba(0, 240, 255, ${0.15 * (1 - dist / 130)})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw dots
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      requestAnimationFrame(animate);
    };

    animate();
  }

  /**
   * 3D Perspective Card Tilt on Mouse Move
   */
  setup3DTilt() {
    document.querySelectorAll('.tilt-card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -7;
        const rotateY = ((x - centerX) / centerX) * 7;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
      });
    });
  }

  /**
   * Tab Routing & Switching
   */
  setupNavigation() {
    document.querySelectorAll('.nav-item').forEach(btn => {
      btn.addEventListener('click', () => {
        const tabId = btn.getAttribute('data-tab');
        this.switchTab(tabId);
      });
    });
  }

  switchTab(tabId) {
    document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));

    const activeBtn = document.querySelector(`.nav-item[data-tab="${tabId}"]`);
    const activePane = document.getElementById(`tab-${tabId}`);

    if (activeBtn) activeBtn.classList.add('active');
    if (activePane) activePane.classList.add('active');

    // Trigger specific tab refreshes
    if (tabId === 'portfolio-studio') {
      this.updatePortfolioPreview();
    } else if (tabId === 'roadmap') {
      window.careerRoadmap.render();
    }
  }

  /**
   * Setup UI Event Handlers
   */
  setupEventListeners() {
    // Resume File Upload
    const uploadInput = document.getElementById('resume-upload-input');
    if (uploadInput) {
      uploadInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (file) {
          const parsed = await window.resumeParser.parseFile(file);
          this.loadProfile(parsed);
          this.switchTab('ats-scorer');
        }
      });
    }

    // Load Demo Profile Button
    const btnDemo = document.getElementById('btn-load-demo');
    if (btnDemo) {
      btnDemo.addEventListener('click', () => {
        this.currentProfile = this.currentProfile.id === 'fullstack-alex' 
          ? window.SampleProfiles.aiEngineer 
          : window.SampleProfiles.fullstack;
        this.loadProfile(this.currentProfile);
      });
    }

    // Quick Sample Switcher in Sidebar
    const btnQuick = document.getElementById('btn-quick-sample');
    if (btnQuick) {
      btnQuick.addEventListener('click', () => {
        this.currentProfile = this.currentProfile.id === 'fullstack-alex' 
          ? window.SampleProfiles.aiEngineer 
          : window.SampleProfiles.fullstack;
        this.loadProfile(this.currentProfile);
      });
    }

    // ATS Audit Execution
    const btnAts = document.getElementById('btn-run-ats-audit');
    if (btnAts) {
      btnAts.addEventListener('click', () => {
        const targetJD = document.getElementById('target-jd-input').value;
        const evaluation = window.atsAnalyzer.evaluate(this.currentProfile, targetJD);
        this.updateAtsUI(evaluation);
      });
    }

    // Paste Sample Tech JD
    const btnSampleJd = document.getElementById('btn-sample-jd');
    if (btnSampleJd) {
      btnSampleJd.addEventListener('click', () => {
        const sampleJD = "We are seeking a Senior Full-Stack Engineer with deep experience in React, TypeScript, Node.js, Go, PostgreSQL, Redis, Kubernetes, AWS ECS, Terraform, Kafka, and microservices architecture. Must have a track record of scaling high-throughput distributed systems with high availability.";
        document.getElementById('target-jd-input').value = sampleJD;
        const evaluation = window.atsAnalyzer.evaluate(this.currentProfile, sampleJD);
        this.updateAtsUI(evaluation);
      });
    }

    // AI Bullet Polisher
    const btnPolish = document.getElementById('btn-polish-bullet');
    if (btnPolish) {
      btnPolish.addEventListener('click', async () => {
        const input = document.getElementById('custom-bullet-input').value;
        const outputDiv = document.getElementById('polished-bullet-output');
        outputDiv.style.display = 'block';
        outputDiv.innerText = "Enhancing bullet point with action-verbs & metrics...";
        const polished = await window.atsAnalyzer.enhanceBullet(input);
        outputDiv.innerText = polished;
      });
    }

    // Viewport Switcher
    document.querySelectorAll('.vp-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.vp-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const vp = btn.getAttribute('data-vp');
        const frame = document.getElementById('device-container');
        frame.className = `device-container ${vp}`;
      });
    });

    // Theme Switcher in Portfolio Studio
    const themeSelect = document.getElementById('portfolio-theme-select');
    if (themeSelect) {
      themeSelect.addEventListener('change', (e) => {
        window.portfolioEngine.currentTheme = e.target.value;
        this.updatePortfolioPreview();
      });
    }

    // Persona Switcher
    const personaSelect = document.getElementById('portfolio-persona-select');
    if (personaSelect) {
      personaSelect.addEventListener('change', (e) => {
        window.portfolioEngine.currentPersona = e.target.value;
        this.updatePortfolioPreview();
      });
    }

    // Accent Color Dots
    document.querySelectorAll('.color-dot').forEach(dot => {
      dot.addEventListener('click', () => {
        document.querySelectorAll('.color-dot').forEach(d => d.classList.remove('active'));
        dot.classList.add('active');
        window.portfolioEngine.accentColor = dot.getAttribute('data-color');
        this.updatePortfolioPreview();
      });
    });

    // Refresh / Sync Preview
    const btnSync = document.getElementById('btn-sync-preview');
    if (btnSync) {
      btnSync.addEventListener('click', () => {
        this.currentProfile.name = document.getElementById('cust-name').value;
        this.currentProfile.title = document.getElementById('cust-title').value;
        this.currentProfile.bio = document.getElementById('cust-bio').value;
        this.currentProfile.location = document.getElementById('cust-loc').value;
        this.currentProfile.email = document.getElementById('cust-email').value;
        this.currentProfile.github = document.getElementById('cust-github').value;
        this.currentProfile.linkedin = document.getElementById('cust-linkedin').value;
        this.updatePortfolioPreview();
      });
    }

    // 1-Click ZIP Export
    const exportHandler = () => {
      window.zipExporter.exportPortfolio(this.currentProfile, {
        theme: window.portfolioEngine.currentTheme,
        persona: window.portfolioEngine.currentPersona,
        accentColor: window.portfolioEngine.accentColor,
        includeBot: document.getElementById('toggle-recruiter-bot')?.checked
      });
    };
    document.getElementById('btn-export-zip')?.addEventListener('click', exportHandler);
    document.getElementById('btn-export-zip-top')?.addEventListener('click', exportHandler);

    // AI Mock Interviewer Triggers
    document.querySelectorAll('.mode-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const mode = btn.getAttribute('data-mode');
        window.aiInterviewer.setMode(mode);
      });
    });

    document.getElementById('btn-toggle-mic')?.addEventListener('click', () => {
      window.aiInterviewer.toggleMic();
    });

    document.getElementById('btn-submit-answer')?.addEventListener('click', () => {
      const input = document.getElementById('user-text-answer');
      const val = input.value.trim();
      if (val) {
        window.aiInterviewer.submitAnswer(val);
        input.value = '';
      }
    });

    document.getElementById('btn-end-interview')?.addEventListener('click', () => {
      window.aiInterviewer.showScorecard();
    });

    // Roadmap Role Switch
    document.getElementById('roadmap-target-role')?.addEventListener('change', (e) => {
      window.careerRoadmap.render(e.target.value);
    });

    // Outreach Studio Trigger
    document.getElementById('btn-generate-outreach')?.addEventListener('click', () => {
      const company = document.getElementById('outreach-company').value;
      const role = document.getElementById('outreach-role').value;
      const recruiter = document.getElementById('outreach-hiring-mgr').value;
      const tone = document.getElementById('outreach-tone-select').value;

      const result = window.outreachStudio.generate(this.currentProfile, company, role, recruiter, tone);
      document.getElementById('linkedin-pitch-text').value = result.linkedin;
      document.getElementById('cover-letter-text').value = result.coverLetter;
    });

    // Settings Modal
    document.getElementById('btn-open-settings')?.addEventListener('click', () => {
      document.getElementById('settings-modal').style.display = 'flex';
      document.getElementById('input-gemini-key').value = window.aiService.geminiKey || '';
      document.getElementById('input-groq-key').value = window.aiService.groqKey || '';
    });
    document.getElementById('btn-close-settings')?.addEventListener('click', () => {
      document.getElementById('settings-modal').style.display = 'none';
    });
    document.getElementById('btn-save-keys')?.addEventListener('click', () => {
      const gKey = document.getElementById('input-gemini-key').value;
      const grKey = document.getElementById('input-groq-key').value;
      window.aiService.saveKeys(gKey, grKey);
      document.getElementById('settings-modal').style.display = 'none';
      document.getElementById('current-ai-mode').innerHTML = `<i class="fa-solid fa-bolt text-cyan"></i> <span>Engine: <strong>${window.aiService.getProviderName()}</strong></span>`;
    });
    document.getElementById('btn-clear-keys')?.addEventListener('click', () => {
      window.aiService.clearKeys();
      document.getElementById('input-gemini-key').value = '';
      document.getElementById('input-groq-key').value = '';
      document.getElementById('current-ai-mode').innerHTML = `<i class="fa-solid fa-bolt text-cyan"></i> <span>Engine: <strong>${window.aiService.getProviderName()}</strong></span>`;
    });
  }

  loadProfile(profile) {
    this.currentProfile = profile;
    this.renderAll();
  }

  renderAll() {
    // Sidebar
    document.getElementById('sidebar-name').innerText = this.currentProfile.name;
    document.getElementById('sidebar-role').innerText = this.currentProfile.title;

    // Customizer form
    document.getElementById('cust-name').value = this.currentProfile.name;
    document.getElementById('cust-title').value = this.currentProfile.title;
    document.getElementById('cust-bio').value = this.currentProfile.bio;
    document.getElementById('cust-loc').value = this.currentProfile.location || '';
    document.getElementById('cust-email').value = this.currentProfile.email || '';
    document.getElementById('cust-github').value = this.currentProfile.github || '';
    document.getElementById('cust-linkedin').value = this.currentProfile.linkedin || '';

    // Extracted raw text
    document.getElementById('raw-resume-text').value = this.currentProfile.rawText || JSON.stringify(this.currentProfile, null, 2);

    // Run ATS Evaluation
    const evaluation = window.atsAnalyzer.evaluate(this.currentProfile);
    this.updateAtsUI(evaluation);

    // Update Live Preview
    this.updatePortfolioPreview();

    // Trigger Outreach Generation
    const result = window.outreachStudio.generate(this.currentProfile);
    document.getElementById('linkedin-pitch-text').value = result.linkedin;
    document.getElementById('cover-letter-text').value = result.coverLetter;
  }

  updateAtsUI(evaluation) {
    document.getElementById('ats-score-val').innerText = evaluation.overall;
    document.getElementById('dash-ats-score').innerHTML = `${evaluation.overall}<span>/100</span>`;
    
    // Conic gradient degree
    const deg = Math.round((evaluation.overall / 100) * 360);
    const gauge = document.getElementById('ats-circular-gauge');
    if (gauge) gauge.style.setProperty('--score-deg', `${deg}deg`);

    // Sub-metrics
    document.getElementById('metric-verbs').innerText = `${evaluation.verbs}%`;
    document.getElementById('fill-verbs').style.width = `${evaluation.verbs}%`;

    document.getElementById('metric-keywords').innerText = `${evaluation.jdMatch}%`;
    document.getElementById('fill-keywords').style.width = `${evaluation.jdMatch}%`;

    document.getElementById('metric-quant').innerText = `${evaluation.quant}%`;
    document.getElementById('fill-quant').style.width = `${evaluation.quant}%`;

    document.getElementById('metric-format').innerText = `${evaluation.format}%`;
    document.getElementById('fill-format').style.width = `${evaluation.format}%`;

    // Keyword clouds
    const matchedCloud = document.getElementById('matched-keywords-cloud');
    if (matchedCloud) {
      matchedCloud.innerHTML = (evaluation.matchedSkills || []).map(s => `<span class="badge-tag match">${s}</span>`).join('');
    }

    const missingCloud = document.getElementById('missing-keywords-cloud');
    if (missingCloud) {
      missingCloud.innerHTML = (evaluation.missingSkills || []).map(s => `<span class="badge-tag missing">${s}</span>`).join('');
    }
  }

  updatePortfolioPreview() {
    const iframe = document.getElementById('portfolio-preview-iframe');
    if (!iframe) return;

    const htmlContent = window.portfolioEngine.generateHTML(this.currentProfile, {
      theme: window.portfolioEngine.currentTheme,
      persona: window.portfolioEngine.currentPersona,
      accentColor: window.portfolioEngine.accentColor,
      includeBot: document.getElementById('toggle-recruiter-bot')?.checked
    });

    iframe.srcdoc = htmlContent;

    // Update browser bar URL
    const safeName = (this.currentProfile.name || 'portfolio').toLowerCase().replace(/[^a-z0-9]/g, '-');
    document.getElementById('preview-url-bar').innerText = `https://${safeName}.portfolio.dev/`;
  }

  copyText(elemId) {
    const elem = document.getElementById(elemId);
    if (elem) {
      navigator.clipboard.writeText(elem.value);
      alert("Copied to clipboard!");
    }
  }
}

// Instantiate on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.App = new AppController();
});
