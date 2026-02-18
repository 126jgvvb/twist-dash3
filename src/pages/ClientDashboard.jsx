import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LogOut, 
  Wallet, 
  TrendingUp, 
  Settings, 
  Download, 
  Plus, 
  Clock, 
  Users, 
  Wifi,
  CreditCard,
  Router,
  Copy,
  RefreshCw,
  Zap,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { ClientFooter } from '../components/clientFooter';
import { format } from 'date-fns';
import jsPDF from 'jspdf';
import { SERVER_IP2 } from '../serverIP';
import ClientsGraphicalData from '../chart/pieChart';
import BarX from '../chart/barGraph';

export const ClientDashboard = () => {
  const [balance, setBalance] = useState(0);
  const [withdrawals, setWithdrawals] = useState([]);
  const [linkedRouters, setLinkedRouters] = useState([]);
  const [generatedTokens, setGeneratedTokens] = useState([]);
  const [currentVouchers, setCurrentVouchers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [voucherForm, setVoucherForm] = useState({
    quantity: 1,
    duration: '1hr' // Changed from timeframe to duration to match backend
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/client-login');
      return;
    }

    // Fetch dashboard data
    const fetchData = async () => {
      setIsLoading(true);
      
      try {
        const response = await fetch(`${SERVER_IP2}/users/dashboard`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Dashboard data:', data);
          console.log('Linked routers:', data.linkedRouters);
          console.log('Generated vouchers:', data.vouchers);
          setBalance(data.wallet?.balance || 0);
          setWithdrawals(data.recentWithdrawals || []);
          setLinkedRouters(data.linkedRouters || []);
          setCurrentVouchers(data.currentlyRunningTokens || []);
          setGeneratedTokens(data.vouchers || []); // Fetch generated vouchers from dashboard
      
      
        //  alert(JSON.stringify(data.vouchers));
        } else {
          // Handle token expiration or invalid token
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          localStorage.removeItem('wallet');
          navigate('/client-login');
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        alert('Failed to load dashboard. Please check your internet connection.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('wallet');
      navigate('/client-login');
    }
  };

  const handleWithdraw = async () => {
    if(balance<=0){
      alert('You have insufficient funds');
      return;
    }

    const amount = parseInt(withdrawAmount);
    if (!amount || amount<10000 || amount > balance) {
      alert('The minimum withdraw amount is UGX 10,000.');
      return;
    }
    
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/client-login');
      return;
    }
    
    // Get user's phone number from localStorage
    const user = JSON.parse(localStorage.getItem('user'));
    const phoneNumber = user?.phoneNumber;
    
    if (!phoneNumber) {
      alert('Phone number not found. Please update your profile.');
      return;
    }
    
    setIsWithdrawing(true);
    
    try {
      const response = await fetch(`${SERVER_IP2}/users/withdraw`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount,
          phoneNumber: phoneNumber,
          provider: 'MTN'
        }),
      });
      
      const result = await response.json();
      
      if (result.status=='Success') {
        setBalance(prev => prev - amount);
        setWithdrawals(prev => [
          { id: Date.now().toString(), amount: amount, date: new Date().toISOString().split('T')[0], status: 'Pending' },
          ...prev
        ]);
        alert('Withdrawal request submitted successfully!');
      } else {
        alert(result.message || 'Withdrawal failed. Please try again.');
      }
    } catch (error) {
      console.error('Withdrawal error:', error);
      alert('Withdrawal failed. Please try again.');
    } finally {
      setIsWithdrawing(false);
    }
    
    setWithdrawAmount('');
  };

  const generateTokenId = () => {
    return 'TWIST-' + Math.random().toString(36).substr(2, 8).toUpperCase();
  };

  const calculateExpiry = (timeframe) => {
    const now = new Date();
    let expiryTime = new Date(now);
    
    if (timeframe === '6Hrs') {
      expiryTime.setHours(now.getHours() + 6);
    } else if (timeframe === '12Hrs') {
      expiryTime.setHours(now.getHours() + 12);
    } else if (timeframe === '24Hrs') {
      expiryTime.setDate(now.getDate() + 1);
    } else if (timeframe === '1Week') {
      expiryTime.setDate(now.getDate() + 7);
    } else if (timeframe === '1Month') {
      expiryTime.setMonth(now.getMonth() + 1);
    }

    return expiryTime.toISOString();
  };

  const handleVoucherGenerate = async () => {
    if (voucherForm.quantity < 1 || voucherForm.quantity > 100) {
      alert('Please enter a quantity between 1 and 100');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/client-login');
      return;
    }

    setIsGenerating(true);

    try {
      const response = await fetch(`${SERVER_IP2}/users/vouchers`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(voucherForm),
      });

      if (response.ok) {
        const data = await response.json();
        
        // Automatically download vouchers as PDF
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        
        doc.setFontSize(20);
        doc.text('Generated Voucher Details', pageWidth / 2, 20, { align: 'center' });
        
        let yPosition = 40;
        data.vouchers.forEach(token => {
          doc.setFontSize(12);
          doc.text(`Voucher Code: ${token.tokenId}`, 20, yPosition);
          doc.text(`Router: ${token.router}`, 20, yPosition + 10);
          doc.text(`Duration: ${token.duration}`, 20, yPosition + 20);
          doc.text(`Expires: ${format(new Date(token.expiryTime), 'MMM dd, hh:mm a')}`, 20, yPosition + 30);
          
          doc.setLineWidth(0.5);
          doc.setDrawColor(150);
          doc.line(20, yPosition + 35, pageWidth - 20, yPosition + 35);
          
          yPosition += 45;
          
          if (yPosition > 270) {
            doc.addPage();
            yPosition = 20;
          }
        });
        
        doc.save(`vouchers-${new Date().toISOString().split('T')[0]}.pdf`);
        
        alert(`Successfully generated ${voucherForm.quantity} voucher(s) for ${voucherForm.duration}\nPDF downloaded automatically`);

        // Refresh the entire dashboard data to ensure consistency
        const dashboardResponse = await fetch(`${SERVER_IP}/users/dashboard`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (dashboardResponse.ok) {
          const dashboardData = await dashboardResponse.json();
          setBalance(dashboardData.wallet?.balance || 0);
          setWithdrawals(dashboardData.recentWithdrawals || []);
          setLinkedRouters(dashboardData.linkedRouters || []);
          setCurrentVouchers(dashboardData.currentlyRunningTokens || []);
          if (dashboardData.vouchers && dashboardData.vouchers.length > 0) {
            setGeneratedTokens(dashboardData.vouchers);
          }
        }
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to generate vouchers');
      }
    } catch (error) {
      console.error('Error generating vouchers:', error);
      alert('Failed to generate vouchers. Please check your internet connection.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadVouchers = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    doc.setFontSize(20);
    doc.text('Generated Voucher Details', pageWidth / 2, 20, { align: 'center' });
    
    const tokenData = generatedTokens.filter(token => token.createdBy === 'Client');
    
    let yPosition = 40;
    tokenData.forEach(token => {
      doc.setFontSize(12);
      doc.text(`Voucher Code: ${token.tokenId}`, 20, yPosition);
      doc.text(`Router: ${token.router}`, 20, yPosition + 10);
      doc.text(`Duration: ${token.duration}`, 20, yPosition + 20);
      doc.text(`Expires: ${format(new Date(token.expiryTime), 'MMM dd, hh:mm a')}`, 20, yPosition + 30);
      
      doc.setLineWidth(0.5);
      doc.setDrawColor(150);
      doc.line(20, yPosition + 35, pageWidth - 20, yPosition + 35);
      
      yPosition += 45;
      
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
      }
    });
    
    doc.save('generated-vouchers.pdf');
  };

  const handleDownloadToken = (tokenId) => {
    const token = generatedTokens.find(t => t.id === tokenId);
    if (token) {
      const doc = new jsPDF();
      doc.setFontSize(16);
      doc.text('Voucher Details', 20, 20);
      doc.setFontSize(12);
      doc.text(`Voucher Code: ${token.tokenId}`, 20, 40);
      doc.text(`Router: ${token.router}`, 20, 50);
      doc.text(`Duration: ${token.duration}`, 20, 60);
      doc.text(`Expires: ${format(new Date(token.expiryTime), 'MMM dd, hh:mm a')}`, 20, 70);
      doc.save(`voucher-${tokenId}.pdf`);
    }
  };

  const handleCopyVoucher = (voucherCode) => {
    navigator.clipboard.writeText(voucherCode);
    alert('Voucher code copied to clipboard');
  };

  const handleDeleteToken = (tokenId) => {
    setGeneratedTokens(generatedTokens.filter(token => token.id !== tokenId));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-800 text-lg font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-600 to-blue-600">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-lg border-b border-white/20 p-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Client Dashboard</h1>
                <p className="text-white/80 text-sm">Network Management</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-white rounded-lg hover:bg-red-500/30 transition-all duration-200"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-4">
        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-green-500 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white/80 text-sm font-medium">Current Balance</h3>
                  <p className="text-2xl font-bold text-white">UGX {balance.toLocaleString()}</p>
                </div>
              </div>
            </div>
            {/* the minimum amount to withdraw is ugx.10,000 */}
            <input
              type="number"
              min="10000"
              max={balance}
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              className="w-full px-4 py-2 mb-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
              placeholder={`Enter amount (min UGX 10,000, max UGX ${balance.toLocaleString()})`}
            />
            <button
              onClick={handleWithdraw}
              disabled={isWithdrawing}
              className="w-full py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isWithdrawing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                </>
              ) : (
                'Withdraw Funds'
              )}
            </button>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                  <Router className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white/80 text-sm font-medium">Linked Routers</h3>
                  <p className="text-2xl font-bold text-white">{linkedRouters.length}</p>
                </div>
              </div>
            </div>
            <div className="text-white/60 text-sm">
              MAC Addresses linked to your account
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white/80 text-sm font-medium">Current Tokens</h3>
                  <p className="text-2xl font-bold text-white">{generatedTokens.length}</p>
                </div>
              </div>
            </div>
            <div className="text-white/60 text-sm">
              Vouchers currently in use
            </div>
          </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white/80 text-sm font-medium">Phone Number</h3>
                  <p className="text-2xl font-bold text-white">
                    {JSON.parse(localStorage.getItem('user'))?.phoneNumber || 'N/A'}
                  </p>
                </div>
              </div>
            </div>
            <div className="text-white/60 text-sm">
              Registered phone number
            </div>
          </div>
        </div>

        {/* Graph Section */}
        <div className="bg-black/30 backdrop-blur-lg rounded-2xl border border-black/20 p-6 shadow-lg mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">Network Traffic Analytics</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-white/80 text-sm font-medium mb-4 text-center">Client Distribution by Duration</h3>
              <ClientsGraphicalData tokens={generatedTokens} />
            </div>
            <div>
              <h3 className="text-white/80 text-sm font-medium mb-4 text-center">Client Count by Duration</h3>
              <BarX tokens={generatedTokens} />
            </div>
          </div>
        </div>

        {/* Current Vouchers */}
        {currentVouchers.length > 0 && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 shadow-lg mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-bold text-white">Current Vouchers in Use</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="text-left py-3 px-4 text-white/80 font-medium">Status</th>
                    <th className="text-left py-3 px-4 text-white/80 font-medium">Client MAC</th>
                    <th className="text-left py-3 px-4 text-white/80 font-medium">Voucher Code</th>
                    <th className="text-left py-3 px-4 text-white/80 font-medium">Remaining</th>
                  </tr>
                </thead>
                <tbody>
                  {currentVouchers.map((voucher) => (
                    <tr key={voucher.id} className="border-b border-white/10 hover:bg-white/5">
                      <td className="py-3 px-4">
                        <span className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400">
                          <CheckCircle2 className="w-3 h-3" />
                          {voucher.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-white/80">{voucher.ip || 'N/A'}</td>
                      <td className="py-3 px-4 font-mono text-white">{voucher.tokenId || voucher.code}</td>
                      <td className="py-3 px-4 text-white/80">{voucher.expiryTime ? format(new Date(voucher.expiryTime), 'MMM dd, hh:mm a') : voucher.expiry}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

         {/* Voucher Generation */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 shadow-lg mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
              <Plus className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-white">Generate Vouchers</h2>
              <p className="text-yellow-400 text-sm mt-1">Premium Feature - UGX 5000 per generation</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">Quantity</label>
              <input
                type="number"
                min="1"
                max="100"
                value={voucherForm.quantity}
                onChange={(e) => setVoucherForm(prev => ({ ...prev, quantity: parseInt(e.target.value) }))}
                className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
                placeholder="Enter quantity"
              />
            </div>
            
            <div>
               <label className="block text-white/80 text-sm font-medium mb-2">Duration</label>
               <select
                 value={voucherForm.duration}
                 onChange={(e) => setVoucherForm(prev => ({ ...prev, duration: e.target.value }))}
                 className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
               >
                 <option value="1hr">1 Hour</option>
                 <option value="2hr">2 Hours</option>
                 <option value="4hr">4 Hours</option>
                 <option value="8hr">8 Hours</option>
                 <option value="1day">1 Day</option>
                 <option value="3day">3 Days</option>
                 <option value="1week">1 Week</option>
                 <option value="1month">1 Month</option>
               </select>
             </div>
          </div>

          <div className="flex gap-4 mt-6">
            <button
              onClick={handleVoucherGenerate}
              disabled={isGenerating || balance < 5000}
              className="flex-1 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : balance < 5000 ? (
                <>
                  <Zap className="w-4 h-4" />
                  Insufficient Balance (UGX 5000 Required)
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Generate Vouchers
                </>
              )}
            </button>
            
            <button
              onClick={handleDownloadVouchers}
              disabled={generatedTokens.length === 0}
              className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              Download PDF
            </button>
          </div>
        </div>



        {/* Linked Routers with Vouchers */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 shadow-lg mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
              <Router className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">Linked Routers & Vouchers</h2>
          </div>

          {linkedRouters.map((router) => {
            // Filter vouchers belonging to this router
            const routerVouchers = generatedTokens.filter(token => 
              token.routerIP === router.routerIP || token.router.includes(router.routerIP)
            );

            return (
              <div key={router.id} className="mb-6 bg-white/5 rounded-xl p-4 border border-white/20">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-white font-semibold">{router.name}</h3>
                    <div className="text-white/60 text-sm">
                       MAC: {router.macAddress}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400">
                      {routerVouchers.length} Voucher{routerVouchers.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>

                {routerVouchers.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-white/20">
                          <th className="text-left py-2 px-3 text-white/80 font-medium">Voucher Code</th>
                     </tr>
                      </thead>
                      <tbody>
                        {routerVouchers.map((voucher) => (
                          <tr key={voucher.id} className="border-b border-white/10 hover:bg-white/5">
                            <td className="py-2 px-3 font-mono text-white">{voucher.tokenId}</td>
                            <td className="py-2 px-3 font-mono text-white">{Math.floor(voucher.duration)+'Hr(s)'}</td>
                   </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-4 text-white/60 italic">
                    No vouchers generated for this router
                  </div>
                )}
              </div>
            );
          })}

          {linkedRouters.length === 0 && (
            <div className="text-center py-8 text-white/60 italic">
              No routers linked to your account
            </div>
          )}
        </div>

        {/* Withdrawal History */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 shadow-lg mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-red-500 flex items-center justify-center">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">Withdrawal History</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="text-left py-3 px-4 text-white/80">Date</th>
                  <th className="text-left py-3 px-4 text-white/80">Amount</th>
                  <th className="text-left py-3 px-4 text-white/80">Status</th>
                </tr>
              </thead>
              <tbody>
                {withdrawals.map((withdrawal) => (
                  <tr key={withdrawal.id} className="border-b border-white/10 hover:bg-white/5">
                    <td className="py-3 px-4 text-white">
                      {withdrawal.date ? (
                        format(new Date(withdrawal.date), 'MMM dd, yyyy')
                      ) : 'N/A'}
                    </td>
                    <td className="py-3 px-4 text-white">UGX {withdrawal.amount.toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        withdrawal.status === 'Completed' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {withdrawal.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Footer */}
      <ClientFooter />
    </div>
  );
};
