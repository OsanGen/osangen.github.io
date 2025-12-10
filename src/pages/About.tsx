const About = () => {
    return (
        <div className="min-h-screen pt-24 pb-12 bg-background">
            <div className="container mx-auto px-4">
                <h1 className="text-4xl md:text-5xl font-bold font-heading mb-8 text-center">About Me</h1>

                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="order-2 md:order-1 space-y-6 text-lg text-muted-foreground leading-relaxed">
                        <p className="text-foreground font-medium">Cambridge, MA</p>
                        <p>
                            Data and AI are at the core of my work as an entrepreneurial leader. I combine a strong foundation in data analytics and strategic branding with a passion for pioneering AI-driven solutions that transform complex information into accessible insights.
                        </p>
                        <p>
                            As a co-founder of <span className="text-brand-accent">Beautiful Patterns</span>, I’ve designed innovative, algorithm-based educational programs that empower underrepresented communities and streamline data analysis for leading institutions like the Broad Institute and Microsoft.
                        </p>
                        <p>
                            My approach integrates cutting-edge data visualization, frontend development, and digital storytelling, enabling impactful, inclusive strategies that drive both technological innovation and community engagement.
                        </p>
                    </div>

                    <div className="order-1 md:order-2 flex justify-center">
                        <div className="relative w-full max-w-md aspect-square rounded-2xl overflow-hidden shadow-2xl border border-white/10 group">
                            <div className="absolute inset-0 bg-brand-primary/10 group-hover:bg-transparent transition-colors duration-500" />
                            <img src="/img/AboutMe.png" alt="Oscar Sanchez" className="object-cover w-full h-full" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
