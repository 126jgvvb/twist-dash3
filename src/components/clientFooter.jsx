import { Phone, Heart } from 'lucide-react';

export const ClientFooter = () => {
  return (
    <footer className="bg-white/10 backdrop-blur-lg border-t border-white/20 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold text-white mb-4">TwistNet</h3>
            <p className="text-white/60 mb-4">
              Professional network management and voucher generation system
              for clients.
            </p>
            <div className="flex items-center gap-2 text-white/60">
            { // <Heart className="w-4 h-4 text-red-400" />
             } <span className="text-sm">From the makers of chargedMatrix</span>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2 text-white/60">
              <li><a href="#" className="hover:text-white transition-colors">Home</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Dashboard</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Vouchers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Settings</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Support</h4>
            <div className="space-y-3 text-white/60">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>+256 741 882 818</span>
              </div>
              <div className="text-sm">
                <p>Available 24/7 for support</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 pt-6 text-center">
          <p className="text-white/60 text-sm">
            © 2026 TwistNet from chargedMatrix. All rights reserved
          </p>
        </div>
      </div>
    </footer>
  );
};
