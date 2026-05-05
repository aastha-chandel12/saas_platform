import React from 'react';
import { motion } from 'framer-motion';
import { UserCheck, FileText, Globe, Palette, Compass, TrendingUp, Plus, ArrowRight } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

const services = [
  {
    id: 'profile-optimization',
    title: 'Profile Optimization',
    icon: <UserCheck size={24} />,
    description: 'Transform your professional presence with a high-impact LinkedIn and social profile makeover.',
    gradient: 'from-blue-500 to-blue-600'
  },
  {
    id: 'ats-resume',
    title: 'ATS Resume',
    icon: <FileText size={24} />,
    description: 'Get a professional, recruiter-ready resume designed to pass Applicant Tracking Systems with ease.',
    gradient: 'from-emerald-500 to-emerald-600'
  },
  {
    id: 'website-development',
    title: 'Website Development',
    icon: <Globe size={24} />,
    description: 'Custom, high-performance websites built with modern technologies to elevate your brand.',
    gradient: 'from-indigo-500 to-indigo-600'
  },
  {
    id: 'portfolio-creation',
    title: 'Portfolio Creation',
    icon: <Palette size={24} />,
    description: 'Showcase your best work with a stunning digital portfolio that leaves a lasting impression.',
    gradient: 'from-purple-500 to-purple-600'
  },
  {
    id: 'career-guidance',
    title: 'Career Guidance',
    icon: <Compass size={24} />,
    description: 'Expert mentorship and strategic advice to help you navigate your career path and land dream roles.',
    gradient: 'from-amber-500 to-amber-600'
  },
  {
    id: 'social-growth',
    title: 'Social Growth Strategy',
    icon: <TrendingUp size={24} />,
    description: 'Data-driven strategies to expand your reach, build authority, and grow your personal brand online.',
    gradient: 'from-rose-500 to-rose-600'
  },
  {
    id: 'other',
    title: 'Other',
    icon: <Plus size={24} />,
    description: 'Have a unique requirement? Tell us what you need and we\'ll find the right solution for you.',
    gradient: 'from-slate-500 to-slate-600'
  }
];

const Services = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto py-12 md:py-16 px-4">
      <div className="text-center mb-16 space-y-4">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-4xl font-bold text-slate-800 tracking-tight"
        >
          Professional Services Catalog
        </motion.h1>
        <p className="text-slate-500 font-medium text-lg max-w-2xl mx-auto">
          Choose from our curated list of expert career services designed to accelerate your growth.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service, index) => (
          <motion.div
            key={service.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden"
          >
            <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${service.gradient} opacity-[0.03] group-hover:opacity-[0.08] transition-opacity`} />
            
            <div className="relative z-10">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${service.gradient} text-white flex items-center justify-center mb-6 shadow-sm`}>
                {service.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">{service.title}</h3>
              <p className="text-slate-500 font-medium text-sm leading-relaxed mb-8">
                {service.description}
              </p>
              <button 
                onClick={() => navigate(`/request-service?type=${encodeURIComponent(service.title)}`)}
                className="w-full py-3 px-4 bg-slate-50 text-slate-700 rounded-xl font-bold text-sm hover:bg-indigo-600 hover:text-white transition-all flex items-center justify-center gap-2 group/btn"
              >
                Request Service <ArrowRight size={16} className="transition-transform group-hover/btn:translate-x-1" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-24 p-10 bg-slate-900 rounded-2xl text-center text-white shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -ml-32 -mb-32" />
        
        <div className="relative z-10">
          <h2 className="text-2xl font-bold mb-4">Can't find what you're looking for?</h2>
          <p className="text-slate-400 font-medium mb-8 max-w-xl mx-auto">
            Contact our support team directly for specialized requests or immediate assistance.
          </p>
          <Link
            to="/feedback"
            className="inline-flex px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-md active:scale-95"
          >
            Send us Feedback
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Services;
