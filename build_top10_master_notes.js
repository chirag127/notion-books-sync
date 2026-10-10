import "dotenv/config";
import fs from "fs";

const databaseId = process.env.NOTION_DATABASE_ID;
const token = process.env.NOTION_TOKEN;

const TOP_10_BOOKS = [
  {
    order: 1,
    title: "Let's Talk Money",
    author: "Monika Halan",
    phase: "Phase 1: Indian Cash Engine & Defense",
    domain: "Wealth / Markets & Finance",
    part: "Part 02: Personal Finance and Financial Independence",
    priority: "EXTREMELY HIGH",
    thesis: "Fixing the Indian financial leakages: The 3-account money system, pure term life and health insurance protection, and automated equity SIPs to defeat real 7-8% Indian inflation.",
    chapters: [
      { name: "The 3-Account Machine", detail: "Segregate salary into: (1) Living Expenses, (2) Emergency Shock Absorber (6 months in liquid/auto-sweep), and (3) Wealth Accumulation (automated equity SIPs on day 2)." },
      { name: "Insurance Reality Check", detail: "Never buy traditional endowment or money-back policies (yield 4-5%). Buy pure term insurance (cover 15x-20x annual income) + personal family health floater with a high-deductible Super Top-Up." },
      { name: "The Indian Equity Engine", detail: "Broad-market index funds (Nifty 50, Next 50) beating inflation. Time in the market trumps market timing." },
      { name: "Retirement Priority", detail: "You can get a loan for a home, car, or education; you CANNOT get a loan for retirement. Fund retirement first." }
    ],
    mentalModels: [
      "The 3-Account Box System",
      "Separation of Risk from Return",
      "The Invisible Inflation Thief (Healthcare/Education at 10-12%)",
      "The Forced Savings Auto-Sweep"
    ],
    rules: [
      "Automate 1st-of-month bank transfers into wealth accounts before discretionary spending.",
      "Cancel/surrender toxic endowment policies once term insurance is active.",
      "Never pause equity SIPs during market corrections."
    ]
  },
  {
    order: 2,
    title: "The Psychology of Money",
    author: "Morgan Housel",
    phase: "Phase 1: Indian Cash Engine & Defense",
    domain: "Decision Science & Thinking",
    part: "Part 01: Thinking / Learning & Decision-Making",
    priority: "EXTREMELY HIGH",
    thesis: "Doing well with money is a soft skill driven by behavior, ego management, and emotional stability, not financial mathematics.",
    chapters: [
      { name: "No One's Crazy", detail: "Personal financial history governs 80% of your risk tolerance. Recognize your biases." },
      { name: "Compounding Asymmetry", detail: "Over 95% of Warren Buffett's wealth came after age 65. Compounding demands patience, not extraordinary monthly returns." },
      { name: "Getting vs. Staying Wealthy", detail: "Getting money requires risk and optimism; staying wealthy requires frugality, paranoia, and a large cash cushion." },
      { name: "Wealth is What You Don't See", detail: "Rich is current display; wealth is the unspent liquidity and options that buy freedom." },
      { name: "Reasonable > Rational", detail: "Adopt a financial strategy that lets you sleep at night during 40% crashes rather than mathematically optimal formulas." }
    ],
    mentalModels: [
      "The Man in the Car Paradox",
      "The Cost of Admission (Volatility is not a fine)",
      "Room for Error (Margin of Safety)",
      "Defining 'Enough'"
    ],
    rules: [
      "Define baseline living costs and resist lifestyle inflation when salary jumps.",
      "Keep 6-12 months cash reserves so you never become a forced seller in a panic.",
      "Price stock market drops as the ticket fee for long-term equity growth."
    ]
  },
  {
    order: 3,
    title: "The Software Engineer's Guidebook",
    author: "Gergely Orosz",
    phase: "Phase 2: Tech Career Leverage & 5x Income",
    domain: "Technology / Math & Engineering",
    part: "Part 26: Tech Career Leverage & Global Engineering Transition",
    priority: "EXTREMELY HIGH",
    thesis: "Navigating software engineering from junior/mid developer to senior, staff, and beyond: Escaping service company linear billing traps to high-tier product engineering, leverage, and equity.",
    chapters: [
      { name: "Career Archetypes & Company Tiers", detail: "Understand Tier 1 (global product tech/FAANG/high-growth remote) vs Tier 3 (regional IT service consultancies). Shifting tiers produces 3x-5x salary leaps." },
      { name: "The Senior Developer Threshold", detail: "Senior engineers are defined by self-direction, handling ambiguous requirements, and delivering end-to-end business value rather than just writing tickets." },
      { name: "System Design & Architecture Ownership", detail: "Mastering trade-offs, scalability, operational reliability, and domain modeling." },
      { name: "Staff Engineer Archetypes", detail: "The Tech Lead, Architect, Solver, and Right Hand: Scaling your impact across teams and driving technical strategy." }
    ],
    mentalModels: [
      "The 3 Tech Company Tiers (Pragmatic Career Arbitrage)",
      "Impact Over Activity (Solving business bottlenecks)",
      "Technical Debt vs Business Agility",
      "Visibility and Sponsorship in Tech"
    ],
    rules: [
      "Transition from implementation coder to systems designer who understands the business domain.",
      "Build a portfolio of high-impact technical initiatives, architecture docs, and design proposals.",
      "Target high-tier tech companies or remote international engineering roles to maximize savings rate."
    ]
  },
  {
    order: 4,
    title: "The Almanack of Naval Ravikant",
    author: "Eric Jorgenson",
    phase: "Phase 2: Tech Career Leverage & 5x Income",
    domain: "Wealth / Markets & Finance",
    part: "Part 27: The Fastlane & Unscripted Wealth Creation (FIRE Architecture)",
    priority: "EXTREMELY HIGH",
    thesis: "Wealth is assets that earn while you sleep. Renting your time (hourly wage) will never make you financially free. You need specific knowledge, accountability, and permissionless leverage.",
    chapters: [
      { name: "Building Wealth Without Luck", detail: "Seek wealth, not money or status. You get rich by giving society what it wants but does not yet know how to get, at scale." },
      { name: "The Four Forms of Leverage", detail: "(1) Labor (oldest, worst), (2) Capital (great, but requires money), (3) Code, and (4) Media (permissionless: works 24/7 with zero marginal cost of reproduction)." },
      { name: "Specific Knowledge & Accountability", detail: "Specific knowledge cannot be taught in school; it is found by pursuing your genuine curiosity. Take personal risks under your own name." },
      { name: "Judgment is the Decisive Skill", detail: "In an age of infinite leverage, judgment is worth infinitely more than raw effort." }
    ],
    mentalModels: [
      "Permissionless Leverage (Code & Media)",
      "Specific Knowledge vs Commoditized Skills",
      "Productize Yourself",
      "Compound Interest in Relationships and Reputation"
    ],
    rules: [
      "Never stay in a role where your compensation is capped strictly by hours worked.",
      "Build digital assets (software, code libraries, content) that can scale infinitely.",
      "Focus on judgment: a CEO or principal architect makes 10 decisions a year that drive $100M in value."
    ]
  },
  {
    order: 5,
    title: "Atomic Habits",
    author: "James Clear",
    phase: "Phase 2: Tech Career Leverage & 5x Income",
    domain: "Decision Science & Thinking",
    part: "Part 18: Career Capital, Productivity and Execution",
    priority: "EXTREMELY HIGH",
    thesis: "You do not rise to the level of your goals; you fall to the level of your systems. Tiny 1% daily compounding creates monumental outcomes over years.",
    chapters: [
      { name: "The Fundamentals of Habit Stacking", detail: "Habits are the compound interest of self-improvement. Getting 1% better every day makes you 37x better in a year." },
      { name: "Identity-Based Habits", detail: "Focus on who you want to become ('I am a software architect and disciplined investor') rather than arbitrary targets." },
      { name: "The 4 Laws of Behavior Change", detail: "(1) Make it Obvious, (2) Make it Attractive, (3) Make it Easy, (4) Make it Satisfying." },
      { name: "The Environment is the Invisible Hand", detail: "Design your physical and digital workspace so the productive choice is frictionless." }
    ],
    mentalModels: [
      "The Aggregation of Marginal Gains",
      "The Plateau of Latent Potential",
      "Implementation Intentions (When X happens, I will do Y)",
      "The 2-Minute Rule"
    ],
    rules: [
      "Set a non-negotiable 60-minute morning deep work block for technical architecture and reading.",
      "Track daily reading habits visually with a simple habit checkmark.",
      "Automate your financial and technical environments to remove friction."
    ]
  },
  {
    order: 6,
    title: "Designing Data-Intensive Applications",
    author: "Martin Kleppmann",
    phase: "Phase 2: Tech Career Leverage & 5x Income",
    domain: "Technology / Math & Engineering",
    part: "Part 14: Computer Science and Software Engineering",
    priority: "EXTREMELY HIGH",
    thesis: "The definitive guide to modern software architecture: reliability, scalability, maintainability, distributed data, replication, partitioning, transactions, and consensus.",
    chapters: [
      { name: "Reliability, Scalability & Maintainability", detail: "Measuring latency percentiles (p99, p99.9), handling load, and decoupling systems." },
      { name: "Data Models & Query Languages", detail: "Relational vs Document vs Graph models: understanding when schemas-on-read vs schemas-on-write excel." },
      { name: "Storage & Retrieval", detail: "LSM-Trees vs B-Trees, write-ahead logs, and indexes under the hood." },
      { name: "Distributed Data & Replication", detail: "Leader-follower replication, split-brain syndromes, quorum reads, and eventual consistency." },
      { name: "Transactions & Consensus", detail: "ACID vs BASE, serializability, two-phase commits, Paxos/Raft consensus algorithms." }
    ],
    mentalModels: [
      "The CAP Theorem & PACELC",
      "LSM-Tree vs B-Tree Storage Engines",
      "Read Uncommitted to Serializable Isolation Levels",
      "Event-Driven Architectures and Idempotency"
    ],
    rules: [
      "Master distributed systems trade-offs to dominate senior/staff engineering interviews.",
      "Always design systems expecting hardware failures, network partitions, and clock drift.",
      "Think in p99 latencies and data durability rather than happy-path functionality."
    ]
  },
  {
    order: 7,
    title: "The Millionaire Fastlane",
    author: "MJ DeMarco",
    phase: "Phase 3: Fastlane Wealth & Digital Assets",
    domain: "Wealth / Markets & Finance",
    part: "Part 27: The Fastlane & Unscripted Wealth Creation (FIRE Architecture)",
    priority: "EXTREMELY HIGH",
    thesis: "The traditional financial roadmap ('The Slowlane': work 40 years, save 10% in mutual funds, retire at 65) is flawed. Wealth is built fast through asymmetric business systems governed by the Law of Effection.",
    chapters: [
      { name: "The Three Roads", detail: "The Sidewalk (living paycheck to paycheck), The Slowlane (trading 5 days of freedom for 2 days of weekend for 40 years), The Fastlane (building scalable business systems)." },
      { name: "The Law of Effection", detail: "The more lives you affect in scale or magnitude, the wealthier you become. Wealth = Net Profit + Asset Value." },
      { name: "The CENTS Framework", detail: "A Fastlane business must satisfy: Control, Entry (high barrier), Need, Time (detached from your hours), Scale." },
      { name: "Building Money Trees", detail: "Rental systems, computer/software systems, content systems, distribution systems that produce cash flow 24/7." }
    ],
    mentalModels: [
      "The Law of Effection (Scale x Magnitude)",
      "The CENTS Business Test",
      "Producer vs Consumer Mindset",
      "Trading Time vs Decoupled Wealth Systems"
    ],
    rules: [
      "Shift mindset from pure consumer/employee to producer of scalable software/services.",
      "Never launch a business without high barriers to entry or scalability.",
      "Reinvest income surpluses into compounding assets that generate perpetual cash flow."
    ]
  },
  {
    order: 8,
    title: "Coffee Can Investing",
    author: "Saurabh Mukherjea, Rakshit Ranjan and Pranab Uniyal",
    phase: "Phase 4: Institutional Compounding & Equity",
    domain: "Wealth / Markets & Finance",
    part: "Part 03: Indian Finance, Banking, Taxation and Insurance",
    priority: "EXTREMELY HIGH",
    thesis: "Building immense wealth in India by buying companies with exceptional moats, clean corporate governance, and >15% ROCE for 10 consecutive years, and holding them for a decade with zero churn.",
    chapters: [
      { name: "The Coffee Can Philosophy", detail: "Originating from Robert Kirby (1984): Buy high-quality compounding machines, put them in a coffee can, and forget about them for 10 years." },
      { name: "The Filtering Criteria", detail: "Revenue growth >10% per annum + Return on Capital Employed (ROCE) >15% every single year for 10 continuous years." },
      { name: "Corporate Governance & Accounting Traps", detail: "How Indian promoters cook books and siphon capital: avoiding value traps and debt-laden businesses." },
      { name: "The Cost of Portfolio Churn", detail: "Brokerage fees, short-term capital gains tax, and timing errors destroy 5-7% of annual returns. Low turnover is the ultimate secret." }
    ],
    mentalModels: [
      "The Coffee Can Moat Filter (ROCE >15% + Revenue >10%)",
      "Corporate Governance Forensics",
      "The Power of Inactivity (Patience as a competitive edge)",
      "Uninterrupted Compounding in Indian Franchises"
    ],
    rules: [
      "Build a core equity portfolio of pristine Indian compounding machines (Asian Paints, Titan, HDFC Bank, TCS, Pidilite).",
      "Never sell a Coffee Can stock because of short-term quarterly noise or macroeconomic panic.",
      "Reinvest all dividends to harness explosive long-term compounding."
    ]
  },
  {
    order: 9,
    title: "Deep Work",
    author: "Cal Newport",
    phase: "Phase 2: Tech Career Leverage & 5x Income",
    domain: "Business / Strategy & Execution",
    part: "Part 18: Career Capital, Productivity and Execution",
    priority: "EXTREMELY HIGH",
    thesis: "The ability to perform deep work is becoming increasingly rare at the exact time it is becoming increasingly valuable in our economy. Cultivating intense focus is a superpower.",
    chapters: [
      { name: "The Deep Work Hypothesis", detail: "To thrive in the new economy you need: (1) The ability to quickly master hard things, (2) The ability to produce at an elite level, in both quality and speed." },
      { name: "High-Quality Work Formula", detail: "Work Accomplished = Time Spent x Intensity of Focus. Multitasking leaves attention residue that cripples cognitive output." },
      { name: "The 4 Deep Work Philosophies", detail: "Monastic, Bimodal, Rhythmic, and Journalistic scheduling: choose the rhythm that fits your career." },
      { name: "Embracing Boredom & Quitting Social Media", detail: "Training the brain to resist instant dopamine hits and maintain sustained concentration." }
    ],
    mentalModels: [
      "Attention Residue",
      "The Law of Deep Productivity",
      "The Shutdown Ritual",
      "Deliberate Practice in Knowledge Work"
    ],
    rules: [
      "Schedule 2-4 hours of uninterrupted deep coding or study daily with zero notifications.",
      "Eliminate phone checks during work intervals to prevent attention residue.",
      "Execute a formal end-of-day shutdown ritual to disconnect and recharge cognitive stamina."
    ]
  },
  {
    order: 10,
    title: "Poor Charlie's Almanack",
    author: "Charles T. Munger",
    phase: "Phase 5: Decision Science & Mastery",
    domain: "Decision Science & Thinking",
    part: "Part 01: Thinking / Learning & Decision-Making",
    priority: "EXTREMELY HIGH",
    thesis: "Worldly wisdom comes from building a latticework of mental models across multiple disciplines (physics, biology, psychology, economics) to make superior decisions in investing and life.",
    chapters: [
      { name: "The Latticework of Mental Models", detail: "You must know the big ideas in the big disciplines and have them in your mind to make a system that you can use automatically. To a man with only a hammer, every problem looks like a nail." },
      { name: "Inversion ('Invert, Always Invert')", detail: "Instead of asking how to succeed, ask: 'What will guarantee failure?' and systematically avoid those things." },
      { name: "The Psychology of Human Misjudgment", detail: "The 25 cognitive tendencies that lead to catastrophic errors (Reward/Punishment bias, Consistency bias, Social Proof, Lollapalooza effect)." },
      { name: "Circle of Competence", detail: "Knowing the boundary of what you understand and refusing to step outside it. It is not how big your circle is; it is knowing where the perimeter lies." }
    ],
    mentalModels: [
      "The Latticework of Mental Models",
      "Inversion Principle",
      "The Circle of Competence",
      "The Lollapalooza Effect (Multiple psychological biases reinforcing each other)"
    ],
    rules: [
      "When evaluating an investment or life decision, invert: write down all the ways it can ruin you and avoid them.",
      "Stay strictly within your circle of competence in business and investing.",
      "Study human psychology to recognize when you and others are being blinded by incentives."
    ]
  }
];

