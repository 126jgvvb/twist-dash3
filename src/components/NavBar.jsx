import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
    BarChart3, 
    Users, 
    Settings, 
    Wifi, 
    LogOut, 
    Menu, 
    X, 
    Package, 
    CreditCard
} from 'lucide-react';
import { useDispatch } from 'react-redux';
import { logOut } from '../redux/defaultSlice';
import { cn } from '../utils';

function NavBar() {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [activeItem, setActiveItem] = useState('Dashboard');
    const [isSmallScreen, setIsSmallScreen] = useState(false);
    const [isMenuOpen, setMenu] = useState(false);

    const navItems = [
        { 
            name: 'Dashboard', 
            path: '/', 
            icon: BarChart3 
        },
        { 
            name: 'Router List', 
            path: '/routerList', 
            icon: Settings 
        },
        { 
            name: 'Client List', 
            path: '/clientList', 
            icon: Users 
        },
        { 
            name: 'Add Router', 
            path: '/addRouter', 
            icon: Wifi 
        },
        { 
            name: 'Token Generate', 
            path: '/tokenGenerate', 
            icon: Package 
        },
        { 
            name: 'Network', 
            path: '/network', 
            icon: Wifi 
        },
        { 
            name: 'Payments', 
            path: '/payments', 
            icon: CreditCard 
        },
    ];

    useEffect(() => {
        const handleResize = () => {
            const smallScreen = window.innerWidth < 640;
            setIsSmallScreen(smallScreen);
            if (!smallScreen && isMenuOpen) {
                setMenu(false);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [isMenuOpen]);

    useEffect(() => {
        const currentPath = location.pathname;
        const activeNavItem = navItems.find(item => item.path === currentPath);
        if (activeNavItem) {
            setActiveItem(activeNavItem.name);
        }
    }, [location.pathname]);

    const handleLogout = () => {
        dispatch(logOut());
        navigate('/login');
    };

    // Mobile view (toggle button visible only on small screens)
    if (isSmallScreen) {
        return (
            <>
                {/* Mobile top navigation bar */}
                <div className="fixed top-0 left-0 right-0 bg-card/90 backdrop-blur-md border-b border-border/50 z-50 p-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0">
                            <Wifi size={18} className="text-primary-foreground" />
                        </div>
                        <span className="font-bold text-foreground">TwistNet</span>
                    </div>
                    
                    {/* Toggle button - only visible on mobile */}
                    <button 
                        onClick={() => setMenu(!isMenuOpen)}
                        className="p-2 rounded-lg text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors"
                    >
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile sidebar */}
                <nav className={cn(
                    "fixed top-16 left-0 h-full bg-card/90 backdrop-blur-md border-r border-border/50 z-40 w-64 transform transition-transform duration-300 ease-in-out",
                    isMenuOpen ? "translate-x-0" : "-translate-x-full"
                )}>
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
                            <button 
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted/50 hover:text-red-400 hover:border border-border/30 transition-all duration-300"
                            >
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

                {/* Overlay for mobile */}
                {isMenuOpen && (
                    <div 
                        className="fixed inset-0 bg-black/50 z-30"
                        onClick={() => setMenu(false)}
                    />
                )}
            </>
        );
    }

    // Desktop view (permanent sidebar, no toggle button)
    return (
        <>
            <nav className="fixed left-0 top-0 h-full bg-card/90 backdrop-blur-md border-r border-border/50 z-40 w-64">
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
                        <button 
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted/50 hover:text-red-400 hover:border border-border/30 transition-all duration-300"
                        >
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

            {/* Overlay for desktop (only shown when menu is open) */}
            {isMenuOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-30 md:block hidden"
                    onClick={() => setMenu(false)}
                />
            )}
        </>
    );
}

export default NavBar;
