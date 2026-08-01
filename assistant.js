// =============================================================================
// CAREER ASSISTANT — Engineering Manager & Platform Architect Journey
// Integrations: GitHub API · LeetCode · Exercism · Coursera · Claude API · LinkedIn
// =============================================================================

const CAREER_PROFILE = {
  name: 'Gurpreet Gandhi',
  targetTitle: 'Senior Engineering Manager, Platform / AI',
  currentTitle: 'Engineering Manager & Platform Architect',
  currentCompany: 'Mobius Networks, Gaian Solutions',
  email: 'gurpreetgandhi3@gmail.com',
  github: 'grupret',
  linkedin: 'gandhigurpreet',
  yearsExp: 12,
  teamLeadership: {
    builtTeam: 'Built and scaled a 12-member Platform Engineering team from the ground up',
    maxOrg: 'Led 3 Engineering Leads and 14 engineers across 4 Agile squads (RunRun)',
    aiGatewayTeam: '6 engineers on the Enterprise AI Gateway',
    genAiTeam: '4 engineers on the Generative AI platform',
    mlPlatformOrg: '15-person cross-functional ML org at Nesy Factory (3 Eng Leads, 6 ML Engineers, 3 Backend, 2 UI, 1 UX)',
    mentoring: 'Mentored engineers into lead-role promotions'
  },
  certifications: [
    'CKAD — Certified Kubernetes Application Developer (The Linux Foundation / CNCF, Dec 2024)',
    'Google Cloud Generative AI Leader (Feb 2026 – Feb 2029)',
    'SnapLogic Developer Certification'
  ],
  skills: {
    expert: ['Kubernetes','Docker','Terraform','Java/Spring Boot','Apache Kafka','Apache Flink','Camunda BPM','MongoDB','PostgreSQL','Istio','Vault','Distributed Systems','Event-driven Architecture'],
    advanced: ['Python','MLflow','Kubeflow','ArgoCD','AWS','GCP','KServe','vLLM','Ollama','LoRAX','Triton/ONNX','CI/CD','mTLS','IAM','GDPR/PII Governance'],
    growing: ['LLMOps','Agentic orchestration','AMD SEV-SNP','Intel TDX','CVM/TEE','Confidential Computing','GPU MIG','OPA Gatekeeper','OpenTelemetry']
  },
  domains: ['Platform Engineering','Distributed Systems','MLOps','LLMOps','Workflow Orchestration','DevSecOps','Security & Compliance','Team Leadership'],
  targetRoles: [
    { title: 'Senior Engineering Manager, Platform / AI', match: 97 },
    { title: 'Director of Platform Engineering', match: 96 },
    { title: 'Engineering Manager, AI/ML Platform', match: 94 },
    { title: 'Principal / Platform Architect', match: 93 },
    { title: 'VP of Platform Engineering', match: 87 },
    { title: 'CTO – Growth-stage Startup', match: 78 }
  ],
  projects: [
    { key: 'aigateway', name: 'Enterprise AI Gateway', impact: '6-engineer team · 50+ foundation models · +30–50% GPU utilization · -25–40% inference cost', keywords: ['ai gateway','llm gateway','inference gateway','foundation model','vllm','ollama','lorax','triton','gpu','kv cache','caching','cag','rag'] },
    { key: 'genai', name: 'Generative AI Platform', impact: '4-engineer team · 1000+ enterprise marketplaces · NVIDIA H100 · 3x throughput', keywords: ['generative ai platform','image studio','video studio','3d studio','h100','genai','scale to zero','keda'] },
    { key: 'daas', name: 'Distributed Database-as-a-Service Platform', impact: '12+ database technologies · 10TB+ daily · 500K–1M events/sec', keywords: ['daas','database as a service','data platform','flink','postgres','postgresql','mongodb','tidb','hudi','htap','olap'] },
    { key: 'runrun', name: 'RunRun DevSecOps Platform', impact: '3 Engineering Leads + 14 engineers / 4 squads · Camunda + Terraform · zero-downtime', keywords: ['runrun','devsecops','terraform','camunda','vault','argocd','iac','infrastructure as code'] },
    { key: 'mlplatform', name: 'ML Platform Engineering (Nesy Factory)', impact: '15-person cross-functional org · 3x delivery speed · 15+ production ML workloads', keywords: ['ml platform','mlops','nesy','kubeflow','mlflow','kserve','pytorch','machine learning platform'] },
    { key: 'cds', name: 'Cloud Data Stream (CDS)', impact: '<1ms latency · 1M+ msg/sec · RSocket over TCP', keywords: ['cloud data stream','cds','rsocket','pitcher catcher','latency'] },
    { key: 'cvm', name: 'CVM Confidential Infrastructure', impact: 'Zero incidents · AMD SEV-SNP / Intel TDX · full audit readiness', keywords: ['cvm','confidential comput','tee','sev-snp','tdx','gdpr','mtls','security infrastructure'] }
  ]
};

// ── Virtual Gurpreet — recruiter-facing Q&A (no API key required) ──────────
// Keyword-matched, first-person answers grounded in CAREER_PROFILE facts.
// This is the DEFAULT chat mode for anonymous visitors. "Power Mode" (below,
// requires a visitor-supplied Claude API key) layers on freeform Q&A on top.
const FAQ_ENTRIES = [
  {
    id: 'greeting',
    keywords: ['who are you','tell me about yourself','introduce yourself','about you','hi','hello','hey'],
    answer: p => `I'm ${p.name} — an ${p.currentTitle} with ${p.yearsExp}+ years building cloud-native platforms, distributed systems, and enterprise AI infrastructure. I currently lead engineering at ${p.currentCompany}, where I ${p.teamLeadership.builtTeam.charAt(0).toLowerCase() + p.teamLeadership.builtTeam.slice(1)} and ${p.teamLeadership.maxOrg.charAt(0).toLowerCase() + p.teamLeadership.maxOrg.slice(1)}. Ask me about my team leadership, certifications, tech stack, or any of my featured projects.`
  },
  {
    id: 'role',
    keywords: ['current role','what do you do','job title','position','what is your role','current job'],
    answer: p => `Right now I'm ${p.currentTitle} at ${p.currentCompany}. It's a hybrid role — I own the platform roadmap and lead the people side of engineering, while staying hands-on enough to make the hard architecture calls myself.`
  },
  {
    id: 'team',
    keywords: ['team size','how many people','direct reports','manage','managed','leadership experience','led a team','mentoring','mentor','promotion','promoted','people manager'],
    answer: p => `${p.teamLeadership.builtTeam}. ${p.teamLeadership.maxOrg}. I've also run smaller focused teams — ${p.teamLeadership.aiGatewayTeam} and ${p.teamLeadership.genAiTeam} — and partnered on a ${p.teamLeadership.mlPlatformOrg}. ${p.teamLeadership.mentoring}.`
  },
  {
    id: 'certs',
    keywords: ['certification','certificate','certified','credly','ckad','generative ai leader','snaplogic'],
    answer: p => `I hold three: ${p.certifications.join('; ')}. All are verifiable on Credly — links are under Personal → Courses & Certifications on this site.`
  },
  {
    id: 'stack',
    keywords: ['tech stack','technology','technologies','skills','what do you use','programming language','tools'],
    answer: p => `Core stack: ${p.skills.expert.slice(0,8).join(', ')}. On the AI/inference side: ${p.skills.advanced.filter(s => /vLLM|Ollama|LoRAX|KServe|Triton/.test(s)).join(', ')}. Full breakdown is in the Skills section above.`
  },
  {
    id: 'manager_or_architect',
    keywords: ['manager or architect','em or architect','people manager or ic','hands on','hands-on','still code','still technical'],
    answer: () => `Both, honestly — my title is Engineering Manager & Platform Architect. I lead the people side (hiring, mentoring, planning, roadmap) but stay hands-on enough to make the hard architecture calls myself. That combination is intentional — it's what I'd bring to a Director or Senior EM seat.`
  },
  {
    id: 'target_roles',
    keywords: ['looking for','target role','next role','what role','open to','job search','career goal'],
    answer: p => `I'm targeting ${p.targetRoles.slice(0,2).map(r => r.title).join(' and ')} roles — open to remote/global opportunities. Happy to talk specifics if you have something in mind.`
  },
  {
    id: 'contact',
    keywords: ['contact','reach you','email','linkedin','get in touch','resume','cv'],
    answer: p => `Best ways to reach me: email at ${p.email}, LinkedIn at linkedin.com/in/${p.linkedin}, or GitHub at github.com/${p.github}. You can also grab my resume from the "Download Resume" button at the top of this page.`
  },
  {
    id: 'projects_general',
    keywords: ['projects','what have you built','built anything','portfolio','work you have done'],
    answer: p => `A few I'm proud of: ${p.projects.slice(0,5).map(pr => pr.name).join(', ')}. Ask me about any one of them by name — the AI Gateway, the DaaS platform, RunRun, or the ML platform — and I'll go deeper.`
  }
];

