import { Project, Experience, Course, ResearchPaper, Article } from '../types.ts';

export const PERSONAL_INFO = {
  name: 'Raiyan Islam',
  title: 'Computer Science Student',
  institution: 'Columbia University',
  degree: 'B.S. in Computer Science',
  graduation: 'May 2027',
  location: 'New York, NY and Washington, D.C.',
  email: 'rmhislam@gmail.com',
  github: 'https://github.com/rmhislam',
  linkedin: 'https://www.linkedin.com/in/raiyan-islam-/',
  pgpKeyId: '4B8F 9120 7AD3 5C2E 8810  9412 E391 00F4 6B21 A5D8',
  bio: 'Undergraduate student focusing on distributed systems, network measurement, and public interest technology. Experienced in kernel telemetry, consensus protocols, and open regulatory data pipelines.',
};

export const PROJECTS: Project[] = [
  {
    id: 'vesper-consensus',
    title: 'Vesper Consensus Engine',
    category: 'Systems & Networks',
    year: '2026',
    oneLiner: 'Raft consensus implementation with log compaction and linearized read state machine.',
    keyMetric: '3.8ms p99 latency at 12,000 writes/sec across 5-node cluster',
    stack: ['Go', 'gRPC', 'BadgerDB', 'TLA+'],
    description:
      'A multi-node consensus engine written in Go from protocol specification. Implements dynamic leader election, log replication with batching, snapshot compaction, and client session tracking. Verified basic safety invariants using formal TLA+ state models.',
    architectureDetails: [
      'Asynchronous RPC transport layer using protocol buffers and keepalive connections.',
      'Log storage layer built on memory-mapped log segments with zero-copy disk writes.',
      'Linearizable read path using read-index leases to bypass disk I/O on uncontested reads.',
      'Chaos test suite simulating packet delays, network partitions, and process crashes.'
    ],
    benchmarks: [
      { label: 'p50 Latency', value: '1.2 ms' },
      { label: 'p99 Latency', value: '3.8 ms' },
      { label: 'Throughput', value: '12,400 ops/sec' },
      { label: 'Partition Recovery', value: '240 ms' }
    ],
    repoUrl: 'https://github.com/rmhislam/vesper-consensus',
  },
  {
    id: 'opendocket-engine',
    title: 'OpenDocket Public Rulemaking Index',
    category: 'Civic Technology',
    year: '2026',
    oneLiner: 'Full-text search engine and comment diff tool for federal regulatory agency dockets.',
    keyMetric: 'Indexes 1.4 million public comments with 85ms median query response',
    stack: ['TypeScript', 'Node.js', 'PostgreSQL', 'Meilisearch', 'Tailwind'],
    description:
      'Open data platform indexing public submissions to federal administrative agencies. Provides structural diffing between agency proposed rules and final regulations, tracking changes across comment periods and automated deduplication of mass comment campaigns.',
    architectureDetails: [
      'Ingestion worker processing federal registry XML dumps and API streams every 6 hours.',
      'Deduplication engine using MinHash locality-sensitive hashing to detect form letters.',
      'Lexical diff engine comparing draft vs final statutory text down to the paragraph level.',
      'Open REST API serving structured JSON endpoints for academic policy researchers.'
    ],
    benchmarks: [
      { label: 'Indexed Records', value: '1,420,000' },
      { label: 'Median Query', value: '85 ms' },
      { label: 'Campaign Grouping', value: '98.4% precision' },
      { label: 'Uptime (180 days)', value: '99.94%' }
    ],
    repoUrl: 'https://github.com/rmhislam/opendocket-engine',
    liveUrl: 'https://opendocket.example.org',
  },
  {
    id: 'packettrace-ebpf',
    title: 'PacketTrace Kernel Telemetry',
    category: 'Systems & Networks',
    year: '2025',
    oneLiner: 'Linux eBPF probe for tracking TCP socket drops and retransmission latency.',
    keyMetric: 'Zero packet drop overhead at 10 Gbps line rate under synthetic load',
    stack: ['C', 'eBPF', 'Go', 'Linux Kernel 6.8', 'Prometheus'],
    description:
      'Low-overhead kernel observation tool attached to Linux network subsystem tracepoints. Captures socket state transitions, buffer overruns, and slow-start collapses without modifying application code or requiring packet capture privileges.',
    architectureDetails: [
      'eBPF programs loaded via libbpf attached to sock:inet_sock_set_state and tcp:tcp_retransmit_skb.',
      'Ring buffer transfer mechanism transferring 50,000 events/second to userspace daemon.',
      'Metrics exporter translating kernel ring buffers into Prometheus format counters.',
      'Tested across kernel versions 5.15 through 6.8 with memory footprint under 14 megabytes.'
    ],
    benchmarks: [
      { label: 'Line Rate Tested', value: '10 Gbps' },
      { label: 'Userspace Memory', value: '13.8 MB' },
      { label: 'CPU Overhead', value: '< 0.4%' },
      { label: 'Event Throughput', value: '52,000 / sec' }
    ],
    repoUrl: 'https://github.com/rmhislam/packettrace-ebpf',
  },
  {
    id: 'legisgraph-network',
    title: 'LegisGraph Congressional Network',
    category: 'Civic Technology',
    year: '2025',
    oneLiner: 'Network analysis tool modeling legislative co-sponsorship patterns and amendment flow.',
    keyMetric: '435 House and 100 Senate records modeled across 12 legislative sessions',
    stack: ['Python', 'DuckDB', 'NetworkX', 'FastAPI'],
    description:
      'Relational and graph analysis platform mapping bill co-sponsorship networks across the United States Congress. Measures cross-party collaboration scores, committee referral paths, and amendment survival probabilities across 24 years of legislative records.',
    architectureDetails: [
      'DuckDB analytical engine processing 140,000 bills and 1.8 million co-sponsorship edges.',
      'Eigenvector and betweenness centrality graph calculations executed in under 2 seconds.',
      'Data pipeline consuming bulk data from Congress.gov and the Government Publishing Office.',
      'Exportable tabular datasets supporting research in political science and public policy.'
    ],
    benchmarks: [
      { label: 'Bills Analyzed', value: '142,300' },
      { label: 'Sponsorship Edges', value: '1,850,000' },
      { label: 'Graph Query Time', value: '1.8 sec' },
      { label: 'Coverage Range', value: '2001 to 2025' }
    ],
    repoUrl: 'https://github.com/rmhislam/legisgraph-network',
    liveUrl: 'https://legisgraph.example.org',
  },
];

