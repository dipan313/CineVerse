/**
 * CAREERforge AI — Real-Time Voice & Speech AI Mock Interviewer
 * Uses Web Speech API for voice recognition & speech synthesis + dynamic evaluation scoring.
 */

class AIInterviewer {
  constructor() {
    this.currentMode = 'technical';
    this.currentQuestionIdx = 0;
    this.isRecording = false;
    this.recognition = null;
    this.synthesis = window.speechSynthesis || null;
    this.conversationHistory = [];

    this.questions = {
      technical: [
        "Welcome Alex! Let's start with your experience in distributed microservices. How do you handle idempotency and distributed transactions when an asynchronous message fails across multiple services?",
        "When scaling a relational database like PostgreSQL under heavy write loads, what strategies do you employ before considering sharding?",
        "Explain the key architectural tradeoffs between REST, GraphQL, and gRPC in a high-throughput microservices ecosystem.",
        "How do you design a robust cache invalidation protocol using Redis to prevent cache stampedes and stale data reads?",
        "Walk me through a production outage or latency bottleneck you diagnosed and resolved under pressure."
      ],
      behavioral: [
        "Tell me about a high-stakes project where requirements were ambiguous or rapidly shifting. How did you align the team and deliver on time?",
        "Describe a situation where you had a significant technical disagreement with a senior engineer or product lead. How did you resolve it?",
        "Can you share an example of when a production deployment failed? How did you manage the incident and prevent recurrence?",
        "Tell me about a time you mentored a junior engineer or drove engineering excellence across your organization."
      ],
      hr: [
        "What motivated you to explore this opportunity, and what are the top 3 criteria you look for in your next engineering team?",
        "How do you approach work-life balance and avoid burnout during intensive release cycles?",
        "What are your target compensation and career progression expectations over the next 2-3 years?"
      ]
    };

    this.initSpeechRecognition();
  }

  initSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';

      this.recognition.onstart = () => {
        this.isRecording = true;
        this.updateMicUI(true);
      };

      this.recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('');
        
        const inputField = document.getElementById('user-text-answer');
        if (inputField) inputField.value = transcript;
      };

      this.recognition.onerror = (event) => {
        console.warn('Speech recognition error:', event.error);
        this.isRecording = false;
        this.updateMicUI(false);
      };

      this.recognition.onend = () => {
        this.isRecording = false;
        this.updateMicUI(false);
      };
    }
  }

  toggleMic() {
    if (!this.recognition) {
      alert("Speech Recognition is not supported in this browser. You can still type your answers!");
      return;
    }

    if (this.isRecording) {
      this.recognition.stop();
    } else {
      this.recognition.start();
    }
  }

  updateMicUI(recording) {
    const btn = document.getElementById('btn-toggle-mic');
    const wave = document.getElementById('soundwave-box');
    const hint = document.getElementById('mic-hint-text');

    if (btn && wave && hint) {
      if (recording) {
        btn.classList.add('recording');
        wave.classList.add('active');
        hint.innerText = "Listening... Speak your answer now";
      } else {
        btn.classList.remove('recording');
        wave.classList.remove('active');
        hint.innerText = "Click to speak your answer";
      }
    }
  }

  setMode(mode) {
    this.currentMode = mode;
    this.currentQuestionIdx = 0;
    this.conversationHistory = [];
    this.showQuestion();
  }

  showQuestion() {
    const qList = this.questions[this.currentMode] || this.questions.technical;
    const qText = qList[this.currentQuestionIdx] || "That concludes the core questions! Click 'Finish & View Scorecard' to generate your detailed AI evaluation.";
    
    const qEl = document.getElementById('current-question-text');
    const qNum = document.getElementById('current-q-num');
    if (qEl) qEl.innerText = `"${qText}"`;
    if (qNum) qNum.innerText = (this.currentQuestionIdx + 1);

    // Speak aloud if enabled
    const speakToggle = document.getElementById('toggle-speech-synthesis');
    if (speakToggle && speakToggle.checked && this.synthesis) {
      this.synthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(qText);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      this.synthesis.speak(utterance);
    }
  }

  async submitAnswer(answerText) {
    if (!answerText || !answerText.trim()) return;

    const stream = document.getElementById('dialogue-stream');
    if (stream) {
      // Append user msg
      const uDiv = document.createElement('div');
      uDiv.className = 'chat-msg user-msg';
      uDiv.innerHTML = `
        <div class="msg-body">
          <div class="msg-author">You (Candidate)</div>
          <p>${answerText}</p>
        </div>
        <div class="msg-avatar"><i class="fa-solid fa-user"></i></div>
      `;
      stream.appendChild(uDiv);
      stream.scrollTop = stream.scrollHeight;
    }

    const qList = this.questions[this.currentMode] || this.questions.technical;
    this.conversationHistory.push({
      question: qList[this.currentQuestionIdx],
      answer: answerText
    });

    // Advance to next question
    this.currentQuestionIdx++;
    if (this.currentQuestionIdx < qList.length) {
      setTimeout(() => {
        const nextQ = qList[this.currentQuestionIdx];
        if (stream) {
          const aiDiv = document.createElement('div');
          aiDiv.className = 'chat-msg ai-msg';
          aiDiv.innerHTML = `
            <div class="msg-avatar"><i class="fa-solid fa-robot"></i></div>
            <div class="msg-body">
              <div class="msg-author">Nexus AI Interviewer</div>
              <p>"${nextQ}"</p>
            </div>
          `;
          stream.appendChild(aiDiv);
          stream.scrollTop = stream.scrollHeight;
        }
        this.showQuestion();
      }, 700);
    } else {
      this.showScorecard();
    }
  }

  showScorecard() {
    const drawer = document.getElementById('interview-scorecard-drawer');
    if (drawer) {
      drawer.style.display = 'flex';
      drawer.scrollIntoView({ behavior: 'smooth' });
    }

    if (window.confetti) {
      window.confetti({ particleCount: 80, spread: 60 });
    }
  }
}

window.aiInterviewer = new AIInterviewer();
