
import { Brain } from "lucide-react";

const About = () => {
    return (
        <div className="min-h-screen pt-24 pb-12 bg-background">
            <div className="container mx-auto px-4">
                <div className="max-w-5xl mx-auto">

                    <div className="flex items-center gap-3 mb-12">
                        <Brain className="text-brand-yellow w-6 h-6 fill-current opacity-90" />
                        <h1 className="text-3xl md:text-4xl font-bold font-heading text-foreground">About Me</h1>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12 items-start">
                        {/* Text Content - Reduced Density */}
                        <div className="order-2 md:order-1 space-y-6 text-lg text-muted-foreground leading-relaxed">
                            <p className="text-foreground font-bold uppercase tracking-wide text-xs">Cambridge, MA</p>

                            <p>
                                I help you become a GenAI power user, not just "someone who uses ChatGPT." For the past decade I have been designing systems where people, agents, and data work together.
                            </p>

                            <p>
                                I co-founded <strong className="text-foreground">Beautiful Patterns</strong> (10k+ students) and <strong className="text-foreground">Gen AI Global</strong> (1k+ members). I build workflows that make researchers and operators better at their jobs by pairing them with governed AI assistants.
                            </p>

                            <div className="border-l-2 border-brand-yellow/50 pl-6 mt-6">
                                <h3 className="font-bold text-foreground mb-2 text-base">How we work 1:1</h3>
                                <p className="text-base">
                                    We design small, safe experiments that connect GenAI agents into a <strong>power user ecosystem</strong> around you.
                                </p>
                            </div>

                            <div className="pt-4">
                                <a href="mailto:you@yourdomain.com?subject=Consultation%20Inquiry" className="text-foreground font-bold hover:text-brand-yellow transition-colors border-b border-white/20 hover:border-brand-yellow pb-0.5">
                                    Email to start a paid consultation &rarr;
                                </a>
                            </div>
                        </div>

                        {/* Image - Minimalist */}
                        <div className="order-1 md:order-2 flex justify-center">
                            <div className="relative w-full max-w-sm aspect-square rounded-xl overflow-hidden shadow-2xl border border-white/10 grayscale hover:grayscale-0 transition-all duration-700">
                                <img src="/img/AboutMe.png" alt="Oscar Sanchez" className="object-cover w-full h-full" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