export const EXPERIENCES: Experience[] = [
  {
    id: 'swe-intern-infra',
    period: 'JUN 2026 - AUG 2026',
    role: 'Software Engineering Intern, Infrastructure',
    organization: 'Cloud Infrastructure Group',
    location: 'New York, NY',
    summary:
      'Engineered internal network proxy services and connection pool routing for distributed microservices.',
    highlights: [
      'Implemented HTTP/2 connection reuse and buffer recycling in Go, reducing garbage collection pauses by 24%.',
      'Configured automated canary verification routines that tested routing failover across 3 availability zones.',
      'Authored technical specification and benchmark documentation adopted by 4 platform engineering teams.'
    ],
    technologies: ['Go', 'gRPC', 'Docker', 'Linux', 'Grafana'],
  },
  {
    id: 'research-fellow-net',
    period: 'SEP 2025 - PRESENT',
    role: 'Undergraduate Research Assistant',
    organization: 'Network Systems and Security Laboratory',
    location: 'New York, NY',
    summary:
      'Investigating route origin authorization validation performance across global Internet routing tables.',
    highlights: [
      'Developed data aggregation pipelines processing BGP routing tables from 18 Route Views collection points.',
      'Quantified RPKI validation latency variations and cryptographic certificate invalidation anomalies.',
      'Co-authored workshop submission on routing security measurements under transient connectivity loss.'
    ],
    technologies: ['Python', 'BGP', 'RPKI', 'PostgreSQL', 'Bash'],
  },
  {
    id: 'civic-tech-fellow',
    period: 'JUN 2025 - AUG 2025',
    role: 'Civic Technology Fellow',
    organization: 'Public Information and Accountability Project',
    location: 'Washington, D.C.',
    summary:
      'Constructed reproducible data pipelines for public financial disclosures and municipal lobbying records.',
    highlights: [
      'Normalized 850,000 unstructured reporting filings into relational PostgreSQL tables with strict constraints.',
      'Automated optical character recognition pipeline for legacy PDF filings, achieving 94% text recovery accuracy.',
      'Presented technical architecture and schema design to Senate staff members and open government advocates.'
    ],
    technologies: ['Python', 'PostgreSQL', 'Tesseract OCR', 'Docker', 'FastAPI'],
  },
  {
    id: 'course-assistant',
    period: 'JAN 2025 - MAY 2026',
    role: 'Teaching Assistant, Systems Programming',
    organization: 'Department of Computer Science',
    location: 'New York, NY',
    summary:
      'Taught weekly laboratory sessions and graded systems assignments for 180 undergraduate students.',
    highlights: [
      'Conducted weekly laboratory recitations on POSIX thread synchronization, socket programming, and memory allocation.',
      'Designed automated test harness using Docker and Valgrind to grade student C implementations.',
      'Held 6 hours of weekly technical office hours explaining virtual memory addressing and concurrency locks.'
    ],
    technologies: ['C', 'GDB', 'Valgrind', 'POSIX Threads', 'Linux'],
  },
];

