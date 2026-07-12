use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct Project {
    pub name: String,
    pub desc: String,
    pub tech: Vec<String>,
    pub link: Option<String>,
    pub demo: Option<String>,
}

pub fn get_projects() -> Vec<Project> {
    vec![
        Project {
            name: "reszVault".to_string(),
            desc: "Full-stack RAG workspace for creating project vaults, indexing PDFs, and chatting with source-grounded answers across uploaded documents.".to_string(),
            tech: vec!["typescript".to_string(), "rag".to_string(), "supabase".to_string()],
            link: Some("https://github.com/swarn007-byte/ReszVault".to_string()),
            demo: Some("https://reszvault.vercel.app/".to_string()),
        },
        Project {
            name: "waveNET".to_string(),
            desc: "Go networking experiment where nearby devices discover peers over UDP and relay messages over TCP with TTL and duplicate protection.".to_string(),
            tech: vec!["go".to_string(), "udp".to_string(), "tcp".to_string()],
            link: Some("https://github.com/swarn007-byte/waveNET".to_string()),
            demo: None,
        },
        Project {
            name: "santinel".to_string(),
            desc: "Deep learning street-monitoring pipeline that captions scenes in real time and flags civic violations like littering or illegal dumping.".to_string(),
            tech: vec!["python".to_string(), "pytorch".to_string(), "vision".to_string()],
            link: Some("https://github.com/swarn007-byte/Sentinel".to_string()),
            demo: None,
        },
        Project {
            name: "novisionmcp".to_string(),
            desc: "MCP server that gives text-only LLM clients vision by sending local image prompts through OpenRouter-backed multimodal models.".to_string(),
            tech: vec!["python".to_string(), "mcp".to_string(), "openrouter".to_string()],
            link: Some("https://github.com/swarn007-byte/0-vision-MCP".to_string()),
            demo: None,
        },
    ]
}
