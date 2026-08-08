/**
 * CAREERforge AI — Skill Gap & Career Roadmap Visualizer
 */

class CareerRoadmap {
  constructor() {
    this.roleRoadmaps = {
      'staff-eng': {
        title: "Staff / Principal Distributed Systems Engineer ($240k+)",
        gaps: [
          { skill: "Distributed Consensus Protocols", status: "Missing", note: "Raft, Paxos, Multi-Region Replicated State Machines" },
          { skill: "Chaos Engineering & Resiliency", status: "Needs Polish", note: "Chaos Mesh, Fault Injection, Circuit Breaking" },
          { skill: "Advanced Zero-Downtime DB Migrations", status: "Verified", note: "Dual-write, Shadowing, Outbox pattern" }
        ],
        milestones: [
          {
            title: "Milestone 1: Multi-Region Event Streaming & Consensus",
            desc: "Build a production Raft consensus engine in Go or Rust handling leader elections, log replication, and partition healing."
          },
          {
            title: "Milestone 2: High-Concurrency Lock-Free Data Structures",
            desc: "Implement a lock-free concurrent hash map and benchmark memory throughput against standard synchronization primitives."
          },
          {
            title: "Milestone 3: Enterprise Architecture & Staff Leadership",
            desc: "Author RFC design proposals, define SLO/SLA error budgets, and lead architectural review boards across 4+ squads."
          }
        ]
      },
      'ai-eng': {
        title: "Senior AI & LLM Systems Engineer ($220k+)",
        gaps: [
          { skill: "Quantization & TensorRT-LLM", status: "Missing", note: "AWQ, SmoothQuant, FlashAttention-2 integration" },
          { skill: "Distributed Training (DeepSpeed/Ray)", status: "Needs Polish", note: "Pipeline and Tensor Parallelism across multi-node clusters" },
          { skill: "Vector Database Indexing & HNSW", status: "Verified", note: "Qdrant, Pinecone, ColBERT reranking" }
        ],
        milestones: [
          {
            title: "Milestone 1: Custom Speculative Decoding Engine",
            desc: "Deploy a fast draft model paired with a 70B target model to accelerate inference token generation by 2.8x."
          },
          {
            title: "Milestone 2: Scalable Hybrid RAG with ColBERT",
            desc: "Implement dual-encoder dense retrieval combined with sparse BM25 and cross-encoder re-ranking for complex enterprise QA."
          }
        ]
      }
    };
  }

  render(roleKey = 'staff-eng') {
    const data = this.roleRoadmaps[roleKey] || this.roleRoadmaps['staff-eng'];
    
    // Render Gaps
    const gapList = document.getElementById('skill-gap-list');
    if (gapList) {
      gapList.innerHTML = data.gaps.map(g => `
        <div class="gap-item">
          <div class="gap-item-top">
            <span>${g.skill}</span>
            <span class="badge-tag ${g.status === 'Verified' ? 'match' : 'missing'}">${g.status}</span>
          </div>
          <p>${g.note}</p>
        </div>
      `).join('');
    }

    // Render Timeline
    const timeline = document.getElementById('timeline-container');
    if (timeline) {
      timeline.innerHTML = data.milestones.map(m => `
        <div class="milestone-node">
          <h4>${m.title}</h4>
          <p>${m.desc}</p>
        </div>
      `).join('');
    }
  }
}

window.careerRoadmap = new CareerRoadmap();
