import fs from "fs";

const existing = JSON.parse(fs.readFileSync("curriculum.json", "utf-8"));
console.log("Current count:", existing.length);

const NEW_PARTS = [
  {
    partNumber: 26,
    partName: "Part 26: Tech Career Leverage & Global Engineering Transition",
    domain: "Technology / Math & Engineering",
    priority: "EXTREMELY HIGH",
    books: [
      { title: "The Software Engineer's Guidebook", author: "Gergely Orosz" },
      { title: "Cracking the Coding Interview", author: "Gayle Laakmann McDowell" },
      { title: "The Staff Engineer's Path", author: "Tanya Reilly" },
      { title: "Grokking Simplicity", author: "Eric Normand" },
      { title: "Building Mobile Apps at Scale", author: "Gergely Orosz" },
      { title: "A Guide to the Business Analysis Body of Knowledge (BABOK / CPQ Guide)", author: "IIBA" },
      { title: "Software Engineering at Google", author: "Titus Winters, Tom Manshreck and Hyrum Wright" },
      { title: "The Missing Readme: A Guide for the New Software Engineer", author: "Chris Riccomini and Dmitriy Ryaboy" },
      { title: "Righting Software", author: "Juval Löwy" },
      { title: "Building Evolutionary Architectures", author: "Neal Ford, Rebecca Parsons and Patrick Kua" },
      { title: "Working in Public: The Making and Maintenance of Open Source", author: "Nadia Eghbal" },
      { title: "Ask Your Developer", author: "Jeff Lawson" },
      { title: "The Tech Resume Inside Out", author: "Gergely Orosz" },
      { title: "Site Reliability Engineering: How Google Runs Production Systems", author: "Niall Richard Murphy et al." },
      { title: "Accelerate: The Science of Lean Software and DevOps", author: "Nicole Forsgren et al." }
    ]
  },
  {
    partNumber: 27,
    partName: "Part 27: The Fastlane & Unscripted Wealth Creation (FIRE Architecture)",
    domain: "Wealth / Markets & Finance",
    priority: "EXTREMELY HIGH",
    books: [
      { title: "The Millionaire Fastlane", author: "MJ DeMarco" },
      { title: "Unscripted: Life, Liberty, and the Pursuit of Entrepreneurship", author: "MJ DeMarco" },
      { title: "The Great Rat Race Escape", author: "MJ DeMarco" },
      { title: "The Almanack of Naval Ravikant", author: "Eric Jorgenson" },
      { title: "How to Get Rich", author: "Felix Dennis" },
      { title: "Early Retirement Extreme", author: "Jacob Lund Fisker" },
      { title: "Your Money: The Missing Manual", author: "J.D. Roth" },
      { title: "Quit Like a Millionaire", author: "Kristy Shen and Bryce Leung" },
      { title: "Work Optional: Retire Early the Non-Penny-Pinching Way", author: "Tanja Hester" },
      { title: "Meet the Frugalwoods", author: "Elizabeth Willard Thames" },
      { title: "Financial Freedom", author: "Grant Sabatier" },
      { title: "Money Works: A Rigorous Guide to Real Wealth in India", author: "Deepak Shenoy" },
      { title: "From the Rat Race to Financial Freedom", author: "Manoj Arora" },
      { title: "The Joys of Compounding", author: "Gautam Baid" },
      { title: "Bulls, Bears and Other Beasts", author: "Santosh Nair" }
    ]
  },
  {
    partNumber: 28,
    partName: "Part 28: Micro-SaaS, Bootstrapping & Independent Digital Assets",
    domain: "Business / Strategy & Execution",
    priority: "EXTREMELY HIGH",
    books: [
      { title: "MAKE: The Bootstrapper's Handbook", author: "Pieter Levels" },
      { title: "The SaaS Playbook", author: "Rob Walling" },
      { title: "Start Small, Stay Awesome", author: "Rob Walling" },
      { title: "The Embedded Entrepreneur", author: "Arvid Kahl" },
      { title: "Zero to Sold", author: "Arvid Kahl" },
      { title: "Show Your Work!", author: "Austin Kleon" },
      { title: "Steal Like an Artist", author: "Austin Kleon" },
      { title: "The Minimalist Entrepreneur", author: "Sahil Lavingia" },
      { title: "Just F***ing Ship", author: "Amy Hoy" },
      { title: "Deploy Empathy", author: "Michele Hansen" },
      { title: "Content Inc.", author: "Joe Pulizzi" },
      { title: "Traction: How Any Startup Can Achieve Explosive Customer Growth", author: "Gabriel Weinberg and Justin Mares" },
      { title: "Hooked: How to Build Habit-Forming Products", author: "Nir Eyal" },
      { title: "Subscribed: Why the Subscription Model Will Be Your Company's Future", author: "Tien Tzuo" },
      { title: "Find Your Yellow Car", author: "Christian Busch" }
    ]
  },
  {
    partNumber: 29,
    partName: "Part 29: Indian Equity Masters & Institutional Wealth Playbooks",
    domain: "Wealth / Markets & Finance",
    priority: "HIGH",
    books: [
      { title: "The Art of Wealth Creation in India", author: "Ramesh Damani" },
      { title: "Masterclass with Super-Investors", author: "Vishal Mittal and Saurabh Basrar" },
      { title: "Of Bulls, Bears and Morons", author: "Ravi Subramanian" },
      { title: "How to Avoid Loss and Earn Consistently in the Stock Market", author: "Prasenjit Paul" },
      { title: "Fundamental Analysis for Investors", author: "Raghu Palat" },
      { title: "Security Analysis and Portfolio Management", author: "Prasanna Chandra" },
      { title: "Valuation of Companies", author: "Aswath Damodaran" },
      { title: "Common Sense on Mutual Funds", author: "John C. Bogle" },
      { title: "Pioneering Portfolio Management", author: "David F. Swensen" },
      { title: "Unconventional Success", author: "David F. Swensen" },
      { title: "The Education of a Value Investor", author: "Guy Spier" },
      { title: "Richer, Wiser, Happier", author: "William Green" },
      { title: "What Works on Wall Street", author: "James P. O'Shaughnessy" },
      { title: "Quantitative Value", author: "Wesley R. Gray and Tobias E. Carlisle" },
      { title: "Deep Value", author: "Tobias E. Carlisle" }
    ]
  },
  {
    partNumber: 30,
    partName: "Part 30: Quarter-Life Mastery & High-Performance Mindset",
    domain: "Decision Science & Thinking",
    priority: "EXTREMELY HIGH",
    books: [
      { title: "Mastery", author: "Robert Greene" },
      { title: "The 33 Strategies of War", author: "Robert Greene" },
      { title: "The Laws of Human Nature", author: "Robert Greene" },
      { title: "Can't Hurt Me", author: "David Goggins" },
      { title: "Never Finished", author: "David Goggins" },
      { title: "Ego Is the Enemy", author: "Ryan Holiday" },
      { title: "The Obstacle Is the Way", author: "Ryan Holiday" },
      { title: "Stillness Is the Key", author: "Ryan Holiday" },
      { title: "Courage Is Calling", author: "Ryan Holiday" },
      { title: "Discipline Is Destiny", author: "Ryan Holiday" },
      { title: "Courage to Be Disliked", author: "Ichiro Kishimi and Fumitake Koga" },
      { title: "The Courage to Be Happy", author: "Ichiro Kishimi and Fumitake Koga" },
      { title: "12 Rules for Life", author: "Jordan B. Peterson" },
      { title: "Beyond Order", author: "Jordan B. Peterson" },
      { title: "Four Thousand Weeks: Time Management for Mortals", author: "Oliver Burkeman" }
    ]
  }
];

let nextId = existing.length + 1;
const addedBooks = [];

for (const part of NEW_PARTS) {
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
console.log(`Curriculum successfully expanded to ${allBooks.length} masterworks!`);
fs.writeFileSync("curriculum.json", JSON.stringify(allBooks, null, 2));
