import { Network, MessageSquare, ArrowRight, ShoppingCart, CreditCard, UserCheck } from "lucide-react";
import { motion } from "motion/react";

export function SystemArchitect() {
  const steps = [
    { 
      id: 1, 
      title: "Trigger", 
      desc: "User comments 'SYSTEM' on IG Reel", 
      icon: MessageSquare,
      color: "text-blue-400",
      bg: "bg-blue-400/10",
      border: "border-blue-400/20"
    },
    { 
      id: 2, 
      title: "Automation", 
      desc: "ManyChat sends DM with VSL Link", 
      icon: Network,
      color: "text-purple-400",
      bg: "bg-purple-400/10",
      border: "border-purple-400/20"
    },
    { 
      id: 3, 
      title: "Conversion", 
      desc: "User lands on Whop Checkout", 
      icon: ShoppingCart,
      color: "text-yellow-400",
      bg: "bg-yellow-400/10",
      border: "border-yellow-400/20"
    },
    { 
      id: 4, 
      title: "Fulfillment", 
      desc: "Instant Access + Community Invite", 
      icon: UserCheck,
      color: "text-green-400",
      bg: "bg-green-400/10",
      border: "border-green-400/20"
    },
  ];

  return (
    <div className="p-8 space-y-8 h-full">
      <header>
        <h2 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
          <Network className="text-shadow-accent" />
          System Architect
        </h2>
        <p className="text-shadow-muted mt-2">Visualizing the automated revenue funnel.</p>
      </header>

      <div className="bg-shadow-card border border-shadow-border rounded-xl p-8 min-h-[500px] flex items-center justify-center relative overflow-hidden">
        {/* Background Grid */}
        <div className="absolute inset-0 opacity-10" 
             style={{ 
               backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)', 
               backgroundSize: '20px 20px' 
             }} 
        />

        <div className="relative z-10 flex flex-col md:flex-row items-center gap-4 max-w-5xl w-full">
          {steps.map((step, index) => (
            <div key={step.id} className="contents">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.2 }}
                className={`flex-1 w-full md:w-auto p-6 rounded-xl border ${step.border} ${step.bg} backdrop-blur-sm relative group hover:scale-105 transition-transform duration-300`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-2 rounded-lg bg-black/20 ${step.color}`}>
                    <step.icon size={20} />
                  </div>
                  <h3 className={`font-bold ${step.color}`}>{step.title}</h3>
                </div>
                <p className="text-sm text-shadow-text/80">{step.desc}</p>
                
                {/* Pulse Effect */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl blur-sm" />
              </motion.div>

              {index < steps.length - 1 && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  transition={{ delay: index * 0.2 + 0.1 }}
                  className="hidden md:flex items-center justify-center text-shadow-muted px-2"
                >
                  <ArrowRight size={24} className="animate-pulse" />
                </motion.div>
              )}
              
              {/* Mobile Arrow */}
              {index < steps.length - 1 && (
                <div className="md:hidden py-2 text-shadow-muted">
                  <ArrowRight size={24} className="rotate-90" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-shadow-card border border-shadow-border p-4 rounded-lg">
           <h4 className="text-white font-mono text-sm mb-2">CONVERSION RATE</h4>
           <p className="text-2xl font-bold text-shadow-accent">4.2%</p>
         </div>
         <div className="bg-shadow-card border border-shadow-border p-4 rounded-lg">
           <h4 className="text-white font-mono text-sm mb-2">AVG. ORDER VALUE</h4>
           <p className="text-2xl font-bold text-shadow-accent">$47.00</p>
         </div>
         <div className="bg-shadow-card border border-shadow-border p-4 rounded-lg">
           <h4 className="text-white font-mono text-sm mb-2">SYSTEM HEALTH</h4>
           <p className="text-2xl font-bold text-green-500">OPTIMAL</p>
         </div>
      </div>
    </div>
  );
}
