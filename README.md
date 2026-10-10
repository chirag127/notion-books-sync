# 📚 Notion Books Library & Smart Sync CLI

An automated, cross-device reading tracker that connects **Google Books API** and **Open Library** directly to your **Notion Workspace**.

Built for seamless synchronization across multiple laptops and mobile phones, featuring an **exit strategy with 100% Markdown export compatibility**.

---

## 🌟 Key Features

1. **Automatic Book Metadata & High-Res Covers:**
   - Fetches official titles, authors, descriptions, page counts, and publication years.
   - Automatically sets the Notion page cover to the book's official high-resolution cover image.

2. **10-Pillar Universal Category System:**
   - Maps books into 10 future-proof domains (Wealth & Finance, Psychology & Behavior, Business, Personal Growth, Philosophy, Sci-Fi, Fiction, Science & Tech, History, and Society).
   - Generates subcategory tags (e.g., *Personal Finance*, *Behavioral Economics*, *Investing*, *Habits*).

3. **Pre-Formatted Reading Template for Every Book:**
   Every imported book page comes pre-built with:
   - 📌 **Executive Summary & Core Premise** (pre-filled from synopsis)
   - 💡 **The One Big Idea (Callout)**
   - 🧠 **Key Takeaways & Mental Models**
   - 💬 **Memorable Quotes & Highlights**
   - 🔗 **Bi-Directional Links & Connected Concepts** (for linking with other books)
   - 🎯 **Actionable Financial & Life Rules (Interactive Checklists)**

4. **Multi-Device Instant Sync:**
   - Edits made on any laptop or your phone appear instantly on all other devices via Notion's cloud.

5. **Data Ownership & Backup:**
   - Export your entire library anytime as standard `.md` (Markdown) and `.csv` files via Notion Settings.

---

## 🚀 How to Use

### 1. Add a Single Book
```bash
node index.js add "The Psychology of Money Morgan Housel"
node index.js add "Let's Talk Money Monika Halan"
node index.js add "Atomic Habits James Clear"
```

### 2. View All Books in Your Library
```bash
node index.js list
```

### 3. Batch Import Multiple Books
Add your book titles into `books.txt` (one book per line), then run:
```bash
node index.js batch books.txt
```

---

## ⚙️ Configuration (.env)

The `.env` file is safely ignored by Git:
```env
NOTION_TOKEN=ntn_...
NOTION_DATABASE_ID=3f5f70b927a4800e9453fcfce1a4911e
GOOGLE_BOOKS_API_KEY=AIzaSy...
```

---

## 📱 Viewing in Notion (Laptops & Phone)

Open your page: **[Books Library](https://app.notion.com/p/Books-Library-3f5f70b927a480559a8ecd72ee9a2b7a)**

### Recommended Views to Add in Notion:
1. **Gallery View:**
   - Click `+ Add view` $\rightarrow$ select **Gallery**.
   - Under `Card preview`, select **Page cover**.
   - Your books will look like a real visual bookshelf!
2. **Board View (Grouped by Category):**
   - Click `+ Add view` $\rightarrow$ select **Board**.
   - Group by `Category`.
   - You can see your books organized under *Wealth & Finance*, *Psychology*, *Business*, etc.
