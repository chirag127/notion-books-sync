import fs from "fs";

const existing = JSON.parse(fs.readFileSync("curriculum.json", "utf-8"));
console.log("Current count:", existing.length);

// 2024-2026 New Modern Masterworks in AI, Tech, Wealth & Future
const MODERN_2025_2026_BOOKS = [
  {
    partNumber: 31,
    partName: "Part 31: 2025-2026 Modern AI Engineering & Production LLMs",
    domain: "Technology / Math & Engineering",
    priority: "EXTREMELY HIGH",
    books: [
      { title: "AI Engineering: Building Applications with Foundation Models", author: "Chip Huyen" },
      { title: "The LLM Engineer's Handbook", author: "Paul Iusztin and Maxime Labonne" },
      { title: "Co-Intelligence: Living and Working with AI", author: "Ethan Mollick" },
      { title: "Building LLMs for Production", author: "Louis-François Bouchard" },
      { title: "The Agentic AI Bible", author: "Thomas R. Caldwell" },
      { title: "Empire of AI: Dreams and Nightmares in Sam Altman's OpenAI", author: "Karen Hao" },
      { title: "Nexus: A Brief History of Information Networks from the Stone Age to AI", author: "Yuval Noah Harari" },
      { title: "Chip War: The Fight for the World's Most Critical Technology", author: "Chris Miller" },
      { title: "The Coming Wave: Technology, Power, and the Twenty-first Century's Greatest Dilemma", author: "Mustafa Suleyman" },
      { title: "Read Write Own: Building the Next Era of the Internet", author: "Chris Dixon" },
      { title: "The Geek Way: The Radical Mindset that Drives Extraordinary Results", author: "Andrew McAfee" },
      { title: "Prompt Engineering for Generative AI", author: "James Phoenix and Mike Taylor" },
      { title: "Generative Deep Learning (2nd Edition)", author: "David Foster" },
      { title: "Machine Learning Design Patterns (Updated Edition)", author: "Valliappa Lakshmanan et al." },
      { title: "AI First: The Blueprint for Success in the AI Era", author: "Ash Fontana" }
    ]
  },
  {
    partNumber: 32,
    partName: "Part 32: 2024-2026 Modern Wealth, Macro & High Performance",
    domain: "Wealth / Markets & Finance",
    priority: "EXTREMELY HIGH",
    books: [
      { title: "The Algebra of Wealth: A Simple Formula for Financial Security", author: "Scott Galloway" },
      { title: "Same as Ever: A Guide to What Never Changes", author: "Morgan Housel" },
      { title: "Slow Productivity: The Lost Art of Accomplishment Without Burnout", author: "Cal Newport" },
      { title: "Clear Thinking: Turning Ordinary Moments into Extraordinary Results", author: "Shane Parrish" },
      { title: "Fluke: Chance, Chaos, and Why Everything We Do Matters", author: "Brian Klaas" },
      { title: "Supercommunicators: How to Unlock the Secret Language of Connection", author: "Charles Duhigg" },
      { title: "Right Kind of Wrong: The Science of Failing Well", author: "Amy Edmondson" },
      { title: "Hidden Potential: The Science of Achieving Greater Things", author: "Adam Grant" },
      { title: "Unreasonable Hospitality", author: "Will Guidara" },
      { title: "The Fund: Ray Dalio, Bridgewater Associates, and the Unraveling of a Wall Street Legend", author: "Rob Copeland" },
      { title: "Going Infinite: The Rise and Fall of a New Tycoon", author: "Michael Lewis" },
      { title: "Elon Musk", author: "Walter Isaacson" },
      { title: "Number Go Up: Inside Crypto's Wild Rise and Staggering Fall", author: "Zeke Faux" },
      { title: "Unscripted: The Great Rat Race Escape", author: "MJ DeMarco" },
      { title: "The Art of Clear Thinking", author: "Hasard Lee" },
      { title: "Die with Zero: Getting All You Can from Your Money and Your Life", author: "Bill Perkins" },
      { title: "The Psychology of Money: Practical Exercises", author: "Morgan Housel" },
      { title: "Building a Second Brain (Hardcover Edition)", author: "Tiago Forte" },
      { title: "Feel-Good Productivity", author: "Ali Abdaal" },
      { title: "Outlive: The Science and Art of Longevity", author: "Peter Attia" },
      { title: "Ultra-Processed People", author: "Chris van Tulleken" },
      { title: "Doppelganger: A Trip into the Mirror World", author: "Naomi Klein" },
      { title: "Determined: A Science of Life Without Free Will", author: "Robert M. Sapolsky" },
      { title: "Power and Progress: Our Thousand-Year Struggle Over Technology and Prosperity", author: "Daron Acemoglu and Simon Johnson" },
      { title: "Paved Paradise: How Parking Explains the World", author: "Henry Grabar" },
      { title: "Material World: The Six Raw Materials That Shape Modern Civilization", author: "Ed Conway" },
      { title: "The Worlds I See: Curiosity, Exploration, and Discovery at the Dawn of AI", author: "Fei-Fei Li" },
      { title: "Magic and Loss: The Internet as Art", author: "Virginia Heffernan" },
      { title: "The End of the World Is Just the Beginning", author: "Peter Zeihan" },
      { title: "Principles for Dealing with the Changing World Order", author: "Ray Dalio" }
    ]
  }
];

let nextId = existing.length + 1;
const addedBooks = [];

for (const part of MODERN_2025_2026_BOOKS) {
  for (const b of part.books) {
    addedBooks.push({
      id: nextId++,
      title: b.title,
      author: b.author,
      partNumber: part.partNumber,
      partName: part.partName,
      priority: part.priority,
      domain: part.domain
    });
  }
}

const allBooks = [...existing, ...addedBooks];
console.log(`Curriculum successfully expanded to ${allBooks.length} books!`);
fs.writeFileSync("curriculum.json", JSON.stringify(allBooks, null, 2));