function matchFAQ(msg) {
  const lower = msg.toLowerCase();
  let best = null, bestScore = 0;
  FAQ_ENTRIES.forEach(entry => {
    const score = entry.keywords.reduce((n, kw) => n + (lower.includes(kw) ? 1 : 0), 0);
    if (score > bestScore) { bestScore = score; best = entry; }
  });
  if (bestScore > 0) return best.answer(CAREER_PROFILE);

  // Try project-specific keyword match
  let bestProject = null, bestPScore = 0;
  CAREER_PROFILE.projects.forEach(pr => {
    const score = pr.keywords.reduce((n, kw) => n + (lower.includes(kw) ? 1 : 0), 0);
    if (score > bestPScore) { bestPScore = score; bestProject = pr; }
  });
  if (bestProject) return `**${bestProject.name}** — ${bestProject.impact}. Want details on another project, my team leadership, or how to reach me?`;

  return `I didn't quite catch that. I'm best at answering questions about my current role, team leadership, certifications, tech stack, or my featured projects (AI Gateway, DaaS, RunRun, ML Platform). Try one of the quick questions below — or turn on **Power Mode** (paste a Claude API key above) for open-ended questions.`;
}

// ── Learning Paths ──────────────────────────────────────────────────────────
const LEARNING_PATHS = {
  platformops: {
    icon: '⚙️', title: 'PlatformOps / Platform Engineering',
    description: 'Build Internal Developer Platforms (IDP) that 10x developer productivity',
    skillsToGain: ['Backstage','Crossplane','Port','IDP Design','CNCF Toolchain'],
    courses: [
      { title:'Platform Engineering Fundamentals', provider:'CNCF', url:'https://www.cncf.io/online-programs/introduction-to-platform-engineering/', duration:'4h', level:'Intermediate', free:true },
      { title:'Backstage — Build Your IDP', provider:'Spotify / backstage.io', url:'https://backstage.io/docs/overview/what-is-backstage', duration:'8h', level:'Advanced', free:true },
      { title:'Crossplane — Universal Control Plane', provider:'CNCF', url:'https://docs.crossplane.io/', duration:'6h', level:'Advanced', free:true },
      { title:'Platform Engineering on Coursera', provider:'Coursera', url:'https://www.coursera.org/search?query=platform+engineering', duration:'20h', level:'Intermediate', free:false }
    ],
    resources: [
      { name:'platformengineering.org', url:'https://platformengineering.org/', type:'community' },
      { name:'CNCF Landscape', url:'https://landscape.cncf.io/', type:'reference' },
      { name:'Awesome Platform Engineering', url:'https://github.com/toptechevangelist/awesome-platform-engineering', type:'github' }
    ]
  },
  mlops: {
    icon: '🤖', title: 'MLOps / ML Platform Engineering',
    description: 'Bridge ML research to production — reliable, scalable, observable ML systems',
    skillsToGain: ['MLflow','Kubeflow','Feature Stores','Model Monitoring','Vertex AI/SageMaker'],
    courses: [
      { title:'MLOps Specialization', provider:'Coursera — DeepLearning.AI', url:'https://www.coursera.org/specializations/machine-learning-engineering-for-production-mlops', duration:'40h', level:'Advanced', free:false },
      { title:'MLflow: Experiments → Production', provider:'Databricks', url:'https://www.databricks.com/learn/training', duration:'8h', level:'Intermediate', free:true },
      { title:'Made With ML — Full MLOps Course', provider:'Made With ML', url:'https://madewithml.com/', duration:'20h', level:'Advanced', free:true },
      { title:'Practical MLOps', provider:'Educative', url:'https://www.educative.io/courses/practical-mlops', duration:'15h', level:'Intermediate', free:false }
    ],
    resources: [
      { name:'Awesome MLOps', url:'https://github.com/visenger/awesome-mlops', type:'github' },
      { name:'Made With ML', url:'https://madewithml.com/', type:'community' },
      { name:'MLOps Roadmap', url:'https://roadmap.sh/mlops', type:'reference' }
    ]
  },
  llmops: {
    icon: '🧠', title: 'LLMOps / GenAI Platform Engineering',
    description: 'Deploy and operate Large Language Models at enterprise scale on Kubernetes',
    skillsToGain: ['vLLM','Ollama','LangChain','RAG','Vector DBs','LLM Observability','Prompt Engineering'],
    courses: [
      { title:'LLMOps (Short Course)', provider:'DeepLearning.AI', url:'https://www.deeplearning.ai/short-courses/llmops/', duration:'4h', level:'Intermediate', free:true },
      { title:'Building RAG Systems', provider:'DeepLearning.AI', url:'https://www.deeplearning.ai/short-courses/building-and-evaluating-advanced-rag/', duration:'3h', level:'Intermediate', free:true },
      { title:'LangChain for LLM Apps', provider:'DeepLearning.AI', url:'https://www.deeplearning.ai/short-courses/langchain-for-llm-application-development/', duration:'3h', level:'Beginner', free:true },
      { title:'LLM Engineer Full Course', provider:'GitHub — mlabonne', url:'https://github.com/mlabonne/llm-course', duration:'30h', level:'Advanced', free:true }
    ],
    resources: [
      { name:'Awesome LLMOps', url:'https://github.com/tensorchord/Awesome-LLMOps', type:'github' },
      { name:'vLLM Docs', url:'https://docs.vllm.ai/', type:'tool' },
      { name:'Ollama', url:'https://ollama.ai/', type:'tool' }
    ]
  },
  gitops: {
    icon: '🔄', title: 'GitOps / Continuous Delivery',
    description: 'Git as single source of truth for declarative infra and application delivery',
    skillsToGain: ['ArgoCD','Flux CD','Helm','Kustomize','Policy as Code','Weave GitOps'],
    courses: [
      { title:'GitOps Fundamentals', provider:'Codefresh', url:'https://codefresh.io/learn/gitops/', duration:'5h', level:'Beginner', free:true },
      { title:'ArgoCD for Beginners', provider:'KodeKloud', url:'https://kodekloud.com/courses/argcd-for-beginners/', duration:'6h', level:'Intermediate', free:false },
      { title:'Flux CD — Getting Started', provider:'Weaveworks', url:'https://fluxcd.io/flux/get-started/', duration:'4h', level:'Intermediate', free:true },
      { title:'GitOps with Kubernetes', provider:'Educative', url:'https://www.educative.io/courses/gitops-with-kubernetes', duration:'12h', level:'Advanced', free:false }
    ],
    resources: [
      { name:'OpenGitOps', url:'https://opengitops.dev/', type:'community' },
      { name:'Awesome GitOps', url:'https://github.com/weaveworks/awesome-gitops', type:'github' }
    ]
  },
  devops: {
    icon: '🚀', title: 'DevOps / SRE Excellence',
    description: 'Site Reliability Engineering + advanced DevOps at VP leadership level',
    skillsToGain: ['SLO/SLA Design','Chaos Engineering','Observability','FinOps','Security as Code','eBPF'],
    courses: [
      { title:'SRE Book by Google', provider:'Google (Free)', url:'https://sre.google/sre-book/table-of-contents/', duration:'40h', level:'Advanced', free:true },
      { title:'Observability with OpenTelemetry', provider:'Linux Foundation', url:'https://opentelemetry.io/docs/getting-started/', duration:'6h', level:'Intermediate', free:true },
      { title:'Chaos Engineering', provider:'Chaos Toolkit', url:'https://chaostoolkit.org/tutorials/', duration:'4h', level:'Advanced', free:true },
      { title:'DevOps on AWS Specialization', provider:'Coursera — AWS', url:'https://www.coursera.org/specializations/aws-devops', duration:'30h', level:'Intermediate', free:false }
    ],
    resources: [
      { name:'DevOps Roadmap', url:'https://roadmap.sh/devops', type:'reference' },
      { name:'Awesome SRE', url:'https://github.com/dastergon/awesome-sre', type:'github' }
    ]
  },
  leadership: {
    icon: '👑', title: 'VP / Executive Engineering Leadership',
    description: 'Executive presence, OKRs, strategic communication, and hiring at VP level',
    skillsToGain: ['OKR Framework','Executive Communication','P&L Basics','Technical Vision','Hiring Strategy','Board Presentations'],
    courses: [
      { title:'Engineering Leadership', provider:'Coursera', url:'https://www.coursera.org/learn/engineering-leadership', duration:'20h', level:'Intermediate', free:false },
      { title:'Technical Leadership & Communication', provider:'Educative', url:'https://www.educative.io/path/become-a-software-engineering-manager', duration:'25h', level:'Advanced', free:false },
      { title:'Awesome Engineering Management', provider:'GitHub', url:'https://github.com/kdeldycke/awesome-engineering-management', duration:'∞', level:'All', free:true },
      { title:'Staff Engineer Path', provider:'StaffEng', url:'https://staffeng.com/', duration:'10h', level:'Advanced', free:true }
    ],
    resources: [
      { name:'Awesome Eng Management', url:'https://github.com/kdeldycke/awesome-engineering-management', type:'github' },
      { name:'StaffEng Stories', url:'https://staffeng.com/', type:'community' },
      { name:'The High Output Management Notes', url:'https://github.com/mgp/book-notes/blob/master/high-output-management.markdown', type:'reference' }
    ]
  }
};

