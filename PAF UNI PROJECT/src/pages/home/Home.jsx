import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Wrench, BarChart2, ChevronLeft, ChevronRight, Check } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans overflow-x-hidden">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="text-xl font-bold text-[#1a2f4c]">
          ScholarFlow Ops
        </div>
        <div className="hidden md:flex space-x-8 text-sm font-medium text-slate-500">
          <a href="#" className="text-[#10b981] border-b-2 border-[#10b981] pb-1">Operations</a>
          <a href="#" className="hover:text-slate-900 transition">Facilities</a>
          <a href="#" className="hover:text-slate-900 transition">Energy</a>
          <a href="#" className="hover:text-slate-900 transition">Sustainability</a>
        </div>
        <div className="flex items-center space-x-4">
          <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition">
            Log in
          </Link>
          <Link to="/login" className="px-5 py-2.5 bg-[#1a2f4c] text-white text-sm font-medium rounded-md hover:bg-[#0f1f38] transition">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-8 pt-12 pb-24 flex flex-col-reverse lg:flex-row items-center justify-between gap-12">
        <div className="flex-1 max-w-2xl">
          <span className="inline-block px-3 py-1 bg-[#bbf7d0] text-[#065f46] text-xs font-bold tracking-wider rounded-full mb-6">
            DIGITAL TWIN TECHNOLOGY
          </span>
          <h1 className="text-5xl lg:text-7xl font-extrabold text-[#1a2f4c] leading-[1.1] mb-6 tracking-tight">
            Architecting the <span className="text-[#10b981]">Future</span> of Campus Life.
          </h1>
          <p className="text-lg text-slate-600 mb-10 leading-relaxed max-w-xl">
            Real-time intelligence, seamless facility management, and a unified operations hub for the modern university.
          </p>
          <div className="flex items-center space-x-4">
            <Link to="/login" className="px-6 py-3 bg-[#1a2f4c] text-white font-medium rounded-md hover:bg-[#0f1f38] transition shadow-lg shadow-blue-900/20">
              Get Started
            </Link>
            <a href="#" className="px-6 py-3 border border-slate-300 text-slate-700 font-medium rounded-md hover:bg-slate-50 transition">
              Learn More
            </a>
          </div>
        </div>

        {/* Hero Graphic */}
        <div className="flex-1 w-full flex justify-end">
          <div className="relative w-full max-w-md bg-[#134e4a] rounded-[2rem] p-8 overflow-hidden shadow-2xl aspect-square flex flex-col justify-between">
            <div className="flex justify-between items-start">
               <div className="bg-[#5eead4]/20 border border-[#5eead4]/30 backdrop-blur-md px-4 py-2 rounded-lg">
                 <span className="block text-[#ccfbf1] text-xs opacity-70">Campus</span>
                 <strong className="text-white text-lg">operations</strong>
               </div>
               <div className="w-16 h-12 bg-[#5eead4]/20 rounded-lg flex items-center justify-center border border-[#5eead4]/30">
                 <div className="w-6 h-4 bg-[#ccfbf1] rounded-sm opacity-80"></div>
               </div>
            </div>
            
            {/* Center abstract avatar */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-32 h-32 rounded-full border-4 border-[#5eead4] shadow-[0_0_30px_rgba(94,234,212,0.3)] bg-cover bg-center" style={{
                backgroundImage: 'url("https://scontent.fcmb1-2.fna.fbcdn.net/v/t39.30808-6/646171339_1231176275881228_2357975964920838948_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=13d280&_nc_eui2=AeEyr3a1w1I80l_rAr0S5PxaZwCzmGpTDVpnALOYalMNWgJaUuDF8eIQJ2S5dt49y8-IynDZ5qajCcCLr56zaykD&_nc_ohc=8lPTB2oT6YkQ7kNvwGBM4ih&_nc_oc=AdrreZmVMT-0xgay7Jg6qcGjIY5gDIDlUfu1nTWQYRiQYXlrGaM1vMmugsXG5-kCEIY&_nc_zt=23&_nc_ht=scontent.fcmb1-2.fna&_nc_gid=sw-WogO_1xDHn4xggIIz7g&_nc_ss=7a3a8&oh=00_AfyujELP6WGr2npI14dmSdW5tUuQuI4r2LnqllyT8glGeQ&oe=69D08B86")'
              }}></div>
              {/* Shoulders */}
              <div className="absolute top-[80%] -left-8 right-0 w-48 h-24 bg-[#5eead4] rounded-t-[3rem] -z-10 ml-0.5"></div>
            </div>

            {/* Bottom active widget */}
            <div className="bg-[#ccfbf1]/90 backdrop-blur-md p-4 rounded-xl flex items-center justify-between mt-auto z-20">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-[#134e4a] rounded-full flex items-center justify-center">
                  <Check className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-[#134e4a] text-xs font-bold tracking-wider">ACTIVE HUB</div>
                  <div className="text-[#0f766e] text-sm font-semibold">Core Campus Node A-4</div>
                </div>
              </div>
              <div className="flex flex-row-reverse -space-x-2 space-x-reverse">
                <div className="w-8 h-8 rounded-full bg-[#1a2f4c] text-white flex items-center justify-center text-xs border-2 border-[#ccfbf1]">+12</div>
                <div className="w-8 h-8 rounded-full bg-slate-200 border-2 border-[#ccfbf1]"></div>
                <div className="w-8 h-8 rounded-full bg-slate-300 border-2 border-[#ccfbf1]"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section className="max-w-7xl mx-auto px-8 pb-24 grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10 -mt-20">
        {/* Card 1 */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition">
          <div className="w-12 h-12 bg-[#10b981] rounded-xl flex items-center justify-center mb-6">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-xl font-bold text-[#1a2f4c] mb-3">Smart Booking</h3>
          <p className="text-slate-500 text-sm leading-relaxed">
            Reserve rooms and equipment in seconds with real-time availability. AI-driven conflicts resolution included.
          </p>
        </div>

          {/* Card 2 */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition">
            <div className="w-12 h-12 bg-[#10b981] rounded-xl flex items-center justify-center mb-6">
              <Wrench className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-[#1a2f4c] mb-3">Incident Tracking</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Report maintenance needs instantly and track resolution in real-time with visual status updates.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition">
            <div className="w-12 h-12 bg-[#92400e] rounded-xl flex items-center justify-center mb-6">
              <BarChart2 className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-[#1a2f4c] mb-3">Campus Intelligence</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Data-driven insights to optimize energy, traffic, and resources across the entire campus ecosystem.
            </p>
          </div>
      </section>

      {/* Stats Section */}
      <section className="bg-[#0f1f38] text-white py-16 px-8 relative overflow-hidden">
        {/* Abstract Background Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e3a8a_1px,transparent_1px),linear-gradient(to_bottom,#1e3a8a_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-30"></div>
        
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="md:w-1/3">
            <h2 className="text-3xl font-extrabold mb-2">Campus Vital Signs</h2>
            <div className="text-[#10b981] text-3xl font-extrabold flex items-center">
              Live Feedback.
              <span className="w-full h-1 bg-[#10b981] ml-4 flex-1 rounded"></span>
            </div>
          </div>
          
          <div className="md:w-2/3 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left md:border-l border-[#1e3a8a] md:pl-8">
            <div className="md:border-r border-[#1e3a8a] px-4">
              <div className="text-5xl font-extrabold mb-2">98%</div>
              <div className="text-[#10b981] text-xs font-bold tracking-widest uppercase">FACILITY UPTIME</div>
            </div>
            <div className="md:border-r border-[#1e3a8a] px-4">
              <div className="text-5xl font-extrabold mb-2">150+</div>
              <div className="text-[#10b981] text-xs font-bold tracking-widest uppercase">RESOURCES MANAGED</div>
            </div>
            <div className="px-4">
              <div className="text-5xl font-extrabold mb-2">4.2m</div>
              <div className="text-[#10b981] text-xs font-bold tracking-widest uppercase">ENERGY UNITS SAVED</div>
            </div>
          </div>
        </div>
      </section>

      {/* Tailored Access */}
      <section className="max-w-7xl mx-auto px-8 py-20">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl font-extrabold text-[#1a2f4c] mb-2">Tailored Access</h2>
            <p className="text-slate-500">Every user has a dedicated path into the ScholarFlow ecosystem.</p>
          </div>
          <div className="hidden md:flex space-x-3">
            <button className="w-10 h-10 rounded-full border border-slate-300 flex items-center justify-center text-slate-500 hover:text-[#1a2f4c] hover:border-[#1a2f4c] transition">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button className="w-10 h-10 rounded-full border border-slate-300 flex items-center justify-center text-slate-500 hover:text-[#1a2f4c] hover:border-[#1a2f4c] transition">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-[#111827] rounded-3xl p-8 pb-10 flex flex-col min-h-[400px] relative overflow-hidden group">
            {/* Background pattern idea */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-500 via-slate-900 to-black pointer-events-none transition-opacity group-hover:opacity-30"></div>
            
            <div className="mt-auto relative z-10">
              <h3 className="text-3xl font-bold text-white mb-3">Students</h3>
              <p className="text-slate-300 text-sm mb-6 max-w-xs">
                Book study rooms, report dorm issues, and access campus maps in a single mobile interface.
              </p>
              <Link to="/login" className="block w-full text-center px-6 py-3 bg-white text-[#111827] font-bold rounded-lg hover:bg-slate-100 transition">
                Student Portal
              </Link>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-[#0f1f1a] rounded-3xl p-8 pb-10 flex flex-col min-h-[400px] relative overflow-hidden group">
             <div className="absolute inset-x-0 top-1/3 flex items-center justify-center pointer-events-none opacity-10">
               <span className="text-5xl font-serif text-white rotate-[-10deg]">Faculty Access</span>
             </div>
            <div className="mt-auto relative z-10">
              <h3 className="text-3xl font-bold text-white mb-3">Faculty</h3>
              <p className="text-slate-300 text-sm mb-6 max-w-xs">
                Manage lab equipment, reserve lecture halls, and coordinate teaching assistants effortlessly.
              </p>
              <Link to="/login" className="block w-full text-center px-6 py-3 bg-[#10b981] text-white font-bold rounded-lg hover:bg-[#059669] transition">
                Faculty Dashboard
              </Link>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-[#0f1f38] rounded-3xl p-8 pb-10 flex flex-col min-h-[400px] relative overflow-hidden group">
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-32 h-40 border-2 border-slate-700/50 rounded-2xl flex items-center justify-center p-4 py-8 pointer-events-none opacity-20 bg-gradient-to-b from-transparent to-[#1a2f4c]">
               <div className="text-center font-bold text-slate-400">Admin<br/>Access</div>
            </div>
            <div className="mt-auto relative z-10">
              <h3 className="text-3xl font-bold text-white mb-3">Administration</h3>
              <p className="text-slate-300 text-sm mb-6 max-w-xs">
                Full-spectrum oversight of energy, security, and facility budgets with predictive analytics.
              </p>
              <Link to="/login" className="block w-full text-center px-6 py-3 bg-[#1e3a8a] text-white font-bold rounded-lg hover:bg-[#1e40af] transition">
                Command Center
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-16 px-8 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-12">
          <div className="lg:w-1/3">
            <div className="text-xl font-bold text-[#1a2f4c] mb-4 text-[#10b981]">
              ScholarFlow Ops
            </div>
            <p className="text-slate-500 text-sm leading-relaxed max-w-xs">
              Defining the digital infrastructure for academic brilliance. Empowering institutions through intelligent spatial management.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-8 lg:w-2/3">
            <div>
              <h4 className="font-bold text-[#1a2f4c] mb-4 text-sm tracking-wider uppercase">Resources</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-sm text-slate-500 hover:text-[#10b981] transition">Campus Map</a></li>
                <li><a href="#" className="text-sm text-slate-500 hover:text-[#10b981] transition">Security Protocols</a></li>
                <li><a href="#" className="text-sm text-slate-500 hover:text-[#10b981] transition">Sustainability Report</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-[#1a2f4c] mb-4 text-sm tracking-wider uppercase">Legal</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-sm text-slate-500 hover:text-[#10b981] transition">Privacy Policy</a></li>
                <li><a href="#" className="text-sm text-slate-500 hover:text-[#10b981] transition">Accessibility</a></li>
                <li><a href="#" className="text-sm text-slate-500 hover:text-[#10b981] transition">Terms of Service</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-[#1a2f4c] mb-4 text-sm tracking-wider uppercase">Support</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-sm text-slate-500 hover:text-[#10b981] transition">Contact Support</a></li>
                <li><a href="#" className="text-sm text-slate-500 hover:text-[#10b981] transition">Help Documentation</a></li>
                <li><a href="#" className="text-sm text-slate-500 hover:text-[#10b981] transition">System Status</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto border-t border-slate-100 mt-16 pt-8 text-center">
          <p className="text-slate-400 text-xs font-medium tracking-wide">
            © 2024 SMART CAMPUS OPERATIONS HUB. ALL RIGHTS RESERVED.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
