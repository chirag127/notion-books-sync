import "dotenv/config";

async function testMention() {
  const psychPageId = "3f5f70b9-27a4-819e-bd11-c966e4461271";
  const letsTalkMoneyId = "3f5f70b9-27a4-81a4-9756-c3306549b4a2";

  // Append a real Notion page mention into Let's Talk Money pointing to The Psychology of Money
  const res = await fetch(`https://api.notion.com/v1/blocks/${letsTalkMoneyId}/children`, {
    method: "PATCH",
    headers: {
      "Authorization": `Bearer ${process.env.NOTION_TOKEN}`,
      "Notion-Version": "2022-06-28",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      children: [
        {
          object: "block",
          type: "callout",
          callout: {
            icon: { type: "emoji", emoji: "🔗" },
            rich_text: [
              { text: { content: "Connected Masterwork (Live Notion Link): " } },
              {
                type: "mention",
                mention: {
                  type: "page",
                  page: { id: psychPageId }
                }
              }
            ]
          }
        }
      ]
    })
  });

  const data = await res.json();
  console.log("Mention block status:", res.status, data.object);
}

testMention().catch(console.error);
