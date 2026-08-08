/**
 * CAREERforge AI — Recruiter Outreach & Cover Letter Studio
 */

class OutreachStudio {
  constructor() {}

  generate(profile, company = 'Stripe', role = 'Senior Backend Engineer', recruiter = 'Sarah', tone = 'value-first') {
    const candidateFirstName = profile.name ? profile.name.split(' ')[0] : 'Alex';
    
    // LinkedIn InMail
    let linkedinPitch = '';
    if (tone === 'value-first') {
      linkedinPitch = `Hi ${recruiter || 'there'},

I noticed ${company}'s impressive work scaling infrastructure and wanted to connect.

At my previous role, I architected distributed Go/Node microservices handling 3.4M+ daily requests with 99.99% uptime, while slashing latency by 44%. 

Given ${company}'s focus on high-throughput reliability, I'd love to share some insights on how I solved similar scaling challenges. 

Are you open to a brief 10-minute engineering chat next Tuesday?

Best regards,
${profile.name}
${profile.portfolioUrl || 'https://alexrivera.dev'}`;
    } else {
      linkedinPitch = `Hi ${recruiter || 'there'},

I’ve been following ${company}'s engineering journey and would love to connect. I’m a ${profile.title || 'Senior Full-Stack Engineer'} with deep experience in cloud resilience, PostgreSQL, and event-driven architectures.

I've attached my live interactive portfolio and case studies here: ${profile.portfolioUrl || 'https://alexrivera.dev'}

Excited to stay in touch!

Best,
${candidateFirstName}`;
    }

    // Cover Letter
    const coverLetter = `Dear Hiring Team at ${company},

I am writing to express my strong interest in the ${role} position. With over 6 years of experience architecting distributed cloud systems, high-concurrency microservices, and modern web applications, I have consistently focused on building scalable, fault-tolerant software that drives business outcomes.

At my current role, I led the development of critical transactional pipelines processing over 3.4M daily requests with 99.99% uptime. By implementing proactive Redis caching layers and optimizing relational database query plans, our team reduced P99 latency by 44% and significantly cut cloud infrastructure overhead.

What excites me most about ${company} is your commitment to engineering rigor and high-velocity innovation. I thrive in collaborative environments where engineers own systems end-to-end, from architecture and automated CI/CD to production telemetry.

Thank you for your time and consideration. You can explore my live portfolio and interactive system design case studies at ${profile.portfolioUrl || 'https://alexrivera.dev'}. I look forward to the possibility of discussing how my technical background aligns with ${company}'s goals.

Sincerely,
${profile.name}
${profile.email || 'alex.rivera@example.com'} • ${profile.phone || '+1 (555) 432-8921'}
${profile.github || 'https://github.com/alexrivera'}`;

    return {
      linkedin: linkedinPitch,
      coverLetter: coverLetter
    };
  }
}

window.outreachStudio = new OutreachStudio();