// ── LinkedIn Message Templates ───────────────────────────────────────────────
const LINKEDIN_TEMPLATES = {
  connection: `Hi {{name}},

I came across your work at {{company}} and was genuinely impressed. As an Engineering Manager & Platform Architect with 12+ years leading teams and building distributed systems, MLOps platforms, and cloud-native infra, I believe we're operating in adjacent spaces.

Would love to connect and exchange ideas on {{topic}}.

Best,
Gurpreet Gandhi`,

  intro: `Hi {{name}},

I'm Gurpreet Gandhi — Engineering Manager & Platform Architect. My work spans:
• Team leadership (built/scaled a 12-member platform team, led 14 engineers/4 squads)
• Distributed platforms (10TB+/day, 99.5% availability, <1ms latency)
• MLOps & LLMOps (Kubeflow, MLflow, vLLM/Ollama on K8s)
• DevSecOps & GitOps (ArgoCD, Vault, Terraform)

I'm exploring leadership opportunities in Platform/ML Engineering and would value your perspective on {{company_domain}}.

Would you be open to a brief conversation?

Gurpreet`,

  referral: `Hi {{name}},

I hope this finds you well! I noticed you're at {{company}}, which has an exciting {{role}} position I'm deeply passionate about.

A quick snapshot of what I bring:
✅ 12+ years Platform Engineering & Architecture
✅ Led 10TB+/day distributed systems with 99.9% uptime
✅ Built MLOps/LLMOps platforms from 0→1
✅ Led 15+ engineer cross-functional teams
✅ CKAD Certified | Terraform | Kafka | ArgoCD | Vault

Would you be comfortable referring me or sharing any insights about the team? Happy to share my resume and more context.

Many thanks,
Gurpreet Gandhi`,

  recruiter: `Hi {{name}},

Thank you for reaching out! I'm actively exploring senior leadership opportunities.

What I bring:
• 12+ years building enterprise-grade distributed systems
• Specialised in: Distributed Systems, Platform Eng, MLOps, LLMOps, DevSecOps
• Led platforms processing 10TB+/day with <1ms latency
• Delivered significant enterprise business impact through platform innovation
• CKAD Certified | Expert: K8s, Terraform, Kafka, Flink

Target: VP/Director Platform Engineering, Head of MLOps/LLMOps
Preference: Remote/Hybrid | Product companies | Global teams

Open to: {{company}} if the scope aligns.

When can we connect?

Gurpreet Gandhi
gurpreetgandhi3@gmail.com`,

  followup: `Hi {{name}},

I wanted to follow up on my message about the {{role}} at {{company}}.

I remain very interested — my experience in {{relevant_skill}} directly maps to what you're building. I recently also {{recent_achievement}}, which might be relevant context.

Would you have 20 minutes this week to connect?

Best,
Gurpreet`,

  hiring_manager: `Hi {{name}},

I'm reaching out directly because I'm genuinely excited about the {{role}} at {{company}} and the platform work your team is driving.

In brief, I've:
→ Architected platforms at 10TB+ daily scale (99.9% uptime, <1ms p99)
→ Led cross-functional teams of 15+ engineers across distributed orgs
→ Driven significant enterprise business impact via platform innovation
→ Built MLOps/LLMOps platforms on Kubernetes from ground up
→ CKAD Certified | Expert in K8s, Terraform, Kafka, ArgoCD

I believe I can accelerate {{company}}'s platform vision significantly.

Happy to share more context — would love to connect at your convenience.

Gurpreet Gandhi
gurpreetgandhi3@gmail.com | linkedin.com/in/gandhigurpreet`
};

// ── IQ Challenges ────────────────────────────────────────────────────────────
const IQ_CHALLENGES = [
  { question:'A data pipeline processes 10TB daily. You need 5x throughput at 3x cost efficiency. What do you prioritize?', options:['Add compute nodes linearly','Data partitioning + Apache Flink stream processing','Switch to batch-only','Reduce quality checks'], answer:1, explanation:'Stream processing + proper partitioning gives linear scalability at lower per-unit cost. This is real systems thinking: horizontal scaling with smart data locality.' },
  { question:'Your ML model has 95% accuracy in dev but only 70% in production. Most likely cause?', options:['Model too complex','Training-serving skew in feature engineering','Not enough training data','Wrong loss function'], answer:1, explanation:'Training-serving skew is the #1 production ML failure. Features computed differently in training vs inference create distribution shift. Always use the same pipeline.' },
  { question:'100 microservices have cascading failures at peak load. Immediate architectural response?', options:['Rewrite all services','Circuit breakers + Bulkhead pattern','Increase server capacity','Disable non-critical services'], answer:1, explanation:'Circuit breakers prevent cascade propagation. Bulkhead isolates failure domains. Both should be standard in distributed systems. Capacity is secondary to architecture.' },
  { question:'In a GitOps model, who should have direct write access to the production config repo?', options:['All developers','Only CD automation (ArgoCD/Flux)','Only senior engineers','DevOps team manually'], answer:1, explanation:'GitOps principle: Only automated CD systems apply changes to production. Humans open PRs, automation syncs cluster state. This guarantees auditability and reproducibility.' },
  { question:'A VP asks for 40% infra cost reduction with no SLA impact. Your first action?', options:['Immediately downsize servers','Cost analysis: idle resources + right-sizing + reserved instances','Move to cheapest cloud','Reduce deployment frequency'], answer:1, explanation:'FinOps: Always analyze before cutting. Idle resources (~30-40% waste), right-sizing, and reserved/committed use discounts are highest-ROI levers. Measure first.' },
  { question:'What is the key architectural difference between a Service Mesh and an API Gateway?', options:['Service Mesh is only for external traffic','Service Mesh handles East-West (service-to-service); API Gateway handles North-South (external ingress)','API Gateway is always faster','They serve identical purposes'], answer:1, explanation:'Service Mesh (Istio/Linkerd) manages internal service communication with mTLS, observability, retries. API Gateway manages external-facing ingress, auth, rate limiting.' },
  { question:'You\'re designing a system for 1M concurrent users. Which database pattern is essential?', options:['Single massive SQL instance','CQRS + Event Sourcing with read replicas','NoSQL only','Increase SQL server RAM'], answer:1, explanation:'CQRS separates read/write paths. Read replicas handle query load. Event Sourcing gives you auditability and temporal queries. This is the standard for high-scale systems.' }
];

