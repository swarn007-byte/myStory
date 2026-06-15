(function () {
    const USER = "swarn007-byte";

    const statsEl = document.getElementById("github-stats");
    const activityEl = document.getElementById("repo-activity");
    const chartEl = document.getElementById("contrib-chart");

    if (chartEl) {
        chartEl.addEventListener("error", () => {
            chartEl.style.display = "none";
            const fallback = document.createElement("div");
            fallback.id = "repo-grid";
            fallback.className = "repo-grid-fallback";
            fallback.innerHTML =
                '<p class="normal-text text-sm mb-3">contribution chart unavailable — showing repo activity instead</p><div class="repo-grid" id="repo-grid-inner"></div>';
            chartEl.parentElement.appendChild(fallback);
            loadRepoGrid(document.getElementById("repo-grid-inner"));
        });
    }

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
        if (!statsEl) return;
        statsEl.innerHTML = `
            <div class="github-stat"><strong>${user.public_repos}</strong> repos</div>
            <div class="github-stat"><strong>${user.followers}</strong> followers</div>
            <div class="github-stat"><strong>${user.following}</strong> following</div>
        `;
    }

    function renderActivity(repos) {
        if (!activityEl) return;
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
                <span class="repo-activity-lang">${repo.language || "—"}</span>
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

    // Fetch GitHub stars for project cards
    function loadProjectStars() {
        fetch(`https://api.github.com/users/${USER}/repos?sort=pushed&per_page=100`)
            .then((r) => r.json())
            .then((repos) => {
                // Create a map of repo names to star counts
                const starMap = {};
                repos.forEach((repo) => {
                    starMap[repo.name] = repo.stargazers_count;
                });

                // Update each project card with its star count
                document.querySelectorAll(".project-card").forEach((card) => {
                    const repoName = card.getAttribute("data-repo");
                    const starsCount = starMap[repoName] || 0;
                    const starsSpan = card.querySelector(".stars-count");
                    if (starsSpan) {
                        starsSpan.textContent = starsCount;
                    }
                });
            })
            .catch(() => {
                // If API fails, stars remain at 0
            });
    }

    Promise.all([
        fetch(`https://api.github.com/users/${USER}`).then((r) => r.json()),
        fetch(
            `https://api.github.com/users/${USER}/repos?sort=pushed&per_page=100`,
        ).then((r) => r.json()),
    ])
        .then(([user, repos]) => {
            renderStats(user);
            renderActivity(repos);
        })
        .catch(() => {
            if (statsEl)
                statsEl.innerHTML =
                    '<p class="normal-text text-sm"><a href="https://github.com/swarn007-byte" class="link" target="_blank">view on github</a></p>';
            if (activityEl) activityEl.innerHTML = "";
        });

    // Load project stars on page load
    loadProjectStars();
})();
