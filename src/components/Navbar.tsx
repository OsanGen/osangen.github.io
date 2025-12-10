import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
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
            if (window.scrollY > 10) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const isActive = (path: string) => location.pathname === path;

    const navLinks = [
        { label: 'Home', path: '/' },
        { label: 'About Me', path: '/about' },
        { label: 'Agent Work', path: '/agent-work' },
        { label: 'CV/Resume', path: '/resume' },
    ];

    const handleNavigation = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
        e.preventDefault();
        navigate(path);
        setIsMenuOpen(false);
    };

    return (
        <nav
            className={cn(
                'fixed top-0 w-full z-50 transition-all duration-300',
                isScrolled
                    ? 'bg-[hsl(var(--footer))]/80 backdrop-blur-md shadow-lg border-b border-white/10'
                    : 'bg-transparent'
            )}
        >
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                {/* Logo */}
                <a
                    href="/"
                    onClick={(e) => handleNavigation(e, '/')}
                    className="text-2xl font-bold font-heading text-white tracking-widest hover:text-brand-accent transition-colors"
                >
                    OSCAR SANCHEZ
                </a>

                {/* Desktop Menu */}
                <div className="hidden md:block">
                    <NavigationMenu>
                        <NavigationMenuList className="space-x-2">
                            {navLinks.map((link) => (
                                <NavigationMenuItem key={link.path}>
                                    <NavigationMenuLink
                                        href={link.path}
                                        onClick={(e) => handleNavigation(e, link.path)}
                                        className={cn(
                                            navigationMenuTriggerStyle(),
                                            'bg-transparent hover:bg-white/5 focus:bg-white/5 data-[active]:bg-transparent data-[state=open]:bg-transparent cursor-pointer',
                                            isActive(link.path)
                                                ? 'text-[hsl(var(--accent))] font-semibold'
                                                : 'text-white/80 hover:text-brand-accent'
                                        )}
                                    >
                                        {link.label}
                                    </NavigationMenuLink>
                                </NavigationMenuItem>
                            ))}

                            {/* Contact Button */}
                            <NavigationMenuItem>
                                <Button variant="glow" size="sm" asChild className="ml-2">
                                    <a href="/contact" onClick={(e) => handleNavigation(e, '/contact')}>Contact</a>
                                </Button>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>
                </div>

                {/* Mobile Menu Button */}
                <div className="md:hidden">
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="text-white hover:text-brand-accent focus:outline-none"
                    >
                        {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>
            </div>

            {/* Mobile Dropdown */}
            <div
                className={cn(
                    'md:hidden absolute top-full left-0 w-full bg-[hsl(var(--footer))] border-b border-white/10 overflow-hidden transition-all duration-300 ease-in-out',
                    isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                )}
            >
                <div className="flex flex-col p-4 space-y-4">
                    {navLinks.map((link) => (
                        <a
                            key={link.path}
                            href={link.path}
                            onClick={(e) => handleNavigation(e, link.path)}
                            className={cn(
                                'text-lg font-medium transition-colors block',
                                isActive(link.path)
                                    ? 'text-brand-accent'
                                    : 'text-white/80 hover:text-brand-accent'
                            )}
                        >
                            {link.label}
                        </a>
                    ))}
                    <Button variant="glow" className="w-full" asChild>
                        <a href="/contact" onClick={(e) => handleNavigation(e, '/contact')}>Contact</a>
                    </Button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
