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
            name: "fyodor-dostoevsky-RETRIEVAL".to_string(),
            desc: "RAG pipeline to query Dostoevsky's White Nights with Bun, Express, Supabase pgvector, LangChain, and Upstash Redis.".to_string(),
            tech: vec!["typescript".to_string(), "langchain".to_string(), "rag".to_string()],
            link: Some("https://github.com/swarn007-byte/fyodor-dostoevsky-RETRIEVAL".to_string()),
            demo: Some("https://fyodor-dostoevsky-retrieval.vercel.app/".to_string()),
        },
        Project {
            name: "StreetSentinel-AI-".to_string(),
            desc: "Deep learning image captioning system for real-time camera input in a civic monitoring pipeline.".to_string(),
            tech: vec!["pytorch".to_string(), "opencv".to_string(), "jupyter".to_string()],
            link: Some("https://github.com/swarn007-byte/StreetSentinel-AI-".to_string()),
            demo: None,
        },
        Project {
            name: "ML-Studio-Interactive".to_string(),
            desc: "Interactive ML algorithm visualiser over user-provided custom datasets.".to_string(),
            tech: vec!["python".to_string(), "scikit-learn".to_string(), "streamlit".to_string()],
            link: Some("https://github.com/swarn007-byte/ML-Studio-Interactive".to_string()),
            demo: None,
        },
        Project {
            name: "AmzPriceLens".to_string(),
            desc: "Multimodal model trained to predict product price from image and description on a large Amazon dataset.".to_string(),
            tech: vec!["pytorch".to_string(), "deep-learning".to_string()],
            link: Some("https://github.com/swarn007-byte/AmzPriceLens".to_string()),
            demo: None,
        },
        Project {
            name: "NutriAI-AI-Powered-Calorie-Estimation".to_string(),
            desc: "AI-powered calorie estimation from food images.".to_string(),
            tech: vec!["python".to_string(), "computer-vision".to_string()],
            link: Some("https://github.com/swarn007-byte/NutriAI-AI-Powered-Calorie-Estimation".to_string()),
            demo: None,
        },
        Project {
            name: "Customer_churn-fastapi".to_string(),
            desc: "ANN-based customer churn prediction API built with FastAPI.".to_string(),
            tech: vec!["fastapi".to_string(), "pytorch".to_string()],
            link: Some("https://github.com/swarn007-byte/Customer_churn-fastapi".to_string()),
            demo: None,
        },
        Project {
            name: "0eye-vision-MCP".to_string(),
            desc: "Give any LLM eyes — drop an image, get instant vision intelligence powered by multimodal AI.".to_string(),
            tech: vec!["typescript".to_string(), "mcp".to_string(), "multimodal".to_string()],
            link: Some("https://github.com/swarn007-byte/0eye-vision-MCP".to_string()),
            demo: None,
        },
        Project {
            name: "mail-mcp".to_string(),
            desc: "MCP server for email workflows and automation.".to_string(),
            tech: vec!["typescript".to_string(), "mcp".to_string()],
            link: Some("https://github.com/swarn007-byte/mail-mcp".to_string()),
            demo: None,
        },
        Project {
            name: "Zomato-insights-Power-bi-".to_string(),
            desc: "Zomato restaurant data insights dashboard built with Power BI.".to_string(),
            tech: vec!["power-bi".to_string(), "data-analysis".to_string()],
            link: Some("https://github.com/swarn007-byte/Zomato-insights-Power-bi-".to_string()),
            demo: None,
        },
        Project {
            name: "Competitve_Programming".to_string(),
            desc: "Collection of competitive programming solutions in C++.".to_string(),
            tech: vec!["c++".to_string(), "dsa".to_string()],
            link: Some("https://github.com/swarn007-byte/Competitve_Programming".to_string()),
            demo: None,
        },
    ]
}