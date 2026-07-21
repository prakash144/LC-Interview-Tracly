import type { TrackId } from "./interviewTracks";
import type { Timestamp } from "firebase/firestore";

export type DifficultyLevel = "Easy" | "Medium" | "Hard";

export type ResourceStatus = "not-started" | "in-progress" | "completed";

export type LinkType = "youtube" | "blog" | "website" | "github" | "article" | "course" | "other";

export interface ResourceLink {
  type: LinkType;
  url: string;
  label: string;
}

export const LINK_TYPE_ICONS: Record<LinkType, string> = {
  youtube: "🎥",
  blog: "📝",
  website: "🌐",
  github: "🐙",
  article: "📄",
  course: "🎓",
  other: "🔗",
};

export const LINK_LABELS: Record<LinkType, string> = {
  youtube: "YouTube",
  blog: "Blog",
  website: "Website",
  github: "GitHub",
  article: "Article",
  course: "Course",
  other: "Other",
};

export const STATUS_LABELS: Record<ResourceStatus, string> = {
  "not-started": "Not Started",
  "in-progress": "In Progress",
  "completed": "Completed",
};

export const STATUS_COLORS: Record<ResourceStatus, string> = {
  "not-started": "text-muted-foreground bg-secondary border-border",
  "in-progress": "text-info bg-info/10 border-info/20",
  "completed": "text-success bg-success/10 border-success/20",
};

export interface KnowledgeResource {
  id: string;
  title: string;
  company: string;
  track: TrackId;
  difficulty: DifficultyLevel;
  tags: string[];
  resourceLinks: ResourceLink[];
  askedAt: string;
  notes: string;
  createdAt: number;
  updatedAt: number;
}

export interface KnowledgeResourceInput {
  title: string;
  company?: string;
  track: TrackId;
  difficulty?: DifficultyLevel;
  tags?: string[];
  resourceLinks?: ResourceLink[];
  askedAt?: string;
  notes?: string;
}

export interface UserResourceProgress {
  resourceId: string;
  status: ResourceStatus;
  inRevisionList: boolean;
  personalNotes: string;
  statusChangedAt: Timestamp | null;
  revisionAddedAt: Timestamp | null;
  updatedAt: Timestamp;
}

export type ResourceProgressMap = Record<string, UserResourceProgress>;

export const RESOURCES_COLLECTION = "resources";

export const COMPANIES = [
  "Google", "Meta", "Amazon", "Microsoft", "Apple", "Netflix", "Uber",
  "Twitter/X", "ByteDance", "Stripe", "Airbnb", "Spotify", "LinkedIn",
  "Coinbase", "Pinterest", "Slack", "Snapchat", "Reddit", "Dropbox",
  "Palantir", "Databricks", "Confluent", "Salesforce", "Oracle",
  "General", "Atlassian", "Zoom", "Robinhood", "Nvidia", "Tesla",
];

