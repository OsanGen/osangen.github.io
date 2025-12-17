

const projects = [
    {
        title: "SelfHelp.ai Bot",
        description: "An advanced Cognitive Expansion Therapy (CET) agent that helps you practice structured self-reflection and emotional rewiring, guiding you through repeatable frames during stress.",
        img: "/img/sh.png",
        link: "https://chatgpt.com/g/g-67a0e640e1a081918b679ac5917aaeb4-selfhelp-ai",
        bullets: [
            "Structured 7-Step Framework",
            "Deep Cognitive Rewiring",
            "Symbolic Interpretation"
        ]
    },
    {
        title: "Content Moderation Agent",
        description: "LLM pipeline that turns you into a power user of noisy comment streams. Extracts, classifies, and moderates YouTube comments so you focus on decisions.",
        img: "/img/git.png",
        link: "https://github.com/OsanGen/Content-Moderation-Agent",
        bullets: [
            "AI-Based Moderation",
            "Softer Sentiment Analysis",
            "Auto-Response Drafts"
        ]
    },
    {
        title: "Sales & Revenue Insights Bot",
        description: "Turns messy sales data into a power user cockpit. Analyzes pipeline, surfaces trends, and generates plain-language insights to save export time.",
        img: "/img/sr.png",
        link: "https://chatgpt.com/g/g-67ae9548ff2081918dcb0fc129243f2e-sales-revenue-insights-bot",
        bullets: [
            "Automated Sales Analysis",
            "Trend Forecasting",
            "Dynamic Viz"
        ]
    },
    {
        title: "Invoice & Billing Report Bot",
        description: "Intelligent billing agent for cash flow power users. Processes invoices, tracks payments, and flags anomalies early.",
        img: "/img/ib.png",
        link: "https://chatgpt.com/g/g-67ae8910b04481918b2664e05625defb-invoice-billing-report-bot",
        bullets: [
            "Automated Processing",
            "Anomaly Detection",
            "Payment Reminders"
        ]
    },
];

const AgentWork = () => {
    return (
        <div className="min-h-screen pt-24 pb-12 bg-background">
            <div className="container mx-auto px-4 max-w-5xl">
                <div className="mb-12 text-center">
                    <h1 className="text-3xl md:text-4xl font-bold font-heading mb-3 text-foreground">Agent Work</h1>
                    <p className="text-muted-foreground font-medium max-w-xl mx-auto">
                        Power user workflows that ship results.
                    </p>
                </div>

                <div className="grid gap-6">
                    {projects.map((project, index) => (
                        <div key={index} className="group bg-card border border-border rounded-xl p-6 hover:border-brand-yellow/30 transition-all duration-300">
                            <div className="flex flex-col md:flex-row gap-6 items-start">
                                {/* Minimalist Media Container */}
                                <div className="hidden md:block w-20 h-20 shrink-0 bg-muted rounded-xl overflow-hidden opacity-80 group-hover:opacity-100 transition-all grayscale group-hover:grayscale-0 border border-white/5">
                                    <img src={project.img} alt={project.title} className="w-full h-full object-cover" />
                                </div>

                                <div className="flex-1 space-y-3">
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-1">
                                            <h2 className="text-xl font-bold text-foreground group-hover:text-brand-yellow transition-colors">{project.title}</h2>
                                            {/* Mobile only image hint if needed, keeping text first for now */}
                                        </div>
                                        <a
                                            href={project.link}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors shrink-0"
                                        >
                                            View Project &rarr;
                                        </a>
                                    </div>

                                    <p className="text-muted-foreground leading-relaxed text-sm max-w-3xl">
                                        {project.description}
                                    </p>

                                    {/* Compact Bullet Row */}
                                    <div className="flex flex-wrap gap-x-6 gap-y-2 pt-1">
                                        {project.bullets.map((bullet, i) => (
                                            <div key={i} className="flex items-center gap-2 text-xs font-medium text-muted-foreground/70">
                                                <span className="w-1 h-1 rounded-full bg-brand-yellow/50" />
                                                {bullet}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Soft Sell Entry */}
                <div className="mt-16 text-center border-t border-border pt-12">
                    <p className="text-muted-foreground mb-4 font-medium">
                        Need a custom agent for your ecosystem?
                    </p>
                    <a href="mailto:you@yourdomain.com?subject=Agent%20Work%20Consultation%20Inquiry" className="text-sm font-bold text-foreground hover:text-brand-yellow border-b border-white/20 hover:border-brand-yellow transition-colors pb-1">
                        Start a paid consultation &rarr;
                    </a>
                </div>
            </div>
        </div>
    );
};

export default AgentWork;
