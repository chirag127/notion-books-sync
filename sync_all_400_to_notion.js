import "dotenv/config";
import fs from "fs";

const databaseId = process.env.NOTION_DATABASE_ID;
const token = process.env.NOTION_TOKEN;

if (!databaseId || !token) {
  console.error("❌ Missing NOTION_TOKEN or NOTION_DATABASE_ID in .env");
  process.exit(1);
}

const curriculum = JSON.parse(fs.readFileSync("curriculum.json", "utf-8"));

async function getExistingTitles() {
  console.log("🔍 Fetching existing books from Notion database...");
  const titles = new Set();
  let cursor = undefined;

  do {
    const body = { page_size: 100 };
    if (cursor) body.start_cursor = cursor;

    const res = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
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
      const name = page.properties["Name"]?.title?.[0]?.plain_text?.toLowerCase().trim();
      if (name) titles.add(name);
    }

    cursor = data.has_more ? data.next_cursor : undefined;
  } while (cursor);

  console.log(`✅ Found ${titles.size} existing books in Notion.`);
  return titles;
}

async function createBookPage(book) {
  const payload = {
    parent: { database_id: databaseId },
    icon: { type: "emoji", emoji: "📖" },
    properties: {
      "Name": {
        title: [{ text: { content: book.title } }]
      },
      "Index": {
        number: book.id
      },
      "Author": {
        rich_text: [{ text: { content: book.author } }]
      },
      "Domain": {
        select: { name: book.domain }
      },
      "Part": {
        select: { name: book.partName }
      },
      "Priority": {
        select: { name: book.priority }
      },
      "Status": {
        select: { name: "To Read" }
      }
    },
    children: [
      {
        object: "block",
        type: "heading_2",
        heading_2: {
          rich_text: [{ text: { content: "📌 Curriculum Overview" } }]
        }
      },
      {
        object: "block",
        type: "paragraph",
        paragraph: {
          rich_text: [
            {
              text: {
                content: `${book.title} by ${book.author} is curated under ${book.partName} (#${String(book.id).padStart(3, "0")}) with Priority: ${book.priority}.`
              }
            }
          ]
        }
      },
      {
        object: "block",
        type: "heading_2",
        heading_2: {
          rich_text: [{ text: { content: "🧠 Key Takeaways & Mental Models" } }]
        }
      },
      {
        object: "block",
        type: "bulleted_list_item",
        bulleted_list_item: {
          rich_text: [{ text: { content: "Core concept 1: " } }]
        }
      },
      {
        object: "block",
        type: "bulleted_list_item",
        bulleted_list_item: {
          rich_text: [{ text: { content: "Core concept 2: " } }]
        }
      },
      {
        object: "block",
        type: "heading_2",
        heading_2: {
          rich_text: [{ text: { content: "🎯 Actionable Takeaways & Next Steps" } }]
        }
      },
      {
        object: "block",
        type: "to_do",
        to_do: {
          checked: false,
          rich_text: [{ text: { content: "Key action to implement: " } }]
        }
      }
    ]
  };

  const res = await fetch("https://api.notion.com/v1/pages", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Notion-Version": "2022-06-28",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(`HTTP ${res.status}: ${JSON.stringify(err)}`);
  }
}

async function main() {
  const existing = await getExistingTitles();
  const toAdd = curriculum.filter(b => !existing.has(b.title.toLowerCase().trim()));

  console.log(`\n📚 Total in Curriculum: ${curriculum.length}`);
  console.log(`✨ Books to sync to Notion: ${toAdd.length}\n`);

  let count = 0;
  for (const book of toAdd) {
    count++;
    try {
      await createBookPage(book);
      console.log(`[${count}/${toAdd.length}] ✅ Added #${String(book.id).padStart(3, "0")} — ${book.title}`);
    } catch (e) {
      console.error(`[${count}/${toAdd.length}] ❌ Failed #${book.id} ${book.title}:`, e.message);
    }
    // Rate limit safety: 350ms pause (~3 req/sec per Notion API guidelines)
    await new Promise(r => setTimeout(r, 350));
  }

  console.log("\n🎉 Full curriculum sync completed!");
}

main().catch(console.error);