export const DSA_SAMPLE: KnowledgeResourceInput[] = [
  {
    title: "Sliding Window Pattern",
    company: "General",
    track: "dsa",
    difficulty: "Medium",
    tags: ["Sliding Window", "Array", "Two Pointers"],
    resourceLinks: [
      { type: "youtube", url: "https://youtube.com/watch?v=sliding-window", label: "Sliding Window Masterclass" },
      { type: "blog", url: "https://blog.example.com/sliding-window-patterns", label: "Common Sliding Window Patterns" },
    ],
    askedAt: "2024-05",
    notes: "Fixed-size and variable-size windows. Used for subarray/substring problems. Key insight: when expanding/shrinking window, maintain a condition invariant. Template: while expanding, while condition violated shrink.",
  },
  {
    title: "Fast & Slow Pointers (Floyd's Algorithm)",
    company: "Amazon",
    track: "dsa",
    difficulty: "Easy",
    tags: ["Linked List", "Two Pointers", "Cycle Detection"],
    resourceLinks: [
      { type: "youtube", url: "https://youtube.com/watch?v=floyd-cycle", label: "Floyd's Cycle Detection" },
    ],
    askedAt: "2024-05",
    notes: "Detect cycle in linked list, find middle element, find start of cycle. Tortoise and hare pointer technique. O(n) time, O(1) space.",
  },
  {
    title: "Binary Search on Answer",
    company: "Meta",
    track: "dsa",
    difficulty: "Medium",
    tags: ["Binary Search", "Searching", "Optimization"],
    resourceLinks: [
      { type: "article", url: "https://blog.example.com/binary-search-on-answer", label: "Binary Search on Answer Pattern" },
    ],
    askedAt: "2024-04",
    notes: "When answer space is monotonic, binary search the answer. Common in 'minimize max' or 'maximize min' problems. Identify feasible() function that can be checked in O(n).",
  },
  {
    title: "Dynamic Programming Patterns",
    company: "Google",
    track: "dsa",
    difficulty: "Hard",
    tags: ["DP", "Optimization", "Memoization"],
    resourceLinks: [
      { type: "youtube", url: "https://youtube.com/watch?v=dp-patterns", label: "DP Patterns Deep Dive" },
      { type: "blog", url: "https://blog.example.com/dp-patterns", label: "5 Essential DP Patterns" },
    ],
    askedAt: "2024-03",
    notes: "Top-down vs bottom-up. Common patterns: 0/1 Knapsack, Unbounded Knapsack, Fibonacci-style, LCS, LIS, Palindromic. Identify state (dp[i][j]) and recurrence relation.",
  },
  {
    title: "Graph Traversal: BFS & DFS",
    company: "Microsoft",
    track: "dsa",
    difficulty: "Easy",
    tags: ["Graph", "BFS", "DFS", "Traversal"],
    resourceLinks: [
      { type: "youtube", url: "https://youtube.com/watch?v=graph-bfs-dfs", label: "BFS & DFS Visualized" },
    ],
    askedAt: "2024-04",
    notes: "BFS uses queue — shortest path in unweighted graphs. DFS uses stack/recursion — topological sort, connected components. BFS space is O(width), DFS space is O(depth).",
  },
  {
    title: "Trie (Prefix Tree)",
    company: "Uber",
    track: "dsa",
    difficulty: "Medium",
    tags: ["Trie", "String", "Prefix"],
    resourceLinks: [
      { type: "article", url: "https://blog.example.com/trie-data-structure", label: "Trie Implementation Guide" },
    ],
    askedAt: "2024-03",
    notes: "O(L) search/insert/prefix lookup. Used in autocomplete, spell check, IP routing. Node has children map and isEnd flag. Can compress with radix tree for memory.",
  },
  {
    title: "Union-Find / Disjoint Set Union",
    company: "Netflix",
    track: "dsa",
    difficulty: "Medium",
    tags: ["Union Find", "DSU", "Graph", "Connectivity"],
    resourceLinks: [
      { type: "youtube", url: "https://youtube.com/watch?v=union-find", label: "Union Find Explained" },
    ],
    askedAt: "2024-02",
    notes: "Path compression + union by rank/size = near O(1). Used for dynamic connectivity, Kruskal's MST, number of islands (with grid mapping), detecting cycles in undirected graph.",
  },
  {
    title: "Segment Tree / Fenwick Tree",
    company: "Google",
    track: "dsa",
    difficulty: "Hard",
    tags: ["Segment Tree", "Range Query", "BIT", "Fenwick"],
    resourceLinks: [
      { type: "blog", url: "https://blog.example.com/segment-tree", label: "Segment Tree from Scratch" },
      { type: "article", url: "https://blog.example.com/fenwick-tree", label: "Fenwick Tree vs Segment Tree" },
    ],
    askedAt: "2024-01",
    notes: "Range sum/update in O(log n). Segment tree: 4n array, recursive build/query/update. Fenwick: n+1 array, i += i&-i for update, i -= i&-i for query. Fenwick simpler but limited to prefix operations.",
  },
  {
    title: "Topological Sort (Kahn's Algorithm)",
    company: "ByteDance",
    track: "dsa",
    difficulty: "Medium",
    tags: ["Topological Sort", "Graph", "DAG", "Kahn"],
    resourceLinks: [
      { type: "youtube", url: "https://youtube.com/watch?v=topological-sort", label: "Topological Sort Tutorial" },
    ],
    askedAt: "2024-02",
    notes: "In-degree based BFS. Process nodes with in-degree 0, decrement neighbors. If queue empties before all nodes processed → cycle exists. Alternative: DFS with post-order reversal.",
  },
  {
    title: "Monotonic Stack / Queue",
    company: "Amazon",
    track: "dsa",
    difficulty: "Medium",
    tags: ["Stack", "Monotonic", "Next Greater Element"],
    resourceLinks: [
      { type: "article", url: "https://blog.example.com/monotonic-stack", label: "Monotonic Stack Pattern" },
    ],
    askedAt: "2024-05",
    notes: "Next greater/smaller element, largest rectangle in histogram, sliding window maximum (deque). Maintain increasing/decreasing order — pop while condition violated. O(n) time.",
  },
];

