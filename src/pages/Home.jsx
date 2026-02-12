import { GraphSection } from "../components/graphSection";
import { NavBar } from "../components/NavBar";
import { ThemeToggle } from "../components/ThemeToggle";
import { RouterList } from "../components/routerList";
import { PackagesList } from "../components/packages";
import { AddRouter } from "../components/addRouter";
import { GenerateToken } from "../components/tokenGenerate";
import { Footer } from "../components/footer";
import { Trash2 } from "lucide-react";

import { useSelector, useDispatch } from "react-redux";
import { getOnlineData, removeToken } from "../redux/defaultSlice";
import { pingServer } from "../redux/defaultSlice";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { networkObject } from "./network";

export const Home = () => {
    const serverActive = useSelector((state) => state.reducerX.dynamicData.serverActive);
    const amountList = useSelector((state) => state.reducerX.dynamicData.amountList);
    const listOfItems = useSelector((state) => state.reducerX.dynamicData.runningCodes);
    const routerList = useSelector((state) => state.reducerX.dynamicData.routerList);

    const listOfHeadings = useSelector((state) => state.reducerX.staticData.listOfHeadings);
    const packageHeader = useSelector((state) => state.reducerX.staticData.packageHeader);
    const routerHeading = useSelector((state) => state.reducerX.staticData.routerHeading);
    const adminDetails = useSelector((state) => state.reducerX.dynamicData.adminDetails);
    const code = useSelector((state) => state.reducerX.dynamicData.currentCode);

    const navigate = useNavigate();
    const user = localStorage.getItem('verified-user');
    const jwtToken = localStorage.getItem('twist-jwt-token');
    const dispatch = useDispatch();
    
    useEffect(() => {
        dispatch(pingServer());
        setTimeout(() => { dispatch(getOnlineData()); }, 20);
    }, [dispatch])

    const checkAuthorization = () => {
        if (jwtToken !== undefined && user !== null) {
            if (networkObject.isNetworkError() == true) {
                return alert('Network error');
            }

            const result = networkObject.sendPostRequest({ token: jwtToken }, '/admin/jwt-login');
            return result.then((result) => {
                if (result) {
                    console.log('token validation succeeded');
                    return;
                }
                else { navigate('/login'); }
            })
        }
        else { navigate('/login'); }
    }

    checkAuthorization();

    return <div className="min-h-screen bg-background text-foreground overflow-x-hidden" >
        <NavBar admin={adminDetails} />
        
        <main className="p-4 md:p-8 max-w-7xl mx-auto pt-20 md:pt-0 md:ml-64">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-foreground">Dashboard Overview</h1>
                    <p className="text-muted-foreground mt-2">Welcome back, Admin. System is running smoothly.</p>
                </div>
                <div className="flex items-center gap-4">
                    <ThemeToggle />
                    <div className="text-right hidden md:block">
                        <p className="text-sm text-muted-foreground">{new Date().toLocaleTimeString()}</p>
                        <div className="flex items-center gap-2 mt-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <p className="text-sm font-medium">{adminDetails.username || "Administrator"}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <div className="glass-card p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Network Traffic Analytics</h2>
                            <div className="flex gap-2">
                                <button className="px-3 py-1 rounded-md bg-muted text-sm font-medium hover:bg-muted/80 transition-colors">1 Day</button>
                                <button className="px-3 py-1 rounded-md bg-muted text-sm font-medium hover:bg-muted/80 transition-colors">3 Days</button>
                                <button className="px-3 py-1 rounded-md bg-muted text-sm font-medium hover:bg-muted/80 transition-colors">1 Week</button>
                            </div>
                        </div>
                        <GraphSection routers={routerList} runningCodes={listOfItems} />
                    </div>
                </div>

                <div className="lg:col-span-1">
                    <div className="glass-card p-6">
                        <h2 className="text-xl font-bold mb-4">Generate Access Token</h2>
                        <GenerateToken code={code} />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                <div className="glass-card p-6">
                    <h2 className="text-xl font-bold mb-4">Available Running Tokens</h2>
                    <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
                        {/* Group tokens by routerIP */}
                        {(() => {
                            // Color gradients for routers - purple, pink, and blue variations
                            const gradients = [
                                'from-purple-500 to-pink-600',
                                'from-blue-500 to-purple-600',
                                'from-pink-500 to-purple-600',
                                'from-purple-600 to-blue-600',
                                'from-pink-600 to-blue-600',
                                'from-purple-500 to-blue-500',
                                'from-pink-500 to-blue-500'
                            ];

                            // Group tokens by routerIP
                            const tokensByRouter = listOfItems.reduce((groups, item) => {
                                const routerIP = item.routerIP || "Unknown Router";
                                if (!groups[routerIP]) {
                                    groups[routerIP] = [];
                                }
                                groups[routerIP].push(item);
                                return groups;
                            }, {});

                            return Object.entries(tokensByRouter).map(([routerIP, tokens], index) => {
                                // Get router name from routerList
                                const router = routerList.find(r => r.routerIP === routerIP);
                                const routerName = router?.name || routerIP;
                                
                                // Get random gradient
                                const gradient = gradients[index % gradients.length];

                                return (
                                    <div key={routerIP} className="relative">
                                        <div className="absolute top-0 right-0 bg-gradient-to-br from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold z-10 shadow-lg">
                                            {tokens.length} clients
                                        </div>
                                        <div className={`glass-card p-4 bg-gradient-to-br ${gradient} bg-opacity-10`}>
                                            <h3 className="text-sm font-semibold mb-3 text-muted-foreground">{routerName}</h3>
                                            <div className="overflow-x-auto">
                                                <table className="w-full text-sm">
                                                    <thead>
                                                        <tr className="border-b border-border/30">
                                                            <th className="text-left py-2 px-3 font-semibold">Client Token</th>
                                                            <th className="text-left py-2 px-3 font-semibold">Router Name</th>
                                                            <th className="text-left py-2 px-3 font-semibold">Status</th>
                                                            <th className="text-left py-2 px-3 font-semibold">Remaining Time</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {tokens.map((item, key) => (
                                                            <tr key={key} className="border-b border-border/10 hover:bg-muted/20 transition-colors">
                                                                <td className="py-2 px-3 font-medium">{item.code || "TWIST-XXXXXX"}</td>
                                                                <td className="py-2 px-3">{item.routerIP || "Unknown"}</td>
                                                                <td className="py-2 px-3">
                                                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-400">
                                                                        <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                                                                        {item.isBound === "true" ? "Active" : "Off"}
                                                                    </span>
                                                                </td>
                                                                <td className="py-2 px-3">{Math.round(item.expiry) + " hr(s)"}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                );
                            });
                        })()}
                    </div>
                </div>

                <div className="glass-card p-6">
                    <h2 className="text-xl font-bold mb-4">Routers Status</h2>
                    <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
                        {(() => {
                            // Color gradients for router rows
                            const rowGradients = [
                                'from-purple-500/10 to-pink-500/10',
                                'from-blue-500/10 to-purple-500/10',
                                'from-pink-500/10 to-purple-500/10',
                                'from-purple-500/10 to-blue-500/10',
                                'from-pink-500/10 to-blue-500/10'
                            ];

                            return routerList.map((router, key) => {
                                // Get client count for this router from running codes
                                const clientCount = listOfItems.filter(item => item.routerIP === router.routerIP).length;
                                const rowGradient = rowGradients[key % rowGradients.length];
                                
                                return (
                                    <div key={key} className={`flex items-center justify-between p-3 rounded-lg bg-gradient-to-r ${rowGradient} hover:bg-opacity-80 transition-colors`}>
                                        <div className="flex items-center gap-3">
                                            <div className={`w-3 h-3 rounded-full ${router.status ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                            <div>
                                                <p className="font-medium">{router.name}</p>
                                                <p className="text-xs text-muted-foreground">{router.routerIP || "00:00:00:00:00:00"}</p>
                                                {router.holderPhoneNumber && (
                                                    <p className="text-xs text-muted-foreground">{router.holderPhoneNumber}</p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="text-right flex items-center gap-4">
                                            <div>
                                                <p className="text-sm font-medium">PHONE:  {router.holderNumber }</p>
                                                <p className="text-xs text-muted-foreground">{clientCount} Devices</p>
                                            </div>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    if (confirm(`Are you sure you want to delete router ${router.name}?`)) {
                                                        // Call delete router API
                                                        networkObject.sendPostRequest(
                                                            { routerIP: router.routerIP },
                                                            '/admin/remove-router?routerIP=' + router.routerIP
                                                        ).then(result => {
                                                            if (result) {
                                                                dispatch(removeRouter({ routerIP: router.routerIP }));
                                                                alert('Router deleted successfully');
                                                            } else {
                                                                alert('Failed to delete router');
                                                            }
                                                        }).catch(error => {
                                                            console.error('Error deleting router:', error);
                                                            alert('Error deleting router');
                                                        });
                                                    }
                                                }}
                                                className="p-1 rounded-lg text-red-400 hover:bg-red-500/20 transition-colors"
                                                title="Delete Router"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                );
                            });
                        })()}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <div className="md:col-span-1">
                    <div className="glass-card p-6">
                        <h2 className="text-xl font-bold mb-4">Add New Router</h2>
                        <AddRouter />
                    </div>
                </div>

                <div className="md:col-span-1">
                    <div className="glass-card p-6">
                        <h2 className="text-xl font-bold mb-4">Package Plans</h2>
                        <div className="space-y-3">
                            {amountList.slice(0, 2).map((pkg, key) => (
                                <div key={key} className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                                            <span className="text-xs font-bold">{pkg?.name ? pkg.name.charAt(0) : 'P'}</span>
                                        </div>
                                        <div>
                                            <p className="font-medium">{pkg?.name || 'Package'}</p>
                                            <p className="text-xs text-muted-foreground">{pkg?.amount || 'UGX 0'}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <button className="w-full mt-2 px-4 py-2 rounded-lg bg-secondary/20 text-secondary hover:bg-secondary/30 transition-colors text-sm font-medium">
                                View All Packages
                            </button>
                        </div>
                    </div>
                </div>

                <div className="md:col-span-1">
                    <div className="glass-card p-6">
                        <h2 className="text-xl font-bold mb-4">Admin Settings</h2>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                                    <span className="font-bold">A</span>
                                </div>
                                <div>
                                    <p className="font-medium">{adminDetails.username || "Administrator"}</p>
                                    <p className="text-xs text-muted-foreground">{adminDetails.email || "admin@twistnet.com"}</p>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">New Password</label>
                                <input 
                                    type="password" 
                                    placeholder="Enter new password" 
                                    className="w-full px-3 py-2 rounded-lg bg-muted/20 border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                />
                            </div>
                            <button className="w-full px-4 py-2 rounded-lg gradient-button font-medium">
                                Update Profile
                            </button>
                            <button className="w-full mt-2 px-4 py-2 rounded-lg bg-accent/20 text-accent hover:bg-accent/30 transition-colors text-sm font-medium">
                                Delete Admin Account
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>

        <Footer adminDetails={adminDetails} />
    </div>
}
