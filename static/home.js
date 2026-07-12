(function () {
    const USER = "swarn007-byte";
    const CONTACT_EMAIL = "swarnshekhar21j@gmail.com";
    const gmailComposeBase = "https://mail.google.com/mail/?view=cm&fs=1";
    const hireMailto = `${gmailComposeBase}&to=${encodeURIComponent(CONTACT_EMAIL)}&su=${encodeURIComponent("Opportunity")}&body=${encodeURIComponent("Hi Swarn Shekhar,\n\n")}`;
    const helloMailto = `${gmailComposeBase}&to=${encodeURIComponent(CONTACT_EMAIL)}&su=${encodeURIComponent("Hello")}&body=${encodeURIComponent("Hi Swarn Shekhar,\n\n")}`;

    const statsEl = document.getElementById("github-stats");
    const activityEl = document.getElementById("repo-activity");
    const chartEl = document.getElementById("contrib-chart");
    const hireLink = document.getElementById("hire-me-link");
    const contactEmailLink = document.getElementById("contact-email-link");
    const contactForm = document.getElementById("contact-form");
    let githubUserData = null;
    let githubReposData = [];
    const githubBadges = [
        {
            href: "https://github.com/swarn007-byte?achievement=quickdraw&tab=achievements",
            image: "https://github.githubassets.com/assets/quickdraw-default-39c6aec8ff89.png",
            alt: "GitHub Quickdraw achievement badge",
        },
        {
            href: "https://github.com/swarn007-byte?achievement=starstruck&tab=achievements",
            image: "https://github.githubassets.com/assets/starstruck-default-b6610abad518.png",
            alt: "GitHub Starstruck achievement badge",
        },
    ];

    function timeAgo(dateStr) {
        const days = Math.floor(
            (Date.now() - new Date(dateStr).getTime()) / 86400000,
        );
        if (days === 0) return "today";
        if (days === 1) return "yesterday";
        if (days < 30) return `${days}d ago`;
        if (days < 365) return `${Math.floor(days / 30)}mo ago`;
        return `${Math.floor(days / 365)}y ago`;
    }

    function activityDot(repo) {
        const days =
            (Date.now() - new Date(repo.pushed_at).getTime()) / 86400000;
        if (days < 7) return "dot-hot";
        if (days < 30) return "dot-warm";
        if (days < 90) return "dot-cool";
        return "dot-cold";
    }

    function renderStats(user) {
        if (
            !statsEl ||
            typeof user?.public_repos !== "number" ||
            typeof user?.followers !== "number" ||
            typeof user?.following !== "number"
        ) {
            return;
        }
        statsEl.innerHTML = `
            <div class="github-stat"><strong>${user.public_repos}</strong> repos</div>
            <div class="github-stat"><strong>${user.followers}</strong> followers</div>
            <div class="github-stat"><strong>${user.following}</strong> following</div>
            ${githubBadges
                .map(
                    (badge) => `
                <a href="${badge.href}" target="_blank" rel="noopener noreferrer" class="github-badge-link" aria-label="${badge.alt}">
                    <img src="${badge.image}" alt="${badge.alt}" class="github-badge-image" loading="lazy" />
                </a>
            `,
                )
                .join("")}
        `;
    }

    function renderActivity(repos) {
        if (!activityEl || !Array.isArray(repos)) return;
        const recent = repos
            .filter((r) => !r.fork && r.name !== USER)
            .sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at))
            .slice(0, 8);

        if (!recent.length) {
            activityEl.innerHTML =
                '<p class="normal-text text-sm">no public repos found</p>';
            return;
        }

        activityEl.innerHTML = recent
            .map(
                (repo) => `
            <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="repo-activity-item">
                <span class="repo-activity-dot ${activityDot(repo)}" aria-hidden="true"></span>
                <span class="repo-activity-name">${repo.name}</span>
                <span class="repo-activity-lang">${repo.language || "-"}</span>
                <span class="repo-activity-time">${timeAgo(repo.pushed_at)}</span>
            </a>
        `,
            )
            .join("");
    }

    function loadRepoGrid(container) {
        if (!container) return;
        fetch(
            `https://api.github.com/users/${USER}/repos?sort=pushed&per_page=100`,
        )
            .then((r) => r.json())
            .then((repos) => {
                const filtered = repos
                    .filter((r) => !r.fork && r.name !== USER)
                    .sort(
                        (a, b) =>
                            new Date(b.pushed_at) - new Date(a.pushed_at),
                    )
                    .slice(0, 52);

                container.innerHTML = filtered
                    .map((repo) => {
                        const dot = activityDot(repo).replace("dot-", "level-");
                        return `<a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="repo-cell ${dot}" title="${repo.name}"></a>`;
                    })
                    .join("");
            })
            .catch(() => {});
    }

    function renderContributionGrid(days) {
        if (!chartEl) return;
        const levelClass = (level) => `contrib-level-${Number(level) || 0}`;
        const visibleDays = days.slice(-371);
        const weeks = [];

        for (let i = 0; i < visibleDays.length; i += 7) {
            weeks.push(visibleDays.slice(i, i + 7));
        }

        chartEl.innerHTML = `
            <div class="github-contrib-weeks">
                ${weeks
                    .map(
                        (week) => `
                    <div class="github-contrib-week">
                        ${week
                            .map(
                                (day) => `
                            <span
                                class="github-contrib-cell ${levelClass(day.level)}"
                                title="${day.count} contribution${day.count === 1 ? "" : "s"} on ${day.date}"
                                aria-label="${day.count} contribution${day.count === 1 ? "" : "s"} on ${day.date}"
                            ></span>
                        `,
                            )
                            .join("")}
                    </div>
                `,
                    )
                    .join("")}
            </div>
            <div class="github-contrib-legend">
                <span>Less</span>
                <span class="github-contrib-cell contrib-level-0"></span>
                <span class="github-contrib-cell contrib-level-1"></span>
                <span class="github-contrib-cell contrib-level-2"></span>
                <span class="github-contrib-cell contrib-level-3"></span>
                <span class="github-contrib-cell contrib-level-4"></span>
                <span>More</span>
            </div>
        `;
    }

    function fallbackContributionDays(repos) {
        if (!Array.isArray(repos)) return [];
        const byDate = new Map();
        const today = new Date();
        const start = new Date(today);
        start.setDate(start.getDate() - 370);

        repos
            .filter((repo) => !repo.fork && repo.pushed_at)
            .forEach((repo) => {
                const key = repo.pushed_at.slice(0, 10);
                byDate.set(key, (byDate.get(key) || 0) + 1);
            });

        return Array.from({ length: 371 }, (_, index) => {
            const date = new Date(start);
            date.setDate(start.getDate() + index);
            const key = date.toISOString().slice(0, 10);
            const count = byDate.get(key) || 0;
            return {
                date: key,
                count,
                level: Math.min(4, count),
            };
        });
    }

    function loadContributionGrid() {
        if (!chartEl) return;

        fetch(`https://github-contributions-api.jogruber.de/v4/${USER}?y=last`)
            .then((r) => r.json())
            .then((data) => {
                if (!Array.isArray(data.contributions)) {
                    throw new Error("missing contributions");
                }
                renderContributionGrid(data.contributions);
            })
            .catch(() => {
                chartEl.innerHTML =
                    '<p class="normal-text text-sm">contribution grid unavailable - showing repo activity instead</p><div class="repo-grid" id="repo-grid-inner"></div>';
                loadRepoGrid(document.getElementById("repo-grid-inner"));
            });
    }

    function initOrigamiBird() {
        const bird = document.querySelector(".origami-bird");
        const light = document.querySelector(".bird-light");
        if (
            !bird ||
            window.innerWidth <= 768 ||
            !window.matchMedia("(pointer: fine)").matches
        ) {
            return;
        }

        let targetX = window.innerWidth - 120;
        let targetY = 140;
        let currentX = targetX;
        let currentY = targetY;
        let lastX = currentX;

        bird.style.right = "auto";
        bird.style.left = "0px";
        bird.style.top = "0px";
        bird.style.animation = "none";
        if (light) {
            light.style.display = "block";
        }

        window.addEventListener(
            "pointermove",
            (event) => {
                targetX = event.clientX + 18;
                targetY = event.clientY + 18;
            },
            { passive: true },
        );

        function animate() {
            currentX += (targetX - currentX) * 0.075;
            currentY += (targetY - currentY) * 0.075;
            const dx = currentX - lastX;
            const tilt = Math.max(-28, Math.min(28, dx * 1.8));
            const flip = dx < -0.35 ? -1 : 1;

            bird.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) rotate(${tilt}deg) scaleX(${flip})`;
            if (light) {
                light.style.transform = `translate3d(${currentX - 132}px, ${currentY - 132}px, 0)`;
            }
            lastX = currentX;
            requestAnimationFrame(animate);
        }

        requestAnimationFrame(animate);
    }

    function openMailDraft(mailto) {
        document.documentElement.dataset.lastMailto = mailto;
        if (window.__TEST_MODE__) {
            return;
        }
        window.location.href = mailto;
    }

    function initContactActions() {
        if (hireLink) {
            hireLink.setAttribute("href", hireMailto);
            hireLink.addEventListener("click", (event) => {
                event.preventDefault();
                openMailDraft(hireMailto);
            });
        }

        if (contactEmailLink) {
            contactEmailLink.setAttribute("href", helloMailto);
            contactEmailLink.addEventListener("click", (event) => {
                event.preventDefault();
                openMailDraft(helloMailto);
            });
        }

        contactForm?.addEventListener("submit", (event) => {
            event.preventDefault();
            const formData = new FormData(contactForm);
            const name = (formData.get("name") || "").toString().trim();
            const email = (formData.get("email") || "").toString().trim();
            const message = (formData.get("message") || "").toString().trim();

            const lines = [
                "Hi Swarn Shekhar,",
                "",
                message || "I would love to connect regarding an opportunity.",
                "",
            ];

            if (name) lines.push(`Name: ${name}`);
            if (email) lines.push(`Email: ${email}`);

            const mailto = `${gmailComposeBase}&to=${encodeURIComponent(
                CONTACT_EMAIL,
            )}&su=${encodeURIComponent(
                name ? `Opportunity from ${name}` : "Opportunity",
            )}&body=${encodeURIComponent(lines.join("\n"))}`;

            openMailDraft(mailto);
        });
    }

    function loadProjectStars() {
        fetch(`https://api.github.com/users/${USER}/repos?sort=pushed&per_page=100`)
            .then((r) => r.json())
            .then((repos) => {
                const starMap = {};
                repos.forEach((repo) => {
                    starMap[repo.name] = repo.stargazers_count;
                });

                document.querySelectorAll(".project-card").forEach((card) => {
                    const repoName =
                        card.getAttribute("data-repo") ||
                        card
                            .querySelector('a[href*="github.com"]')
                            ?.getAttribute("href")
                            ?.split("/")
                            .filter(Boolean)
                            .pop();
                    const starsCount = starMap[repoName] || 0;
                    const starsSpan = card.querySelector(".stars-count");
                    if (starsSpan) {
                        starsSpan.textContent = starsCount;
                    }
                });
            })
            .catch(() => {});
    }

    function tokenize(text) {
        const stopwords = new Set([
            "a",
            "an",
            "and",
            "are",
            "about",
            "around",
            "at",
            "be",
            "can",
            "does",
            "for",
            "from",
            "has",
            "he",
            "her",
            "his",
            "how",
            "i",
            "in",
            "is",
            "it",
            "me",
            "of",
            "on",
            "or",
            "right",
            "the",
            "their",
            "them",
            "there",
            "to",
            "tell",
            "what",
            "with",
        ]);
        return text
            .toLowerCase()
            .replace(/[^a-z0-9+#.\-\s]/g, " ")
            .split(/\s+/)
            .filter((token) => token && !stopwords.has(token) && token.length > 1);
    }

    function expandTokens(tokens) {
        const aliases = {
            hire: ["contact", "email", "opportunity"],
            mail: ["email", "contact"],
            github: ["repo", "repositories", "followers", "following", "stars"],
            repo: ["github", "repository", "project"],
            repos: ["github", "repositories", "project"],
            project: ["work", "build", "github"],
            projects: ["work", "build", "github"],
            experience: ["aossie", "open", "source", "contributor"],
            resume: ["profile", "background", "skills", "experience"],
            cv: ["resume", "profile"],
            skill: ["stack", "tools", "technology"],
            skills: ["stack", "tools", "technology"],
            rag: ["retrieval", "llm", "vector", "graphrag"],
            networking: ["tcp", "udp", "distributed", "systems"],
            leetcode: ["coding", "dsa", "problem", "solving"],
        };

        const expanded = new Set(tokens);
        tokens.forEach((token) => {
            (aliases[token] || []).forEach((related) => expanded.add(related));
        });
        return [...expanded];
    }

    function chunkText(text, size = 38, overlap = 10) {
        const words = text.split(/\s+/).filter(Boolean);
        if (words.length <= size) return [text.trim()];

        const chunks = [];
        for (let index = 0; index < words.length; index += size - overlap) {
            chunks.push(words.slice(index, index + size).join(" "));
        }
        return chunks;
    }

    function buildKnowledgeDocuments() {
        const docs = [];
        const intro = document.querySelector(".portfolio-intro")?.innerText?.trim();
        if (intro) {
            docs.push({
                source: "intro",
                title: "Profile summary",
                text: intro,
            });
        }

        const skillItems = [...document.querySelectorAll(".portfolio-skills span")]
            .map((item) => item.innerText.replace(/\s+/g, " ").trim())
            .filter(Boolean);
        if (skillItems.length) {
            docs.push({
                source: "skills",
                title: "Core skills and stack",
                text: `Core skills and stack: ${skillItems.join(", ")}.`,
            });
        }

        document.querySelectorAll(".experience-card").forEach((card) => {
            const title = card.querySelector("h3")?.innerText?.trim() || "Experience";
            const meta = [...card.querySelectorAll(".experience-meta-row span")]
                .map((item) => item.innerText.trim())
                .join(" | ");
            const summary = card.querySelector(".experience-summary")?.innerText?.trim() || "";
            const tags = [...card.querySelectorAll(".experience-tags span")]
                .map((item) => item.innerText.trim())
                .join(", ");

            docs.push({
                source: "experience",
                title,
                text: `${title}. ${meta}. ${summary}. Tags: ${tags}.`,
            });
        });

        document.querySelectorAll(".portfolio-project-card").forEach((card) => {
            const title = card.querySelector("h3")?.innerText?.trim() || "Project";
            const summary = card.querySelector(".portfolio-project-body p")?.innerText?.trim() || "";
            const tags = [...card.querySelectorAll(".portfolio-project-tags span")]
                .map((item) => item.innerText.trim())
                .join(", ");

            docs.push({
                source: "projects",
                title,
                text: `${title}. ${summary}. Stack: ${tags}.`,
            });
        });

        document.querySelectorAll("#journal .portfolio-blog-item").forEach((entry) => {
            const title = entry.querySelector("h3")?.innerText?.trim() || "Journal";
            const description = entry.querySelector(".portfolio-blog-description")?.innerText?.trim() || "";
            const meta = entry.querySelector(".portfolio-blog-copy p")?.innerText?.trim() || "";

            docs.push({
                source: "journal",
                title,
                text: `${title}. ${meta}. ${description}.`,
            });
        });

        docs.push({
            source: "contact",
            title: "Contact",
            text: `Contact Swarn at ${CONTACT_EMAIL}. Hire Me and Email me both open a compose draft addressed to ${CONTACT_EMAIL} starting with Hi Swarn Shekhar.`,
        });

        if (githubUserData) {
            docs.push({
                source: "github",
                title: "GitHub stats",
                text: `GitHub profile swarn007-byte has ${githubUserData.public_repos} public repos, ${githubUserData.followers} followers, and follows ${githubUserData.following} accounts.`,
            });
        }

        if (Array.isArray(githubReposData) && githubReposData.length) {
            const recentRepos = githubReposData
                .filter((repo) => !repo.fork && repo.name !== USER)
                .slice(0, 12)
                .map((repo) => {
                    const language = repo.language || "unknown language";
                    const updated = repo.time_ago || timeAgo(repo.pushed_at);
                    return `${repo.name} uses ${language} and was updated ${updated}`;
                });

            docs.push({
                source: "github",
                title: "Recent GitHub repos",
                text: `Recent repository activity: ${recentRepos.join(". ")}.`,
            });
        }

        return docs;
    }

    function readStatsFromDom() {
        const statValues = [...document.querySelectorAll("#github-stats .github-stat strong")]
            .map((item) => Number(item.textContent.trim()));
        if (statValues.length < 3 || statValues.some((value) => Number.isNaN(value))) {
            return null;
        }
        return {
            public_repos: statValues[0],
            followers: statValues[1],
            following: statValues[2],
        };
    }

    function readSkillsFromDom() {
        return [...document.querySelectorAll(".portfolio-skills span")]
            .map((item) => item.innerText.replace(/\s+/g, " ").trim())
            .filter(Boolean);
    }

    function buildKnowledgeChunks() {
        return buildKnowledgeDocuments().flatMap((doc) =>
            chunkText(doc.text).map((text, index) => ({
                source: doc.source,
                title: doc.title,
                text,
                index,
                tokens: tokenize(text),
            })),
        );
    }

    function detectQuestionIntent(question) {
        const q = question.toLowerCase();
        if (q.includes("contact") || q.includes("hire") || q.includes("email")) {
            return "contact";
        }
        if (q.includes("github") || q.includes("repo") || q.includes("followers") || q.includes("following")) {
            return "github";
        }
        if (q.includes("experience") || q.includes("aossie") || q.includes("open source")) {
            return "experience";
        }
        if (q.includes("skill") || q.includes("stack") || q.includes("tech")) {
            return "skills";
        }
        if (q.includes("project") || q.includes("build") || q.includes("work")) {
            return "projects";
        }
        return "general";
    }

    function retrieveKnowledge(question) {
        const queryTokens = expandTokens(tokenize(question));
        const querySet = new Set(queryTokens);
        const intent = detectQuestionIntent(question);
        const allowedSourcesByIntent = {
            contact: new Set(["contact"]),
            github: new Set(["github", "projects"]),
            experience: new Set(["experience", "intro"]),
            skills: new Set(["skills", "projects", "intro"]),
            projects: new Set(["projects", "github", "intro"]),
            general: null,
        };
        const allowed = allowedSourcesByIntent[intent];
        const chunks = buildKnowledgeChunks().filter(
            (chunk) => !allowed || allowed.has(chunk.source),
        );

        return chunks
            .map((chunk) => {
                let score = 0;
                chunk.tokens.forEach((token) => {
                    if (querySet.has(token)) score += 3;
                });

                if (queryTokens.some((token) => chunk.title.toLowerCase().includes(token))) {
                    score += 5;
                }

                if (chunk.source === "github" && querySet.has("github")) score += 3;
                if (chunk.source === "projects" && (querySet.has("project") || querySet.has("stack"))) score += 3;
                if (chunk.source === "skills" && (querySet.has("skills") || querySet.has("stack") || querySet.has("tech"))) score += 4;
                if (chunk.source === "experience" && (querySet.has("experience") || querySet.has("aossie"))) score += 4;
                if (chunk.source === "contact" && (querySet.has("contact") || querySet.has("email"))) score += 3;

                return { ...chunk, score };
            })
            .filter((chunk) => chunk.score > 0)
            .sort((a, b) => b.score - a.score)
            .slice(0, 4);
    }

    function formatRagAnswer(question, matches) {
        const q = question.toLowerCase();

        if (q.includes("contact") || q.includes("hire") || q.includes("email")) {
            return `You can reach Swarn at ${CONTACT_EMAIL}. The Hire Me button opens a compose draft to that address with "Hi Swarn Shekhar" prefilled.`;
        }

        if (q.includes("github")) {
            const stats = githubUserData || readStatsFromDom();
            if (stats) {
                const repoSummary = githubReposData[0]
                    ? ` Recent activity includes ${githubReposData
                          .slice(0, 3)
                          .map((repo) => repo.name)
                          .join(", ")}.`
                    : "";
                return `Swarn's GitHub has ${stats.public_repos} public repos, ${stats.followers} followers, and ${stats.following} following.${repoSummary}`;
            }
        }

        if (!matches.length) {
            return "I can help with resume, projects, skills, experience, GitHub activity, and contact details. Ask about projects, stack, open-source work, repo activity, or how to reach Swarn.";
        }

        const seenTitles = new Set();
        const evidence = matches
            .filter((chunk) => {
                if (seenTitles.has(chunk.title)) return false;
                seenTitles.add(chunk.title);
                return true;
            })
            .map((chunk) => chunk.text.trim())
            .slice(0, 3);

        if (q.includes("skill") || q.includes("stack") || q.includes("tech")) {
            const skills = readSkillsFromDom();
            if (skills.length) {
                return `Swarn's core stack includes ${skills.slice(0, 10).join(", ")}.${evidence[1] ? ` ${evidence[1]}` : ""}`;
            }
            return evidence.join(" ");
        }

        if (q.includes("project") || q.includes("build") || q.includes("work")) {
            return evidence.join(" ");
        }

        if (q.includes("experience") || q.includes("open source") || q.includes("aossie")) {
            return evidence.join(" ");
        }

        return `Here’s what I found: ${evidence.join(" ")}`;
    }

    function initResumeChat() {
        const chat = document.querySelector(".resume-chat");
        const chatToggle = document.querySelector(".resume-chat-toggle");
        const chatClose = document.querySelector(".resume-chat-close");
        const chatMessages = document.querySelector(".resume-chat-messages");
        const chatForm = document.querySelector(".resume-chat-form");
        const chatInput = chatForm?.querySelector("input");
        const chatPrompts = document.querySelectorAll(".resume-chat-prompts button");

        function setChatOpen(isOpen) {
            if (!chat || !chatToggle) return;
            chat.dataset.open = String(isOpen);
            chatToggle.setAttribute("aria-expanded", String(isOpen));
            if (isOpen) setTimeout(() => chatInput?.focus(), 80);
        }

        function addMessage(text, sender) {
            if (!chatMessages) return;
            const bubble = document.createElement("p");
            bubble.className = `resume-chat-bubble ${sender}`;
            bubble.textContent = text;
            chatMessages.appendChild(bubble);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }

        function answerQuestion(question) {
            return formatRagAnswer(question, retrieveKnowledge(question));
        }

        chatToggle?.addEventListener("click", () => {
            setChatOpen(chat?.dataset.open !== "true");
        });

        chatClose?.addEventListener("click", () => setChatOpen(false));

        chatPrompts.forEach((button) => {
            button.addEventListener("click", () => {
                const question = button.textContent.trim();
                addMessage(question, "user");
                addMessage(answerQuestion(question), "bot");
                setChatOpen(true);
            });
        });

        chatForm?.addEventListener("submit", (event) => {
            event.preventDefault();
            const question = chatInput.value.trim();
            if (!question) return;
            addMessage(question, "user");
            chatInput.value = "";
            setTimeout(() => addMessage(answerQuestion(question), "bot"), 120);
        });
    }

    Promise.all([
        fetch(`https://api.github.com/users/${USER}`).then((r) => r.json()),
        fetch(
            `https://api.github.com/users/${USER}/repos?sort=pushed&per_page=100`,
        ).then((r) => r.json()),
    ])
        .then(([user, repos]) => {
            if (
                typeof user?.public_repos === "number" &&
                typeof user?.followers === "number" &&
                typeof user?.following === "number"
            ) {
                githubUserData = user;
            }
            githubReposData = Array.isArray(repos) ? repos : [];
            if (
                typeof user?.public_repos === "number" &&
                typeof user?.followers === "number" &&
                typeof user?.following === "number"
            ) {
                renderStats(user);
            }

            if (Array.isArray(repos)) {
                renderActivity(repos);
                renderContributionGrid(fallbackContributionDays(repos));
            }
        })
        .catch(() => {
            if (activityEl) activityEl.innerHTML = "";
        });

    initContactActions();
    loadProjectStars();
    loadContributionGrid();
    initOrigamiBird();
    initResumeChat();
})();
