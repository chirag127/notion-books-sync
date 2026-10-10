import "dotenv/config";

const token = process.env.NOTION_TOKEN;
const parentPageId = "3f5f70b9-27a4-8055-9a8e-cd72ee9a2b7a";

async function run() {
  const res = await fetch("https://api.notion.com/v1/pages", {
    method: "POST",
    headers: {
      "Authorization": "Bearer " + token,
      "Notion-Version": "2022-06-28",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      parent: {page_id: parentPageId},
      properties: {
        title: [{text: {content: "Test Table Block"}}]
      },
      children: [
        {
          object: "block",
          type: "table",
          table: {
            table_width: 3,
            has_column_header: true,
            has_row_header: false,
            children: [
              {
                type: "table_row",
                table_row: {
                  cells: [
                    [{type: "text", text: {content: "#"}}],
                    [{type: "text", text: {content: "Title"}}],
                    [{type: "text", text: {content: "Author"}}]
                  ]
                }
              },
              {
                type: "table_row",
                table_row: {
                  cells: [
                    [{type: "text", text: {content: "1"}}],
                    [{type: "text", text: {content: "Let's Talk Money"}}],
                    [{type: "text", text: {content: "Monika Halan"}}]
                  ]
                }
              }
            ]
          }
        }
      ]
    })
  });
  const data = await res.json();
  console.log("Status: ", res.status, data.id || data);
  if (data.id) {
    await fetch("https://api.notion.com/v1/pages/" + data.id, {
      method: "PATCH",
      headers: { "Authorization": "Bearer " + token, "Notion-Version": "2022-06-28", "Content-Type": "application/json" },
      body: JSON.stringify({ archived: true })
    });
    console.log("Archived test page!");
  }
}
run();