export const COURSES: Course[] = [
  { code: 'COMS 3157', title: 'Advanced Programming', term: 'Fall 2024', grade: 'A', focus: 'C, Unix system calls, memory management, sockets' },
  { code: 'COMS 4118', title: 'Operating Systems', term: 'Spring 2025', grade: 'A', focus: 'Linux kernel internals, scheduling, virtual memory, ext4' },
  { code: 'COMS 4119', title: 'Computer Networks', term: 'Fall 2025', grade: 'A', focus: 'TCP congestion control, BGP, DNS, link layer protocols' },
  { code: 'COMS 4113', title: 'Distributed Systems', term: 'Spring 2026', grade: 'A', focus: 'Consensus protocols, Paxos, Raft, vector clocks, RPC' },
  { code: 'COMS 4170', title: 'Database Systems', term: 'Fall 2025', grade: 'A-', focus: 'Query execution engines, B+ trees, WAL, ACID transactions' },
  { code: 'POLS 3211', title: 'Congressional Politics', term: 'Spring 2025', grade: 'A', focus: 'Committee jurisdictions, legislative rules, statutory drafting' },
  { code: 'POLS 3220', title: 'Administrative Law and Policy', term: 'Fall 2025', grade: 'A', focus: 'Administrative Procedure Act, judicial review, notice and comment' },
  { code: 'COMS 4995', title: 'Formal Verification in Systems', term: 'Spring 2026', grade: 'In Progress', focus: 'TLA+, model checking, temporal logic, invariant proofs' },
];

export const RESEARCH_PAPERS: ResearchPaper[] = [
  {
    id: 'rpki-measurement-2026',
    title: 'Measurement and Propagation Delays in Global RPKI Route Origin Validations',
    status: 'In Review',
    year: '2026',
    venue: 'ACM Internet Measurement Conference (IMC) Student Workshop',
    abstract:
      'An empirical study tracking validation propagation times across 70,000 Autonomous Systems. We evaluate transient state discrepancies that lead to premature route drops during certificate rotation intervals.',
    pdfAvailable: true,
  },
  {
    id: 'rulemaking-ingestion-2025',
    title: 'Deterministic Ingestion and Verification of Public Regulatory Comment Dockets',
    status: 'Published',
    year: '2025',
    venue: 'Workshop on Public Interest Technology and Data Infrastructure',
    abstract:
      'Presents an open schema and deduplication architecture for administrative comment ingestion. Demonstrates how locality-sensitive hashing isolates coordinated mass-submission campaigns from substantive expert submissions.',
    pdfAvailable: true,
  },
  {
    id: 'raft-election-formal-2025',
    title: 'Formal Invariant Verification of Raft Leader Election under Asymmetric Network Partitions',
    status: 'Technical Report',
    year: '2025',
    venue: 'Columbia Systems Laboratory Technical Report CS-2025-04',
    abstract:
      'Models election safety and state machine safety in TLA+ under asymmetric partition scenarios where split votes cause repetitive terms. Proposes pre-vote verification conditions preventing split terms.',
    pdfAvailable: true,
  },
];