export const SYSTEM_DESIGN_SAMPLE: KnowledgeResourceInput[] = [
  {
    title: "Design Google Pay / Payment System",
    company: "Google",
    track: "system-design",
    difficulty: "Hard",
    tags: ["Payment", "Fintech", "Distributed Transactions", "Idempotency"],
    resourceLinks: [
      { type: "youtube", url: "https://youtube.com/watch?v=payment-system-design", label: "Payment System Deep Dive" },
      { type: "blog", url: "https://blog.example.com/payment-system", label: "Building Reliable Payment Systems" },
    ],
    askedAt: "2024-03",
    notes: "Key aspects: idempotency keys, two-phase commit, ledger service, payment reconciliation, handling duplicate requests, eventual consistency",
  },
  {
    title: "Design Uber/Lyft Ride Hailing",
    company: "Uber",
    track: "system-design",
    difficulty: "Hard",
    tags: ["Real-time", "Matching", "Geolocation", "GPS"],
    resourceLinks: [
      { type: "youtube", url: "https://youtube.com/watch?v=uber-design", label: "Uber System Design" },
      { type: "blog", url: "https://blog.example.com/uber-architecture", label: "Uber's Real-time Architecture" },
    ],
    askedAt: "2024-02",
    notes: "FourSquare grid for geohashing, Kafka for real-time location streaming, surge pricing algorithm, ETA calculation, driver-rider matching",
  },
  {
    title: "Design WhatsApp / Messenger",
    company: "Meta",
    track: "system-design",
    difficulty: "Hard",
    tags: ["Chat", "WebSocket", "Real-time", "End-to-End Encryption"],
    resourceLinks: [
      { type: "youtube", url: "https://youtube.com/watch?v=whatsapp-design", label: "WhatsApp Architecture" },
      { type: "article", url: "https://blog.example.com/whatsapp-encryption", label: "End-to-End Encryption Explained" },
    ],
    askedAt: "2024-01",
    notes: "WebSocket persistent connections, message ordering, last-seen presence, typing indicators, end-to-end encryption with Signal protocol, group chats",
  },
  {
    title: "Design TikTok / Video Feed",
    company: "ByteDance",
    track: "system-design",
    difficulty: "Medium",
    tags: ["Feed", "Recommendation", "Content Delivery", "CDN"],
    resourceLinks: [
      { type: "youtube", url: "https://youtube.com/watch?v=tiktok-design", label: "TikTok Recommendation System" },
    ],
    askedAt: "2024-04",
    notes: "For-you feed algorithm, content-based recommendations, user embedding vectors, CDN for video delivery, pre-fetching, watch time tracking",
  },
  {
    title: "Design Netflix / Video Streaming",
    company: "Netflix",
    track: "system-design",
    difficulty: "Hard",
    tags: ["CDN", "Streaming", "Content Delivery", "Recommendation"],
    resourceLinks: [
      { type: "blog", url: "https://blog.example.com/netflix-cdn", label: "Netflix CDN Architecture" },
      { type: "youtube", url: "https://youtube.com/watch?v=netflix-design", label: "Netflix System Design" },
    ],
    askedAt: "2023-11",
    notes: "Adaptive bitrate streaming, Open Connect CDN, recommendation engine, content encoding pipeline, fault tolerance across regions",
  },
  {
    title: "Design Twitter / News Feed",
    company: "Twitter/X",
    track: "system-design",
    difficulty: "Medium",
    tags: ["Feed", "News Feed", "Caching", "Fan-out"],
    resourceLinks: [
      { type: "blog", url: "https://blog.example.com/twitter-feed", label: "Twitter Feed Architecture" },
    ],
    askedAt: "2023-09",
    notes: "Fan-out on write vs read, pull vs push models, timeline generation, tweet indexing, trending topics with Storm/Kafka, caching hot users",
  },
  {
    title: "Design URL Shortener",
    company: "Google",
    track: "system-design",
    difficulty: "Easy",
    tags: ["Caching", "Redis", "Sharding", "Base62"],
    resourceLinks: [
      { type: "youtube", url: "https://youtu.be/fMZMm_0kKvU", label: "URL Shortener Design" },
      { type: "article", url: "https://blog.example.com/url-shortener", label: "Building a URL Shortener" },
    ],
    askedAt: "2024-05",
    notes: "Base62 encoding for short URLs, Redis caching for hot URLs, database sharding by hash, redirect tracking with 301/302, expiration policies",
  },
  {
    title: "Design Rate Limiter",
    company: "Amazon",
    track: "system-design",
    difficulty: "Easy",
    tags: ["Rate Limiting", "Token Bucket", "Sliding Window", "Redis"],
    resourceLinks: [
      { type: "youtube", url: "https://youtube.com/watch?v=rate-limiter", label: "Rate Limiter Algorithms" },
    ],
    askedAt: "2024-06",
    notes: "Token bucket vs sliding window vs leaky bucket algorithms, distributed rate limiting with Redis, per-user vs per-API throttling",
  },
  {
    title: "Design Distributed Cache",
    company: "Meta",
    track: "system-design",
    difficulty: "Medium",
    tags: ["Caching", "Distributed Systems", "Consistent Hashing", "Redis"],
    resourceLinks: [
      { type: "blog", url: "https://blog.example.com/distributed-cache", label: "Distributed Caching Patterns" },
    ],
    askedAt: "2024-02",
    notes: "Consistent hashing for node distribution, LRU eviction, cache-aside vs write-through, replication for fault tolerance, cache invalidation strategies",
  },
  {
    title: "Design Parking Lot System",
    company: "Amazon",
    track: "system-design",
    difficulty: "Easy",
    tags: ["OOD", "Real-time", "Sensors"],
    resourceLinks: [
      { type: "youtube", url: "https://youtube.com/watch?v=parking-lot", label: "Parking Lot OOD" },
    ],
    askedAt: "2023-08",
    notes: "Object-oriented design, parking spot allocation, real-time availability tracking, pricing model, entry/exit gates",
  },
];

