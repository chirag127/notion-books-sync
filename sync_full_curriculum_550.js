import "dotenv/config";
import fs from "fs";

const databaseId = process.env.NOTION_DATABASE_ID;
const token = process.env.NOTION_TOKEN;

if (!databaseId || !token) {
  console.error("Missing NOTION_TOKEN or NOTION_DATABASE_ID");
  process.exit(1);
}

const books = JSON.parse(fs.readFileSync("curriculum_550.json", "utf-8"));
console.log(`Loaded ${books.length} books from curriculum_550.json`);

function normalize(s) {
  return (s || "").toLowerCase().replace(/[^a-z0-9]/g, "");
}

async function delay(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function fetchWithRetry(url, options, maxRetries = 5) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const res = await fetch(url, options);
      if (res.status === 429) {
        const wait = 1500 * Math.pow(2, i);
        console.warn(`Rate limited (429). Retrying in ${wait}ms...`);
        await delay(wait);
        continue;
      }
      return res;
    } catch (e) {
      if (i === maxRetries - 1) throw e;
      await delay(1000 * Math.pow(2, i));
    }
  }
}

async function getExistingPages() {
  console.log("Fetching existing pages from Notion database...");
  const pageMap = new Map();
  let cursor = undefined;

  do {
    const body = { page_size: 100 };
    if (cursor) body.start_cursor = cursor;

    const res = await fetchWithRetry(`https://api.notion.com/v1/databases/${databaseId}/query`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    const data = await res.json();
    for (const page of data.results || []) {
      const name = page.properties["Name"]?.title?.[0]?.plain_text;
      const order = page.properties["Reading Order"]?.number;
      if (name) {
        pageMap.set(normalize(name), { id: page.id, title: name, readingOrder: order });
      }
    }

    cursor = data.has_more ? data.next_cursor : undefined;
  } while (cursor);

  console.log(`Found ${pageMap.size} existing unique pages in Notion.`);
  return pageMap;
}

function buildProperties(b) {
  return {
    "Name": { title: [{ type: "text", text: { content: b.title } }] },
    "Reading Order": { number: b.readingOrder },
    "Index": { number: b.readingOrder },
    "Author": { rich_text: [{ type: "text", text: { content: b.author } }] },
    "Phase": { select: { name: b.phase } },
    "Domain": { select: { name: b.domain } },
    "Part": { select: { name: b.part } },
    "Priority": { select: { name: b.priority } },
    "Status": { select: { name: b.status } },
    "One-Line Thesis": { rich_text: [{ type: "text", text: { content: b.thesis } }] },
    "YouTube Insights": { url: b.youtube },
    "Rating": { select: { name: b.rating } },
    "Pages": { number: b.pages },
    "Published": { rich_text: [{ type: "text", text: { content: String(b.published) } }] },
    "Type": { select: { name: b.type } }
  };
}

function buildChildren(b) {
  return [
    {
      object: "block",
      type: "callout",
      callout: {
        icon: { type: "emoji", emoji: "🎯" },
        rich_text: [
          {
            type: "text",
            text: { content: "Strategic Thesis: " },
            annotations: { bold: true }
          },
          {
            type: "text",
            text: { content: b.thesis }
          }
        ]
      }
    },
    {
      object: "block",
      type: "heading_2",
      heading_2: {
        rich_text: [{ type: "text", text: { content: "🧠 Core Conceptual Pillars" } }]
      }
    },
    {
      object: "block",
      type: "bulleted_list_item",
      bulleted_list_item: {
        rich_text: [
          {
            type: "text",
            text: { content: "Domain Mastery: " },
            annotations: { bold: true }
          },
          {
            type: "text",
            text: { content: `Foundational principles under ${b.domain} designed for compounding individual capability.` }
          }
        ]
      }
    },
    {
      object: "block",
      type: "bulleted_list_item",
      bulleted_list_item: {
        rich_text: [
          {
            type: "text",
            text: { content: "Strategic Leverage: " },
            annotations: { bold: true }
          },
          {
            type: "text",
            text: { content: `How ${b.title} accelerates breaking out of linear IT services toward financial independence.` }
          }
        ]
      }
    },
    {
      object: "block",
      type: "heading_2",
      heading_2: {
        rich_text: [{ type: "text", text: { content: "🛠️ Action Blueprint for Chirag" } }]
      }
    },
    {
      object: "block",
      type: "bulleted_list_item",
      bulleted_list_item: {
        rich_text: [
          {
            type: "text",
            text: { content: "Execution Rule 1: " },
            annotations: { bold: true }
          },
          {
            type: "text",
            text: { content: `Synthesize the primary mechanism of ${b.title} into daily decision-making and code execution.` }
          }
        ]
      }
    },
    {
      object: "block",
      type: "bulleted_list_item",
      bulleted_list_item: {
        rich_text: [
          {
            type: "text",
            text: { content: "Execution Rule 2: " },
            annotations: { bold: true }
          },
          {
            type: "text",
            text: { content: "Convert linear employment hours into high-leverage intellectual capital, independent assets, and compounding equity." }
          }
        ]
      }
    },
    {
      object: "block",
      type: "heading_2",
      heading_2: {
        rich_text: [{ type: "text", text: { content: "📺 Curated Video Insights & Author Talks" } }]
      }
    },
    {
      object: "block",
      type: "paragraph",
      paragraph: {
        rich_text: [
          {
            type: "text",
            text: { content: "Watch deep-dive breakdown: " }
          },
          {
            type: "text",
            text: {
              content: `YouTube: ${b.title} Deep Dive`,
              link: { url: b.youtube }
            },
            annotations: { bold: true, color: "blue" }
          }
        ]
      }
    }
  ];
}

async function main() {
  const existingMap = await getExistingPages();
  let created = 0;
  let updated = 0;
  let preservedTop20 = 0;

  console.log(`Starting synchronization for ${books.length} books in chronological reading order...`);

  for (let i = 0; i < books.length; i++) {
    const b = books[i];
    const key = normalize(b.title);
    const existing = existingMap.get(key);

    if (existing) {
      if (b.readingOrder <= 20) {
        preservedTop20++;
      } else {
        const patchRes = await fetchWithRetry(`https://api.notion.com/v1/pages/${existing.id}`, {
          method: "PATCH",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Notion-Version": "2022-06-28",
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ properties: buildProperties(b) })
        });
        if (patchRes && patchRes.ok) updated++;
      }
    } else {
      const createRes = await fetchWithRetry("https://api.notion.com/v1/pages", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Notion-Version": "2022-06-28",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          parent: { database_id: databaseId },
          icon: { type: "emoji", emoji: b.readingOrder <= 20 ? "🏆" : "📖" },
          properties: buildProperties(b),
          children: buildChildren(b)
        })
      });

      if (createRes && createRes.ok) {
        created++;
      } else if (createRes) {
        const errTxt = await createRes.text();
        console.error(`Failed book #${b.readingOrder}: ${b.title}`, errTxt.slice(0, 150));
      }
    }

    if ((i + 1) % 25 === 0 || i === books.length - 1) {
      console.log(`[Progress ${i + 1}/${books.length}] Created: ${created} | Updated: ${updated} | Preserved Top20: ${preservedTop20}`);
    }

    await delay(340);
  }

  console.log("============================================================");
  console.log(`🎉 Sync Complete! Total: ${books.length} Books`);
  console.log(`✨ Newly Created: ${created} | Updated: ${updated} | Preserved Top20: ${preservedTop20}`);
  console.log("============================================================");
}

main().catch(console.error);
