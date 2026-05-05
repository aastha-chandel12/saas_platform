import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, Globe, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="relative pt-12 md:pt-20 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex-1 space-y-6 text-center md:text-left"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold uppercase tracking-wider">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
                </span>
                Next-Gen Career Solutions
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-800 leading-[1.1] tracking-tight">
                Unlock Your Professional <br /> 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Potential with Servicely</span>
              </h1>
              <p className="text-lg text-slate-500 font-medium max-w-xl mx-auto md:mx-0 leading-relaxed">
                Empowering career growth through expert ATS resume building, portfolio creation, and strategic career guidance.
              </p>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-4">
                <button 
                  onClick={() => navigate('/services')}
                  className="px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100 flex items-center gap-3 active:scale-95"
                >
                  Explore Services <ArrowRight size={20} />
                </button>
                <button className="px-8 py-4 bg-white text-slate-700 rounded-xl font-bold text-lg hover:bg-slate-50 transition-all border border-slate-100 active:scale-95">
                  How it Works
                </button>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex-1 relative"
            >
              <div className="relative z-10 rounded-2xl overflow-hidden shadow-xl border border-slate-100">
                <img 
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800" 
                  alt="Team working" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-purple-100 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob" />
              <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-indigo-100 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob animation-delay-2000" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-10">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-slate-800">Our Expertise</h2>
              <p className="text-slate-500 font-medium">Specialized solutions tailored to your professional journey.</p>
            </div>
            <button 
              onClick={() => navigate('/services')}
              className="text-indigo-600 font-bold flex items-center gap-2 hover:gap-3 transition-all"
            >
              View all services <ArrowRight size={18} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard 
              icon={<Zap className="text-amber-500" />}
              title="ATS Resume"
              desc="Optimized resumes that pass automated screening with flying colors."
              color="amber"
            />
            <FeatureCard 
              icon={<Globe className="text-indigo-500" />}
              title="Portfolio Creation"
              desc="Showcase your best work with stunning, responsive personal websites."
              color="indigo"
            />
            <FeatureCard 
              icon={<Target className="text-rose-500" />}
              title="Career Guidance"
              desc="1-on-1 mentorship to navigate your path to professional success."
              color="rose"
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-4">
        <div className="max-w-7xl mx-auto bg-slate-900 rounded-2xl p-8 md:p-12 text-center">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatItem label="Happy Clients" value="2k+" />
            <StatItem label="Expert Mentors" value="50+" />
            <StatItem label="Success Rate" value="98%" />
            <StatItem label="Services" value="15+" />
          </div>
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc, color }: any) => (
  <div className="group bg-white p-6 rounded-2xl border border-slate-100 hover:border-indigo-100 hover:shadow-md transition-all duration-300">
    <div className={`w-12 h-12 rounded-xl bg-${color}-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
      {React.cloneElement(icon, { size: 24 })}
    </div>
    <h3 className="text-xl font-bold text-slate-800 mb-2">{title}</h3>
    <p className="text-slate-500 font-medium text-sm leading-relaxed">{desc}</p>
  </div>
);

const StatItem = ({ label, value }: any) => (
  <div className="space-y-1">
    <div className="text-3xl font-bold text-white">{value}</div>
    <div className="text-slate-400 text-xs font-bold uppercase tracking-widest">{label}</div>
  </div>
);

export default Home;