export const ARTICLES: Article[] = [
  {
    id: 'ebpf-socket-telemetry',
    title: 'Understanding eBPF Socket Filters Without the Jargon',
    date: 'OCT 2026',
    readTime: '6 MIN',
    summary:
      'A practical guide to attaching BPF programs to Linux socket transitions, tracing TCP resets, and measuring drop rates with minimal performance penalty.',
    content: [
      'Linux network telemetry has historically forced a compromise between deep packet inspection and production CPU safety. Tools relying on libpcap require copying packets across the kernel-userspace boundary, quickly bottlenecking multi-gigabit links.',
      'Extended Berkeley Packet Filters (eBPF) change this constraint by executing verified bytecode directly within the kernel context. By attaching to tracepoints like sock:inet_sock_set_state, we inspect connection states at the exact moment the socket transitions from ESTABLISHED to CLOSE_WAIT or RESET.',
      'The critical architectural detail is the BPF ring buffer. Older perf buffers allocated memory per CPU core, causing out-of-order event reads and wasted memory. The ring buffer introduced in Linux 5.8 provides a variable-length, memory-efficient FIFO queue with single-consumer semantics.',
      'In our test suite under a 10 Gbps synthetic load, the eBPF probe sustained 52,000 events per second with less than 0.4% CPU overhead and zero packet drops.'
    ],
  },
  {
    id: 'legislative-data-identifiers',
    title: 'Why Public Legislative Data Needs Deterministic Identifiers',
    date: 'AUG 2026',
    readTime: '8 MIN',
    summary:
      'How ambiguous bill numbers and versioning gaps in congressional data formats impede public oversight, and how content-addressable storage solves the problem.',
    content: [
      'When an amendment is offered on the floor of the United States Senate, it is assigned an amendment number specific to that measure and printed in the Congressional Record. However, downstream regulatory references and press accounts frequently refer to amendments by their sponsor names or bill titles rather than statutory citations.',
      'This discrepancy causes serious linkage failures in open government databases. If a provision moves from an introduced stand-alone bill into an omnibus reconciliation package, automated tracking tools lose the chain of custody.',
      'By applying content-addressable cryptographic hashes (such as SHA-256 digests over normalized statutory text), legislative bodies can generate deterministic identifiers that remain valid regardless of procedural renumbering.',
      'Implementing content-addressable identifiers across federal registries ensures that researchers, journalists, and citizens can verify the exact origin and evolution of every legislative sentence.'
    ],
  },
  {
    id: 'memory-allocator-tradeoffs',
    title: 'Memory Allocator Tradeoffs: Jemalloc vs Go Runtime Heap',
    date: 'MAY 2026',
    readTime: '10 MIN',
    summary:
      'Analyzing fragmentation, allocation latency, and garbage collection pauses when running high-concurrency network servers in Go and C.',
    content: [
      'Network proxies handling tens of thousands of active socket connections allocate and release short-lived byte buffers continuously. In languages with managed runtimes like Go, frequent allocations stress the runtime garbage collector, leading to stop-the-world latency spikes.',
      'In Go, sync.Pool offers a mechanism to cache and reuse allocated byte slices across goroutines. When paired with proper memory-aligned buffer sizes, pool recycling reduced our proxy GC pause duration from 14 milliseconds down to 1.8 milliseconds.',
      'In C and C++ environments, replacing the glibc ptmalloc allocator with jemalloc yielded a 32% reduction in memory fragmentation under multi-threaded allocation patterns. Jemalloc achieves this through thread-specific arenas and size-class quantization.',
      'The takeaway for systems engineers: never optimize network code without profiling allocation distribution. In high-throughput servers, allocation patterns frequently dictate tail latency more than network packet processing.'
    ],
  },
];
