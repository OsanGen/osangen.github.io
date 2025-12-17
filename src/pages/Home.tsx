import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";

const Home = () => {
    return (
        <div className="bg-background min-h-screen selection:bg-brand-yellow/30">
            {/* Hero Section */}
            <section className="min-h-screen grid items-center justify-center relative overflow-hidden pt-20">

                {/* Micro-accent Background */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-yellow/5 rounded-full blur-[120px] pointer-events-none" />

                <div className="relative z-10 w-full max-w-4xl mx-auto px-6 text-center space-y-8">

                    {/* H1 Name */}
                    <div className="space-y-2">
                        <h1 className="text-5xl md:text-7xl font-bold font-heading tracking-tight text-foreground">
                            OSCAR SANCHEZ
                        </h1>
                    </div>

                    {/* Role Line */}
                    <p className="text-xl md:text-2xl font-medium text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        I design <span className="text-foreground font-bold">GenAI power-user ecosystems</span> for individuals and teams.
                    </p>

                    {/* Supporting Content & Credentials */}
                    <div className="space-y-4">
                        <p className="text-base text-muted-foreground/80 max-w-xl mx-auto">
                            Founder of Gen AI Global. Learning Facilitator at MIT Professional Education.
                        </p>

                        {/* Credential Strip */}
                        <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-sm md:text-base text-muted-foreground/70">
                            <a
                                href="mailto:oscarsan@mit.edu"
                                className="underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/60 rounded"
                                aria-label="Email Oscar at oscarsan@mit.edu"
                            >
                                oscarsan@mit.edu
                            </a>
                            <span className="text-muted-foreground/40" aria-hidden="true">·</span>
                            <a
                                href="https://www.mit.edu/~oscarsan/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="break-all sm:break-normal underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/60 rounded"
                                aria-label="Open Oscar’s MIT page at https://www.mit.edu/~oscarsan/"
                            >
                                https://www.mit.edu/~oscarsan/
                            </a>
                        </div>
                    </div>

                    {/* CTA Layout */}
                    <div className="pt-8 flex flex-col items-center gap-6">
                        {/* Primary One Decision */}
                        <Button size="lg" className="rounded-full px-8 py-6 text-lg font-bold bg-foreground text-background hover:bg-foreground/90 transition-all shadow-xl shadow-brand-yellow/5" asChild>
                            <a href="mailto:you@yourdomain.com?subject=Consultation%20Inquiry">
                                Start 1:1 Consultation
                            </a>
                        </Button>

                        {/* Secondary Quiet Link */}
                        <a href="mailto:you@yourdomain.com?subject=Team%20Consulting%20Inquiry" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors border-b border-transparent hover:border-foreground pb-0.5">
                            Looking for Team Consulting?
                        </a>
                    </div>
                </div>

                {/* Minimal Scroll Hint */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce opacity-30">
                    <ArrowRight className="rotate-90 w-5 h-5 text-foreground" />
                </div>
            </section>

            {/* Consultation Entry Section */}
            <section className="py-24 md:py-32 border-t border-white/5 bg-background">
                <div className="container mx-auto px-4 max-w-3xl">

                    <div className="space-y-4 mb-12">
                        <h2 className="text-3xl font-bold font-heading text-foreground">Work With Me</h2>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            I accept a limited number of consulting engagements per quarter. My focus is on moving you from "chatting with AI" to building a governed, agentic power-user stack.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12 mb-12">
                        {/* Individual Path */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-foreground border-b border-white/10 pb-2">For Individuals</h3>
                            <ul className="space-y-3">
                                <li className="flex items-start gap-3 text-sm text-muted-foreground">
                                    <Check className="w-4 h-4 text-brand-yellow mt-0.5" />
                                    <span>Audit your current workflows and tools.</span>
                                </li>
                                <li className="flex items-start gap-3 text-sm text-muted-foreground">
                                    <Check className="w-4 h-4 text-brand-yellow mt-0.5" />
                                    <span>Build custom agentic automations.</span>
                                </li>
                                <li className="flex items-start gap-3 text-sm text-muted-foreground">
                                    <Check className="w-4 h-4 text-brand-yellow mt-0.5" />
                                    <span>Create your personal "Board of AI Directors."</span>
                                </li>
                            </ul>
                        </div>

                        {/* Team Path */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-foreground border-b border-white/10 pb-2">For Teams</h3>
                            <ul className="space-y-3">
                                <li className="flex items-start gap-3 text-sm text-muted-foreground">
                                    <Check className="w-4 h-4 text-brand-yellow mt-0.5" />
                                    <span>GenAI "Bootcamp" for non-coders.</span>
                                </li>
                                <li className="flex items-start gap-3 text-sm text-muted-foreground">
                                    <Check className="w-4 h-4 text-brand-yellow mt-0.5" />
                                    <span>Establish governance and risk frameworks.</span>
                                </li>
                                <li className="flex items-start gap-3 text-sm text-muted-foreground">
                                    <Check className="w-4 h-4 text-brand-yellow mt-0.5" />
                                    <span>Deploy shared agentic infrastructure.</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-white/5 space-y-6">
                        <div className="flex flex-col sm:flex-row gap-6 items-center justify-between">
                            <p className="text-sm font-medium text-muted-foreground">
                                Ready to start?
                            </p>
                            <Button variant="outline" className="border-border text-foreground hover:bg-secondary w-full sm:w-auto" asChild>
                                <a href="mailto:you@yourdomain.com?subject=Consultation%20Context">
                                    Email to Inquire
                                </a>
                            </Button>
                        </div>
                        <p className="text-xs text-muted-foreground/50 text-center">
                            * I adhere to strict ethics regarding AI capability disclosures and data privacy.
                        </p>
                    </div>

                </div>
            </section>
        </div>
    );
};

export default Home;