export const BACKEND_SAMPLE: KnowledgeResourceInput[] = [
  {
    title: "Design API Gateway",
    company: "Amazon",
    track: "backend",
    difficulty: "Medium",
    tags: ["API Gateway", "Microservices", "Rate Limiting", "Authentication"],
    resourceLinks: [
      { type: "blog", url: "https://blog.example.com/api-gateway", label: "API Gateway Patterns" },
    ],
    askedAt: "2024-03",
    notes: "Request routing, rate limiting per client, authentication/authorization, request/response transformation, circuit breaker pattern",
  },
  {
    title: "Database Sharding Strategies",
    company: "Meta",
    track: "backend",
    difficulty: "Hard",
    tags: ["Sharding", "Database", "Scaling", "Partitioning"],
    resourceLinks: [
      { type: "youtube", url: "https://youtube.com/watch?v=sharding", label: "Database Sharding Explained" },
    ],
    askedAt: "2024-01",
    notes: "Horizontal vs vertical sharding, hash-based sharding, range-based sharding, consistent hashing, rebalancing, cross-shard queries",
  },
  {
    title: "Design Message Queue System",
    company: "Confluent",
    track: "backend",
    difficulty: "Hard",
    tags: ["Message Queue", "Kafka", "Pub/Sub", "Distributed Systems"],
    resourceLinks: [
      { type: "course", url: "https://course.example.com/kafka", label: "Kafka Deep Dive Course" },
    ],
    askedAt: "2024-04",
    notes: "Topic partitioning, consumer groups, exactly-once semantics, message ordering, retention policies, replication, leader election",
  },
  {
    title: "Implement Distributed Rate Limiting",
    company: "Stripe",
    track: "backend",
    difficulty: "Medium",
    tags: ["Rate Limiting", "Redis", "Distributed Systems"],
    resourceLinks: [
      { type: "github", url: "https://github.com/example/rate-limiter", label: "Rate Limiter Implementation" },
    ],
    askedAt: "2024-05",
    notes: "Redis Sorted Sets for sliding window, Lua scripting for atomic operations, multi-region considerations, fallback mechanisms",
  },
  {
    title: "Design Microservices Architecture",
    company: "Netflix",
    track: "backend",
    difficulty: "Medium",
    tags: ["Microservices", "Service Discovery", "Containerization"],
    resourceLinks: [
      { type: "youtube", url: "https://youtube.com/watch?v=microservices", label: "Microservices Patterns" },
    ],
    askedAt: "2023-12",
    notes: "Service discovery with Eureka/Consul, API gateway pattern, circuit breaker with Hystrix, event-driven communication, saga pattern for distributed transactions",
  },
  {
    title: "Design a Key-Value Store",
    company: "Amazon",
    track: "backend",
    difficulty: "Hard",
    tags: ["Distributed Systems", "Storage", "Consistency", "Dynamo"],
    resourceLinks: [
      { type: "article", url: "https://blog.example.com/dynamo-paper", label: "DynamoDB Paper Analysis" },
    ],
    askedAt: "2023-10",
    notes: "Consistent hashing, quorum-based replication, vector clocks for conflict resolution, gossip protocol for membership, hinted handoff",
  },
  {
    title: "SQL vs NoSQL Trade-offs",
    company: "General",
    track: "backend",
    difficulty: "Easy",
    tags: ["Databases", "SQL", "NoSQL", "Architecture"],
    resourceLinks: [
      { type: "blog", url: "https://blog.example.com/sql-vs-nosql", label: "SQL vs NoSQL Guide" },
    ],
    askedAt: "2024-06",
    notes: "ACID vs BASE, when to use relational vs document vs columnar vs graph databases, consistency models, scaling approaches",
  },
  {
    title: "Design a Distributed Lock Service",
    company: "Google",
    track: "backend",
    difficulty: "Medium",
    tags: ["Distributed Systems", "Locking", "Consensus", "ZooKeeper"],
    resourceLinks: [
      { type: "youtube", url: "https://youtube.com/watch?v=distributed-locks", label: "Distributed Locking" },
    ],
    askedAt: "2024-02",
    notes: "Redis Redlock algorithm, ZooKeeper ephemeral sequential nodes, lease-based locks, fencing tokens, split-brain prevention",
  },
];

