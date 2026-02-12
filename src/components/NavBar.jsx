import { useEffect, useState } from "react";
import { cn } from "../utils";
import { Bell, Circle, Menu, X, Wifi, Activity, Key, Server, FileText, Settings, LogOut, CreditCard } from "lucide-react";
import { useNavigate } from "react-router-dom";

const navItems = [
    { name: 'Dashboard', icon: Activity, path: '/' },
    { name: 'Live Monitoring', icon: Activity, path: '/monitoring' },
    { name: 'Token Management', icon: Key, path: '/tokens' },
    { name: 'Router Config', icon: Server, path: '/routers' },
    { name: 'Packages', icon: FileText, path: '/packages' },
    { name: 'Payments', icon: CreditCard, path: '/payments' },
    { name: 'Settings', icon: Settings, path: '/settings' }
];

export const NavBar = ({ admin }) => {
    const [isScrolled, setScrolled] = useState(false);
    const [isMenuOpen, setMenu] = useState(false); // Menu closed by default
    const [isSmallScreen, setScreen] = useState(false); // Auto-detect screen size
    const [activeItem, setActiveItem] = useState('Dashboard');
    const navigate = useNavigate();

    const handleScroll = () => {
        return setScrolled(window.innerHeight > 10);
    };
    
    const alterScreen = () => {
        const screenWidth = window.innerWidth;
        setScreen(true); // Always show mobile view for testing
    };

    useEffect(() => {
        alterScreen();
        window.addEventListener('scroll', handleScroll);
        window.addEventListener('resize', alterScreen);
        
        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("resize", alterScreen);
        };
    }, []);

    if (isSmallScreen) {
        return (
            <>
                <nav className="fixed top-0 left-0 right-0 bg-card/90 backdrop-blur-md border-b border-border/50 z-50">
                    <div className="flex items-center justify-between px-4 py-3">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0">
                                <Wifi size={20} className="text-primary-foreground" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-foreground">TwistNet</h1>
                                <p className="text-xs text-muted-foreground">Admin Portal</p>
                            </div>
                        </div>
                        
                        <button
                            onClick={() => setMenu(!isMenuOpen)}
                            className="p-2 rounded-lg bg-muted/20 text-foreground"
                        >
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>

                    {isMenuOpen && (
                        <div className="border-t border-border/50 bg-card/95 backdrop-blur-md">
                            <div className="p-4">
                                <ul className="space-y-2">
                                    {navItems.map((navItem, key) => {
                                        const Icon = navItem.icon;
                                        return (
                                            <li key={key}>
                                                <button
                                                    onClick={() => {
                                                        setActiveItem(navItem.name);
                                                        navigate(navItem.path);
                                                        setMenu(false);
                                                    }}
                                                    className={cn(
                                                        "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300",
                                                        activeItem === navItem.name
                                                            ? "bg-primary/20 text-primary border border-primary/30"
                                                            : "text-muted-foreground hover:bg-muted/50 hover:text-foreground hover:border border-border/30"
                                                    )}
                                                >
                                                    <Icon size={18} className="flex-shrink-0" />
                                                    <span>{navItem.name}</span>
                                                </button>
                                            </li>
                                        );
                                    })}
                                </ul>

                                <div className="mt-8 pt-6 border-t border-border/50">
                                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted/50 hover:text-red-400 hover:border border-border/30 transition-all duration-300">
                                        <LogOut size={18} className="flex-shrink-0" />
                                        <span>Logout Account</span>
                                    </button>
                                </div>
                            </div>

                            <div className="px-4 py-3 border-t border-border/50 text-center">
                                <p className="text-xs text-muted-foreground">
                                    © 2028 chargedMax
                                </p>
                            </div>
                        </div>
                    )}
                </nav>

                {isMenuOpen && (
                    <div 
                        className="fixed inset-0 bg-black/50 z-40 md:hidden"
                        onClick={() => setMenu(false)}
                    />
                )}
            </>
        );
    }

    return (
        <nav className="fixed left-0 top-0 h-full w-64 bg-card/90 backdrop-blur-md border-r border-border/50 z-50">
            <div className="p-6 border-b border-border/50 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0">
                    <Wifi size={20} className="text-primary-foreground" />
                </div>
                <div>
                    <h1 className="text-xl font-bold text-foreground">TwistNet</h1>
                    <p className="text-xs text-muted-foreground">Admin Portal</p>
                </div>
            </div>

            <div className="p-4">
                <ul className="space-y-2">
                    {navItems.map((navItem, key) => {
                        const Icon = navItem.icon;
                        return (
                            <li key={key}>
                                <button
                                    onClick={() => {
                                        setActiveItem(navItem.name);
                                        navigate(navItem.path);
                                    }}
                                    className={cn(
                                        "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300",
                                        activeItem === navItem.name
                                            ? "bg-primary/20 text-primary border border-primary/30"
                                            : "text-muted-foreground hover:bg-muted/50 hover:text-foreground hover:border border-border/30"
                                    )}
                                >
                                    <Icon size={18} className="flex-shrink-0" />
                                    <span>{navItem.name}</span>
                                </button>
                            </li>
                        );
                    })}
                </ul>

                <div className="mt-8 pt-6 border-t border-border/50">
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted/50 hover:text-red-400 hover:border border-border/30 transition-all duration-300">
                        <LogOut size={18} className="flex-shrink-0" />
                        <span>Logout Account</span>
                    </button>
                </div>
            </div>

            <div className="absolute bottom-6 left-0 right-0 text-center">
                <p className="text-xs text-muted-foreground">
                    © 2028 chargedMax
                </p>
            </div>
        </nav>
    );
};
