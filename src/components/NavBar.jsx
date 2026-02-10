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
    const [isMenuOpen, setMenu] = useState(false);
    const [isSmallScreen, setScreen] = useState(true);
    const [activeItem, setActiveItem] = useState('Dashboard');
    const navigate = useNavigate();

    const handleScroll = () => {
        return setScrolled(window.innerHeight > 10);
    };
    
    const alterScreen = () => {
        window.innerWidth < 640 ? setScreen(true) : setScreen(false);
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        window.addEventListener('resize', alterScreen);
        
        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("resize", alterScreen);
        };
    }, []);

    return (
        <>
            {/* Mobile menu trigger */}
            {isSmallScreen && (
                <button
                    onClick={() => setMenu(!isMenuOpen)}
                    className="fixed left-4 top-4 z-50 p-2 rounded-lg bg-card/80 backdrop-blur-md border border-border/50 text-foreground md:hidden"
                >
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            )}

            <nav 
                className={cn(
                    "fixed left-0 top-0 h-full bg-card/90 backdrop-blur-md border-r border-border/50 z-50 transition-all duration-300",
                    isMenuOpen || !isSmallScreen ? "w-64" : "w-20 md:hover:w-64"
                )}
                onMouseEnter={() => !isSmallScreen && setMenu(true)}
                onMouseLeave={() => !isSmallScreen && setMenu(false)}
            >
                <div className="p-6 border-b border-border/50 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0">
                        <Wifi size={20} className="text-primary-foreground" />
                    </div>
                    <div className="hidden md:block transition-all duration-300 overflow-hidden">
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
                                            if (isSmallScreen) {
                                                setMenu(false);
                                            }
                                        }}
                                        className={cn(
                                            "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300",
                                            activeItem === navItem.name
                                                ? "bg-primary/20 text-primary border border-primary/30"
                                                : "text-muted-foreground hover:bg-muted/50 hover:text-foreground hover:border border-border/30"
                                        )}
                                    >
                                        <Icon size={18} className="flex-shrink-0" />
                                        <span className={cn("hidden md:block transition-all duration-300 overflow-hidden")}>
                                            {navItem.name}
                                        </span>
                                    </button>
                                </li>
                            );
                        })}
                    </ul>

                    <div className="mt-8 pt-6 border-t border-border/50">
                        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted/50 hover:text-red-400 hover:border border-border/30 transition-all duration-300">
                            <LogOut size={18} className="flex-shrink-0" />
                            <span className={cn("hidden md:block transition-all duration-300 overflow-hidden")}>
                                Logout Account
                            </span>
                        </button>
                    </div>
                </div>

                <div className="absolute bottom-6 left-0 right-0 text-center">
                    <p className="text-xs text-muted-foreground hidden md:block">
                        © 2028 chargedMax
                    </p>
                </div>
            </nav>

            {/* Overlay for mobile */}
            {isMenuOpen && isSmallScreen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setMenu(false)}
                />
            )}
        </>
    );
};
