import "dotenv/config";
import fs from "fs";

const databaseId = process.env.NOTION_DATABASE_ID;
const token = process.env.NOTION_TOKEN;

const books = JSON.parse(fs.readFileSync("top20_data.json", "utf-8"));

async function run() {
  console.log(`🚀 Starting Top 20 Synchronization for ${books.length} Masterworks...`);

  // Query existing database pages
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

  const pageIdsByOrder = {};

  // Step 1: Create or Update Properties
  for (const b of books) {
    const key = b.title.toLowerCase().trim();
    let pageId = existingMap.get(key);

    let coverUrl = null;
    try {
      const gRes = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(b.title + " " + b.author)}&key=${process.env.GOOGLE_BOOKS_API_KEY}`);
      if (gRes.ok) {
        const gData = await gRes.json();
        coverUrl = gData.items?.[0]?.volumeInfo?.imageLinks?.thumbnail?.replace("http://", "https://") || null;
      }
    } catch (e) {}

    const properties = {
      "Name": { title: [{ text: { content: b.title } }] },
      "Reading Order": { number: b.order },
      "Phase": { select: { name: b.phase } },
      "Author": { rich_text: [{ text: { content: b.author } }] },
      "Domain": { select: { name: b.domain } },
      "Part": { select: { name: b.part } },
      "Priority": { select: { name: b.priority } },
      "One-Line Thesis": { rich_text: [{ text: { content: b.thesis } }] },
      "YouTube Insights": { url: b.youtube },
      "Status": { select: { name: b.order <= 2 ? "Reading" : "To Read" } }
    };

    if (pageId) {
      await fetch(`https://api.notion.com/v1/pages/${pageId}`, {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Notion-Version": "2022-06-28",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ properties })
      });
      console.log(`[#${String(b.order).padStart(2, "0")}] Updated table row: ${b.title}`);
    } else {
      const payload = {
        parent: { database_id: databaseId },
        icon: { type: "emoji", emoji: "📖" },
        properties
      };
      if (coverUrl) {
        payload.cover = { type: "external", external: { url: coverUrl } };
      }
      const cRes = await fetch("https://api.notion.com/v1/pages", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Notion-Version": "2022-06-28",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });
      const cData = await cRes.json();
      pageId = cData.id;
      console.log(`[#${String(b.order).padStart(2, "0")}] Created table row: ${b.title}`);
    }

    pageIdsByOrder[b.order] = pageId;
    await new Promise(r => setTimeout(r, 350));
  }

  // Step 2: Inject Notes & Links
  console.log("\n📝 Injecting full chapter notes & Notion mentions...");
  for (const b of books) {
    const pageId = pageIdsByOrder[b.order];
    if (!pageId) continue;

    // Clear old blocks
    const oldRes = await fetch(`https://api.notion.com/v1/blocks/${pageId}/children`, {
      headers: { "Authorization": `Bearer ${token}`, "Notion-Version": "2022-06-28" }
    });
    const oldData = await oldRes.json();
    for (const blk of oldData.results || []) {
      await fetch(`https://api.notion.com/v1/blocks/${blk.id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}`, "Notion-Version": "2022-06-28" }
      });
    }

    const blocks = [
      {
        object: "block",
        type: "callout",
        callout: {
          icon: { type: "emoji", emoji: "🏆" },
          rich_text: [
            { type: "text", text: { content: `READING ROADMAP RANK #${b.order} • ${b.phase}\n` }, annotations: { bold: true } },
            { type: "text", text: { content: `Author: ${b.author} | Priority: ${b.priority}\n` } },
            { type: "text", text: { content: "📺 Watch Curated YouTube Deep Dive: " }, annotations: { bold: true } },
            { type: "text", text: { content: "Click to Open Video Analysis ↗", link: { url: b.youtube } }, annotations: { underline: true } }
          ]
        }
      },
      {
        object: "block",
        type: "heading_2",
        heading_2: { rich_text: [{ text: { content: "🏛️ Central Premise & Strategic Value for Chirag" } }] }
      },
      {
        object: "block",
        type: "paragraph",
        paragraph: { rich_text: [{ text: { content: b.thesis } }] }
      },
      {
        object: "block",
        type: "heading_2",
        heading_2: { rich_text: [{ text: { content: "🧠 Core Mental Models & Frameworks" } }] }
      }
    ];

    for (const m of b.mentalModels) {
      blocks.push({
        object: "block",
        type: "bulleted_list_item",
        bulleted_list_item: { rich_text: [{ text: { content: m }, annotations: { bold: true } }] }
      });
    }

    blocks.push({
      object: "block",
      type: "heading_2",
      heading_2: { rich_text: [{ text: { content: "📑 Chapter-by-Chapter Core Synthesis" } }] }
    });

    for (const ch of b.chapters) {
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

    blocks.push({
      object: "block",
      type: "heading_2",
      heading_2: { rich_text: [{ text: { content: "🎯 Actionable Execution Rules" } }] }
    });

    for (const rule of b.rules) {
      blocks.push({
        object: "block",
        type: "to_do",
        to_do: {
          checked: false,
          rich_text: [{ text: { content: rule } }]
        }
      });
    }

    // Upstream & Downstream Live Notion Mentions
    const nextOrder = b.order < 20 ? b.order + 1 : null;
    const prevOrder = b.order > 1 ? b.order - 1 : null;

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

    console.log(`[#${String(b.order).padStart(2, "0")}] Injected notes & Notion links: ${b.title}`);
    await new Promise(r => setTimeout(r, 350));
  }

  console.log("\n🎉 Complete Top 20 Synchronized successfully with Notes, Theses, and YouTube Insights!");
}

run().catch(console.error);