// ── EQ Exercises ─────────────────────────────────────────────────────────────
const EQ_EXERCISES = [
  { scenario:'Your team missed a critical deadline. The PM is blaming engineering publicly.', exercise:'Practice non-defensive leadership: Acknowledge facts, protect your team, propose solutions.', prompt:'How do you respond to the PM AND to the client in a way that maintains trust while being honest about what happened?', insight:'High-performing leaders absorb external pressure before it reaches their team. Psychological safety is your performance multiplier.' },
  { scenario:'A senior engineer challenges your architectural decision in front of the whole team.', exercise:'Practice intellectual humility before defending your position.', prompt:'How do you make this disagreement productive rather than a status battle? What would you say to open the floor?', insight:'The best VPs actively invite expert dissent. Psychological safety = innovation. Make yourself the safest person to disagree with.' },
  { scenario:'You need to give tough performance feedback to a top performer who is becoming a bottleneck.', exercise:'Craft SBI (Situation-Behavior-Impact) feedback without judgment.', prompt:'Write the opening 3 sentences of this feedback conversation using SBI + future-focused language.', insight:'Top performers leave when feedback is absent OR delivered poorly. Radical candor (care personally + challenge directly) is the VP superpower.' },
  { scenario:'Executives are pushing a technical decision you believe will create massive tech debt.', exercise:'Translate technical risk into executive language.', prompt:'Frame your concern as: business impact + probability + mitigation cost. Avoid saying "tech debt" — what is the business equivalent?', insight:'Influence without authority defines the VP role. Business outcomes (revenue risk, speed-to-market, retention) unlock executive alignment, not technical arguments.' },
  { scenario:'Two of your strongest engineers are in open conflict over a technology choice.', exercise:'Facilitate a structured technical debate without taking sides.', prompt:'Design a 45-minute decision-making process that uses both engineers\' strengths and resolves the conflict with a documented outcome.', insight:'Your job is to build systems where smart people resolve conflict productively. Document the decision criteria BEFORE the meeting, not the decision.' }
];

// ── Communication Tips ───────────────────────────────────────────────────────
const COMM_TIPS = [
  { category:'Executive Communication', tip:'Lead with the recommendation. Executives process top-down, not bottom-up. State the "what" first, then the "why".', example:'❌ "We analyzed 5 options over 3 weeks..." ✅ "I recommend Option B. Three reasons: [bullet points]. Details available if needed."' },
  { category:'Technical Storytelling', tip:'Use the 3-layer explanation: Business Impact → Technical Approach → Implementation Detail. Shift layers based on your audience.', example:'CEO: "This cuts deploys from 2hrs to 5min" → CTO: "GitOps with ArgoCD" → Engineer: "Declarative manifests synced via Flux controllers"' },
  { category:'Conflict Resolution', tip:'"Yes, and..." builds; "Yes, but..." blocks. Extend ideas before challenging them — it earns the right to push back.', example:'❌ "Yes, but that won\'t scale." ✅ "Yes, and as we scale we\'ll need to solve X — here\'s how I\'d approach that together."' },
  { category:'VP Interview (STAR-B)', tip:'Every technical story needs a business outcome. Use STAR-B: Situation, Task, Action, Result, Business Impact.', example:'❌ "I implemented Kafka..." ✅ "I led the Kafka migration enabling 10x throughput, which unlocked a major enterprise contract."' },
  { category:'Stakeholder Management', tip:'Send status proactively — before you\'re asked. No news is always bad news to a stakeholder.', example:'Weekly 5-sentence update: Progress · Risk · Next milestone · Need from them · Confidence 🟢🟡🔴' },
  { category:'LinkedIn Presence', tip:'Post 2-3x/week: Problem → Approach → Lesson. The VP formula: make complex things simple. Consistency > virality.', example:'Post idea: "We cut infra costs 40% without touching SLAs. Here\'s the 3-step FinOps framework we used in 2 weeks:"' },
  { category:'Async Written Comms', tip:'Add TLDR at the top of any message over 3 paragraphs. Respect cognitive load — it signals executive maturity.', example:'TLDR: K8s 1.28 upgrade Friday 2am. Impact: 15min downtime. Action needed: no deploys 1-3am Friday. Reply if blocked.' }
];

// ── Coding Challenges ─────────────────────────────────────────────────────────
const CODING_CHALLENGES = [
  { platform:'LeetCode', title:'Design a Rate Limiter', difficulty:'Medium', url:'https://leetcode.com/problems/design-rate-limiter/', relevance:'API Gateway / PlatformOps — Token Bucket vs Sliding Window', hint:'Director-level: also design the distributed version with Redis + Lua scripts for atomicity.' },
  { platform:'LeetCode', title:'LRU Cache', difficulty:'Medium', url:'https://leetcode.com/problems/lru-cache/', relevance:'Caching strategy in distributed systems', hint:'HashMap + Doubly Linked List. O(1) get/put. Maps directly to Envoy/Nginx cache tuning.' },
  { platform:'LeetCode', title:'Design Twitter / News Feed', difficulty:'Medium', url:'https://leetcode.com/problems/design-twitter/', relevance:'Event streaming, fan-out — maps to your Cloud Data Stream project', hint:'Think Kafka topic fan-out vs pull model. This is exactly what CDS solves.' },
  { platform:'LeetCode', title:'Word Ladder', difficulty:'Hard', url:'https://leetcode.com/problems/word-ladder/', relevance:'Graph traversal — used in dependency resolution (K8s scheduler)', hint:'BFS on implicit graph. K8s scheduler uses similar algorithms for pod placement.' },
  { platform:'Exercism', title:'Go Track — Cloud Native', difficulty:'Intermediate', url:'https://exercism.org/tracks/go', relevance:'Go is the language of cloud-native infra (K8s, Terraform, ArgoCD all written in Go)', hint:'Learning Go deepens understanding of K8s controllers, Terraform providers, and ArgoCD internals.' },
  { platform:'Exercism', title:'Python Track — MLOps Scripts', difficulty:'Beginner', url:'https://exercism.org/tracks/python', relevance:'Python for MLOps automation, data pipelines, Kubeflow components', hint:'Focus on generators, context managers, and async/await — critical for efficient ML pipeline code.' },
  { platform:'LeetCode', title:'Serialize and Deserialize Binary Tree', difficulty:'Hard', url:'https://leetcode.com/problems/serialize-and-deserialize-binary-tree/', relevance:'Data serialization — Protocol Buffers, Avro (used in your Kafka/Flink stack)', hint:'This maps to schema evolution challenges in your DaaS platform with Apache Hudi.' }
];

// =============================================================================
// CareerAssistant Class
// =============================================================================
class CareerAssistant {
  constructor() {
    this.profile = CAREER_PROFILE;
    this.s = this.loadState();
    this.timerInterval = null;
    this.timerEnd = null;
    this.iqIndex = 0;
    this.eqIndex = 0;
    this.commIndex = 0;
    this.challengeIndex = 0;
    this.iqAnswered = false;
    this.init();
  }

  // ── State management ─────────────────────────────────────────────────────
  loadState() {
    const defaults = {
      apiKey: '', todos: [], notes: '', jobApps: [], chatHistory: [],
      learningProgress: {}, streakDays: 0, lastVisit: '',
      leetcodeUsername: '', exercismUsername: '', githubData: null,
      iqScore: 0, eqScore: 0, iqStreak: 0
    };
    const s = { ...defaults };
    Object.keys(defaults).forEach(k => {
      const raw = localStorage.getItem(`ca_${k}`);
      if (raw !== null) {
        try { s[k] = JSON.parse(raw); } catch { s[k] = raw; }
      }
    });
    return s;
  }

  save(key, val) {
    this.s[key] = val;
    localStorage.setItem(`ca_${key}`, typeof val === 'object' ? JSON.stringify(val) : String(val));
  }

  // ── Initialization ────────────────────────────────────────────────────────
  init() {
    this.setupPanel();
    this.updateStreak();
    setTimeout(() => {
      this.loadHubData();
      this.fetchGitHub();
      this.loadBrainTab();
      this.loadLearningPath();
      this.renderJobTracker();
      this.renderChatHistory();
      this.loadTemplate();
      this.updateApiKeyUI();
      if (this.s.notes) document.getElementById('notesArea').value = this.s.notes;
    }, 300);
  }

