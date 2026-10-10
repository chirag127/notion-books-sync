import "dotenv/config";
import { Client } from "@notionhq/client";
import fs from "fs";

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const databaseId = process.env.NOTION_DATABASE_ID;
const googleApiKey = process.env.GOOGLE_BOOKS_API_KEY;

// 10 Universal Pillar Categories
const CATEGORY_MAP = [
  {
    name: "Wealth & Finance",
    keywords: ["finance", "money", "investing", "wealth", "economics", "stocks", "capital", "rich", "currency", "crypto", "budget", "financial"]
  },
  {
    name: "Psychology & Behavior",
    keywords: ["psychology", "behavior", "cognitive", "mind", "brain", "emotion", "mental", "decision", "irrational", "thinking", "influence", "bias"]
  },
  {
    name: "Business & Strategy",
    keywords: ["business", "strategy", "management", "leadership", "entrepreneur", "startup", "marketing", "sales", "corporate", "company"]
  },
  {
    name: "Personal Growth & Habits",
    keywords: ["habit", "habits", "productivity", "self-help", "success", "discipline", "focus", "deep work", "learning", "growth", "time management"]
  },
  {
    name: "Philosophy & Spirituality",
    keywords: ["philosophy", "stoic", "spirituality", "religion", "zen", "wisdom", "meditation", "ethics", "meaning", "life", "soul", "moral"]
  },
  {
    name: "Sci-Fi & Futurism",
    keywords: ["science fiction", "sci-fi", "dystopian", "cyberpunk", "future", "space", "artificial intelligence", "post-human", "speculative"]
  },
  {
    name: "Fiction & Literature",
    keywords: ["fiction", "novel", "literature", "fantasy", "thriller", "mystery", "classic", "drama", "poetry", "stories"]
  },
  {
    name: "Science & Technology",
    keywords: ["technology", "computer", "science", "physics", "biology", "programming", "software", "mathematics", "cosmos", "nature"]
  },
  {
    name: "History & Biographies",
    keywords: ["biography", "autobiography", "memoir", "history", "historical", "war", "civilization", "empire"]
  },
  {
    name: "Society & World Affairs",
    keywords: ["politics", "political", "society", "sociology", "government", "law", "geopolitics", "world affairs"]
  }
];

function detectCategoryAndSubcategory(title, description, categories = []) {
  const combinedText = `${title} ${description || ""} ${categories.join(" ")}`.toLowerCase();

  let matchedCategory = "Non-Fiction";
  for (const cat of CATEGORY_MAP) {
    if (cat.keywords.some((kw) => combinedText.includes(kw))) {
      matchedCategory = cat.name;
      break;
    }
  }

  // Detect Type (Fiction vs Non-Fiction)
  const isFiction =
    categories.some((c) => c.toLowerCase().includes("fiction")) ||
    combinedText.includes("novel") ||
    matchedCategory === "Fiction & Literature" ||
    matchedCategory === "Sci-Fi & Futurism";
  const type = isFiction ? "Fiction" : "Non-Fiction";

  // Subcategory tags
  const subcategories = [];
  if (combinedText.includes("personal finance") || combinedText.includes("money")) subcategories.push("Personal Finance");
  if (combinedText.includes("investing") || combinedText.includes("stock") || combinedText.includes("market")) subcategories.push("Investing");
  if (combinedText.includes("behavior") || combinedText.includes("psychology")) subcategories.push("Behavioral Economics");
  if (combinedText.includes("habit")) subcategories.push("Habits & Systems");
  if (combinedText.includes("mindset")) subcategories.push("Mindset");
  if (combinedText.includes("entrepreneur") || combinedText.includes("startup")) subcategories.push("Entrepreneurship");
  if (combinedText.includes("decision")) subcategories.push("Decision Making");

  return {
    type,
    category: matchedCategory,
    subcategories: subcategories.slice(0, 2)
  };
}

