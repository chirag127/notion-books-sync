import json

P1 = [
    {
        "order": 1,
        "title": "Let's Talk Money",
        "author": "Monika Halan",
        "phase": "Phase 1: Indian Cash Engine & Defense",
        "domain": "Wealth / Markets & Finance",
        "part": "Part 02: Personal Finance and Financial Independence",
        "priority": "EXTREMELY HIGH",
        "thesis": "Fix financial leakages in India: 3-account cash box, emergency fund, surrender toxic endowments, pure term/health insurance, automated equity SIPs.",
        "youtube": "https://www.youtube.com/watch?v=0kP0s1c0s5M",
        "chapters": [
            {"name": "The 3-Account Machine", "detail": "Segregate salary into: (1) Living Expenses, (2) Emergency Shock Absorber (6 months in liquid/auto-sweep), and (3) Wealth Accumulation (automated equity SIPs on day 2)."},
            {"name": "Insurance Reality Check", "detail": "Never buy traditional endowment or money-back policies (yield 4-5%). Buy pure term insurance (cover 15x-20x annual income) + personal family health floater with a high-deductible Super Top-Up."},
            {"name": "The Indian Equity Engine", "detail": "Broad-market index funds (Nifty 50, Next 50) beating inflation. Time in the market trumps market timing."},
            {"name": "Retirement Priority", "detail": "You can get a loan for a home, car, or education; you CANNOT get a loan for retirement. Fund retirement first."}
        ],
        "mentalModels": ["The 3-Account Box System", "Separation of Risk from Return", "The Invisible Inflation Thief (Healthcare/Education at 10-12%)", "The Forced Savings Auto-Sweep"],
        "rules": ["Automate 1st-of-month bank transfers into wealth accounts before discretionary spending.", "Cancel/surrender toxic endowment policies once term insurance is active.", "Never pause equity SIPs during market corrections."]
    },
    {
        "order": 2,
        "title": "The Psychology of Money",
        "author": "Morgan Housel",
        "phase": "Phase 1: Indian Cash Engine & Defense",
        "domain": "Decision Science & Thinking",
        "part": "Part 01: Thinking / Learning & Decision-Making",
        "priority": "EXTREMELY HIGH",
        "thesis": "Doing well with money is behavioral; wealth is what you don't spend; room for error and defining 'Enough'.",
        "youtube": "https://www.youtube.com/watch?v=T_s_U_qVb00",
        "chapters": [
            {"name": "No One's Crazy", "detail": "Personal financial history governs 80% of your risk tolerance. Recognize your biases."},
            {"name": "Compounding Asymmetry", "detail": "Over 95% of Warren Buffett's wealth came after age 65. Compounding demands patience, not extraordinary monthly returns."},
            {"name": "Getting vs. Staying Wealthy", "detail": "Getting money requires risk and optimism; staying wealthy requires frugality, paranoia, and a large cash cushion."},
            {"name": "Wealth is What You Don't See", "detail": "Rich is current display; wealth is the unspent liquidity and options that buy freedom."},
            {"name": "Reasonable > Rational", "detail": "Adopt a financial strategy that lets you sleep at night during 40% crashes rather than mathematically optimal formulas."}
        ],
        "mentalModels": ["The Man in the Car Paradox", "The Cost of Admission (Volatility is not a fine)", "Room for Error (Margin of Safety)", "Defining 'Enough'"],
        "rules": ["Define baseline living costs and resist lifestyle inflation when salary jumps.", "Keep 6-12 months cash reserves so you never become a forced seller in a panic.", "Price stock market drops as the ticket fee for long-term equity growth."]
    },
    {
        "order": 3,
        "title": "The Software Engineer's Guidebook",
        "author": "Gergely Orosz",
        "phase": "Phase 2: Tech Career Leverage & 5x Income",
        "domain": "Technology / Math & Engineering",
        "part": "Part 26: Tech Career Leverage & Global Engineering Transition",
        "priority": "EXTREMELY HIGH",
        "thesis": "Transition from IT service company implementation to high-tier product engineering, senior/staff levels, and high equity.",
        "youtube": "https://www.youtube.com/watch?v=p33Kx11hZ-E",
        "chapters": [
            {"name": "Career Archetypes & Company Tiers", "detail": "Understand Tier 1 (global product tech/FAANG/high-growth remote) vs Tier 3 (regional IT service consultancies). Shifting tiers produces 3x-5x salary leaps."},
            {"name": "The Senior Developer Threshold", "detail": "Senior engineers are defined by self-direction, handling ambiguous requirements, and delivering end-to-end business value rather than just writing tickets."},
            {"name": "System Design & Architecture Ownership", "detail": "Mastering trade-offs, scalability, operational reliability, and domain modeling."},
            {"name": "Staff Engineer Archetypes", "detail": "The Tech Lead, Architect, Solver, and Right Hand: Scaling your impact across teams and driving technical strategy."}
        ],
        "mentalModels": ["The 3 Tech Company Tiers (Pragmatic Career Arbitrage)", "Impact Over Activity (Solving business bottlenecks)", "Technical Debt vs Business Agility", "Visibility and Sponsorship in Tech"],
        "rules": ["Transition from implementation coder to systems designer who understands the business domain.", "Build a portfolio of high-impact technical initiatives, architecture docs, and design proposals.", "Target high-tier tech companies or remote international engineering roles to maximize savings rate."]
    },
    {
        "order": 4,
        "title": "The Almanack of Naval Ravikant",
        "author": "Eric Jorgenson",
        "phase": "Phase 2: Tech Career Leverage & 5x Income",
        "domain": "Wealth / Markets & Finance",
        "part": "Part 27: The Fastlane & Unscripted Wealth Creation (FIRE Architecture)",
        "priority": "EXTREMELY HIGH",
        "thesis": "Wealth is assets that earn while you sleep; specific knowledge, accountability, and permissionless leverage (Code & Media).",
        "youtube": "https://www.youtube.com/watch?v=1-TZqOsVCN8",
        "chapters": [
            {"name": "Building Wealth Without Luck", "detail": "Seek wealth, not money or status. You get rich by giving society what it wants but does not yet know how to get, at scale."},
            {"name": "The Four Forms of Leverage", "detail": "(1) Labor (oldest, worst), (2) Capital (great, but requires money), (3) Code, and (4) Media (permissionless: works 24/7 with zero marginal cost of reproduction)."},
            {"name": "Specific Knowledge & Accountability", "detail": "Specific knowledge cannot be taught in school; it is found by pursuing your genuine curiosity. Take personal risks under your own name."},
            {"name": "Judgment is the Decisive Skill", "detail": "In an age of infinite leverage, judgment is worth infinitely more than raw effort."}
        ],
        "mentalModels": ["Permissionless Leverage (Code & Media)", "Specific Knowledge vs Commoditized Skills", "Productize Yourself", "Compound Interest in Relationships and Reputation"],
        "rules": ["Never stay in a role where your compensation is capped strictly by hours worked.", "Build digital assets (software, code libraries, content) that can scale infinitely.", "Focus on judgment: a CEO or principal architect makes 10 decisions a year that drive $100M in value."]
    },
    {
        "order": 5,
        "title": "Atomic Habits",
        "author": "James Clear",
        "phase": "Phase 2: Tech Career Leverage & 5x Income",
        "domain": "Decision Science & Thinking",
        "part": "Part 18: Career Capital, Productivity and Execution",
        "priority": "EXTREMELY HIGH",
        "thesis": "You don't rise to the level of your goals; you fall to the level of your systems. 1% compounding behavior change.",
        "youtube": "https://www.youtube.com/watch?v=PZ7lDrwYdZc",
        "chapters": [
            {"name": "The Fundamentals of Habit Stacking", "detail": "Habits are the compound interest of self-improvement. Getting 1% better every day makes you 37x better in a year."},
            {"name": "Identity-Based Habits", "detail": "Focus on who you want to become ('I am a software architect and disciplined investor') rather than arbitrary targets."},
            {"name": "The 4 Laws of Behavior Change", "detail": "(1) Make it Obvious, (2) Make it Attractive, (3) Make it Easy, (4) Make it Satisfying."},
            {"name": "The Environment is the Invisible Hand", "detail": "Design your physical and digital workspace so the productive choice is frictionless."}
        ],
        "mentalModels": ["The Aggregation of Marginal Gains", "The Plateau of Latent Potential", "Implementation Intentions (When X happens, I will do Y)", "The 2-Minute Rule"],
        "rules": ["Set a non-negotiable 60-minute morning deep work block for technical architecture and reading.", "Track daily reading habits visually with a simple habit checkmark.", "Automate your financial and technical environments to remove friction."]
    }
]

with open("p1.json", "w", encoding="utf-8") as f:
    json.dump(P1, f, indent=2)
print("Part 1 written")