  setupPanel() {
    // Trigger button
    document.getElementById('assistantTrigger').addEventListener('click', () => this.openPanel());
    document.getElementById('panelClose').addEventListener('click', () => this.closePanel());
    document.getElementById('panelMinimize').addEventListener('click', () => this.closePanel());
    document.getElementById('assistantOverlay').addEventListener('click', () => this.closePanel());

    // Tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => this.switchTab(btn.dataset.tab));
    });

    // Jobs subtabs
    document.querySelectorAll('.jobs-subtab').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.jobs-subtab').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.jobs-subtab-content').forEach(c => c.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById(`subtab-${btn.dataset.subtab}`).classList.add('active');
      });
    });

    // Chat
    const chatInput = document.getElementById('chatInput');
    chatInput.addEventListener('keydown', e => {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); this.sendMessage(); }
    });

    // Notes
    document.getElementById('notesArea').addEventListener('input', e => {
      this.save('notes', e.target.value);
    });

    // Render suggestions
    this.renderSuggestions();

    // Learning domain change
    document.getElementById('learnDomain').addEventListener('change', () => this.loadLearningPath());
  }

  openPanel() {
    document.getElementById('assistantPanel').classList.add('open');
    document.getElementById('assistantOverlay').classList.add('visible');
    document.getElementById('assistantTrigger').style.display = 'none';
  }

  closePanel() {
    document.getElementById('assistantPanel').classList.remove('open');
    document.getElementById('assistantOverlay').classList.remove('visible');
    document.getElementById('assistantTrigger').style.display = 'flex';
  }

  switchTab(tab) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
    document.querySelector(`.tab-btn[data-tab="${tab}"]`).classList.add('active');
    document.getElementById(`tab-${tab}`).classList.add('active');
  }

  toggleNotes() {
    const area = document.getElementById('notesArea');
    const chevron = document.getElementById('notesChevron');
    const visible = area.style.display !== 'none';
    area.style.display = visible ? 'none' : 'block';
    chevron.style.transform = visible ? '' : 'rotate(180deg)';
  }

  updateStreak() {
    const today = new Date().toDateString();
    if (this.s.lastVisit !== today) {
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      const streak = this.s.lastVisit === yesterday ? this.s.streakDays + 1 : 1;
      this.save('streakDays', streak);
      this.save('lastVisit', today);
    }
  }

  // ── Hub Tab ───────────────────────────────────────────────────────────────
  loadHubData() {
    this.renderTodos();
    this.renderDailyBrief();
    this.renderLeetCodeStats();
  }

  renderDailyBrief() {
    const el = document.getElementById('dailyBrief');
    const briefDate = document.getElementById('briefDate');
    const now = new Date();
    briefDate.textContent = now.toLocaleDateString('en-US', { weekday:'long', month:'short', day:'numeric' });

    const completedToday = this.s.todos.filter(t => t.done).length;
    const total = this.s.todos.length;
    const domain = document.getElementById('learnDomain')?.value || 'platformops';
    const path = LEARNING_PATHS[domain];

    el.innerHTML = `
      <div class="brief-section">
        <h5>Career Progress</h5>
        <div class="brief-stat-row">
          <div class="brief-stat"><span class="val">${this.s.streakDays}</span><span class="lbl">Day Streak</span></div>
          <div class="brief-stat"><span class="val">${completedToday}/${total}</span><span class="lbl">Tasks Done</span></div>
          <div class="brief-stat"><span class="val">${this.s.iqScore}</span><span class="lbl">IQ Points</span></div>
          <div class="brief-stat"><span class="val">${this.s.jobApps.length}</span><span class="lbl">Applications</span></div>
        </div>
      </div>
      <div class="brief-section">
        <h5>Today's Focus — ${path ? path.title : 'Platform Engineering'}</h5>
        <p>Priority: Complete 1 learning module + 1 LeetCode problem + compose 3 LinkedIn messages.</p>
      </div>
      <div class="brief-section">
        <h5>Roles Match</h5>
        ${this.profile.targetRoles.slice(0,3).map(r => `
          <div style="margin-bottom:6px">
            <div style="display:flex;justify-content:space-between;font-size:12px;color:#94a3b8;margin-bottom:3px">
              <span>${r.title}</span><span style="color:#a5b4fc;font-weight:700">${r.match}%</span>
            </div>
            <div class="course-progress-bar"><div class="course-progress-fill" style="width:${r.match}%"></div></div>
          </div>
        `).join('')}
      </div>`;
  }

  // ── Todos ─────────────────────────────────────────────────────────────────
  renderTodos() {
    const el = document.getElementById('todayGoals');
    if (!el) return;
    const html = `
      <div class="goals-list">
        ${this.s.todos.map((t, i) => `
          <div class="goal-item">
            <button class="goal-check ${t.done ? 'done' : ''}" onclick="assistant.toggleTodo(${i})"></button>
            <span class="goal-text ${t.done ? 'done' : ''}">${this.esc(t.text)}</span>
            <button class="goal-delete" onclick="assistant.deleteTodo(${i})"><i class="fas fa-times"></i></button>
          </div>
        `).join('')}
      </div>
      <div class="add-goal-row">
        <input id="newTodoInput" placeholder="Add task or goal..." onkeydown="if(event.key==='Enter')assistant.addTodo()" />
        <button onclick="assistant.addTodo()"><i class="fas fa-plus"></i></button>
      </div>`;
    el.innerHTML = html;
  }

  addTodo() {
    const input = document.getElementById('newTodoInput');
    if (!input || !input.value.trim()) return;
    const todos = [...this.s.todos, { text: input.value.trim(), done: false, created: Date.now() }];
    this.save('todos', todos);
    input.value = '';
    this.renderTodos();
    this.renderDailyBrief();
  }

  toggleTodo(i) {
    const todos = [...this.s.todos];
    todos[i].done = !todos[i].done;
    this.save('todos', todos);
    this.renderTodos();
    this.renderDailyBrief();
  }

  deleteTodo(i) {
    const todos = this.s.todos.filter((_, idx) => idx !== i);
    this.save('todos', todos);
    this.renderTodos();
  }

  // ── GitHub Integration ────────────────────────────────────────────────────
  async fetchGitHub() {
    const el = document.getElementById('githubStats');
    el.innerHTML = '<div class="loading-spinner"></div>';
    try {
      const [user, repos, events] = await Promise.all([
        fetch(`https://api.github.com/users/${this.profile.github}`).then(r => r.json()),
        fetch(`https://api.github.com/users/${this.profile.github}/repos?sort=updated&per_page=5`).then(r => r.json()),
        fetch(`https://api.github.com/users/${this.profile.github}/events?per_page=10`).then(r => r.json())
      ]);

      const recentCommits = Array.isArray(events) ? events.filter(e => e.type === 'PushEvent').length : 0;
      const languages = [...new Set(repos.map(r => r.language).filter(Boolean))].slice(0, 5);

      this.save('githubData', { user, repos: repos.slice(0, 5), fetchedAt: Date.now() });

      el.innerHTML = `
        <div class="github-stats">
          <div class="gh-stat"><span class="gh-stat-label">Public Repos</span><span class="gh-stat-value">${user.public_repos || 0}</span></div>
          <div class="gh-stat"><span class="gh-stat-label">Followers</span><span class="gh-stat-value">${user.followers || 0}</span></div>
          <div class="gh-stat"><span class="gh-stat-label">Recent Pushes</span><span class="gh-stat-value">${recentCommits}</span></div>
        </div>
        <div class="gh-langs">${languages.map(l => `<span class="gh-lang-tag">${l}</span>`).join('')}</div>
        <div class="gh-repos">
          ${repos.slice(0, 4).map(r => `
            <div class="gh-repo">
              <a href="${r.html_url}" target="_blank" class="gh-repo-name">${r.name}</a>
              <span class="gh-repo-stars">⭐ ${r.stargazers_count}</span>
            </div>`).join('')}
        </div>
        <a href="https://github.com/${this.profile.github}" target="_blank" style="color:#6366f1;font-size:11px;text-decoration:none;display:block;margin-top:8px">View all on GitHub →</a>`;
    } catch {
      el.innerHTML = `<p style="color:#64748b;font-size:12px">Could not load GitHub data. <button onclick="assistant.fetchGitHub()" style="background:none;border:none;color:#6366f1;cursor:pointer;font-size:12px">Retry</button></p>`;
    }
  }

  // ── LeetCode Stats ────────────────────────────────────────────────────────
  renderLeetCodeStats() {
    const el = document.getElementById('leetcodeStats');
    const user = this.s.leetcodeUsername;
    if (!user) {
      el.innerHTML = `
        <p style="color:#64748b;font-size:12px;margin-bottom:8px">Enter your LeetCode username to track progress</p>
        <div class="leet-form">
          <input id="leetcodeInput" placeholder="your-username" />
          <button onclick="assistant.saveLeetcodeUser()">Set</button>
        </div>`;
      return;
    }
    // Use open-source LeetCode stats API
    el.innerHTML = '<div class="loading-spinner"></div>';
    fetch(`https://leetcode-stats-api.herokuapp.com/${user}`)
      .then(r => r.json())
      .then(data => {
        if (data.status === 'error') throw new Error('User not found');
        el.innerHTML = `
          <div class="leet-stats">
            <div class="leet-stat"><span class="leet-label">Total Solved</span><span style="color:#a5b4fc;font-weight:700">${data.totalSolved}/${data.totalQuestions}</span></div>
            <div class="leet-stat"><span class="leet-label">Easy</span><span class="leet-easy">${data.easySolved}</span></div>
            <div class="leet-stat"><span class="leet-label">Medium</span><span class="leet-medium">${data.mediumSolved}</span></div>
            <div class="leet-stat"><span class="leet-label">Hard</span><span class="leet-hard">${data.hardSolved}</span></div>
            <div class="leet-stat"><span class="leet-label">Acceptance</span><span style="color:#94a3b8">${data.acceptanceRate?.toFixed(1)}%</span></div>
          </div>
          <a href="https://leetcode.com/${user}" target="_blank" style="color:#6366f1;font-size:11px;text-decoration:none;display:block;margin-top:8px">View LeetCode Profile →</a>`;
      })
      .catch(() => {
        el.innerHTML = `<p style="color:#64748b;font-size:12px">Could not load LeetCode data for <strong style="color:#a5b4fc">${user}</strong>. <button onclick="assistant.clearLeetcodeUser()" style="background:none;border:none;color:#f87171;cursor:pointer;font-size:11px">Reset</button></p>`;
      });
  }

  saveLeetcodeUser() {
    const val = document.getElementById('leetcodeInput')?.value?.trim();
    if (!val) return;
    this.save('leetcodeUsername', val);
    this.renderLeetCodeStats();
  }

  clearLeetcodeUser() {
    this.save('leetcodeUsername', '');
    this.renderLeetCodeStats();
  }

  // ── Chat with Claude ──────────────────────────────────────────────────────
  updateApiKeyUI() {
    const config = document.getElementById('apiConfig');
    if (config) config.style.display = this.s.apiKey ? 'none' : 'block';
  }

  saveApiKey() {
    const key = document.getElementById('apiKeyInput')?.value?.trim();
    if (!key || !key.startsWith('sk-ant-')) {
      alert('Please enter a valid Anthropic API key (starts with sk-ant-)');
      return;
    }
    this.save('apiKey', key);
    this.updateApiKeyUI();
    this.addAssistantMessage('**Power Mode on.** I can now go beyond quick facts and answer open-ended questions in depth — feel free to ask anything.');
  }

  renderSuggestions() {
    const suggestions = [
      'Tell me about yourself',
      'How big a team have you led?',
      'What certifications do you hold?',
      'Tell me about the AI Gateway project',
      'Are you a manager or an architect?',
      'How do I reach you?'
    ];
    const el = document.getElementById('chatSuggestions');
    if (!el) return;
    el.innerHTML = suggestions.map(s =>
      `<button class="chat-suggestion" onclick="assistant.useSuggestion('${s}')">${s}</button>`
    ).join('');
  }

  useSuggestion(text) {
    document.getElementById('chatInput').value = text;
    this.sendMessage();
  }

  buildSystemPrompt() {
    const p = this.profile;
    return `You are Gurpreet Gandhi, speaking in the first person directly to a visitor on your personal site — likely a recruiter, hiring manager, or engineering peer. This is "Power Mode": deeper, freeform Q&A beyond the quick-facts chat.

Answer naturally, concretely, and honestly using ONLY the facts below — never invent employers, numbers, dates, or claims that aren't listed. If asked something outside this profile (compensation specifics, opinions unrelated to your work), say so plainly rather than guessing.

FACTS ABOUT YOU:
- Current role: ${p.currentTitle} at ${p.currentCompany}
- Years of experience: ${p.yearsExp}+
- Target roles: ${p.targetRoles.map(r => r.title).join(', ')}
- Team leadership: ${p.teamLeadership.builtTeam}. ${p.teamLeadership.maxOrg}. ${p.teamLeadership.aiGatewayTeam}. ${p.teamLeadership.genAiTeam}. ${p.teamLeadership.mlPlatformOrg}. ${p.teamLeadership.mentoring}.
- Certifications: ${p.certifications.join('; ')}
- Expert skills: ${p.skills.expert.join(', ')}
- Advanced skills: ${p.skills.advanced.join(', ')}
- Domains: ${p.domains.join(', ')}
- Projects: ${p.projects.map(pr => pr.name + ' — ' + pr.impact).join(' | ')}
- Contact: ${p.email} · linkedin.com/in/${p.linkedin} · github.com/${p.github}

TONE: Confident, warm, concise — not salesy. Format with markdown-style bold for key terms. Keep responses under 250 words unless the visitor explicitly asks for depth.`;
  }

  async sendMessage() {
    const input = document.getElementById('chatInput');
    const msg = input?.value?.trim();
    if (!msg) return;

    input.value = '';
    this.addUserMessage(msg);

    if (!this.s.apiKey) {
      // Default mode: no API key needed — rule-based "virtual Gurpreet" answers instantly.
      this.addThinkingMessage();
      const reply = matchFAQ(msg);
      const newHistory = [...this.s.chatHistory,
        { role: 'user', content: msg },
        { role: 'assistant', content: reply }
      ].slice(-30);
      this.save('chatHistory', newHistory);
      setTimeout(() => {
        this.removeThinking();
        this.addAssistantMessage(reply);
      }, 350);
      return;
    }

    this.addThinkingMessage();

    const history = this.s.chatHistory.slice(-12);

    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.s.apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true'
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 1024,
          system: this.buildSystemPrompt(),
          messages: [
            ...history.map(m => ({ role: m.role, content: m.content })),
            { role: 'user', content: msg }
          ]
        })
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error.message);
      const reply = data.content[0].text;

      const newHistory = [...this.s.chatHistory,
        { role: 'user', content: msg },
        { role: 'assistant', content: reply }
      ].slice(-30);
      this.save('chatHistory', newHistory);

      this.removeThinking();
      this.addAssistantMessage(reply);
    } catch (err) {
      this.removeThinking();
      this.addAssistantMessage(`⚠️ API error: ${err.message}. Check your API key in the config above.`);
    }
  }

  addUserMessage(text) {
    const el = document.getElementById('chatMessages');
    el.innerHTML += `
      <div class="chat-msg user">
        <div class="chat-avatar"><i class="fas fa-user"></i></div>
        <div class="chat-bubble">${this.esc(text)}</div>
      </div>`;
    el.scrollTop = el.scrollHeight;
  }

  addAssistantMessage(text) {
    const el = document.getElementById('chatMessages');
    const formatted = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\n/g, '<br>');
    el.innerHTML += `
      <div class="chat-msg">
        <div class="chat-avatar"><i class="fas fa-robot"></i></div>
        <div class="chat-bubble">${formatted}</div>
      </div>`;
    el.scrollTop = el.scrollHeight;
  }

  addThinkingMessage() {
    const el = document.getElementById('chatMessages');
    el.innerHTML += `
      <div class="chat-msg" id="thinkingMsg">
        <div class="chat-avatar"><i class="fas fa-robot"></i></div>
        <div class="chat-bubble thinking"><i class="fas fa-spinner fa-spin"></i> Thinking...</div>
      </div>`;
    el.scrollTop = el.scrollHeight;
  }

  removeThinking() {
    document.getElementById('thinkingMsg')?.remove();
  }

  renderChatHistory() {
    const el = document.getElementById('chatMessages');
    if (!el || this.s.chatHistory.length === 0) {
      if (el) el.innerHTML = `
        <div class="chat-msg">
          <div class="chat-avatar"><i class="fas fa-robot"></i></div>
          <div class="chat-bubble">
            👋 Hi, I'm <strong>Gurpreet Gandhi</strong> — or rather, a virtual version of me trained on my real profile.<br><br>
            Ask me about my current role, team leadership experience, certifications, tech stack, or any of my featured projects (AI Gateway, DaaS, RunRun, ML Platform) — I'll answer instantly, no sign-up needed.<br><br>
            Want deeper, open-ended answers? Turn on <strong>Power Mode</strong> above with a Claude API key.
          </div>
        </div>`;
      return;
    }
    this.s.chatHistory.slice(-10).forEach(m => {
      if (m.role === 'user') this.addUserMessage(m.content);
      else this.addAssistantMessage(m.content);
    });
  }

  // ── Learning Tab ──────────────────────────────────────────────────────────
  loadLearningPath() {
    const domain = document.getElementById('learnDomain')?.value || 'platformops';
    const path = LEARNING_PATHS[domain];
    const el = document.getElementById('learningPath');
    if (!el || !path) return;

    const progress = this.s.learningProgress;

    el.innerHTML = `
      <div class="learning-header">
        <h4>${path.icon} ${path.title}</h4>
        <p>${path.description}</p>
        <div class="skills-to-gain">${path.skillsToGain.map(s => `<span class="skill-pill">${s}</span>`).join('')}</div>
      </div>
      <div class="courses-list">
        ${path.courses.map((c, i) => {
          const key = `${domain}_${i}`;
          const pct = progress[key] || 0;
          return `
            <a href="${c.url}" target="_blank" class="course-item" onclick="assistant.trackCourse('${key}')">
              <div class="course-top">
                <span class="course-title">${c.title}</span>
                ${c.free ? '<span class="course-free-badge">FREE</span>' : ''}
              </div>
              <div class="course-provider">${c.provider}</div>
              <div class="course-meta">
                <span class="course-level">${c.level}</span>
                <span class="course-duration">⏱ ${c.duration}</span>
              </div>
              ${pct > 0 ? `<div class="course-progress-bar"><div class="course-progress-fill" style="width:${pct}%"></div></div>` : ''}
            </a>`;
        }).join('')}
      </div>
      <div class="resources-section">
        <h5>Resources & Communities</h5>
        <div class="resource-links">
          ${path.resources.map(r => `
            <a href="${r.url}" target="_blank" class="resource-link ${r.type}">
              ${r.type === 'github' ? '<i class="fab fa-github"></i>' : r.type === 'community' ? '<i class="fas fa-users"></i>' : '<i class="fas fa-link"></i>'}
              ${r.name}
            </a>`).join('')}
        </div>
      </div>`;

    this.loadTodayChallenge();
    this.loadExercismTracks();
  }

  trackCourse(key) {
    const progress = { ...this.s.learningProgress };
    if (!progress[key]) progress[key] = 10; // mark as started
    this.save('learningProgress', progress);
  }

  loadTodayChallenge() {
    const el = document.getElementById('todayChallenge');
    if (!el) return;
    const c = CODING_CHALLENGES[this.challengeIndex % CODING_CHALLENGES.length];
    el.innerHTML = `
      <div class="challenge-header">
        <span class="challenge-title">${c.title}</span>
        <span class="challenge-platform">${c.platform}</span>
      </div>
      <div class="difficulty-${c.difficulty.toLowerCase()}">${c.difficulty}</div>
      <div class="challenge-relevance">💡 ${c.relevance}</div>
      <div class="challenge-hint">🔑 ${c.hint}</div>
      <div style="display:flex;gap:8px;margin-top:10px;flex-wrap:wrap">
        <a href="${c.url}" target="_blank" class="challenge-link">Open Challenge →</a>
        <button onclick="assistant.nextChallenge()" style="background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.12);color:#94a3b8;border-radius:6px;padding:7px 14px;font-size:12px;cursor:pointer">Next →</button>
      </div>`;
  }

  nextChallenge() {
    this.challengeIndex++;
    this.loadTodayChallenge();
  }

  loadExercismTracks() {
    const el = document.getElementById('exercismTrack');
    if (!el) return;
    el.innerHTML = `
      <div class="exercism-content">
        <div class="exercism-track">
          <h5>Go Track — Cloud Native Infra</h5>
          <p>Go powers K8s, Terraform, ArgoCD, and Prometheus. Essential for VP Platform Engineering.</p>
          <a href="https://exercism.org/tracks/go" target="_blank"><i class="fas fa-external-link-alt"></i> Start Go Track on Exercism</a>
        </div>
        <div class="exercism-track">
          <h5>Python Track — MLOps Automation</h5>
          <p>Python is the lingua franca of MLOps — Kubeflow components, data pipelines, and automation scripts.</p>
          <a href="https://exercism.org/tracks/python" target="_blank"><i class="fas fa-external-link-alt"></i> Start Python Track on Exercism</a>
        </div>
        <div class="exercism-track">
          <h5>Rust Track — Systems Programming</h5>
          <p>Rust is emerging in cloud-native tools (Firecracker, Bottlerocket, Linux kernel modules).</p>
          <a href="https://exercism.org/tracks/rust" target="_blank"><i class="fas fa-external-link-alt"></i> Explore Rust Track</a>
        </div>
      </div>`;
  }

  // ── Jobs Tab ──────────────────────────────────────────────────────────────
  loadTemplate() {
    const type = document.getElementById('messageType')?.value || 'connection';
    const template = LINKEDIN_TEMPLATES[type] || '';
    const el = document.getElementById('messageTemplate');
    if (el) el.textContent = template;
  }

  async generateLinkedInMessage() {
    if (!this.s.apiKey) {
      alert('Add your Claude API key in the Chat tab to generate AI messages.');
      return;
    }
    const type = document.getElementById('messageType')?.value;
    const role = document.getElementById('recipientRole')?.value || 'engineering leader';
    const company = document.getElementById('recipientCompany')?.value || 'their company';
    const el = document.getElementById('messageTemplate');
    el.textContent = 'Generating...';

    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.s.apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true'
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 400,
          messages: [{
            role: 'user',
            content: `Write a LinkedIn ${type} message from Gurpreet Gandhi (Engineering Manager & Platform Architect, 12+ years, built/scaled a 12-member platform team, led 14 engineers across 4 squads, CKAD + Google Cloud Generative AI Leader certified, built 10TB+/day systems, MLOps/LLMOps expert) to a ${role} at ${company}. Keep it under 150 words, genuine, not salesy. Highlight 1-2 specific relevant achievements. No subject line needed.`
          }]
        })
      });
      const data = await res.json();
      el.textContent = data.content[0].text;
    } catch (err) {
      el.textContent = LINKEDIN_TEMPLATES[type] || '';
    }
  }

  copyMessage() {
    const text = document.getElementById('messageTemplate')?.textContent;
    if (text) {
      navigator.clipboard.writeText(text).then(() => {
        const btn = document.querySelector('.compose-actions .secondary');
        if (btn) { btn.innerHTML = '<i class="fas fa-check"></i> Copied!'; setTimeout(() => { btn.innerHTML = '<i class="fas fa-copy"></i> Copy'; }, 2000); }
      });
    }
  }

  addJobApplication() {
    const modal = document.getElementById('jobModal');
    if (modal) { modal.classList.add('visible'); return; }
    // Create modal
    const m = document.createElement('div');
    m.className = 'modal-overlay visible'; m.id = 'jobModal';
    m.innerHTML = `
      <div class="modal-box">
        <h4><i class="fas fa-briefcase"></i> Add Job Application</h4>
        <div class="modal-form">
          <input id="jTitle" placeholder="Job Title (e.g. VP Platform Engineering)" />
          <input id="jCompany" placeholder="Company Name" />
          <input id="jUrl" placeholder="Job posting URL (optional)" />
          <input id="jDate" type="date" value="${new Date().toISOString().split('T')[0]}" />
          <select id="jStatus">
            <option value="saved">💾 Saved</option>
            <option value="applied">📤 Applied</option>
            <option value="interview">🤝 Interview</option>
            <option value="offer">🎉 Offer</option>
            <option value="rejected">❌ Rejected</option>
          </select>
          <input id="jNote" placeholder="Notes (optional)" />
        </div>
        <div class="modal-actions">
          <button class="btn-save" onclick="assistant.saveJobApp()">Save Application</button>
          <button class="btn-cancel" onclick="assistant.closeModal()">Cancel</button>
        </div>
      </div>`;
    document.body.appendChild(m);
  }

  saveJobApp() {
    const app = {
      id: Date.now(),
      title: document.getElementById('jTitle')?.value || 'Unknown Role',
      company: document.getElementById('jCompany')?.value || 'Unknown Company',
      url: document.getElementById('jUrl')?.value || '',
      date: document.getElementById('jDate')?.value || new Date().toISOString().split('T')[0],
      status: document.getElementById('jStatus')?.value || 'saved',
      note: document.getElementById('jNote')?.value || ''
    };
    const apps = [...this.s.jobApps, app];
    this.save('jobApps', apps);
    this.closeModal();
    this.renderJobTracker();
    this.renderDailyBrief();
  }

  closeModal() {
    document.getElementById('jobModal')?.remove();
  }

  renderJobTracker() {
    const el = document.getElementById('jobTracker');
    if (!el) return;
    if (!this.s.jobApps.length) {
      el.innerHTML = '<p style="color:#64748b;font-size:12px;text-align:center;padding:20px">No applications yet. Add your first one above!</p>';
      return;
    }
    el.innerHTML = this.s.jobApps.slice().reverse().map(app => `
      <div class="job-card ${app.status}">
        <div class="job-top">
          <span class="job-title">${this.esc(app.title)}</span>
          <span class="job-status status-${app.status}">${this.statusLabel(app.status)}</span>
        </div>
        <div class="job-company">${this.esc(app.company)}</div>
        <div class="job-meta">
          <span>${app.date}</span>
          ${app.note ? `<span>${this.esc(app.note)}</span>` : ''}
          ${app.url ? `<a href="${app.url}" target="_blank" style="color:#6366f1;font-size:11px">View Posting</a>` : ''}
        </div>
        <button class="job-delete" onclick="assistant.deleteJobApp(${app.id})" title="Delete">
          <i class="fas fa-trash"></i>
        </button>
      </div>`).join('');
  }

  statusLabel(s) {
    return { saved:'💾 Saved', applied:'📤 Applied', interview:'🤝 Interview', offer:'🎉 Offer', rejected:'❌ Rejected' }[s] || s;
  }

  deleteJobApp(id) {
    if (!confirm('Remove this application?')) return;
    this.save('jobApps', this.s.jobApps.filter(a => a.id !== id));
    this.renderJobTracker();
    this.renderDailyBrief();
  }

  async analyzeJD() {
    const jd = document.getElementById('jobDescription')?.value?.trim();
    const el = document.getElementById('jdAnalysis');
    if (!jd) { alert('Paste a job description first.'); return; }

    el.classList.add('visible');
    el.innerHTML = '<div class="loading-spinner"></div>';

    if (!this.s.apiKey) {
      // Offline analysis
      const mySkills = [...this.profile.skills.expert, ...this.profile.skills.advanced];
      const jdLower = jd.toLowerCase();
      const matches = mySkills.filter(s => jdLower.includes(s.toLowerCase()));
      const domainMatches = this.profile.domains.filter(d => jdLower.includes(d.toLowerCase()));
      const score = Math.min(99, 60 + matches.length * 5);
      el.innerHTML = `
        <div class="match-score">${score}% Profile Match</div>
        <div class="match-section"><h5>Strong Matches</h5>
          <ul class="match-list">${matches.map(m => `<li class="good">${m}</li>`).join('')}${domainMatches.map(d => `<li class="good">${d}</li>`).join('')}</ul>
        </div>
        <div class="match-section"><h5>Potential Gaps to Address</h5>
          <ul class="match-list">
            ${this.profile.skills.growing.filter(s => jdLower.includes(s.toLowerCase())).map(s => `<li class="gap">${s} — growing skill, strengthen before applying</li>`).join('')}
            <li class="learn">Add Claude API key for detailed AI-powered gap analysis</li>
          </ul>
        </div>`;
      return;
    }

    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.s.apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true'
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 600,
          messages: [{
            role: 'user',
            content: `Analyze this JD against Gurpreet Gandhi's profile. Profile: ${JSON.stringify(this.profile)}. JD: ${jd}. Output: 1) A % match score 2) 5 strongest alignment points (prefix with ✅) 3) 3 gaps to address (prefix with 📌) 4) 2 learning recommendations (prefix with 📚). Keep it concise.`
          }]
        })
      });
      const data = await res.json();
      const text = data.content[0].text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n/g, '<br>');
      el.innerHTML = `<div style="color:#94a3b8;font-size:13px;line-height:1.7">${text}</div>`;
    } catch (err) {
      el.innerHTML = `<p style="color:#f87171">Analysis failed: ${err.message}</p>`;
    }
  }

  // ── Brain Tab ─────────────────────────────────────────────────────────────
  loadBrainTab() {
    this.loadIQChallenge();
    this.loadEQExercise();
    this.loadCommTip();
  }

  loadIQChallenge() {
    const el = document.getElementById('iqChallenge');
    if (!el) return;
    this.iqAnswered = false;
    const c = IQ_CHALLENGES[this.iqIndex % IQ_CHALLENGES.length];
    el.innerHTML = `
      <p class="iq-question">${c.question}</p>
      <div class="iq-options">
        ${c.options.map((opt, i) => `
          <button class="iq-option" onclick="assistant.answerIQ(${i}, ${c.answer})">${opt}</button>
        `).join('')}
      </div>
      <div class="iq-explanation" id="iqExpl">${c.explanation}</div>
      <button class="iq-next-btn" id="iqNext" onclick="assistant.nextIQ()">Next Challenge →</button>`;
  }

  answerIQ(selected, correct) {
    if (this.iqAnswered) return;
    this.iqAnswered = true;
    const opts = document.querySelectorAll('.iq-option');
    opts[selected].classList.add(selected === correct ? 'correct' : 'wrong');
    opts[correct].classList.add('correct');
    document.getElementById('iqExpl').classList.add('show');
    document.getElementById('iqNext').classList.add('show');
    if (selected === correct) {
      this.save('iqScore', this.s.iqScore + 10);
      this.renderDailyBrief();
    }
  }

  nextIQ() {
    this.iqIndex++;
    this.loadIQChallenge();
  }

  loadEQExercise() {
    const el = document.getElementById('eqExercise');
    if (!el) return;
    const e = EQ_EXERCISES[this.eqIndex % EQ_EXERCISES.length];
    el.innerHTML = `
      <div class="eq-scenario">${e.scenario}</div>
      <div class="eq-exercise">${e.exercise}</div>
      <div class="eq-prompt">"${e.prompt}"</div>
      <div class="eq-insight">${e.insight}</div>
      <button onclick="assistant.nextEQ()" style="margin-top:10px;background:rgba(99,102,241,0.15);border:1px solid rgba(99,102,241,0.3);color:#a5b4fc;border-radius:6px;padding:6px 14px;font-size:12px;cursor:pointer">Next Scenario →</button>`;
  }

  nextEQ() { this.eqIndex++; this.loadEQExercise(); }

  loadCommTip() {
    const el = document.getElementById('commTip');
    if (!el) return;
    const t = COMM_TIPS[this.commIndex % COMM_TIPS.length];
    el.innerHTML = `
      <span class="comm-category">${t.category}</span>
      <p class="comm-tip">${t.tip}</p>
      <div class="comm-example">${t.example}</div>
      <button onclick="assistant.nextComm()" style="margin-top:10px;background:rgba(99,102,241,0.15);border:1px solid rgba(99,102,241,0.3);color:#a5b4fc;border-radius:6px;padding:6px 14px;font-size:12px;cursor:pointer">Next Tip →</button>`;
  }

  nextComm() { this.commIndex++; this.loadCommTip(); }

  // ── Pomodoro Timer ────────────────────────────────────────────────────────
  startTimer(minutes) {
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.timerEnd = Date.now() + minutes * 60 * 1000;
    document.getElementById('timerStatus').textContent = minutes === 5 ? '☕ Break time — relax!' : '🎯 Focus mode — you\'ve got this!';
    this.timerInterval = setInterval(() => {
      const left = Math.max(0, this.timerEnd - Date.now());
      const m = Math.floor(left / 60000);
      const s = Math.floor((left % 60000) / 1000);
      document.getElementById('timerDisplay').textContent = `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
      if (left === 0) {
        clearInterval(this.timerInterval);
        document.getElementById('timerStatus').textContent = '✅ Session complete!';
        if (Notification.permission === 'granted') new Notification('Focus session complete! Take a break 🎉');
      }
    }, 500);
    if (Notification.permission === 'default') Notification.requestPermission();
  }

  stopTimer() {
    if (this.timerInterval) clearInterval(this.timerInterval);
    document.getElementById('timerDisplay').textContent = '00:00';
    document.getElementById('timerStatus').textContent = 'Timer stopped';
  }

  // ── Utility ───────────────────────────────────────────────────────────────
  esc(s) {
    if (!s) return '';
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }
}

// ── Initialize on DOM ready ───────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  window.assistant = new CareerAssistant();
});