async function updateOrCreateTop10() {
  console.log("🚀 Starting Top 10 Reading Order Sync to Notion...");

  // First, query existing pages to match by title
  const res = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Notion-Version": "2022-06-28",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ page_size: 100 })
  });

  const data = await res.json();
  const existingMap = new Map();
  for (const page of data.results || []) {
    const title = page.properties["Name"]?.title?.[0]?.plain_text?.toLowerCase().trim();
    if (title) existingMap.set(title, page.id);
  }

  // Pre-create/update all 10 books so we have their page IDs for cross-linking!
  const pageIdsByOrder = {};

  for (const book of TOP_10_BOOKS) {
    const key = book.title.toLowerCase().trim();
    let pageId = existingMap.get(key);

    // Fetch book cover from Google Books
    let coverUrl = null;
    try {
      const gRes = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(book.title + " " + book.author)}&key=${process.env.GOOGLE_BOOKS_API_KEY}`);
      if (gRes.ok) {
        const gData = await gRes.json();
        coverUrl = gData.items?.[0]?.volumeInfo?.imageLinks?.thumbnail?.replace("http://", "https://") || null;
      }
    } catch (e) {}

    const properties = {
      "Name": { title: [{ text: { content: book.title } }] },
      "Reading Order": { number: book.order },
      "Phase": { select: { name: book.phase } },
      "Author": { rich_text: [{ text: { content: book.author } }] },
      "Domain": { select: { name: book.domain } },
      "Part": { select: { name: book.part } },
      "Priority": { select: { name: book.priority } },
      "Status": { select: { name: book.order <= 2 ? "Reading" : "To Read" } }
    };

    if (pageId) {
      // Update properties
      await fetch(`https://api.notion.com/v1/pages/${pageId}`, {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Notion-Version": "2022-06-28",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ properties })
      });
      console.log(`[Order #${book.order}] Updated existing page: ${book.title}`);
    } else {
      // Create new page
      const payload = {
        parent: { database_id: databaseId },
        icon: { type: "emoji", emoji: "📖" },
        properties
      };
      if (coverUrl) {
        payload.cover = { type: "external", external: { url: coverUrl } };
      }
      const createRes = await fetch("https://api.notion.com/v1/pages", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Notion-Version": "2022-06-28",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });
      const createData = await createRes.json();
      pageId = createData.id;
      console.log(`[Order #${book.order}] Created new page: ${book.title}`);
    }

    pageIdsByOrder[book.order] = pageId;
    await new Promise(r => setTimeout(r, 350));
  }

  // Now, inject the deep AI chapter notes & native Notion page mentions into each of the 10 books!
  console.log("\n📝 Injecting deep chapter summaries & Notion page mentions into all 10 books...");

  for (const book of TOP_10_BOOKS) {
    const pageId = pageIdsByOrder[book.order];
    if (!pageId) continue;

    // Clear old blocks
    const oldBlocksRes = await fetch(`https://api.notion.com/v1/blocks/${pageId}/children`, {
      headers: { "Authorization": `Bearer ${token}`, "Notion-Version": "2022-06-28" }
    });
    const oldBlocksData = await oldBlocksRes.json();
    for (const b of oldBlocksData.results || []) {
      await fetch(`https://api.notion.com/v1/blocks/${b.id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}`, "Notion-Version": "2022-06-28" }
      });
    }

    // Build rich Notion blocks
    const blocks = [];

    // Header Callout
    blocks.push({
      object: "block",
      type: "callout",
      callout: {
        icon: { type: "emoji", emoji: "🏆" },
        rich_text: [
          { type: "text", text: { content: `READING ORDER #${book.order} • ${book.phase}\n` }, annotations: { bold: true } },
          { type: "text", text: { content: `Author: ${book.author} | Priority: ${book.priority}` } }
        ]
      }
    });

    // Core Thesis
    blocks.push({
      object: "block",
      type: "heading_2",
      heading_2: { rich_text: [{ text: { content: "🏛️ Central Premise & Why Read This Book First" } }] }
    });
    blocks.push({
      object: "block",
      type: "paragraph",
      paragraph: { rich_text: [{ text: { content: book.thesis } }] }
    });

    // Core Mental Models
    blocks.push({
      object: "block",
      type: "heading_2",
      heading_2: { rich_text: [{ text: { content: "🧠 Core Mental Models & Frameworks" } }] }
    });
    for (const model of book.mentalModels) {
      blocks.push({
        object: "block",
        type: "bulleted_list_item",
        bulleted_list_item: { rich_text: [{ text: { content: model }, annotations: { bold: true } }] }
      });
    }

    // Chapter by Chapter Synthesis
    blocks.push({
      object: "block",
      type: "heading_2",
      heading_2: { rich_text: [{ text: { content: "📑 Chapter-by-Chapter Core Synthesis" } }] }
    });
    for (const ch of book.chapters) {
      blocks.push({
        object: "block",
        type: "bulleted_list_item",
        bulleted_list_item: {
          rich_text: [
            { type: "text", text: { content: `${ch.name}: ` }, annotations: { bold: true } },
            { type: "text", text: { content: ch.detail } }
          ]
        }
      });
    }

    // Action Rules
    blocks.push({
      object: "block",
      type: "heading_2",
      heading_2: { rich_text: [{ text: { content: "🎯 Actionable Execution Rules for Chirag" } }] }
    });
    for (const rule of book.rules) {
      blocks.push({
        object: "block",
        type: "to_do",
        to_do: {
          checked: false,
          rich_text: [{ text: { content: rule } }]
        }
      });
    }

    // Upstream & Downstream Reading Links (Real Notion Mentions!)
    const nextOrder = book.order < 10 ? book.order + 1 : null;
    const prevOrder = book.order > 1 ? book.order - 1 : null;

    if (nextOrder || prevOrder) {
      blocks.push({
        object: "block",
        type: "heading_2",
        heading_2: { rich_text: [{ text: { content: "🔗 Curriculum Reading Chain (Live Notion Links)" } }] }
      });

      const linkRichText = [];
      if (prevOrder && pageIdsByOrder[prevOrder]) {
        linkRichText.push({ type: "text", text: { content: "⬅️ Previous Book in Roadmap: " } });
        linkRichText.push({ type: "mention", mention: { type: "page", page: { id: pageIdsByOrder[prevOrder] } } });
        linkRichText.push({ type: "text", text: { content: "\n" } });
      }
      if (nextOrder && pageIdsByOrder[nextOrder]) {
        linkRichText.push({ type: "text", text: { content: "➡️ Next Recommended Masterwork: " } });
        linkRichText.push({ type: "mention", mention: { type: "page", page: { id: pageIdsByOrder[nextOrder] } } });
      }

      blocks.push({
        object: "block",
        type: "callout",
        callout: {
          icon: { type: "emoji", emoji: "🧭" },
          rich_text: linkRichText
        }
      });
    }

    // Append blocks
    await fetch(`https://api.notion.com/v1/blocks/${pageId}/children`, {
      method: "PATCH",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ children: blocks })
    });

    console.log(`[Order #${book.order}] Injected full notes and Notion links for: ${book.title}`);
    await new Promise(r => setTimeout(r, 400));
  }

  console.log("\n🎉 All 10 books successfully prioritized and populated with full AI notes and bidirectional links in Notion!");
}

updateOrCreateTop10().catch(console.error);