export const BEHAVIORAL_SAMPLE: KnowledgeResourceInput[] = [
  {
    title: "Tell me about a time you had a conflict with a teammate",
    company: "General",
    track: "behavioral",
    difficulty: "Easy",
    tags: ["Conflict Resolution", "Teamwork", "Communication"],
    resourceLinks: [
      { type: "youtube", url: "https://youtube.com/watch?v=star-method", label: "STAR Method Explained" },
    ],
    askedAt: "2024-04",
    notes: "Use STAR: Situation (project deadline conflict), Task (align on approach), Action (listened, proposed compromise), Result (delivered on time, stronger relationship)",
  },
  {
    title: "Describe a challenging project and how you handled it",
    company: "Google",
    track: "behavioral",
    difficulty: "Medium",
    tags: ["Leadership", "Problem Solving", "Resilience"],
    resourceLinks: [
      { type: "article", url: "https://blog.example.com/behavioral-prep", label: "Behavioral Interview Prep" },
    ],
    askedAt: "2024-03",
    notes: "Focus on technical challenges with ambiguous requirements, how you broke down the problem, collaborated across teams, and delivered results under constraints",
  },
  {
    title: "Why do you want to work here?",
    company: "General",
    track: "behavioral",
    difficulty: "Easy",
    tags: ["Motivation", "Company Research", "Culture Fit"],
    resourceLinks: [],
    askedAt: "2024-05",
    notes: "Research the company's products, engineering blog, tech stack, and culture. Connect your experience and values to their mission. Be specific about what excites you.",
  },
  {
    title: "Tell me about a time you failed",
    company: "Meta",
    track: "behavioral",
    difficulty: "Easy",
    tags: ["Failure", "Growth", "Accountability"],
    resourceLinks: [],
    askedAt: "2024-02",
    notes: "Be honest about a real failure, take ownership, explain what you learned, and describe how you changed your approach. Shows self-awareness and growth mindset.",
  },
  {
    title: "How do you handle tight deadlines?",
    company: "Amazon",
    track: "behavioral",
    difficulty: "Medium",
    tags: ["Time Management", "Prioritization", "Pressure"],
    resourceLinks: [],
    askedAt: "2024-01",
    notes: "Prioritization frameworks, communicating trade-offs early, breaking down work into MVPs, knowing when to ask for help, maintaining quality under pressure",
  },
  {
    title: "Tell me about a time you improved team processes",
    company: "Stripe",
    track: "behavioral",
    difficulty: "Medium",
    tags: ["Process Improvement", "Initiative", "Impact"],
    resourceLinks: [
      { type: "blog", url: "https://blog.example.com/process-improvement", label: "Driving Process Change" },
    ],
    askedAt: "2024-06",
    notes: "Identify pain point, propose solution with metrics, get buy-in, measure results. Examples: CI/CD pipeline, code review process, on-call rotation, documentation culture.",
  },
  {
    title: "Describe a time you disagreed with a decision",
    company: "Apple",
    track: "behavioral",
    difficulty: "Medium",
    tags: ["Disagreement", "Communication", "Professionalism"],
    resourceLinks: [],
    askedAt: "2024-06",
    notes: "Disagree respectfully using data. Propose alternatives rather than just criticizing. Know when to escalate vs accept. Demonstrate compromise and alignment with team goals.",
  },
  {
    title: "How do you stay updated with industry trends?",
    company: "General",
    track: "behavioral",
    difficulty: "Easy",
    tags: ["Learning", "Growth", "Self-Improvement"],
    resourceLinks: [],
    askedAt: "2024-07",
    notes: "Engineering blogs, conference talks, side projects, open source contributions, paper readings. Show genuine curiosity and structured approach to continuous learning.",
  },
];

