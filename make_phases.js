import fs from "fs";

const books = JSON.parse(fs.readFileSync("curriculum_550.json", "utf-8"));
const phasesDef = [
  {
    order: 1,
    name: "Phase 01: Indian Cash Defense & Daily Habit Architecture",
    track: "Wealth / Markets & FIRE",
    priority: "EXTREMELY HIGH",
    status: "Active Reading",
    modernHighlight: "Money Works (Deepak Shenoy) & Same as Ever (Morgan Housel)",
    anchorClassic: "Let's Talk Money (Monika Halan) & Atomic Habits (James Clear)",
    keys: ["let's talk money", "psychology of money", "atomic habits", "personal finance", "simple path to wealth", "same as ever", "algebra of wealth", "rich dad", "millionaire next door", "babylon", "bogleheads", "cash", "habit"]
  },
  {
    order: 2,
    name: "Phase 02: 2024-2026 Modern AI Engineering & Production LLMs",
    track: "AI & Tech Leverage (2024-2026)",
    priority: "EXTREMELY HIGH",
    status: "Active Reading",
    modernHighlight: "The Thinking Machine (2025), Supremacy (2024) & ai Engineering (2025)",
    anchorClassic: "Designing Data-Intensive Applications & Artificial Intelligence",
    keys: ["ai engineering", "llm", "foundation model", "thinking machine", "supremacy", "why machines learn", "agentic", "openai", "deepmind", "artificial intelligence", "coming wave", "nexus", "co-intelligence", "machine learning", "neural network", "chatgpt", "langchain", "langgraph", "sharon zhou", "karen hao"]
  },
  {
    order: 3,
    name: "Phase 03: Senior Systems Architecture & TCS Escape",
    track: "Systems & Architecture",
    priority: "EXTREMELY HIGH",
    status: "Next Up",
    modernHighlight: "The Software Engineer's Guidebook (Gergely Orosz)",
    anchorClassic: "Designing Data-Intensive Applications & Clean Code",
    keys: ["software engineer's guidebook", "system design interview", "clean code", "pragmatic programmer", "code complete", "refactoring", "design patterns", "staff engineer", "cracking the coding", "computer science", "software engineering at google"]
  },
  {
    order: 4,
    name: "Phase 04: Indian Capital Markets & Compounding Champions",
    track: "Wealth / Markets & FIRE",
    priority: "EXTREMELY HIGH",
    status: "Next Up",
    modernHighlight: "The Sacred Truths of Investing (2025) & 1929 Wall Street Crash (2025)",
    anchorClassic: "Coffee Can Investing & The Intelligent Investor",
    keys: ["coffee can", "diamonds in the dust", "intelligent investor", "indian finance", "stock analysis", "valuation", "sacred truths", "1929", "security analysis", "common stocks and uncommon", "one up on wall street", "dhandho", "deepak shenoy"]
  },
  {
    order: 5,
    name: "Phase 05: Micro-SaaS, Bootstrapping & Independent Cashflow",
    track: "Micro-SaaS & Solopreneurship",
    priority: "EXTREMELY HIGH",
    status: "Queued",
    modernHighlight: "MAKE: Bootstrapper's Handbook (Pieter Levels) & Unscripted",
    anchorClassic: "The Almanack of Naval Ravikant & The Millionaire Fastlane",
    keys: ["naval", "make: the bootstrapper", "millionaire fastlane", "micro-saas", "zero to one", "unscripted", "show your work", "lean startup", "bootstrapp", "solopreneur", "founders at work"]
  },
  {
    order: 6,
    name: "Phase 06: Cloud Distributed Systems, SRE & Microservices",
    track: "Systems & Architecture",
    priority: "HIGH",
    status: "Queued",
    modernHighlight: "Learning Systems Thinking (2024) & Fundamentals of Software Architecture",
    anchorClassic: "Building Microservices & Site Reliability Engineering (Google)",
    keys: ["microservices", "distributed systems", "site reliability", "cloud", "accelerate", "systems thinking", "kubernetes", "database internals", "monolith to microservices"]
  },
  {
    order: 7,
    name: "Phase 07: Tech Geopolitics, Supply Chains & Chokepoints",
    track: "AI & Tech Leverage (2024-2026)",
    priority: "HIGH",
    status: "Queued",
    modernHighlight: "Chokepoints (2025) & Apple in China (2025)",
    anchorClassic: "Chip War (Chris Miller) & The World for Sale",
    keys: ["chokepoints", "apple in china", "chip war", "geopolitics", "supply chain", "economic warfare", "semiconductor", "world for sale", "sanctions"]
  },
  {
    order: 8,
    name: "Phase 08: Deep Mental Models & Rational Decision Science",
    track: "Decision Science & Philosophy",
    priority: "HIGH",
    status: "Queued",
    modernHighlight: "Clear Thinking (Shane Parrish) & Fluke (2024)",
    anchorClassic: "Poor Charlie's Almanack & Thinking, Fast and Slow",
    keys: ["poor charlie", "thinking, fast and slow", "superforecasting", "scout mindset", "thinking in bets", "clear thinking", "mental models", "seeking wisdom", "decision"]
  },
  {
    order: 9,
    name: "Phase 09: Sales, High-Stakes Negotiation & Persuasion",
    track: "Decision Science & Philosophy",
    priority: "HIGH",
    status: "Queued",
    modernHighlight: "Supercommunicators (Charles Duhigg 2024)",
    anchorClassic: "Never Split the Difference & Crucial Conversations",
    keys: ["never split the difference", "crucial conversations", "influence", "pitch anything", "sales", "marketing", "negotiation", "supercommunicators", "how to win friends"]
  },
  {
    order: 10,
    name: "Phase 10: Deep Work, Peak Performance & Rapid Learning",
    track: "Decision Science & Philosophy",
    priority: "HIGH",
    status: "Queued",
    modernHighlight: "Slow Productivity (Cal Newport 2024) & Hidden Potential",
    anchorClassic: "Deep Work (Cal Newport) & Peak (Anders Ericsson)",
    keys: ["deep work", "peak", "ultralearning", "so good they can't ignore you", "range", "make it stick", "a mind for numbers", "slow productivity", "hidden potential", "focus"]
  },
  {
    order: 11,
    name: "Phase 11: Real Estate Cashflow, Debt Markets & Credit",
    track: "Wealth / Markets & FIRE",
    priority: "MEDIUM",
    status: "Queued",
    modernHighlight: "The Algebra of Wealth & Debt Dynamics",
    anchorClassic: "Early Retirement Extreme & The Book on Rental Property",
    keys: ["real estate", "rental property", "p2p", "fixed income", "bond", "credit", "debt", "early retirement extreme", "property"]
  },
  {
    order: 12,
    name: "Phase 12: Business Strategy, Hypergrowth & Enterprise Scale",
    track: "Micro-SaaS & Solopreneurship",
    priority: "MEDIUM",
    status: "Queued",
    modernHighlight: "Amp It Up (Frank Slootman) & High-Growth Handbook",
    anchorClassic: "The Hard Thing About Hard Things & Good to Great",
    keys: ["strategy", "good to great", "amp it up", "hard thing about hard things", "high output management", "7 powers", "innovator's dilemma", "competitive advantage"]
  },
  {
    order: 13,
    name: "Phase 13: Quantitative Math, Statistics & Probability",
    track: "Systems & Architecture",
    priority: "MEDIUM",
    status: "Queued",
    modernHighlight: "The Signal and the Noise & Naked Statistics",
    anchorClassic: "Introduction to Algorithms (CLRS) & Fooled by Randomness",
    keys: ["mathematics", "statistics", "probability", "algorithms", "signal and the noise", "naked statistics", "clrs", "randomness", "linear algebra"]
  },
  {
    order: 14,
    name: "Phase 14: Macroeconomics, Debt Crises & Monetary Regimes",
    track: "Wealth / Markets & FIRE",
    priority: "MEDIUM",
    status: "Queued",
    modernHighlight: "The Price of Tomorrow & Big Debt Crises (Ray Dalio)",
    anchorClassic: "The Ascent of Money & Lords of Finance",
    keys: ["macroeconomics", "economics", "debt crises", "central bank", "inflation", "price of tomorrow", "ascent of money", "lords of finance", "currency"]
  },
  {
    order: 15,
    name: "Phase 15: Indian Society, History & Institutional Evolution",
    track: "Wealth / Markets & FIRE",
    priority: "MEDIUM",
    status: "Queued",
    modernHighlight: "Fault Lines (Raghuram Rajan) & India's Economic Future",
    anchorClassic: "India After Gandhi (Ramachandra Guha)",
    keys: ["india after gandhi", "indian society", "indian politics", "institutions", "difficulty of being good", "fault lines", "rethinking the indian economy"]
  },
  {
    order: 16,
    name: "Phase 16: Stoic Wisdom, Longevity & The Sovereign Life",
    track: "Decision Science & Philosophy",
    priority: "HIGH",
    status: "Queued",
    modernHighlight: "Outlive: Science of Longevity & Four Thousand Weeks",
    anchorClassic: "Mastery (Robert Greene) & Meditations (Marcus Aurelius)",
    keys: []
  }
];

const allocated = new Set();
const phaseBooks = {};
for (const p of phasesDef) phaseBooks[p.order] = [];

for (let i = 0; i < phasesDef.length - 1; i++) {
  const p = phasesDef[i];
  for (const b of books) {
    if (!allocated.has(b.title)) {
      const haystack = (b.title + " " + (b.part || "") + " " + (b.domain || "")).toLowerCase();
      if (p.keys.some(k => haystack.includes(k))) {
        phaseBooks[p.order].push(b);
        allocated.add(b.title);
      }
    }
  }
}

for (const b of books) {
  if (!allocated.has(b.title)) {
    phaseBooks[16].push(b);
    allocated.add(b.title);
  }
}

for (const p of phasesDef) {
  p.booksCount = phaseBooks[p.order].length;
  console.log(`Phase ${String(p.order).padStart(2, "0")}: ${p.name} -> ${p.booksCount} books`);
}

fs.writeFileSync("phases_metadata.json", JSON.stringify(phasesDef, null, 2));
fs.writeFileSync("phase_books_map.json", JSON.stringify(phaseBooks, null, 2));
console.log("Saved phases_metadata.json and phase_books_map.json!");
