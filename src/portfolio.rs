use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct MediumArticle {
    pub title: String,
    pub description: String,
    pub link: String,
    pub published_label: String,
    pub image: String,
    pub clap_count: u32,
    pub tags: Vec<String>,
    pub comments: Vec<String>,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct ExperienceHighlight {
    pub org: String,
    pub role: String,
    pub title: String,
    pub summary: String,
    pub timeframe: String,
    pub link: String,
    pub tags: Vec<String>,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct JournalEntry {
    pub title: String,
    pub description: String,
    pub published_label: String,
    pub link: String,
    pub tags: Vec<String>,
}

pub fn get_medium_articles() -> Vec<MediumArticle> {
    vec![
        MediumArticle {
            title: "Go for Networking: A Practical Guide to Building Networked Systems".to_string(),
            description: "A practical walkthrough of goroutines, channels, TCP, UDP, worker pools, and graceful shutdown through real Go networking patterns.".to_string(),
            link: "https://medium.com/@swarnshekhar007/go-for-networking-a-practical-guide-to-building-networked-systems-e0129a698906".to_string(),
            published_label: "Jul 6, 2026".to_string(),
            image: "/static/images/medium-go-networking.jpg".to_string(),
            clap_count: 170,
            tags: vec![
                "go".to_string(),
                "networking".to_string(),
                "tcp".to_string(),
                "systems".to_string(),
            ],
            comments: vec![
                "\"Go makes the concurrency part finally feel approachable.\"".to_string(),
                "\"Practical and clean. The worker-pool bit especially helped.\"".to_string(),
                "\"This is the kind of networking writeup that actually teaches.\"".to_string(),
            ],
        },
        MediumArticle {
            title: "RAG, Vectorless RAG & GraphRAG".to_string(),
            description: "A grounded breakdown of classical RAG, lexical and agentic retrieval, and where GraphRAG actually changes the retrieval story.".to_string(),
            link: "https://medium.com/@swarnshekhar007/rag-vectorless-rag-graphrag-0245d6ee8e71".to_string(),
            published_label: "Jun 24, 2026".to_string(),
            image: "/static/images/medium-rag.jpg".to_string(),
            clap_count: 128,
            tags: vec![
                "rag".to_string(),
                "graphrag".to_string(),
                "retrieval".to_string(),
                "ai".to_string(),
            ],
            comments: vec![
                "\"Nice read. Keep it up.\"".to_string(),
                "\"Good read, learned a lot.\"".to_string(),
                "\"Great learning of the evolution from traditional RAG to GraphRAG.\"".to_string(),
            ],
        },
        MediumArticle {
            title: "DisasterNet Has a Range Problem. Here's a BFS-Based Fix I've Been Designing.".to_string(),
            description: "A systems design note on using BFS-style packet relays over nearby devices to push SOS messages toward the nearest internet gateway.".to_string(),
            link: "https://medium.com/@swarnshekhar007/disasternet-has-a-range-problem-heres-a-bfs-based-fix-i-ve-been-designing-60988b997fd7".to_string(),
            published_label: "Jun 16, 2026".to_string(),
            image: "/static/images/medium-disasternet.jpeg".to_string(),
            clap_count: 74,
            tags: vec![
                "mesh".to_string(),
                "bfs".to_string(),
                "p2p".to_string(),
                "routing".to_string(),
            ],
            comments: vec![
                "\"The graph framing here is really smart.\"".to_string(),
                "\"This feels like the start of a very real systems project.\"".to_string(),
                "\"Would love to see a prototype of the relay logic next.\"".to_string(),
            ],
        },
    ]
}

pub fn get_experience_highlights() -> Vec<ExperienceHighlight> {
    vec![ExperienceHighlight {
        org: "AOSSIE".to_string(),
        role: "Open source contributor".to_string(),
        title: "PictoPy: designed a face-cluster merge workflow".to_string(),
        summary: "Opened and scoped a feature proposal for PictoPy to merge split face clusters, including selection UX, a merge endpoint, transactional reassignment, and safe soft-delete behavior.".to_string(),
        timeframe: "Jul 2026".to_string(),
        link: "https://github.com/AOSSIE-Org/PictoPy/issues/1364".to_string(),
        tags: vec![
            "PictoPy".to_string(),
            "AOSSIE".to_string(),
            "computer vision".to_string(),
            "product thinking".to_string(),
            "issue design".to_string(),
        ],
    }]
}

pub fn get_journal_entries() -> Vec<JournalEntry> {
    vec![
        JournalEntry {
            title: "26/05 - Wandering Across Selves".to_string(),
            description: "A first-year college journal entry about drifting, drawing, fitness, and finding the programmer pulse again.".to_string(),
            published_label: "May 26, 2026".to_string(),
            link: "/journal/2026-05-26".to_string(),
            tags: vec![
                "journal".to_string(),
                "college".to_string(),
                "art".to_string(),
                "reflection".to_string(),
            ],
        },
        JournalEntry {
            title: "25/04 - End of Beginning".to_string(),
            description: "A long reflection on JEE, programming as art, and navigating the Indian CS grind without losing the joy of building.".to_string(),
            published_label: "Apr 1, 2025".to_string(),
            link: "/journal/2025-04-01".to_string(),
            tags: vec![
                "journal".to_string(),
                "jee".to_string(),
                "career".to_string(),
                "reflection".to_string(),
            ],
        },
        JournalEntry {
            title: "24/10 - Year Retrospective".to_string(),
            description: "A retrospective through the projects, experiments, and tiny obsessions that shaped a pretty wild year of programming.".to_string(),
            published_label: "Oct 15, 2024".to_string(),
            link: "/journal/2024-10-15".to_string(),
            tags: vec![
                "journal".to_string(),
                "retrospective".to_string(),
                "projects".to_string(),
                "year in review".to_string(),
            ],
        },
    ]
}