export const LEADERSHIP_SAMPLE: KnowledgeResourceInput[] = [
  {
    title: "How do you mentor junior engineers?",
    company: "Microsoft",
    track: "leadership",
    difficulty: "Medium",
    tags: ["Mentorship", "Growth", "Delegation"],
    resourceLinks: [
      { type: "blog", url: "https://blog.example.com/mentoring", label: "Engineering Mentorship Guide" },
    ],
    askedAt: "2024-03",
    notes: "Pair programming, code reviews as teaching moments, gradually increasing ownership, creating psychological safety, setting clear expectations",
  },
  {
    title: "Describe a time you influenced without authority",
    company: "Google",
    track: "leadership",
    difficulty: "Hard",
    tags: ["Influence", "Stakeholder Management", "Communication"],
    resourceLinks: [],
    askedAt: "2024-04",
    notes: "Building relationships, data-driven arguments, finding allies, understanding incentives, persistence without being pushy, leading by example",
  },
  {
    title: "How do you prioritize technical debt vs new features?",
    company: "Amazon",
    track: "leadership",
    difficulty: "Medium",
    tags: ["Technical Debt", "Strategy", "Decision Making"],
    resourceLinks: [
      { type: "article", url: "https://blog.example.com/tech-debt", label: "Managing Technical Debt" },
    ],
    askedAt: "2024-02",
    notes: "Quantify debt in terms of velocity impact, allocate percentage of capacity for cleanup, tie improvements to feature work, make incremental progress",
  },
  {
    title: "Tell me about a time you made a difficult technical decision",
    company: "Netflix",
    track: "leadership",
    difficulty: "Hard",
    tags: ["Decision Making", "Trade-offs", "Architecture"],
    resourceLinks: [],
    askedAt: "2024-05",
    notes: "Framework: gather data, list options with pros/cons, consult stakeholders, make decision with rationale, measure outcomes, retrospect. Be decisive but data-driven.",
  },
  {
    title: "How do you build engineering culture?",
    company: "Stripe",
    track: "leadership",
    difficulty: "Easy",
    tags: ["Culture", "Process", "Team Building"],
    resourceLinks: [
      { type: "youtube", url: "https://youtube.com/watch?v=eng-culture", label: "Building Engineering Culture" },
    ],
    askedAt: "2024-01",
    notes: "Psychological safety, blameless postmortems, knowledge sharing through tech talks, written documentation culture, investing in developer tooling",
  },
  {
    title: "How do you handle a failing project?",
    company: "Uber",
    track: "leadership",
    difficulty: "Hard",
    tags: ["Crisis Management", "Accountability", "Turnaround"],
    resourceLinks: [
      { type: "blog", url: "https://blog.example.com/project-turnaround", label: "Turning Around Failing Projects" },
    ],
    askedAt: "2024-06",
    notes: "Assess the situation honestly, identify root causes, create a recovery plan with clear milestones, communicate transparently with stakeholders, protect team morale, know when to escalate.",
  },
  {
    title: "Describe your approach to quarterly planning",
    company: "Stripe",
    track: "leadership",
    difficulty: "Medium",
    tags: ["Planning", "Strategy", "OKRs"],
    resourceLinks: [],
    askedAt: "2024-07",
    notes: "Top-down vision meets bottom-up estimates. Set OKRs, break into projects, scope ruthlessly, allocate resources, define success metrics. Balance innovation vs maintenance vs tech debt.",
  },
  {
    title: "How do you handle underperformance on your team?",
    company: "Meta",
    track: "leadership",
    difficulty: "Hard",
    tags: ["Performance", "Management", "Coaching"],
    resourceLinks: [
      { type: "article", url: "https://blog.example.com/managing-underperformance", label: "Performance Management Guide" },
    ],
    askedAt: "2024-05",
    notes: "Timely and direct feedback, understand root causes (skill vs will gap), create improvement plan with clear expectations and support, document progress, PIP as last resort. Fair but firm.",
  },
];

export const SAMPLE_RESOURCES_BY_TRACK: Record<TrackId, KnowledgeResourceInput[]> = {
  "dsa": DSA_SAMPLE,
  "system-design": SYSTEM_DESIGN_SAMPLE,
  "backend": BACKEND_SAMPLE,
  "behavioral": BEHAVIORAL_SAMPLE,
  "leadership": LEADERSHIP_SAMPLE,
};
