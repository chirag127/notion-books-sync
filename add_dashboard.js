import "dotenv/config";

async function addDashboardHeader() {
  const pageId = "3f5f70b9-27a4-8055-9a8e-cd72ee9a2b7a";

  const blocks = [
    {
      object: "block",
      type: "callout",
      callout: {
        icon: { type: "emoji", emoji: "🎯" },
        rich_text: [
          {
            type: "text",
            text: {
              content: "CHIRAG'S LIFETIME READING ROADMAP — WEALTH, TECH LEVERAGE & EARLY RETIREMENT\n"
            },
            annotations: { bold: true }
          },
          {
            type: "text",
            text: {
              content: "Curated to build independent multi-crore wealth, transition from IT service company to high-leverage software equity/SaaS, master Indian and global capital markets, and achieve early financial retirement."
            }
          }
        ]
      }
    },
    {
      object: "block",
      type: "divider",
      divider: {}
    },
    {
      object: "block",
      type: "heading_2",
      heading_2: {
        rich_text: [{ text: { content: "🏛️ Master Curriculum Navigation & Categories (30 Tracks)" } }]
      }
    },
    {
      object: "block",
      type: "toggle",
      toggle: {
        rich_text: [
          {
            type: "text",
            text: { content: "💰 Domain: Wealth, Markets & FIRE Architecture (Parts 02-08, 27, 29)" },
            annotations: { bold: true }
          }
        ],
        children: [
          {
            object: "block",
            type: "bulleted_list_item",
            bulleted_list_item: { rich_text: [{ text: { content: "Part 02: Personal Finance & Financial Independence (Let's Talk Money, Simple Path to Wealth)" } }] }
          },
          {
            object: "block",
            type: "bulleted_list_item",
            bulleted_list_item: { rich_text: [{ text: { content: "Part 03: Indian Finance, Banking, Taxation & Insurance (Monika Halan, Saurabh Mukherjea, Parag Parikh)" } }] }
          },
          {
            object: "block",
            type: "bulleted_list_item",
            bulleted_list_item: { rich_text: [{ text: { content: "Part 04: Investment Philosophy & Portfolio Management (Graham, Marks, Buffett, Lynch)" } }] }
          },
          {
            object: "block",
            type: "bulleted_list_item",
            bulleted_list_item: { rich_text: [{ text: { content: "Part 27: The Fastlane & Unscripted Wealth (MJ DeMarco, Naval Ravikant, Early Retirement Extreme, Deepak Shenoy)" } }] }
          },
          {
            object: "block",
            type: "bulleted_list_item",
            bulleted_list_item: { rich_text: [{ text: { content: "Part 29: Indian Equity Masters (Ramesh Damani, Super-Investors, Value Investing in India)" } }] }
          }
        ]
      }
    },
    {
      object: "block",
      type: "toggle",
      toggle: {
        rich_text: [
          {
            type: "text",
            text: { content: "⚡ Domain: Tech Career Leverage, Architecture & SaaS (Parts 13-17, 26, 28)" },
            annotations: { bold: true }
          }
        ],
        children: [
          {
            object: "block",
            type: "bulleted_list_item",
            bulleted_list_item: { rich_text: [{ text: { content: "Part 14: Computer Science & Software Engineering (Clean Code, Pragmatic Programmer, DDIA)" } }] }
          },
          {
            object: "block",
            type: "bulleted_list_item",
            bulleted_list_item: { rich_text: [{ text: { content: "Part 15: System Design, Cloud & Distributed Systems (Alex Xu, Microservices, SRE)" } }] }
          },
          {
            object: "block",
            type: "bulleted_list_item",
            bulleted_list_item: { rich_text: [{ text: { content: "Part 26: Tech Career Leverage & Global Transition (Software Engineer's Guidebook, Staff Engineer, Google Eng)" } }] }
          },
          {
            object: "block",
            type: "bulleted_list_item",
            bulleted_list_item: { rich_text: [{ text: { content: "Part 28: Micro-SaaS & Bootstrapped Digital Assets (Pieter Levels, Rob Walling, Minimalist Entrepreneur)" } }] }
          }
        ]
      }
    },
    {
      object: "block",
      type: "toggle",
      toggle: {
        rich_text: [
          {
            type: "text",
            text: { content: "🧠 Domain: Decision Science & High-Performance Mindset (Parts 01, 30)" },
            annotations: { bold: true }
          }
        ],
        children: [
          {
            object: "block",
            type: "bulleted_list_item",
            bulleted_list_item: { rich_text: [{ text: { content: "Part 01: Thinking, Learning & Decision-Making (Psychology of Money, Kahneman, Munger, Tetlock)" } }] }
          },
          {
            object: "block",
            type: "bulleted_list_item",
            bulleted_list_item: { rich_text: [{ text: { content: "Part 30: Quarter-Life Mastery & High-Performance Mindset (Mastery, Can't Hurt Me, Stoicism, 12 Rules)" } }] }
          }
        ]
      }
    },
    {
      object: "block",
      type: "divider",
      divider: {}
    }
  ];

  const res = await fetch(`https://api.notion.com/v1/blocks/${pageId}/children`, {
    method: "PATCH",
    headers: {
      "Authorization": `Bearer ${process.env.NOTION_TOKEN}`,
      "Notion-Version": "2022-06-28",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ children: blocks })
  });

  console.log("Dashboard navigation added to parent page! Status:", res.status);
}

addDashboardHeader().catch(console.error);
