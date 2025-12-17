import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const isActive = (path: string) => location.pathname === path;

    const navLinks = [
        { label: 'Home', path: '/' },
        { label: 'About', path: '/about' }, // Simplified label
        { label: 'Agent Work', path: '/agent-work' },
        { label: 'CV', path: '/resume' }, // Simplified label
    ];

    const handleNavigation = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
        e.preventDefault();
        navigate(path);
        setIsMenuOpen(false);
    };

    return (
        <nav
            className={cn(
                'fixed top-0 w-full z-50 transition-all duration-300 h-20 flex items-center',
                isScrolled
                    ? 'bg-background/90 backdrop-blur-md border-b border-border shadow-sm'
                    : 'bg-transparent'
            )}
        >
            <div className="container mx-auto px-4 flex justify-between items-center">
                {/* Logo - Minimalist */}
                <a
                    href="/"
                    onClick={(e) => handleNavigation(e, '/')}
                    className="flex items-center gap-2 text-xl font-bold font-heading text-foreground group"
                >
                    <span className="tracking-widest group-hover:text-muted-foreground transition-colors">OSCAR SANCHEZ</span>
                    {/* Micro-accent only */}
                    <Brain className="text-brand-yellow w-5 h-5 fill-current opacity-80" />
                </a>

                {/* Desktop Menu - Muted Links */}
                <div className="hidden md:block">
                    <NavigationMenu>
                        <NavigationMenuList className="gap-2">
                            {navLinks.map((link) => (
                                <NavigationMenuItem key={link.path}>
                                    <NavigationMenuLink
                                        href={link.path}
                                        onClick={(e) => handleNavigation(e, link.path)}
                                        className={cn(
                                            navigationMenuTriggerStyle(),
                                            'bg-transparent hover:bg-transparent focus:bg-transparent data-[active]:bg-transparent data-[state=open]:bg-transparent cursor-pointer',
                                            isActive(link.path)
                                                ? 'text-foreground font-semibold'
                                                : 'text-muted-foreground hover:text-foreground font-normal'
                                        )}
                                    >
                                        {link.label}
                                    </NavigationMenuLink>
                                </NavigationMenuItem>
                            ))}

                            {/* Calm Utility CTA */}
                            <NavigationMenuItem>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    asChild
                                    className="ml-4 border-border text-foreground hover:bg-secondary hover:text-secondary-foreground transition-all rounded-lg"
                                >
                                    <a href="mailto:you@yourdomain.com?subject=Consultation%20Inquiry">
                                        Email for Consultation
                                    </a>
                                </Button>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>
                </div>

                {/* Mobile Menu Button - Calm */}
                <div className="md:hidden">
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="text-muted-foreground hover:text-foreground focus:outline-none"
                    >
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Dropdown - Dark Panel */}
            <div
                className={cn(
                    'md:hidden absolute top-20 left-0 w-full bg-background border-b border-border overflow-hidden transition-all duration-300 ease-in-out',
                    isMenuOpen ? 'max-h-96 opacity-100 shadow-xl' : 'max-h-0 opacity-0'
                )}
            >
                <div className="flex flex-col p-6 space-y-4">
                    {navLinks.map((link) => (
                        <a
                            key={link.path}
                            href={link.path}
                            onClick={(e) => handleNavigation(e, link.path)}
                            className={cn(
                                'text-lg font-medium transition-colors block py-2 border-b border-transparent',
                                isActive(link.path)
                                    ? 'text-foreground border-brand-yellow/50'
                                    : 'text-muted-foreground hover:text-foreground'
                            )}
                        >
                            {link.label}
                        </a>
                    ))}
                    <Button variant="outline" className="w-full mt-4" asChild>
                        <a href="mailto:you@yourdomain.com?subject=Consultation%20Inquiry">
                            Email for Consultation
                        </a>
                    </Button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
