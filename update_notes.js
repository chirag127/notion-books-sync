import "dotenv/config";
import fs from "fs";

async function updatePage(pageId, bookMeta, mdFilePath) {
  const content = fs.readFileSync(mdFilePath, "utf-8");
  
  // 1. Update page properties
  const propRes = await fetch(`https://api.notion.com/v1/pages/${pageId}`, {
    method: "PATCH",
    headers: {
      "Authorization": `Bearer ${process.env.NOTION_TOKEN}`,
      "Notion-Version": "2022-06-28",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      properties: {
        "Index": { number: bookMeta.index },
        "Domain": { select: { name: bookMeta.domain } },
        "Part": { select: { name: bookMeta.part } },
        "Priority": { select: { name: bookMeta.priority } },
        "Status": { select: { name: "Reading" } }
      }
    })
  });
  console.log(`Updated properties for ${bookMeta.title}: HTTP ${propRes.status}`);

  // 2. Fetch existing blocks and delete them so we replace with the new deep summary
  const blocksRes = await fetch(`https://api.notion.com/v1/blocks/${pageId}/children`, {
    headers: {
      "Authorization": `Bearer ${process.env.NOTION_TOKEN}`,
      "Notion-Version": "2022-06-28"
    }
  });
  const blocksData = await blocksRes.json();
  for (const block of blocksData.results || []) {
    await fetch(`https://api.notion.com/v1/blocks/${block.id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${process.env.NOTION_TOKEN}`,
        "Notion-Version": "2022-06-28"
      }
    });
  }
  console.log(`Cleared old blocks for ${bookMeta.title}`);

  // 3. Convert Markdown lines into Notion block structures
  const lines = content.split("\n");
  const notionBlocks = [];
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    if (trimmed.startsWith("# ")) {
      notionBlocks.push({
        object: "block",
        type: "heading_1",
        heading_1: { rich_text: [{ text: { content: trimmed.replace("# ", "") } }] }
      });
    } else if (trimmed.startsWith("## ")) {
      notionBlocks.push({
        object: "block",
        type: "heading_2",
        heading_2: { rich_text: [{ text: { content: trimmed.replace("## ", "") } }] }
      });
    } else if (trimmed.startsWith("### ")) {
      notionBlocks.push({
        object: "block",
        type: "heading_3",
        heading_3: { rich_text: [{ text: { content: trimmed.replace("### ", "") } }] }
      });
    } else if (trimmed.startsWith("* ") || trimmed.startsWith("- ")) {
      const bulletText = trimmed.replace(/^[\*\-]\s+/, "");
      notionBlocks.push({
        object: "block",
        type: "bulleted_list_item",
        bulleted_list_item: { rich_text: [{ text: { content: bulletText.slice(0, 1900) } }] }
      });
    } else if (/^\d+\.\s+/.test(trimmed)) {
      const numText = trimmed.replace(/^\d+\.\s+/, "");
      notionBlocks.push({
        object: "block",
        type: "numbered_list_item",
        numbered_list_item: { rich_text: [{ text: { content: numText.slice(0, 1900) } }] }
      });
    } else if (trimmed.startsWith("> ")) {
      notionBlocks.push({
        object: "block",
        type: "quote",
        quote: { rich_text: [{ text: { content: trimmed.replace("> ", "") } }] }
      });
    } else if (trimmed === "---") {
      notionBlocks.push({
        object: "block",
        type: "divider",
        divider: {}
      });
    } else {
      notionBlocks.push({
        object: "block",
        type: "paragraph",
        paragraph: { rich_text: [{ text: { content: trimmed.slice(0, 1900) } }] }
      });
    }
  }

  // Notion allows appending up to 100 blocks per request
  for (let i = 0; i < notionBlocks.length; i += 75) {
    const chunk = notionBlocks.slice(i, i + 75);
    const appendRes = await fetch(`https://api.notion.com/v1/blocks/${pageId}/children`, {
      method: "PATCH",
      headers: {
        "Authorization": `Bearer ${process.env.NOTION_TOKEN}`,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ children: chunk })
    });
    console.log(`Appended block chunk ${i}..${i + chunk.length}: HTTP ${appendRes.status}`);
  }
}

async function run() {
  await updatePage("3f5f70b9-27a4-819e-bd11-c966e4461271", {
    index: 1,
    title: "The Psychology of Money",
    domain: "Decision Science & Thinking",
    part: "Part 01: Thinking / Learning & Decision-Making",
    priority: "EXTREMELY HIGH"
  }, "summaries/001-the-psychology-of-money.md");

  await updatePage("3f5f70b9-27a4-81a4-9756-c3306549b4a2", {
    index: 17,
    title: "Let's Talk Money",
    domain: "Wealth / Markets & Finance",
    part: "Part 02: Personal Finance and Financial Independence",
    priority: "EXTREMELY HIGH"
  }, "summaries/017-lets-talk-money.md");

  console.log("Both pages successfully updated with deep chapter summaries!");
}

run().catch(console.error);