async function searchGoogleBooks(query, retryCount = 0) {
  try {
    const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&key=${googleApiKey}`;
    const res = await fetch(url);

    if (!res.ok) {
      if ((res.status === 503 || res.status === 429) && retryCount < 2) {
        await new Promise((r) => setTimeout(r, 800));
        return await searchGoogleBooks(query, retryCount + 1);
      }
      throw new Error(`Google Books HTTP ${res.status}`);
    }

    const data = await res.json();
    if (!data.items || data.items.length === 0) return null;

    const info = data.items[0].volumeInfo;
    let coverUrl = info.imageLinks?.thumbnail || info.imageLinks?.smallThumbnail || null;
    if (coverUrl) {
      coverUrl = coverUrl.replace("http://", "https://");
      // Remove curl edge for cleaner image
      coverUrl = coverUrl.replace("&edge=curl", "");
    }

    return {
      title: info.title || query,
      subtitle: info.subtitle || "",
      authors: info.authors || ["Unknown Author"],
      publishedDate: info.publishedDate || "",
      description: info.description || "No synopsis available.",
      pageCount: info.pageCount || null,
      categories: info.categories || [],
      coverUrl
    };
  } catch (err) {
    console.warn(`[Google Books] ${err.message}. Trying Open Library fallback...`);
    return await searchOpenLibrary(query);
  }
}

async function searchOpenLibrary(query) {
  try {
    const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=1`;
    const res = await fetch(url);
    const data = await res.json();
    if (!data.docs || data.docs.length === 0) return null;
    const doc = data.docs[0];

    const coverUrl = doc.cover_i ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg` : null;

    return {
      title: doc.title || query,
      subtitle: "",
      authors: doc.author_name || ["Unknown Author"],
      publishedDate: doc.first_publish_year ? String(doc.first_publish_year) : "",
      description: doc.first_sentence ? doc.first_sentence.join(" ") : "No synopsis available.",
      pageCount: doc.number_of_pages_median || null,
      categories: doc.subject ? doc.subject.slice(0, 3) : [],
      coverUrl
    };
  } catch (err) {
    console.error(`[Open Library] Search failed:`, err.message);
    return null;
  }
}

async function addBookToNotion(bookData, initialStatus = "To Read") {
  const { type, category, subcategories } = detectCategoryAndSubcategory(
    bookData.title,
    bookData.description,
    bookData.categories
  );

  const authorString = bookData.authors.join(", ");

  const properties = {
    "Name": {
      title: [{ text: { content: bookData.title } }]
    },
    "Author": {
      rich_text: [{ text: { content: authorString } }]
    },
    "Type": {
      select: { name: type }
    },
    "Category": {
      select: { name: category }
    },
    "Status": {
      select: { name: initialStatus }
    }
  };

  if (subcategories.length > 0) {
    properties["Subcategory"] = {
      multi_select: subcategories.map((s) => ({ name: s }))
    };
  }

  if (bookData.pageCount) {
    properties["Pages"] = { number: bookData.pageCount };
  }

  if (bookData.publishedDate) {
    properties["Published"] = {
      rich_text: [{ text: { content: String(bookData.publishedDate).slice(0, 10) } }]
    };
  }

  // Pre-build structured book summary page layout
  const cleanDescription = (bookData.description || "")
    .replace(/<[^>]+>/g, "")
    .slice(0, 1800);

  const children = [
    {
      object: "block",
      type: "heading_2",
      heading_2: {
        rich_text: [{ text: { content: "📌 Executive Summary & Core Premise" } }]
      }
    },
    {
      object: "block",
      type: "paragraph",
      paragraph: {
        rich_text: [{ text: { content: cleanDescription || "Add your summary here." } }]
      }
    },
    {
      object: "block",
      type: "callout",
      callout: {
        icon: { type: "emoji", emoji: "💡" },
        rich_text: [
          {
            text: {
              content:
                "The One Big Idea: What is the single most valuable lesson from this book that changes how you think or make decisions?"
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
        rich_text: [{ text: { content: "Takeaway 1: " } }]
      }
    },
    {
      object: "block",
      type: "bulleted_list_item",
      bulleted_list_item: {
        rich_text: [{ text: { content: "Takeaway 2: " } }]
      }
    },
    {
      object: "block",
      type: "bulleted_list_item",
      bulleted_list_item: {
        rich_text: [{ text: { content: "Takeaway 3: " } }]
      }
    },
    {
      object: "block",
      type: "heading_2",
      heading_2: {
        rich_text: [{ text: { content: "💬 Memorable Quotes & Highlights" } }]
      }
    },
    {
      object: "block",
      type: "quote",
      quote: {
        rich_text: [{ text: { content: "Add your favorite quotes here..." } }]
      }
    },
    {
      object: "block",
      type: "heading_2",
      heading_2: {
        rich_text: [{ text: { content: "🔗 Bi-Directional Links & Connected Concepts" } }]
      }
    },
    {
      object: "block",
      type: "paragraph",
      paragraph: {
        rich_text: [
          {
            text: {
              content: "Connect this book to other concepts (e.g., type @ or [[ to link other books, principles, or journal notes)."
            }
          }
        ]
      }
    },
    {
      object: "block",
      type: "heading_2",
      heading_2: {
        rich_text: [{ text: { content: "🎯 Actionable Rules to Implement" } }]
      }
    },
    {
      object: "block",
      type: "to_do",
      to_do: {
        checked: false,
        rich_text: [{ text: { content: "Action item 1:" } }]
      }
    }
  ];

  const payload = {
    parent: { database_id: databaseId },
    icon: { type: "emoji", emoji: "📖" },
    properties,
    children
  };

  if (bookData.coverUrl) {
    payload.cover = {
      type: "external",
      external: { url: bookData.coverUrl }
    };
  }

  const response = await notion.pages.create(payload);
  return { id: response.id, url: response.url };
}

async function listBooks() {
  const res = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.NOTION_TOKEN}`,
      "Notion-Version": "2022-06-28",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      sorts: [{ timestamp: "created_time", direction: "descending" }]
    })
  });

  const data = await res.json();
  const books = data.results || [];

  console.log(`\n📚 Total Books in Library: ${books.length}`);
  console.log("=".repeat(75));
  for (const page of books) {
    const title = page.properties["Name"]?.title?.[0]?.plain_text || "Untitled";
    const author = page.properties["Author"]?.rich_text?.[0]?.plain_text || "Unknown";
    const status = page.properties["Status"]?.select?.name || "N/A";
    const category = page.properties["Category"]?.select?.name || "N/A";
    console.log(`• [${status.padEnd(9)}] ${title.padEnd(30)} | ${author.padEnd(20)} | ${category}`);
  }
  console.log("=".repeat(75) + "\n");
}

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (!databaseId || !process.env.NOTION_TOKEN) {
    console.error("❌ Error: Missing NOTION_TOKEN or NOTION_DATABASE_ID in .env");
    process.exit(1);
  }

  if (command === "list") {
    await listBooks();
    return;
  }

  if (command === "add") {
    const query = args.slice(1).join(" ");
    if (!query) {
      console.log("Usage: node index.js add \"Book Title\"");
      return;
    }

    console.log(`🔍 Searching for "${query}"...`);
    const bookData = await searchGoogleBooks(query);
    if (!bookData) {
      console.error(`❌ Could not find book info for "${query}".`);
      return;
    }

    console.log(`📖 Found: "${bookData.title}" by ${bookData.authors.join(", ")} (${bookData.publishedDate || "N/A"})`);
    console.log(`🚀 Adding to Notion Library...`);
    const result = await addBookToNotion(bookData, "Reading");
    console.log(`✅ Successfully added!`);
    console.log(`🔗 Notion Page: ${result.url}`);
    return;
  }

  if (command === "batch") {
    const filePath = args[1] || "books.txt";
    if (!fs.existsSync(filePath)) {
      console.error(`❌ File not found: ${filePath}`);
      return;
    }
    const lines = fs.readFileSync(filePath, "utf-8").split("\n").map(l => l.trim()).filter(Boolean);
    console.log(`📚 Starting batch import of ${lines.length} books...`);
    for (const title of lines) {
      console.log(`\n🔍 Searching: ${title}...`);
      const bookData = await searchGoogleBooks(title);
      if (bookData) {
        const result = await addBookToNotion(bookData, "To Read");
        console.log(`  ✅ Added: "${bookData.title}" by ${bookData.authors.join(", ")}`);
      } else {
        console.log(`  ⚠️ Not found: ${title}`);
      }
      await new Promise(r => setTimeout(r, 1200));
    }
    console.log("\n🎉 Batch import complete!");
    return;
  }

  console.log(`
📚 Notion Books Sync CLI

Commands:
  node index.js add "Book Title"     Search and add a book to your Notion
  node index.js list                 List all books currently in your Notion
  node index.js batch [file.txt]     Import multiple books from a list
  `);
}

main().catch(console.error);
