import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Home = () => {
    return (
        <div className="min-h-screen relative overflow-hidden flex items-center justify-center bg-background">
            {/* Background Aurora Effect */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-40 pointer-events-none">
                <div className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] bg-gradient-to-br from-brand-primary/20 via-transparent to-brand-accent/20 animate-aurora-drift blur-[100px]" />
            </div>

            <div className="container relative z-10 text-center px-4">
                <div className="mb-8 animate-float">
                    <h1 className="text-6xl md:text-8xl font-bold font-heading mb-4 tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
                        OSCAR SANCHEZ
                    </h1>
                    <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
                        Entrepreneurial Leader. Data & AI Strategist.
                    </p>
                </div>

                <div className="flex justify-center gap-4">
                    <Button variant="glow" size="lg" asChild>
                        <Link to="/agent-work">View Agent Work</Link>
                    </Button>
                    <Button variant="outline" size="lg" asChild>
                        <Link to="/about">About Me</Link>
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Home;
