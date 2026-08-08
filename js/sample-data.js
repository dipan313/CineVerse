/**
 * CAREERforge AI — Curated Sample Developer & Designer Profiles
 */

const SampleProfiles = {
  fullstack: {
    id: "fullstack-alex",
    name: "Alex Rivera",
    title: "Senior Full-Stack & Distributed Systems Architect",
    bio: "Passionate engineer with 6+ years of production experience building high-throughput microservices, real-time streaming architectures, and reactive glassmorphic interfaces.",
    location: "San Francisco, CA",
    email: "alex.rivera@example.com",
    phone: "+1 (555) 432-8921",
    github: "https://github.com/alexrivera",
    linkedin: "https://linkedin.com/in/alexrivera",
    portfolioUrl: "https://alexrivera.dev",
    atsScore: 94,
    skills: {
      frontend: ["React.js", "TypeScript", "Next.js", "Tailwind CSS", "Vue.js", "WebGL / Three.js"],
      backend: ["Node.js", "Python / FastAPI", "Go", "PostgreSQL", "Redis", "GraphQL", "Kafka"],
      cloud: ["Docker", "Kubernetes", "AWS (ECS, Lambda, S3)", "Terraform", "CI/CD (GitHub Actions)"],
      core: ["System Design", "Microservices", "RESTful Architecture", "Distributed Idempotency"]
    },
    experiences: [
      {
        role: "Senior Full-Stack Engineer",
        company: "Stripe / FinTech Infrastructure",
        period: "2022 — Present",
        location: "San Francisco, CA",
        bullets: [
          "Architected high-throughput payment ingestion pipeline handling 3.4M requests/day with 99.99% uptime using Go and PostgreSQL.",
          "Engineered real-time merchant analytics dashboard with Next.js and Redis, cutting load latency by 44%.",
          "Spearheaded migration of legacy monolith to containerized Docker & Kubernetes microservices on AWS."
        ]
      },
      {
        role: "Full-Stack Software Engineer",
        company: "CloudScale Systems",
        period: "2019 — 2022",
        location: "Austin, TX",
        bullets: [
          "Developed distributed cache invalidation protocol utilizing Redis clusters, reducing database read load by 60%.",
          "Mentored 6 junior engineers on TypeScript best practices, automated CI/CD unit testing, and code review standards.",
          "Implemented OAuth2.0 authentication and role-based access control (RBAC) across 12 internal microservices."
        ]
      }
    ],
    projects: [
      {
        title: "NexusFlow — Distributed Event Streaming Broker",
        description: "Ultra-low-latency event pipeline built with Go and Kafka, achieving sub-4ms message dispatching.",
        techStack: ["Go", "Kafka", "PostgreSQL", "Docker", "Prometheus"],
        githubUrl: "https://github.com/alexrivera/nexusflow",
        liveUrl: "https://nexusflow.dev"
      },
      {
        title: "SpectraHUD — Real-Time Telemetry Dashboard",
        description: "Interactive WebGL visualizer for monitoring cluster health, GPU compute metrics, and network latency.",
        techStack: ["React", "TypeScript", "Three.js", "TailwindCSS", "WebSocket"],
        githubUrl: "https://github.com/alexrivera/spectrahud",
        liveUrl: "https://spectrahud.io"
      },
      {
        title: "HyperQuery — Natural Language to SQL Compiler",
        description: "AI-assisted query generator optimizing indexing hints and explaining execution plans in plain English.",
        techStack: ["Python", "FastAPI", "OpenAI / Gemini", "PostgreSQL"],
        githubUrl: "https://github.com/alexrivera/hyperquery",
        liveUrl: "https://hyperquery.ai"
      }
    ],
    education: [
      {
        degree: "B.S. in Computer Science",
        institution: "University of California, Berkeley",
        year: "2015 — 2019",
        honors: "Dean's Honors List • Focus in Distributed Systems"
      }
    ]
  },

  aiEngineer: {
    id: "ai-elena",
    name: "Dr. Elena Rostova",
    title: "Senior AI / ML Research & Systems Engineer",
    bio: "Specializing in Large Language Model fine-tuning, RAG pipelines, quantization (GGUF/AWQ), and deploying high-throughput neural inference servers.",
    location: "Seattle, WA",
    email: "elena.rostova@example.com",
    phone: "+1 (555) 819-2044",
    github: "https://github.com/elenarostova",
    linkedin: "https://linkedin.com/in/elenarostova",
    portfolioUrl: "https://elena-ai.dev",
    atsScore: 97,
    skills: {
      frontend: ["Streamlit", "Gradio", "React", "TypeScript", "TailwindCSS"],
      backend: ["PyTorch", "Python", "vLLM", "TensorRT-LLM", "FastAPI", "Hugging Face"],
      cloud: ["Kubernetes", "Ray Cluster", "AWS SageMaker", "Docker", "CUDA"],
      core: ["LLM Fine-Tuning (LoRA/QLoRA)", "Vector DBs (Qdrant, Pinecone)", "RAG Systems", "Quantization"]
    },
    experiences: [
      {
        role: "Lead Machine Learning Engineer",
        company: "Synthetix AI Labs",
        period: "2021 — Present",
        location: "Seattle, WA",
        bullets: [
          "Orchestrated distributed training of 14B parameter domain-specific LLM across 64x H100 GPUs using DeepSpeed and Ray.",
          "Designed multi-stage hybrid RAG pipeline achieving 94.2% retrieval accuracy on enterprise knowledge bases.",
          "Cut LLM inference server cost by 52% via TensorRT-LLM 4-bit AWQ quantization and speculative decoding."
        ]
      }
    ],
    projects: [
      {
        title: "OmniRAG — Hybrid Sparse/Dense Retrieval Engine",
        description: "Sub-10ms neural search combining BM25 and ColBERT embeddings with re-ranking.",
        techStack: ["PyTorch", "Qdrant", "FastAPI", "Docker"],
        githubUrl: "https://github.com/elenarostova/omnirag",
        liveUrl: "https://omnirag.ai"
      }
    ],
    education: [
      {
        degree: "Ph.D. in Artificial Intelligence & Machine Learning",
        institution: "University of Washington",
        year: "2017 — 2021",
        honors: "Best Dissertation Award in Scalable Deep Learning"
      }
    ]
  }
};

window.SampleProfiles = SampleProfiles;
