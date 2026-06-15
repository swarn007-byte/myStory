use serde::{Deserialize, Serialize};
use serde_json::Value as JsonValue;
use chrono::{DateTime, Utc};

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct GitHubStats {
    pub public_repos: u32,
    pub followers: u32,
    pub following: u32,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct GitHubRepo {
    pub name: String,
    pub html_url: String,
    pub language: Option<String>,
    pub time_ago: String,
    pub dot_class: String,
}

fn time_ago(pushed_at_str: &str) -> String {
    let pushed_at = DateTime::parse_from_rfc3339(pushed_at_str)
        .or_else(|_| DateTime::parse_from_str(pushed_at_str, "%Y-%m-%dT%H:%M:%SZ"))
        .map(|dt| dt.with_timezone(&Utc));

    let pushed_at = match pushed_at {
        Ok(dt) => dt,
        Err(_) => return "some time ago".to_string(),
    };

    let now = Utc::now();
    let duration = now.signed_duration_since(pushed_at);
    let days = duration.num_days();

    if days <= 0 {
        "today".to_string()
    } else if days == 1 {
        "yesterday".to_string()
    } else if days < 30 {
        format!("{}d ago", days)
    } else if days < 365 {
        format!("{}mo ago", days / 30)
    } else {
        format!("{}y ago", days / 365)
    }
}

fn dot_class(pushed_at_str: &str) -> String {
    let pushed_at = DateTime::parse_from_rfc3339(pushed_at_str)
        .or_else(|_| DateTime::parse_from_str(pushed_at_str, "%Y-%m-%dT%H:%M:%SZ"))
        .map(|dt| dt.with_timezone(&Utc));

    let pushed_at = match pushed_at {
        Ok(dt) => dt,
        Err(_) => return "dot-cold".to_string(),
    };

    let now = Utc::now();
    let duration = now.signed_duration_since(pushed_at);
    let days = duration.num_days();

    if days < 7 {
        "dot-hot".to_string()
    } else if days < 30 {
        "dot-warm".to_string()
    } else if days < 90 {
        "dot-cool".to_string()
    } else {
        "dot-cold".to_string()
    }
}

pub async fn fetch_github_data() -> (Option<GitHubStats>, Option<Vec<GitHubRepo>>) {
    let username = "swarn007-byte";
    let client = match reqwest::Client::builder()
        .user_agent("personal-portfolio-rust")
        .no_proxy()
        .build()
    {
        Ok(c) => c,
        Err(_) => return fallback_data(),
    };

    // 1. Fetch User Stats
    let user_url = format!("https://api.github.com/users/{}", username);
    let stats = match client.get(&user_url).send().await {
        Ok(res) if res.status().is_success() => {
            if let Ok(text) = res.text().await {
                if let Ok(json) = serde_json::from_str::<JsonValue>(&text) {
                    let public_repos = json.get("public_repos").and_then(|v| v.as_u64()).unwrap_or(0) as u32;
                    let followers = json.get("followers").and_then(|v| v.as_u64()).unwrap_or(0) as u32;
                    let following = json.get("following").and_then(|v| v.as_u64()).unwrap_or(0) as u32;
                    Some(GitHubStats {
                        public_repos,
                        followers,
                        following,
                    })
                } else {
                    None
                }
            } else {
                None
            }
        }
        _ => None,
    };

    // 2. Fetch Repos
    let repos_url = format!("https://api.github.com/users/{}/repos?sort=pushed&per_page=100", username);
    let repos = match client.get(&repos_url).send().await {
        Ok(res) if res.status().is_success() => {
            if let Ok(text) = res.text().await {
                if let Ok(JsonValue::Array(arr)) = serde_json::from_str::<JsonValue>(&text) {
                    let mut list = Vec::new();
                    for item in arr {
                        let is_fork = item.get("fork").and_then(|v| v.as_bool()).unwrap_or(false);
                        let name = item.get("name").and_then(|v| v.as_str()).unwrap_or("").to_string();
                        
                        if is_fork || name == username || name.is_empty() {
                            continue;
                        }

                        let html_url = item.get("html_url").and_then(|v| v.as_str()).unwrap_or("").to_string();
                        let language = item.get("language").and_then(|v| v.as_str()).map(|s| s.to_string());
                        let pushed_at = item.get("pushed_at").and_then(|v| v.as_str()).unwrap_or("").to_string();
                        let time_ago = time_ago(&pushed_at);
                        let dot_class = dot_class(&pushed_at);

                        list.push(GitHubRepo {
                            name,
                            html_url,
                            language,
                            time_ago,
                            dot_class,
                        });
                    }
                    
                    list.truncate(8);
                    Some(list)
                } else {
                    None
                }
            } else {
                None
            }
        }
        _ => None,
    };

    if stats.is_none() || repos.is_none() {
        let (f_stats, f_repos) = fallback_data();
        (stats.or(f_stats), repos.or(f_repos))
    } else {
        (stats, repos)
    }
}

fn fallback_data() -> (Option<GitHubStats>, Option<Vec<GitHubRepo>>) {
    let stats = Some(GitHubStats {
        public_repos: 15,
        followers: 2,
        following: 7,
    });
    
    let repos = Some(vec![
        GitHubRepo {
            name: "myStory".to_string(),
            html_url: "https://github.com/swarn007-byte/myStory".to_string(),
            language: Some("Rust".to_string()),
            time_ago: "today".to_string(),
            dot_class: "dot-hot".to_string(),
        },
        GitHubRepo {
            name: "portfolio".to_string(),
            html_url: "https://github.com/swarn007-byte/portfolio".to_string(),
            language: Some("Rust".to_string()),
            time_ago: "today".to_string(),
            dot_class: "dot-hot".to_string(),
        },
        GitHubRepo {
            name: "0eye-vision-MCP".to_string(),
            html_url: "https://github.com/swarn007-byte/0eye-vision-MCP".to_string(),
            language: Some("TypeScript".to_string()),
            time_ago: "3d ago".to_string(),
            dot_class: "dot-hot".to_string(),
        },
        GitHubRepo {
            name: "fyodor-dostoevsky-RETRIEVAL".to_string(),
            html_url: "https://github.com/swarn007-byte/fyodor-dostoevsky-RETRIEVAL".to_string(),
            language: Some("TypeScript".to_string()),
            time_ago: "4d ago".to_string(),
            dot_class: "dot-hot".to_string(),
        },
        GitHubRepo {
            name: "ML-Studio-Interactive".to_string(),
            html_url: "https://github.com/swarn007-byte/ML-Studio-Interactive".to_string(),
            language: Some("Python".to_string()),
            time_ago: "1mo ago".to_string(),
            dot_class: "dot-warm".to_string(),
        },
        GitHubRepo {
            name: "StreetSentinel-AI-".to_string(),
            html_url: "https://github.com/swarn007-byte/StreetSentinel-AI-".to_string(),
            language: Some("Python".to_string()),
            time_ago: "1mo ago".to_string(),
            dot_class: "dot-warm".to_string(),
        },
    ]);

    (stats, repos)
}
