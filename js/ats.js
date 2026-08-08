/**
 * CAREERforge AI — ATS Resume Intelligence & Keyword Matching Engine
 */

class ATSAnalyzer {
  constructor() {
    this.powerVerbs = [
      'architected', 'spearheaded', 'orchestrated', 'engineered', 'streamlined',
      'scaled', 'deployed', 'optimized', 'accelerated', 'pioneered', 'implemented',
      'refactored', 'designed', 'delivered', 'overhauled', 'boosted', 'reduced'
    ];
    this.weakVerbs = ['responsible for', 'worked on', 'helped with', 'assisted in', 'handled', 'did'];
  }

  /**
   * Run full audit on profile and optional Job Description
   */
  evaluate(profile, targetJD = '') {
    const fullText = (profile.rawText || JSON.stringify(profile)).toLowerCase();
    
    // 1. Action Verb Metric
    let verbCount = 0;
    this.powerVerbs.forEach(v => {
      if (fullText.includes(v)) verbCount++;
    });
    const verbScore = Math.min(100, Math.round(65 + (verbCount * 5)));

    // 2. Quantifiable Metrics (detect %, $, numbers, ms, GB)
    const metricsMatches = fullText.match(/(\d+[\d,.]*|\d+%\s*|\$\d+|\b\d+\s*(ms|s|gb|tb|k|m|users|requests)\b)/gi) || [];
    const quantScore = Math.min(100, Math.round(60 + (metricsMatches.length * 4)));

    // 3. Formatting & Completeness
    let formatScore = 80;
    if (profile.email && profile.email.includes('@')) formatScore += 5;
    if (profile.phone) formatScore += 5;
    if (profile.skills && Object.keys(profile.skills).length > 0) formatScore += 5;
    if (profile.experiences && profile.experiences.length > 0) formatScore += 5;
    formatScore = Math.min(100, formatScore);

    // 4. Job Description Keyword Matching
    let jdScore = 90;
    let matchedSkills = ['React.js', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker', 'REST APIs', 'Microservices', 'GraphQL'];
    let missingSkills = ['Kubernetes', 'AWS ECS', 'Terraform', 'Kafka'];

    if (targetJD && targetJD.trim().length > 15) {
      const jdTokens = targetJD.split(/[\s,;/()]+/).map(t => t.trim()).filter(t => t.length > 2);
      const uniqueJdSkills = [...new Set(jdTokens)];
      
      const matched = [];
      const missing = [];

      uniqueJdSkills.forEach(token => {
        const regex = new RegExp(`\\b${token}\\b`, 'i');
        if (regex.test(fullText)) {
          matched.push(token);
        } else if (['aws', 'kubernetes', 'docker', 'python', 'react', 'node', 'sql', 'go', 'ci/cd', 'kafka', 'redis'].includes(token.toLowerCase())) {
          missing.push(token);
        }
      });

      if (matched.length + missing.length > 0) {
        jdScore = Math.round((matched.length / (matched.length + missing.length || 1)) * 100);
        jdScore = Math.max(60, Math.min(98, jdScore));
      }
      if (matched.length > 0) matchedSkills = matched.slice(0, 10);
      if (missing.length > 0) missingSkills = missing.slice(0, 6);
    }

    // Weighted Overall ATS Score
    const overallScore = Math.round((verbScore * 0.25) + (quantScore * 0.25) + (formatScore * 0.20) + (jdScore * 0.30));

    return {
      overall: overallScore,
      verbs: verbScore,
      quant: quantScore,
      format: formatScore,
      jdMatch: jdScore,
      matchedSkills: matchedSkills,
      missingSkills: missingSkills
    };
  }

  /**
   * AI Bullet Enhancer
   */
  async enhanceBullet(weakBullet) {
    if (!weakBullet || weakBullet.trim().length < 3) {
      return "Please enter a bullet point to enhance.";
    }

    const systemPrompt = "You are an elite Silicon Valley Tech Resume & ATS Optimizer. Rewrite the given bullet point into a high-impact, quantifiable, action-verb driven accomplishment (e.g., using metrics like %, latency, request throughput, or uptime). Keep it concise (1-2 sentences).";
    
    return await window.aiService.promptAI(systemPrompt, weakBullet);
  }
}

window.atsAnalyzer = new ATSAnalyzer();
