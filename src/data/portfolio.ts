export const profile = {
  name: 'Pawan Ghimire', title: 'Senior Software Engineer', email: 'ghimirep175@gmail.com', phone: '+1 945-225-4518',
  linkedin: 'https://linkedin.com/in/pawan-ghimire-633a75235', location: 'Dallas, TX',
  headline: 'I build scalable distributed systems and cloud platforms.',
  summary: 'Senior Software Engineer specializing in Java/Spring Boot, event-driven architecture, cloud-native systems, and production-scale applications—with a focus on reliability, performance, and measurable business outcomes.'
};
export const metrics = [
  { value: '150K+', label: 'POS devices supported' }, { value: '30%', label: 'faster high-traffic queries' },
  { value: '22%', label: 'lower core API latency' }, { value: '35%', label: 'more functional test coverage' }
];
export const projects = [
  { title: 'POS Device Health Platform', subtitle: 'Observability for 150K+ retail devices', description: 'Built Spring Boot services that process device telemetry through event-driven workflows, with health data analyzed in GCP/BigQuery and surfaced through React/Redux dashboards and Grafana. Contributed across backend services, API design, event processing, query optimization, production debugging, security, and frontend integration.', result: '22% lower API latency · 30% faster queries · 150K+ devices supported', tags: ['Java', 'Spring Boot', 'Kafka', 'BigQuery', 'React', 'Grafana'] },
  { title: 'AI-Powered Device Health Insights', subtitle: 'Operational insights from historical telemetry', description: 'Integrated an internal enterprise LLM API with aggregated device-health telemetry to generate operational insights and identify trends from historical health data, while keeping the production workflow grounded in existing platform data and services.', result: 'Turned device telemetry into concise operational insights', tags: ['LLM APIs', 'GCP', 'BigQuery', 'Java', 'AI Workflows'] },
  { title: 'Automated Release Quality Platform', subtitle: 'Faster feedback with stronger engineering confidence', description: 'Expanded automated quality across API, UI, and delivery pipelines using Playwright, Selenium, and custom test orchestration to improve release confidence and reduce regression risk.', result: '35% increase in functional test coverage', tags: ['Playwright', 'Selenium', 'Java', 'GitHub Actions'] },
  { title: 'Enterprise Service Modernization', subtitle: 'Legacy systems moved toward cloud-ready services', description: 'Modernized Java services into Spring Boot microservices, improved SQL performance, and helped move workloads toward cloud-native deployment patterns.', result: '40% improvement in query performance', tags: ['Spring Boot', 'GCP', 'Kubernetes', 'SQL'] }
];
export const skills = {
  'Backend & Distributed Systems': ['Java 8/11/17', 'Spring Boot', 'REST APIs', 'Microservices', 'Apache Kafka', 'Redis', 'OAuth 2.0 / JWT', 'Spring Security'],
  'Cloud & Data': ['GCP', 'BigQuery', 'AWS', 'Kubernetes', 'Docker', 'SQL', 'Memcached'],
  'Frontend & Quality': ['React', 'Redux', 'TypeScript', 'Angular', 'Playwright', 'Selenium', 'JUnit', 'TestNG'],
  'AI & Agentic Systems': ['LLM API Integration', 'MCP', 'Agent-to-Agent (A2A)', 'Agentic Workflows', 'Prompt Engineering', 'AI-assisted Development']
};
export const experience = [
  { company: 'Walmart Global Tech', role: 'Senior Software Engineer', period: 'Oct 2024 – Aug 2026', location: 'Bentonville, AR', points: ['Built Java Spring Boot microservices and React/Redux dashboards for retail device analytics and quality automation.', 'Worked across event-driven processing, API performance, BigQuery analytics, production reliability, security, and observability.'] },
  { company: 'Paychex', role: 'Full Stack Developer', period: 'Sep 2023 – Oct 2024', location: 'Rochester, NY', points: ['Delivered Java, Spring, SQL, and Linux improvements for business-critical systems.', 'Supported production environments, modernization work, and high-priority incident resolution.'] },
  { company: 'WorldLink Communications', role: 'Full Stack Developer', period: 'Mar 2018 – May 2022', location: 'Nepal', points: ['Built customer-facing Angular, JavaScript, Java, and relational-database solutions.', 'Designed and delivered ISP billing and customer management capabilities.'] }
];
export const education = [
  { school: 'Webster University', degree: "Master's Degree, Cyber Security", year: 'May 2022 – Aug 2023' },
  { school: 'University of Bedfordshire', degree: "Bachelor's Degree, Software Engineering", year: 'Feb 2017 – Sep 2021' }
];
