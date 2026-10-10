// Chirag'\''s Lifetime Reading Curriculum — Interactive Web Client

document.addEventListener("DOMContentLoaded", () => {
  const books = window.BOOKS_DATA || [];
  const booksGrid = document.getElementById("booksGrid");
  const searchInput = document.getElementById("searchInput");
  const partSelect = document.getElementById("partSelect");
  const prioritySelect = document.getElementById("prioritySelect");
  const domainTabs = document.getElementById("domainTabs");
  const ambientGlow = document.getElementById("ambientGlow");

  // Modal elements
  const modal = document.getElementById("bookModal");
  const btnCloseModal = document.getElementById("btnCloseModal");
  const modalCover = document.getElementById("modalCoverContainer");
  const modalBadge = document.getElementById("modalBadge");
  const modalTitle = document.getElementById("modalTitle");
  const modalAuthor = document.getElementById("modalAuthor");
  const modalPart = document.getElementById("modalPart");
  const modalBody = document.getElementById("modalBody");
  const modalGoogleLink = document.getElementById("modalGoogleLink");

  let currentDomain = "ALL";
  let currentPart = "ALL";
  let currentPriority = "ALL";
  let currentSearch = "";

  // Ambient mouse glow
  window.addEventListener("pointermove", (e) => {
    if (ambientGlow) {
      ambientGlow.style.left = `${e.clientX}px`;
      ambientGlow.style.top = `${e.clientY}px`;
    }
  });

  // Populate 25 Parts Dropdown
  const uniqueParts = [...new Set(books.map((b) => b.partName))];
  uniqueParts.forEach((partName) => {
    const opt = document.createElement("option");
    opt.value = partName;
    opt.textContent = partName;
    partSelect.appendChild(opt);
  });

  // Update Stats
  const extHighCount = books.filter((b) => b.priority === "EXTREMELY HIGH").length;
  document.getElementById("statTotalBooks").textContent = books.length;
  document.getElementById("statExtremelyHigh").textContent = extHighCount;

  // Render books
  function renderBooks() {
    const query = currentSearch.toLowerCase().trim();

    const filtered = books.filter((b) => {
      // Domain filter
      if (currentDomain !== "ALL" && b.domain !== currentDomain) return false;
      // Part filter
      if (currentPart !== "ALL" && b.partName !== currentPart) return false;
      // Priority filter
      if (currentPriority !== "ALL" && b.priority !== currentPriority) return false;
      // Search query
      if (query) {
        const matchTitle = b.title.toLowerCase().includes(query);
        const matchAuthor = b.author.toLowerCase().includes(query);
        const matchIndex = `#${b.id}`.includes(query) || String(b.id) === query;
        const matchPart = b.partName.toLowerCase().includes(query);
        if (!matchTitle && !matchAuthor && !matchIndex && !matchPart) return false;
      }
      return true;
    });

    booksGrid.innerHTML = "";

    if (filtered.length === 0) {
      booksGrid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 4rem; color: #94a3b8;">
          <div style="font-size: 3rem; margin-bottom: 1rem;">🔍</div>
          <h3>No books matched your criteria</h3>
          <p>Try clearing your search query or selecting a different domain.</p>
        </div>
      `;
      return;
    }

    filtered.forEach((book) => {
      const card = document.createElement("div");
      card.className = "book-card";

      // Priority class
      const pClass =
        book.priority === "EXTREMELY HIGH"
          ? "priority-extremely-high"
          : book.priority === "HIGH"
          ? "priority-high"
          : "priority-medium";

      // Formatted Index
      const indexStr = `#${String(book.id).padStart(3, "0")}`;

      // High-res cover or 3D mock spine
      const coverHtml = `
        <div class="book-cover-wrap">
          <div class="book-spine-mock">
            <div class="mock-title">${escapeHtml(book.title)}</div>
            <div class="mock-author">${escapeHtml(book.author)}</div>
          </div>
        </div>
      `;

      card.innerHTML = `
        <div class="book-card-top">
          <span class="book-index">${indexStr}</span>
          <span class="priority-badge ${pClass}">${book.priority}</span>
        </div>
        ${coverHtml}
        <h3 class="book-title">${escapeHtml(book.title)}</h3>
        <div class="book-author">by ${escapeHtml(book.author)}</div>
        <div class="book-meta-footer">
          <div class="part-tag">${escapeHtml(book.partName)}</div>
          <button class="btn-read-notes">Read AI Chapter Notes 📖</button>
        </div>
      `;

      card.addEventListener("click", () => openBookModal(book));
      booksGrid.appendChild(card);
    });
  }

  // Pre-compiled deep notes for top books
  const DEEP_NOTES = {
    1: {
      thesis: "Doing well with money has a little to do with how smart you are and a lot to do with how you behave. Financial success is not a hard science like physics or engineering; it is a soft skill where your personal psychology, ego, emotional stability, and historical perspective matter infinitely more than spreadsheet formulas.",
      chapters: [
        { title: "Ch 1: No One's Crazy", takeaway: "Your personal financial history shapes 80% of how you view risk. What looks crazy to you makes complete sense to someone who grew up in a different era." },
        { title: "Ch 2: Luck & Risk", takeaway: "Luck and risk are siblings. Never judge an investor solely by their best or worst outcome; variance dominates short-term results." },
        { title: "Ch 3: Never Enough", takeaway: "The most dangerous financial disease is moving the goalpost. Knowing when you have 'Enough' protects your freedom." },
        { title: "Ch 4: Confounding Compounding", takeaway: "More than 95% of Warren Buffett's wealth accumulated after his 65th birthday. Compounding demands patience, not extraordinary monthly returns." },
        { title: "Ch 5: Getting Wealthy vs. Staying Wealthy", takeaway: "Getting wealth requires optimism and risk; staying wealthy requires frugality, paranoia, and an unshakeable cash cushion." },
        { title: "Ch 6: Tails, You Win", takeaway: "A small fraction of rare tail events drive 90% of returns in venture capital, index funds, and careers. You can be wrong half the time and still win." },
        { title: "Ch 7: Freedom", takeaway: "The highest dividend money pays is the ability to control your own time and wake up saying, 'I can do whatever I want today.'" },
        { title: "Ch 8: The Man in the Car Paradox", takeaway: "No one is admiring the driver of an expensive car; they are imagining how cool they would look in it. Modesty earns authentic respect." },
        { title: "Ch 9: Wealth is What You Don't See", takeaway: "Spending money to show people how much money you have is the fastest route to having less money." },
        { title: "Ch 10: Save Money", takeaway: "Save without a specific purchase goal. Unallocated savings provide the flexibility to capitalize on unexpected opportunities." },
        { title: "Ch 11: Reasonable > Rational", takeaway: "Don't aim for cold mathematical optimization. Choose an investment strategy that lets you sleep at night during market panics." },
        { title: "Ch 15: Nothing's Free", takeaway: "Market downturns are not a fine; they are an admission ticket to equity returns. Pay the fee with emotional stamina." }
      ],
      actionRules: [
        "Define your personal 'Enough' to avoid lifestyle inflation.",
        "Never interrupt compounding unnecessarily during short-term volatility.",
        "Keep a 6–12 month cash buffer so you never become a forced seller in a crash."
      ]
    },
    17: {
      thesis: "Personal finance in India is plagued by product mis-selling (endowments, ULIPs). Monika Halan lays down an automated 3-account money system to segregate cash flow, secure health/life protection, and ride India's equity growth story through disciplined index SIPs.",
      chapters: [
        { title: "Ch 1–3: The 3-Account Cash Flow Box", takeaway: "Segregate into: (1) Income & Expense Account, (2) Emergency & Sinking Fund, (3) Wealth Accumulation (automated SIPs)." },
        { title: "Ch 4–5: Emergency Shock Absorber", takeaway: "Keep 6 months of mandatory fixed commitments in liquid funds / sweep FDs to insulate against job or medical shocks." },
        { title: "Ch 6–7: Pure Risk Protection", takeaway: "Never mix investment with insurance. Buy pure term cover (15x–20x income) + family health cover with a high-deductible Super Top-Up." },
        { title: "Ch 8–10: Equity Investing in India", takeaway: "Broad-market index funds (Nifty 50 / Next 50) beating 6–7% inflation through long-term uninterrupted rupee-cost averaging." },
        { title: "Ch 14: Retirement Priority", takeaway: "You can get a loan for a house or education, but no one gives you a loan for retirement. Fund retirement first." }
      ],
      actionRules: [
        "Automate salary day transfers into the Wealth and Emergency accounts.",
        "Verify beneficial nomination and term cover adequacy.",
        "Avoid all traditional endowment and guaranteed income policies."
      ]
    }
  };

  function openBookModal(book) {
    const pClass =
      book.priority === "EXTREMELY HIGH"
        ? "priority-extremely-high"
        : book.priority === "HIGH"
        ? "priority-high"
        : "priority-medium";

    modalBadge.textContent = `#${String(book.id).padStart(3, "0")} • ${book.priority}`;
    modalBadge.className = `badge-pill ${pClass}`;
    modalTitle.textContent = book.title;
    modalAuthor.textContent = `by ${book.author}`;
    modalPart.textContent = `${book.partName} • [${book.domain}]`;
    modalGoogleLink.href = book.googleSearchUrl;

    modalCover.innerHTML = `
      <div class="book-spine-mock" style="width: 130px; height: 190px;">
        <div class="mock-title" style="font-size: 0.82rem;">${escapeHtml(book.title)}</div>
        <div class="mock-author">${escapeHtml(book.author)}</div>
      </div>
    `;

    const note = DEEP_NOTES[book.id];
    if (note) {
      let chaptersHtml = note.chapters
        .map(
          (c) => `
        <div style="margin-bottom: 0.9rem; background: rgba(255,255,255,0.03); padding: 0.8rem 1rem; border-radius: 8px; border-left: 3px solid #6366f1;">
          <strong style="color: #c7d2fe;">${escapeHtml(c.title)}:</strong>
          <span style="color: #cbd5e1; margin-left: 0.4rem;">${escapeHtml(c.takeaway)}</span>
        </div>
      `
        )
        .join("");

      let rulesHtml = note.actionRules
        .map((r) => `<li>${escapeHtml(r)}</li>`)
        .join("");

      modalBody.innerHTML = `
        <h2>🏛️ Core Premise & First Principles</h2>
        <p>${escapeHtml(note.thesis)}</p>

        <h2>📑 Chapter-by-Chapter Core Synthesis</h2>
        ${chaptersHtml}

        <h2>🎯 Actionable Playbook for Chirag</h2>
        <ul>${rulesHtml}</ul>

        <h2>🔗 Cross-Curriculum Syntopical Connections</h2>
        <p>This masterwork links to other foundational texts in your 400-book roadmap. Type <code>@</code> or <code>[[</code> in your Notion workspace to connect ideas.</p>
      `;
    } else {
      modalBody.innerHTML = `
        <h2>🏛️ Curriculum Roadmap & Subject Focus</h2>
        <p><strong>${escapeHtml(book.title)}</strong> by <em>${escapeHtml(book.author)}</em> is curated under <strong>${escapeHtml(book.partName)}</strong> as a cornerstone text in <strong>${escapeHtml(book.domain)}</strong>.</p>
        
        <h2>🧠 Key Intellectual Focus Areas</h2>
        <ul>
          <li>Core theories, models, and empirical observations established by ${escapeHtml(book.author)}.</li>
          <li>How this book connects to upstream and downstream works in Track #${String(book.partNumber).padStart(2, "0")}.</li>
          <li>Strategic application to your personal and professional knowledge portfolio.</li>
        </ul>

        <h2>📝 Personal Reading Notes & Active Recall</h2>
        <p>Open this book directly in your Notion workspace to add your personalized chapter highlights, quotes, and active recall notes.</p>
      `;
    }

    modal.classList.add("active");
  }

  // Close modal
  btnCloseModal.addEventListener("click", () => modal.classList.remove("active"));
  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.classList.remove("active");
  });
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") modal.classList.remove("active");
  });

  // Filter Event Listeners
  searchInput.addEventListener("input", (e) => {
    currentSearch = e.target.value;
    renderBooks();
  });

  partSelect.addEventListener("change", (e) => {
    currentPart = e.target.value;
    renderBooks();
  });

  prioritySelect.addEventListener("change", (e) => {
    currentPriority = e.target.value;
    renderBooks();
  });

  domainTabs.addEventListener("click", (e) => {
    const btn = e.target.closest(".domain-tab");
    if (!btn) return;
    document.querySelectorAll(".domain-tab").forEach((t) => t.classList.remove("active"));
    btn.classList.add("active");
    currentDomain = btn.dataset.domain;
    renderBooks();
  });

  function escapeHtml(str) {
    if (!str) return "";
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // Initial Render
  renderBooks();
});
