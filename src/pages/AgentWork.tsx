import { Button } from "@/components/ui/button";

const projects = [
    {
        title: "SelfHelp.ai Bot",
        description: "An advanced Cognitive Expansion Therapy (CET) AI that guides users through structured cognitive and emotional transformation processes. Integrates real-time contextual awareness and emotional mapping.",
        img: "/img/sh.png",
        link: "https://chatgpt.com/g/g-67a0e640e1a081918b679ac5917aaeb4-selfhelp-ai",
        bullets: [
            "Structured 7-Step Framework",
            "Deep Cognitive Rewiring",
            "Symbolic Interpretation Framework"
        ]
    },
    {
        title: "Content Moderation Agent",
        description: "End-to-end LLM-driven pipeline to extract, classify, and moderate YouTube comments.",
        img: "/img/git.png",
        link: "https://github.com/OsanGen/Content-Moderation-Agent",
        bullets: [
            "AI-Based Moderation (Sentiment, Anger, Spam)",
            "Adaptive Response Generation",
            "Analytics & Visualization (Plotly)"
        ]
    },
    {
        title: "Sales & Revenue Insights Bot",
        description: "Cutting-edge AI agent designed to analyze sales data, generate automated reports, and deliver real-time revenue insights.",
        img: "/img/sr.png",
        link: "https://chatgpt.com/g/g-67ae9548ff2081918dcb0fc129243f2e-sales-revenue-insights-bot",
        bullets: [
            "Automated Sales Analysis",
            "Trend Detection & Forecasting",
            "Dynamic Data Visualization"
        ]
    },
    {
        title: "Invoice & Billing Report Bot",
        description: "Intelligent AI system specialized in invoice processing, outstanding payment tracking, and financial anomaly detection.",
        img: "/img/ib.png",
        link: "https://chatgpt.com/g/g-67ae8910b04481918b2664e05625defb-invoice-billing-report-bot",
        bullets: [
            "Automated Invoice Processing",
            "Anomaly Detection",
            "Automated Payment Reminders"
        ]
    },
];

const AgentWork = () => {
    return (
        <div className="min-h-screen pt-24 pb-12 bg-background">
            <div className="container mx-auto px-4">
                <h1 className="text-4xl md:text-5xl font-bold font-heading mb-4 text-center">Agent Work</h1>
                <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12">
                    Maripos.ai specializes in crafting intelligent GPT solutions designed to optimize workflows and drive innovation.
                </p>

                <div className="grid gap-12">
                    {projects.map((project, index) => (
                        <div key={index} className="group relative bg-card border border-border/50 rounded-xl overflow-hidden hover:border-brand-primary/50 transition-colors duration-300">
                            {/* Glow effect on hover */}
                            <div className="absolute inset-0 bg-brand-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                            <div className="grid md:grid-cols-12 gap-6 p-6 md:p-8 items-center">
                                <div className="md:col-span-4 overflow-hidden rounded-lg shadow-md">
                                    <img src={project.img} alt={project.title} className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500" />
                                </div>

                                <div className="md:col-span-8 space-y-4">
                                    <h2 className="text-2xl md:text-3xl font-bold">{project.title}</h2>
                                    <p className="text-muted-foreground">{project.description}</p>

                                    <ul className="grid sm:grid-cols-2 gap-2 text-sm text-foreground/80">
                                        {project.bullets.map((bullet, i) => (
                                            <li key={i} className="flex items-center gap-2">
                                                <span className="w-1.5 h-1.5 rounded-full bg-brand-accent" />
                                                {bullet}
                                            </li>
                                        ))}
                                    </ul>

                                    <div className="pt-4">
                                        <Button variant="glow" asChild>
                                            <a href={project.link} target="_blank" rel="noreferrer">View Project</a>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AgentWork;
