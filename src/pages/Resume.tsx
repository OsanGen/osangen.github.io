
import { Button } from "@/components/ui/button";

const Resume = () => {
    return (
        <div className="min-h-screen pt-24 pb-12 bg-background font-sans">
            <div className="container mx-auto px-4 max-w-4xl">
                <h1 className="text-3xl md:text-4xl font-bold font-heading mb-12 text-center text-foreground">
                    CV / Resume
                </h1>

                <div className="space-y-16">

                    {/* Summary */}
                    <section className="space-y-4">
                        <h2 className="text-xl font-bold text-foreground border-b border-white/10 pb-2 mb-4">Professional Summary</h2>
                        <p className="text-muted-foreground leading-relaxed text-lg max-w-3xl">
                            <strong className="text-foreground">I design and ship GenAI power-user ecosystems.</strong> I lead <strong>Gen AI Global</strong>, co-founded <strong>AIforAll Global</strong>, and build governed GenAI systems that move real KPIs. My work combines agentic orchestration and curriculum design so teams get repeatable operating systems, not just one-off experiments.
                        </p>
                    </section>

                    {/* Experience */}
                    <section className="space-y-8">
                        <h2 className="text-xl font-bold text-foreground border-b border-white/10 pb-2 mb-6">Professional Experience</h2>

                        <div className="space-y-10">
                            {/* Gen AI Global */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                                <div className="md:col-span-1">
                                    <p className="text-sm font-medium text-muted-foreground/60 tabular-nums">Jan 2025 – Present</p>
                                </div>
                                <div className="md:col-span-3 space-y-2">
                                    <h3 className="text-lg font-bold text-foreground">Founder & Head | Gen AI Global</h3>
                                    <ul className="list-disc list-inside space-y-1 text-muted-foreground text-sm leading-relaxed marker:text-brand-yellow/50">
                                        <li>Built an MIT Professional Education-backed network to 1,000+ members in 4 weeks.</li>
                                        <li>Architected an AI community OS (Discord bots, automations) driving annualized ROI.</li>
                                        <li>Mentored cohorts on agentic workflows (GenAI for Non-Coders).</li>
                                    </ul>
                                </div>
                            </div>

                            {/* AIforAll Global */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                                <div className="md:col-span-1">
                                    <p className="text-sm font-medium text-muted-foreground/60 tabular-nums">Jun 2025 – Present</p>
                                </div>
                                <div className="md:col-span-3 space-y-2">
                                    <h3 className="text-lg font-bold text-foreground">Co-Founder | AIforAll Global</h3>
                                    <ul className="list-disc list-inside space-y-1 text-muted-foreground text-sm leading-relaxed marker:text-brand-yellow/50">
                                        <li>Co-designed fellowships and bootcamps for students and managers.</li>
                                        <li>Built partnerships and open curricula for AI in education and climate.</li>
                                    </ul>
                                </div>
                            </div>

                            {/* Beautiful Patterns */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                                <div className="md:col-span-1">
                                    <p className="text-sm font-medium text-muted-foreground/60 tabular-nums">June 2014 – Present</p>
                                </div>
                                <div className="md:col-span-3 space-y-2">
                                    <h3 className="text-lg font-bold text-foreground">Co-Founder | Beautiful Patterns</h3>
                                    <ul className="list-disc list-inside space-y-1 text-muted-foreground text-sm leading-relaxed marker:text-brand-yellow/50">
                                        <li>Scaled STEM program to 10,000+ participants annually (US & Mexico).</li>
                                        <li>Designed data-driven curricula and instructor pipelines.</li>
                                    </ul>
                                </div>
                            </div>

                            {/* MIT Professional Education */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                                <div className="md:col-span-1">
                                    <p className="text-sm font-medium text-muted-foreground/60 tabular-nums">2025 – Present</p>
                                </div>
                                <div className="md:col-span-3 space-y-2">
                                    <h3 className="text-lg font-bold text-foreground">Learning Facilitator | MIT Professional Edu</h3>
                                    <p className="text-muted-foreground text-sm">
                                        Support professionals in applied AI programs (Agentic AI, Governance).
                                    </p>
                                </div>
                            </div>

                            {/* Panamerican University */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                                <div className="md:col-span-1">
                                    <p className="text-sm font-medium text-muted-foreground/60 tabular-nums">2025 – Present</p>
                                </div>
                                <div className="md:col-span-3 space-y-2">
                                    <h3 className="text-lg font-bold text-foreground">Applied Deep Learning Instructor</h3>
                                    <ul className="list-disc list-inside space-y-1 text-muted-foreground text-sm leading-relaxed marker:text-brand-yellow/50">
                                        <li>Designed "Applied Deep Learning (Browser-Only)" course.</li>
                                        <li>Created evidence pipeline for student model justification.</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Education */}
                    <section className="space-y-8">
                        <h2 className="text-xl font-bold text-foreground border-b border-white/10 pb-2 mb-6">Education</h2>
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="p-4 rounded-xl border border-border bg-card">
                                <h3 className="text-base font-bold text-foreground">MIT Professional Education</h3>
                                <p className="text-sm text-brand-yellow/80 mb-2">Applied Generative AI (2025)</p>
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    GenAI production, LLM fundamentals, Agentic orchestration, LLMOps, Governance.
                                </p>
                            </div>
                            <div className="p-4 rounded-xl border border-border bg-card">
                                <h3 className="text-base font-bold text-foreground">B.B.A. Marketing</h3>
                                <p className="text-sm text-brand-yellow/80 mb-2">UMass Amherst (2025)</p>
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    Dean’s List. Marketing Analytics, Digital Strategy, Data Mining.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Power User Ecosystem Toolkit */}
                    <section className="space-y-8">
                        <h2 className="text-xl font-bold text-foreground border-b border-white/10 pb-2 mb-6">Power User Ecosystem Toolkit</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="space-y-2">
                                <h4 className="text-sm font-bold text-foreground uppercase tracking-wider">Agents</h4>
                                <ul className="text-sm text-muted-foreground space-y-1">
                                    <li>Custom GPTs</li>
                                    <li>LangChain/Flowise</li>
                                    <li>Replit Agents</li>
                                    <li>Cursor</li>
                                </ul>
                            </div>
                            <div className="space-y-2">
                                <h4 className="text-sm font-bold text-foreground uppercase tracking-wider">Automations</h4>
                                <ul className="text-sm text-muted-foreground space-y-1">
                                    <li>Make.com</li>
                                    <li>Zapier</li>
                                    <li>n8n</li>
                                    <li>Scriptable</li>
                                </ul>
                            </div>
                            <div className="space-y-2">
                                <h4 className="text-sm font-bold text-foreground uppercase tracking-wider">Data</h4>
                                <ul className="text-sm text-muted-foreground space-y-1">
                                    <li>Airtable Interfaces</li>
                                    <li>Google Sheets</li>
                                    <li>Notion DBs</li>
                                    <li>Vector Stores</li>
                                </ul>
                            </div>
                            <div className="space-y-2">
                                <h4 className="text-sm font-bold text-foreground uppercase tracking-wider">Governance</h4>
                                <ul className="text-sm text-muted-foreground space-y-1">
                                    <li>Eval Frameworks</li>
                                    <li>Risk Assessment</li>
                                    <li>Human-in-the-loop</li>
                                    <li>Policy Design</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    <div className="text-center pt-8">
                        <p className="text-muted-foreground font-medium mb-4">
                            Want to build a stack that looks like this?
                        </p>
                        <Button variant="outline" className="border-border text-foreground hover:bg-secondary" asChild>
                            <a href="mailto:you@yourdomain.com?subject=Resume%20Context%20Consultation%20Inquiry">
                                Email for Consultation
                            </a>
                        </Button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Resume;

