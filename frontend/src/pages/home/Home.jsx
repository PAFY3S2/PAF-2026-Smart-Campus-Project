import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Wrench, BarChart2, ChevronLeft, ChevronRight, Check, BookOpen, Shield, Award } from 'lucide-react';
import logo from '../../assets/SLIIT FacilityFlow logo design.png';

import gradImg from '../../assets/GRAD.jpg';
import studentsImg from '../../assets/students images (1).jpg';
import sideBarImg from '../../assets/side bar std copy.jpg';

const Home = () => {
  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans overflow-x-hidden">
      {/* Navbar */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="flex items-center justify-between px-8 py-4 max-w-7xl mx-auto">
          <div className="flex items-center space-x-3">
            <img src={logo} alt="SLIIT Logo" className="h-12 w-auto" />
            <div className="h-8 w-px bg-slate-200 mx-2 hidden md:block"></div>
            <div className="text-xl font-black text-[#142B5D] hidden md:block uppercase tracking-tighter">
              FACILITY<span className="text-[#F5AB24]">FLOW</span>
            </div>
          </div>
          <div className="hidden md:flex space-x-8 text-sm font-semibold text-[#142B5D]">
            <a href="#" className="hover:text-[#F5AB24] transition border-b-2 border-[#142B5D] pb-1">Operations</a>
            <a href="#" className="hover:text-[#F5AB24] transition">Academic Hub</a>
            <a href="#" className="hover:text-[#F5AB24] transition">Resources</a>
            <a href="#" className="hover:text-[#F5AB24] transition">Support</a>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/login" className="text-sm font-bold text-[#142B5D] hover:text-[#F5AB24] transition">
              Portal Login
            </Link>
            <Link to="/login" className="px-6 py-2 bg-[#142B5D] text-white text-sm font-bold rounded shadow-md hover:bg-[#0D1E40] transition">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={gradImg} 
            alt="University Campus" 
            className="w-full h-full object-cover brightness-[0.4]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#142B5D]/80 to-transparent"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-8 relative z-10 w-full">
          <div className="max-w-2xl">
            <span className="inline-block px-4 py-1 bg-[#F5AB24] text-[#142B5D] text-xs font-black tracking-widest rounded mb-6 uppercase">
              Official University Operations
            </span>
            <h1 className="text-5xl lg:text-6xl font-black text-white leading-tight mb-6">
              Excellence in <span className="text-[#F5AB24]">Campus</span> Infrastructure Management.
            </h1>
            <p className="text-xl text-slate-100 mb-10 leading-relaxed font-medium">
              A unified digital ecosystem for SLIIT facility management, resource optimization, and operational intelligence.
            </p>
            <div className="flex items-center space-x-4">
              <Link to="/login" className="px-8 py-4 bg-[#F5AB24] text-[#142B5D] font-black rounded shadow-xl hover:bg-[#E09A20] transition transform hover:-translate-y-0.5">
                Staff & Student Login
              </Link>
              <a href="#" className="px-8 py-4 border-2 border-white text-white font-black rounded hover:bg-white/10 transition">
                View Resources
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Institutional Bar */}
      <div className="bg-[#142B5D] py-6 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-8 flex flex-wrap justify-around items-center gap-8">
          <div className="flex items-center space-x-3 text-white">
            <BookOpen className="w-5 h-5 text-[#F5AB24]" />
            <span className="font-bold text-sm tracking-wide uppercase">Academic Standards</span>
          </div>
          <div className="flex items-center space-x-3 text-white">
            <Shield className="w-5 h-5 text-[#F5AB24]" />
            <span className="font-bold text-sm tracking-wide uppercase">Secure Operations</span>
          </div>
          <div className="flex items-center space-x-3 text-white">
            <Award className="w-5 h-5 text-[#F5AB24]" />
            <span className="font-bold text-sm tracking-wide uppercase">ISO Certified Systems</span>
          </div>
        </div>
      </div>

      {/* Feature Section */}
      <section className="max-w-7xl mx-auto px-8 py-24 relative">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-[#142B5D] mb-4">Core Operational Modules</h2>
          <div className="w-24 h-1.5 bg-[#F5AB24] mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Card 1 */}
          <div className="bg-white p-10 rounded shadow-lg border-t-4 border-[#142B5D] hover:shadow-2xl transition-all group">
            <div className="w-14 h-14 bg-slate-50 rounded flex items-center justify-center mb-8 group-hover:bg-[#142B5D] transition-colors">
              <Calendar className="w-7 h-7 text-[#142B5D] group-hover:text-white" />
            </div>
            <h3 className="text-2xl font-bold text-[#142B5D] mb-4">Facility Booking</h3>
            <p className="text-slate-600 leading-relaxed font-medium">
              Seamlessly reserve lecture halls, labs, and sports facilities with real-time institutional scheduling and conflict resolution.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-10 rounded shadow-lg border-t-4 border-[#F5AB24] hover:shadow-2xl transition-all group">
            <div className="w-14 h-14 bg-slate-50 rounded flex items-center justify-center mb-8 group-hover:bg-[#F5AB24] transition-colors">
              <Wrench className="w-7 h-7 text-[#142B5D]" />
            </div>
            <h3 className="text-2xl font-bold text-[#142B5D] mb-4">Maintenance Desk</h3>
            <p className="text-slate-600 leading-relaxed font-medium">
              Report and track infrastructure incidents. Our automated ticketing system ensures rapid response from university technical staff.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-10 rounded shadow-lg border-t-4 border-[#142B5D] hover:shadow-2xl transition-all group">
            <div className="w-14 h-14 bg-slate-50 rounded flex items-center justify-center mb-8 group-hover:bg-[#142B5D] transition-colors">
              <BarChart2 className="w-7 h-7 text-[#142B5D] group-hover:text-white" />
            </div>
            <h3 className="text-2xl font-bold text-[#142B5D] mb-4">Operations Hub</h3>
            <p className="text-slate-600 leading-relaxed font-medium">
              Centralized dashboard for administration to monitor campus energy, sustainability, and cross-departmental resource usage.
            </p>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="bg-slate-50 py-24">
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <img 
              src={studentsImg} 
              alt="Students" 
              className="rounded-lg shadow-2xl border-8 border-white"
            />
          </div>
          <div>
            <h2 className="text-4xl font-black text-[#142B5D] mb-8 leading-tight">
              Empowering the Academic Community through <span className="text-[#F5AB24]">Smart Technology</span>.
            </h2>
            <div className="space-y-6">
              {[
                "Enhanced student accessibility to campus resources",
                "Advanced predictive maintenance for safety",
                "Data-driven decisions for sustainable growth",
                "Unified interface for all institutional roles"
              ].map((text, i) => (
                <div key={i} className="flex items-start space-x-4">
                  <div className="mt-1 bg-[#142B5D] rounded-full p-1">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <p className="font-bold text-slate-700">{text}</p>
                </div>
              ))}
            </div>
            <button className="mt-12 px-10 py-4 bg-[#142B5D] text-white font-black rounded hover:bg-[#0D1E40] transition shadow-lg">
              Learn Our Processes
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#142B5D] text-white py-20 px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-16">
          <div className="lg:w-1/3">
            <img src={logo} alt="SLIIT" className="h-16 w-auto mb-8 brightness-0 invert" />
            <p className="text-slate-300 font-medium leading-relaxed">
              FACILITYFLOW is the official operations management platform for the university, dedicated to providing a world-class infrastructure for academic excellence.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-12 lg:w-2/3">
            <div>
              <h4 className="font-black text-[#F5AB24] mb-6 tracking-widest uppercase">Institutional</h4>
              <ul className="space-y-4 text-slate-300 font-bold text-sm">
                <li><a href="#" className="hover:text-white transition">Campus Policy</a></li>
                <li><a href="#" className="hover:text-white transition">Administration</a></li>
                <li><a href="#" className="hover:text-white transition">Sustainability</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-black text-[#F5AB24] mb-6 tracking-widest uppercase">Support</h4>
              <ul className="space-y-4 text-slate-300 font-bold text-sm">
                <li><a href="#" className="hover:text-white transition">ITS Support</a></li>
                <li><a href="#" className="hover:text-white transition">System Status</a></li>
                <li><a href="#" className="hover:text-white transition">Help Documentation</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-black text-[#F5AB24] mb-6 tracking-widest uppercase">Legal</h4>
              <ul className="space-y-4 text-slate-300 font-bold text-sm">
                <li><a href="#" className="hover:text-white transition">Data Privacy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms of Use</a></li>
                <li><a href="#" className="hover:text-white transition">Accessibility</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto border-t border-white/10 mt-16 pt-8 text-center">
          <p className="text-slate-400 text-xs font-black tracking-widest uppercase">
            © 2024 FACILITYFLOW OPERATIONS HUB. ALL RIGHTS RESERVED.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;

