// import Link from "next/link";
// import StarBackground from "@/components/StarBackground";

// export default function HomePage() {
//   return (
//     <div className="relative w-full min-h-screen overflow-x-hidden bg-zinc-50 dark:bg-black font-sans selection:bg-zinc-300 dark:selection:bg-zinc-700">

//       <StarBackground />
//       {/* Abstract Background Glow (Top) */}
//       <div className="absolute top-0 inset-x-0 h-[500px] pointer-events-none opacity-40 dark:opacity-20">
//         <div className="absolute -top-[100px] -left-[10%] w-[120%] h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-300 via-transparent to-transparent dark:from-zinc-800"></div>
//       </div>

//       {/* Navigation Bar */}
//       <header className="sticky top-0 z-50 w-full border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/50 dark:bg-black/50 backdrop-blur-md">
//         <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
//           <div className="flex items-center gap-2">
//             <svg className="w-7 h-7 text-black dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
//             </svg>
//             <span className="text-xl font-bold tracking-tight text-black dark:text-white">CodeAtlas</span>
//           </div>
//           <nav className="flex items-center gap-4">
//             <Link href="/signin" className="text-sm font-medium text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-white transition-colors">
//               Log in
//             </Link>
//             <Link href="/signup" className="text-sm font-medium bg-black text-white dark:bg-white dark:text-black px-4 py-2 rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors shadow-sm">
//               Sign up
//             </Link>
//           </nav>
//         </div>
//       </header>

//       <main className="relative z-10">

//         {/* HERO SECTION */}
//         <section className="max-w-7xl mx-auto px-6 pt-24 pb-20 flex flex-col items-center text-center">
//           <div className="inline-flex items-center rounded-full border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 px-3 py-1 text-sm font-medium text-zinc-800 dark:text-zinc-200 backdrop-blur-sm mb-8">
//             <span className="flex h-2 w-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
//             Now Supporting LeetCode, Codeforces, CodeChef, GFG, InterviewBit, AtCoder & GitHub
//           </div>

//           <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-black dark:text-white max-w-4xl leading-tight mb-6">
//             Unify your developer <br className="hidden md:block" /> identity in one place.
//           </h1>

//           <p className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mb-10">
//             Stop jumping between tabs. Connect your coding platforms to build a comprehensive portfolio, track your problem-solving progress, and analyze your global ranking via interactive heatmaps.
//           </p>

//           <div className="flex flex-col sm:flex-row gap-4">
//             <Link href="/signup" className="flex items-center justify-center gap-2 bg-black text-white dark:bg-white dark:text-black px-8 py-3.5 rounded-xl text-lg font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
//               Get Started for Free
//               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
//             </Link>
//             <a href="#demo" className="flex items-center justify-center px-8 py-3.5 rounded-xl text-lg font-medium border border-zinc-300 dark:border-zinc-700 text-black dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all">
//               View Live Demo
//             </a>
//           </div>
//         </section>

//         {/* ENHANCED DASHBOARD PREVIEW */}
//         <section id="demo" className="max-w-6xl mx-auto px-6 pb-32 flex flex-col items-center">
//           <div className="text-center mb-10">
//             <h2 className="text-3xl font-bold text-black dark:text-white mb-3">See your progress like never before</h2>
//             <p className="text-zinc-500 max-w-xl mx-auto">A unified interface pulling real-time data from across the developer ecosystem.</p>
//           </div>

//           <div className="w-full relative group">
//             {/* Blur Glow Effect behind the component */}
//             <div className="absolute -inset-2 bg-gradient-to-r from-zinc-200 via-zinc-100 to-zinc-300 dark:from-zinc-800 dark:via-zinc-900 dark:to-zinc-700 rounded-[2rem] blur-2xl opacity-50 group-hover:opacity-70 transition-opacity duration-500"></div>

//             <div className="relative rounded-2xl border border-white/40 dark:border-zinc-700/50 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl shadow-2xl overflow-hidden p-6 md:p-10 flex flex-col md:flex-row gap-8 text-left">

//               {/* Left side: Stats */}
//               <div className="flex-1 space-y-6 relative">
//                 <div>
//                   <h3 className="text-xl font-bold text-black dark:text-white flex items-center gap-2">
//                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>
//                     Aggregated Stats
//                   </h3>
//                   <p className="text-sm text-zinc-500">Your combined problem-solving journey.</p>
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="relative bg-white/50 dark:bg-black/50 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-600 transition-colors">
//                     <div className="absolute -top-3 -right-2 bg-black dark:bg-white text-white dark:text-black text-[10px] px-2 py-0.5 rounded-full font-medium shadow-sm">Total Problems Solved</div>
//                     <div className="text-sm font-medium text-zinc-500 mb-1">Total Solved</div>
//                     <div className="text-3xl font-bold text-black dark:text-white">1,482</div>
//                     <div className="text-xs text-green-600 dark:text-green-400 mt-1 flex items-center">
//                       <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path></svg>
//                       Top 2% globally
//                     </div>
//                   </div>
//                   <div className="bg-white/50 dark:bg-black/50 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800">
//                     <div className="text-sm font-medium text-zinc-500 mb-1">Highest Rating</div>
//                     <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">2140</div>
//                     <div className="text-xs text-zinc-500 mt-1">Codeforces (Candidate Master)</div>
//                   </div>
//                 </div>

//                 {/* Simulated Heatmap */}
//                 <div className="relative bg-white/50 dark:bg-black/50 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800">
//                   <div className="absolute -top-3 right-4 bg-black dark:bg-white text-white dark:text-black text-[10px] px-2 py-0.5 rounded-full font-medium shadow-sm z-10">Daily consistency</div>
//                   <div className="text-sm font-medium text-zinc-500 mb-3">Activity Heatmap</div>
//                   <div className="flex gap-1 overflow-hidden">
//                     {Array.from({ length: 30 }).map((_, colIndex) => (
//                       <div key={colIndex} className="flex flex-col gap-1">
//                         {Array.from({ length: 5 }).map((_, rowIndex) => {
//                           const levels = ['bg-zinc-200 dark:bg-zinc-800', 'bg-green-200 dark:bg-green-900/50', 'bg-green-400 dark:bg-green-700/80', 'bg-green-500 dark:bg-green-500'];
//                           const randomLevel = levels[Math.floor(Math.random() * levels.length)];
//                           return <div key={rowIndex} className={`w-3 h-3 rounded-sm ${randomLevel} hover:scale-125 transition-transform`}></div>;
//                         })}
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>

//               {/* Right side: Chart Simulation */}
//               <div className="flex-1 flex flex-col justify-between">
//                 <div className="relative bg-white/50 dark:bg-black/50 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 h-full flex flex-col hover:border-zinc-300 dark:hover:border-zinc-600 transition-colors">
//                   <div className="absolute -top-3 left-4 bg-black dark:bg-white text-white dark:text-black text-[10px] px-2 py-0.5 rounded-full font-medium shadow-sm">Rating growth over time</div>
//                   <div className="text-sm font-medium text-zinc-500 mb-6 mt-2">Platform Performance</div>

//                   <div className="flex-1 flex items-end justify-between gap-2 px-2 pb-2 h-32 border-b border-zinc-300 dark:border-zinc-700">
//                     <div className="w-full bg-zinc-200 dark:bg-zinc-800 rounded-t-sm h-[30%] hover:bg-zinc-400 dark:hover:bg-zinc-600 transition-colors relative group"><div className="absolute -top-7 left-1/2 -translate-x-1/2 hidden group-hover:block text-xs bg-black text-white px-2 py-1 rounded">1200</div></div>
//                     <div className="w-full bg-zinc-200 dark:bg-zinc-800 rounded-t-sm h-[45%] hover:bg-zinc-400 dark:hover:bg-zinc-600 transition-colors"></div>
//                     <div className="w-full bg-zinc-200 dark:bg-zinc-800 rounded-t-sm h-[40%] hover:bg-zinc-400 dark:hover:bg-zinc-600 transition-colors"></div>
//                     <div className="w-full bg-blue-500 dark:bg-blue-500 rounded-t-sm h-[65%] shadow-[0_0_15px_rgba(59,130,246,0.5)] relative group"><div className="absolute -top-7 left-1/2 -translate-x-1/2 hidden group-hover:block text-xs bg-black text-white px-2 py-1 rounded">1850</div></div>
//                     <div className="w-full bg-zinc-200 dark:bg-zinc-800 rounded-t-sm h-[60%] hover:bg-zinc-400 dark:hover:bg-zinc-600 transition-colors"></div>
//                     <div className="w-full bg-zinc-200 dark:bg-zinc-800 rounded-t-sm h-[75%] hover:bg-zinc-400 dark:hover:bg-zinc-600 transition-colors"></div>
//                     <div className="w-full bg-zinc-200 dark:bg-zinc-800 rounded-t-sm h-[80%] hover:bg-zinc-400 dark:hover:bg-zinc-600 transition-colors"></div>
//                     <div className="w-full bg-black dark:bg-white rounded-t-sm h-[100%] relative group"><div className="absolute -top-7 left-1/2 -translate-x-1/2 hidden group-hover:block text-xs bg-black text-white px-2 py-1 rounded">2140</div></div>
//                   </div>
//                   <div className="flex justify-between mt-2 text-[10px] text-zinc-400 font-mono">
//                     <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span>
//                   </div>
//                 </div>
//               </div>

//             </div>
//           </div>
//         </section>

//         {/* FEATURES SECTION */}
//         <section className="py-24 bg-zinc-100/50 dark:bg-zinc-900/20 border-y border-zinc-200/50 dark:border-zinc-800/50">
//           <div className="max-w-7xl mx-auto px-6">
//             <div className="text-center mb-16">
//               <h2 className="text-3xl md:text-4xl font-bold text-black dark:text-white">Everything you need to track your coding journey</h2>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {[
//                 { title: "Unified Coding Profile", desc: "Connect LeetCode, Codeforces, and GitHub. View everything in one single place.", icon: <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z" /> },
//                 { title: "Aggregated Stats Dashboard", desc: "Get a bird's-eye view of your total problems solved across all platforms.", icon: <path d="M3 3v18h18 M18 17V9 M13 17V5 M8 17v-3" /> },
//                 { title: "Global Ranking Insights", desc: "See where you stand globally. Track your percentile and rating classifications.", icon: <path d="M2 20h.01 M7 20v-4 M12 20v-8 M17 20V8 M22 4v16" /> },
//                 { title: "Activity Heatmaps", desc: "Visualize your daily coding habits to ensure you maintain your problem-solving streak.", icon: <><rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><path d="M3 9h18 M9 21V9" /></> },
//                 { title: "Rating & Progress Tracking", desc: "Monitor your upsolves, contest performances, and historical rating graphs over time.", icon: <path d="m22 8-6 4-6-4-6 4 M22 8v10 M16 12v6 M10 8v10 M4 12v6" /> },
//                 { title: "Portfolio Sharing", desc: "Generate a clean, public URL to share your coding achievements with recruiters.", icon: <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M17 8l-5-5-5 5 M12 3v12" /> },
//               ].map((feature, i) => (
//                 <div key={i} className="group bg-white/60 dark:bg-zinc-900/60 backdrop-blur-sm border border-zinc-200 dark:border-zinc-800 p-8 rounded-2xl hover:-translate-y-1 hover:shadow-xl dark:hover:shadow-zinc-900/50 transition-all duration-300">
//                   <div className="w-12 h-12 bg-black/5 dark:bg-white/10 rounded-xl flex items-center justify-center mb-6 text-black dark:text-white group-hover:scale-110 transition-transform">
//                     <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                       {feature.icon}
//                     </svg>
//                   </div>
//                   <h3 className="text-xl font-bold text-black dark:text-white mb-2">{feature.title}</h3>
//                   <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">{feature.desc}</p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </section>

//         {/* HOW IT WORKS SECTION */}
//         <section className="py-24 max-w-7xl mx-auto px-6">
//           <div className="text-center mb-16">
//             <h2 className="text-3xl md:text-4xl font-bold text-black dark:text-white">How CodeAtlas Works</h2>
//           </div>

//           <div className="relative flex flex-col md:flex-row justify-between items-start gap-12 md:gap-6">
//             {/* Connecting Line (Desktop) */}
//             <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-transparent via-zinc-300 dark:via-zinc-700 to-transparent"></div>

//             {[
//               { num: "01", title: "Connect Platforms", desc: "Link your GitHub, LeetCode, Codeforces, CodeChef, GFG, InterviewBit, Atcoder handles." },
//               { num: "02", title: "We Aggregate Data", desc: "Our engine fetches your latest submissions, ratings, and repositories securely in the background." },
//               { num: "03", title: "View Insights", desc: "Access your unified dashboard, track your growth, and share your public developer portfolio." }
//             ].map((step, i) => (
//               <div key={i} className="relative flex-1 text-center group w-full">
//                 <div className="w-24 h-24 mx-auto bg-zinc-50 dark:bg-black border-2 border-zinc-200 dark:border-zinc-800 rounded-full flex items-center justify-center mb-6 relative z-10 group-hover:border-black dark:group-hover:border-white transition-colors">
//                   <span className="text-2xl font-bold text-zinc-400 dark:text-zinc-500 group-hover:text-black dark:group-hover:text-white transition-colors">{step.num}</span>
//                 </div>
//                 <h3 className="text-xl font-bold text-black dark:text-white mb-2">{step.title}</h3>
//                 <p className="text-zinc-600 dark:text-zinc-400 text-sm max-w-xs mx-auto">{step.desc}</p>
//               </div>
//             ))}
//           </div>
//         </section>

//         {/* WHO IS IT FOR SECTION */}
//         <section className="py-24 bg-zinc-100/50 dark:bg-zinc-900/20 border-y border-zinc-200/50 dark:border-zinc-800/50">
//           <div className="max-w-5xl mx-auto px-6">
//             <div className="text-center mb-12">
//               <h2 className="text-3xl font-bold text-black dark:text-white mb-4">Who is CodeAtlas for?</h2>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//               {[
//                 { title: "Competitive Programmers", desc: "Track contest ratings, upsolves, and global percentile.", icon: "M13 2L3 14h9l-1 8 10-12h-9l1-8z" },
//                 { title: "Interview Prep Students", desc: "Ensure daily consistency with easy/medium/hard metrics.", icon: "M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" },
//                 { title: "Portfolio Builders", desc: "Showcase open-source contributions and projects instantly.", icon: "M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" }
//               ].map((audience, i) => (
//                 <div key={i} className="bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 p-6 rounded-xl hover:-translate-y-1 hover:shadow-md transition-all text-center">
//                   <div className="w-10 h-10 mx-auto bg-black dark:bg-white text-white dark:text-black rounded-full flex items-center justify-center mb-4">
//                     <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                       <path d={audience.icon} />
//                     </svg>
//                   </div>
//                   <h3 className="text-lg font-bold text-black dark:text-white mb-1">{audience.title}</h3>
//                   <p className="text-sm text-zinc-500">{audience.desc}</p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </section>

//         {/* WHY CODEATLAS SECTION */}
//         <section className="py-24 max-w-4xl mx-auto px-6 text-center">
//           <h2 className="text-3xl font-bold text-black dark:text-white mb-10">Why CodeAtlas?</h2>
//           <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
//             <div>
//               <h4 className="text-lg font-semibold text-black dark:text-white mb-2">No more tab switching</h4>
//               <p className="text-sm text-zinc-500">View LeetCode heatmaps and Codeforces ratings on one screen.</p>
//             </div>
//             <div>
//               <h4 className="text-lg font-semibold text-black dark:text-white mb-2">Data-driven insights</h4>
//               <p className="text-sm text-zinc-500">Analyze your weak topics and track your growth trajectory natively.</p>
//             </div>
//             <div>
//               <h4 className="text-lg font-semibold text-black dark:text-white mb-2">Built for the serious</h4>
//               <p className="text-sm text-zinc-500">Minimal UI, lightning fast data fetching, and dark mode by default.</p>
//             </div>
//           </div>
//         </section>

//         {/* CTA SECTION */}
//         <section className="py-32 px-6 relative overflow-hidden">
//           <div className="absolute inset-0 bg-zinc-50 dark:bg-zinc-950/50"></div>
//           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-[300px] bg-gradient-to-r from-zinc-300 via-transparent to-zinc-300 dark:from-zinc-800 dark:via-transparent dark:to-zinc-800 blur-3xl opacity-50 rounded-full pointer-events-none"></div>

//           <div className="relative z-10 max-w-3xl mx-auto text-center">
//             <h2 className="text-4xl md:text-5xl font-extrabold text-black dark:text-white mb-6">Start building your coding identity today</h2>
//             <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-10">Join thousands of developers tracking their progress and showcasing their skills.</p>
//             <div className="flex flex-col sm:flex-row justify-center gap-4">
//               <Link href="/signup" className="bg-black text-white dark:bg-white dark:text-black px-8 py-4 rounded-xl text-lg font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
//                 Get Started Now
//               </Link>
//               <a href="#demo" className="px-8 py-4 rounded-xl text-lg font-medium border border-zinc-300 dark:border-zinc-700 text-black dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all bg-white/50 dark:bg-black/50 backdrop-blur-sm">
//                 View Live Demo
//               </a>
//             </div>
//           </div>
//         </section>

//       </main>

//       {/* FOOTER */}
//       <footer className="bg-black text-zinc-400 py-12 border-t border-zinc-800">
//         <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
//           {/* Col 1 */}
//           <div className="md:col-span-1">
//             <div className="flex items-center gap-2 mb-4">
//               <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
//               </svg>
//               <span className="text-xl font-bold text-white tracking-tight">CodeAtlas</span>
//             </div>
//             <p className="text-sm text-zinc-500">
//               CodeAtlas helps developers unify and track their coding journey seamlessly across platforms.
//             </p>
//           </div>

//           {/* Col 2 */}
//           <div>
//             <h4 className="text-white font-semibold mb-4">Product</h4>
//             <ul className="space-y-2 text-sm">
//               <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
//               <li><a href="#demo" className="hover:text-white transition-colors">Live Demo</a></li>
//               <li><a href="#" className="hover:text-white transition-colors">Pricing <span className="text-[10px] bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded ml-1">Soon</span></a></li>
//             </ul>
//           </div>

//           {/* Col 3 */}
//           <div>
//             <h4 className="text-white font-semibold mb-4">Company</h4>
//             <ul className="space-y-2 text-sm">
//               <li><a href="#" className="hover:text-white transition-colors">About</a></li>
//               <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
//               <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
//             </ul>
//           </div>

//           {/* Col 4 */}
//           <div>
//             <h4 className="text-white font-semibold mb-4">Resources</h4>
//             <ul className="space-y-2 text-sm">
//               <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
//               <li><a href="#" className="hover:text-white transition-colors flex items-center gap-2">
//                 GitHub
//                 <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
//               </a></li>
//               <li><a href="#" className="hover:text-white transition-colors flex items-center gap-2">
//                 LinkedIn
//               </a></li>
//             </ul>
//           </div>
//         </div>

//         <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-zinc-800/50 flex flex-col md:flex-row justify-between items-center text-xs text-zinc-600">
//           <p>© 2026 CodeAtlas. All rights reserved.</p>
//           <div className="mt-4 md:mt-0 flex gap-4">
//             <a href="#" className="hover:text-zinc-400">Terms of Service</a>
//             <a href="#" className="hover:text-zinc-400">Security</a>
//           </div>
//         </div>
//       </footer>

//     </div>
//   );
// }

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import StarBackground from "@/components/StarBackground";
import { Badge } from "@/components/ui/badge";
import { 
  Sun, 
  Moon, 
  ArrowRight, 
  Terminal, 
  Code, 
  TrendingUp, 
  Calendar, 
  Share2, 
  Layers, 
  ExternalLink,
  ChevronRight
} from "lucide-react";
import { FaGithub } from "react-icons/fa";

export default function HomePage() {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [isDarkMode]);

  return (
    <div className="relative w-full min-h-screen overflow-x-hidden bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 font-sans selection:bg-emerald-500/30 selection:text-emerald-900 dark:selection:text-emerald-200 transition-colors duration-300">
      <StarBackground />
      
      {/* Background Lighting */}
      <div className="pointer-events-none absolute top-0 left-0 right-0 h-[600px] overflow-hidden">
        <div className="absolute top-[-300px] left-[15%] w-[700px] h-[700px] rounded-full bg-emerald-500/5 dark:bg-emerald-500/10 blur-[150px]" />
        <div className="absolute top-[-250px] right-[5%] w-[600px] h-[600px] rounded-full bg-blue-500/5 dark:bg-blue-500/10 blur-[130px]" />
      </div>

      {/* Navigation Bar */}
      <header className="sticky top-0 z-50 w-full border-b border-zinc-200/60 dark:border-zinc-900 bg-white/60 dark:bg-zinc-950/40 backdrop-blur-md transition-colors duration-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white dark:text-zinc-950 font-bold shadow-md shadow-emerald-500/10 dark:shadow-emerald-500/20">
              <Layers className="h-4 w-4" />
            </div>
            <span className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">CodeAtlas</span>
          </div>

          <nav className="flex items-center gap-3">
            

            <Link href="/signin" className="text-sm font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white px-3 py-2 transition-colors">
              Log in
            </Link>
            <Link href="/signup" className="text-sm font-bold bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 px-4 h-9 flex items-center rounded-xl hover:bg-zinc-800 dark:hover:bg-zinc-200 transition shadow-md">
              Sign up
            </Link>
          </nav>
        </div>
      </header>

      <main className="relative z-10">

        {/* HERO SECTION */}
        <section className="max-w-7xl mx-auto px-6 pt-20 pb-16 flex flex-col items-center text-center">
          <div className="inline-flex items-center rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 px-4 py-1.5 text-xs font-bold tracking-wide text-zinc-500 dark:text-zinc-400 backdrop-blur-sm mb-8 shadow-sm uppercase">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 mr-2.5 animate-pulse shadow-lg shadow-emerald-500/50"></span>
            All your coding profiles, synced in real-time
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-zinc-900 dark:text-white max-w-4xl leading-[1.1] mb-6">
            Your entire developer <br className="hidden md:block" /> portfolio in one place.
          </h1>

          <p className="text-base sm:text-lg text-zinc-500 dark:text-zinc-400 max-w-2xl mb-10 leading-relaxed font-medium">
            Stop switching between different tabs. Connect your coding accounts to automatically combine your solved problems, follow your rankings, and see your global progress on interactive calendars.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 min-w-[280px] sm:min-w-0">
            <Link href="/signup" className="flex items-center justify-center gap-2 bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 px-6 py-3.5 rounded-xl text-base font-bold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition shadow-lg hover:shadow-xl hover:-translate-y-0.5 group">
              Create Your Free Profile
              <ArrowRight className="w-4 h-4 text-emerald-500 dark:text-emerald-600 transition-transform group-hover:translate-x-1" />
            </Link>
            <a href="#demo" className="flex items-center justify-center px-6 py-3.5 rounded-xl text-base font-bold border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 bg-white/40 dark:bg-zinc-900/30 hover:bg-zinc-100 dark:hover:bg-zinc-900/60 transition shadow-sm">
              See Live Example
            </a>
          </div>
        </section>

        {/* INTERACTIVE DASHBOARD PREVIEW DEMO */}
        <section id="demo" className="max-w-6xl mx-auto px-6 pb-24 flex flex-col items-center">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-900 dark:text-white mb-3">Dashboard Preview</h2>
            <p className="text-xs md:text-sm font-semibold text-zinc-400 dark:text-zinc-500 max-w-xl mx-auto uppercase tracking-wider">A quick look at how your combined metrics will show up</p>
          </div>

          <div className="w-full relative group">
            <div className="absolute -inset-1.5 bg-gradient-to-r from-zinc-200 via-zinc-100 to-zinc-300 dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-800 rounded-[2rem] blur-2xl opacity-40 group-hover:opacity-60 transition duration-500"></div>

            <div className="relative rounded-3xl border border-zinc-200 dark:border-zinc-900 bg-white dark:bg-zinc-950/40 backdrop-blur-xl shadow-2xl overflow-hidden p-6 md:p-8 flex flex-col md:flex-row gap-6 text-left border-t-2 border-t-emerald-500 dark:border-t-emerald-500">

              {/* Left Panel: Combined Stats */}
              <div className="flex-1 space-y-5 relative">
                <div className="border-b border-zinc-100 dark:border-zinc-900 pb-3">
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2 uppercase tracking-wider">
                    <Terminal className="w-4 h-4 text-emerald-600 dark:text-emerald-500" />
                    Overall Statistics
                  </h3>
                  <p className="text-[11px] font-semibold text-zinc-400 dark:text-zinc-500 mt-0.5">Your lifetime coding milestones, automatically grouped together.</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="relative bg-zinc-50/50 dark:bg-zinc-950/40 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-800 transition duration-200 border-l-2 border-l-emerald-500">
                    <span className="absolute top-3 right-3 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 text-[9px] px-1.5 py-0.5 rounded font-bold tracking-wide uppercase">Live</span>
                    <div className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-1">Total Solved Problems</div>
                    <div className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">1,482</div>
                    <div className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 mt-2 flex items-center tracking-wide uppercase">
                      Top 2% of Global Users
                    </div>
                  </div>
                  
                  <div className="bg-zinc-50/50 dark:bg-zinc-950/40 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-800 transition duration-200 border-l-2 border-l-blue-500">
                    <div className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-1">Highest Platform Rating</div>
                    <div className="text-3xl font-extrabold tracking-tight text-blue-600 dark:text-blue-400">2140</div>
                    <div className="text-[10px] font-bold text-zinc-500 mt-2 truncate uppercase tracking-wider">Candidate Master on Codeforces</div>
                  </div>
                </div>

                {/* Simulated Heatmap */}
                <div className="relative bg-zinc-50/50 dark:bg-zinc-950/40 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800">
                  <div className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-3">Daily Consistency Calendar</div>
                  <div className="flex gap-1.5 overflow-hidden pb-1">
                    {Array.from({ length: 28 }).map((col, colIndex) => (
                      <div key={colIndex} className="flex flex-col gap-1.5 shrink-0">
                        {Array.from({ length: 5 }).map((row, rowIndex) => {
                          const levels = [
                            'bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/40 dark:border-transparent', 
                            'bg-emerald-100 dark:bg-emerald-950 border border-emerald-200/20 dark:border-emerald-900/10', 
                            'bg-emerald-300 dark:bg-emerald-800', 
                            'bg-emerald-500 dark:bg-emerald-500'
                          ];
                          const targetWeight = (colIndex + rowIndex) % 4;
                          return <div key={rowIndex} className={`w-3 h-3 rounded-[3px] ${levels[targetWeight]} transition duration-200 hover:scale-125`} />;
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Simulated Right Panel: Analytics Chart */}
              <div className="flex-1 flex flex-col justify-between">
                <div className="relative bg-zinc-50/50 dark:bg-zinc-950/40 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-900 h-full flex flex-col hover:border-zinc-300 dark:hover:border-zinc-800 transition duration-200 border-l-2 border-l-indigo-500">
                  <div className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-6 mt-1">Rating Growth Over Time</div>

                  <div className="flex-1 flex items-end justify-between gap-2 px-1 pb-2 h-36 border-b border-zinc-200 dark:border-zinc-900">
                    {[
                      { h: "h-[30%]", val: "1200", act: false },
                      { h: "h-[45%]", val: "1420", act: false },
                      { h: "h-[40%]", val: "1390", act: false },
                      { h: "h-[65%]", val: "1850", act: true },
                      { h: "h-[60%]", val: "1710", act: false },
                      { h: "h-[75%]", val: "1980", act: false },
                      { h: "h-[80%]", val: "2010", act: false },
                      { h: "h-[100%]", val: "2140", act: false }
                    ].map((bar, barIdx) => (
                      <div 
                        key={barIdx} 
                        className={`w-full rounded-t-[3px] transition duration-300 relative group cursor-pointer ${
                          bar.act 
                            ? "bg-gradient-to-t from-blue-600 to-blue-500 dark:from-blue-500 dark:to-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.3)]" 
                            : "bg-zinc-200 dark:bg-zinc-900 hover:bg-zinc-300 dark:hover:bg-zinc-800"
                        } ${bar.h}`}
                      >
                        <div className="absolute -top-7 left-1/2 -translate-x-1/2 hidden group-hover:block text-[10px] font-bold bg-zinc-900 text-white px-1.5 py-0.5 rounded border border-zinc-800 shadow-xl z-20">
                          {bar.val}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between mt-2.5 text-[10px] font-bold font-mono text-zinc-400 dark:text-zinc-600 tracking-wider uppercase px-1">
                    <span>Month 1</span><span>Month 2</span><span>Month 3</span><span>Latest</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* CORE FEATURES GRID */}
        <section className="py-20 bg-zinc-100/60 dark:bg-zinc-900/20 border-y border-zinc-200/50 dark:border-zinc-900">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white">Everything You Need to Track Progress</h2>
              <p className="text-xs md:text-sm font-semibold text-zinc-400 dark:text-zinc-500 max-w-xl mx-auto uppercase tracking-wider mt-2">Built to help you stay motivated and monitor your achievements.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { title: "All-in-One Profile", desc: "Link LeetCode, Codeforces, GitHub, and more to look at your entire online presence in a single unified view.", icon: <Code className="h-5 w-5" />, accent: "group-hover:text-emerald-500" },
                { title: "Combined Statistics", desc: "See the total number of problems you have solved across all your profiles with auto-updating counters.", icon: <Terminal className="h-5 w-5" />, accent: "group-hover:text-teal-500" },
                { title: "Global Ranking Insights", desc: "Find out exactly where you stand globally. Track your skill badges, percentiles, and contest rankings.", icon: <TrendingUp className="h-5 w-5" />, accent: "group-hover:text-cyan-500" },
                { title: "Visual Heatmaps", desc: "Keep track of your coding streaks. View nicely organized monthly calendar grids for all active profiles.", icon: <Calendar className="h-5 w-5" />, accent: "group-hover:text-blue-500" },
                { title: "Progress History Graphs", desc: "Look back at your historical contest performances, past ratings, and growth milestones over any timeline.", icon: <Layers className="h-5 w-5" />, accent: "group-hover:text-indigo-500" },
                { title: "Easy Profile Sharing", desc: "Create and export beautiful, simplified portfolio cards to showcase your verified statistics to peers or recruiters.", icon: <Share2 className="h-5 w-5" />, accent: "group-hover:text-purple-500" },
              ].map((feature, i) => (
                <div key={i} className="group bg-white dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-900 p-6 rounded-2xl hover:border-zinc-300 dark:hover:border-zinc-800 hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
                  <div>
                    <div className="w-10 h-10 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/60 rounded-xl flex items-center justify-center mb-5 text-zinc-500 dark:text-zinc-400 group-hover:scale-110 transition-transform">
                      <span className={`transition-colors duration-200 ${feature.accent}`}>{feature.icon}</span>
                    </div>
                    <h3 className="text-base font-bold text-zinc-900 dark:text-white mb-2 tracking-tight">{feature.title}</h3>
                    <p className="text-zinc-500 dark:text-zinc-400 text-xs font-medium leading-relaxed">{feature.desc}</p>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-600 mt-5 opacity-0 group-hover:opacity-100 transition-opacity">
                    Learn More <ChevronRight className="h-3 w-3" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS SECTION */}
        <section className="py-24 max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">How CodeAtlas Works</h2>
            <p className="text-xs md:text-sm font-semibold text-zinc-400 dark:text-zinc-500 max-w-xl mx-auto uppercase tracking-wider mt-2">Get your profile synchronized in three easy steps</p>
          </div>

          <div className="relative flex flex-col md:flex-row justify-between items-start gap-8 md:gap-4">
            <div className="hidden md:block absolute top-10 left-[12%] right-[12%] h-[1px] bg-gradient-to-r from-transparent via-zinc-200 dark:via-zinc-900 to-transparent"></div>

            {[
              { num: "01", title: "Add Your Handles", desc: "Simply type in your public usernames for GitHub, LeetCode, Codeforces, and your other accounts." },
              { num: "02", title: "We Sync Your Data", desc: "Our system gathers your public solved questions, contest updates, and repositories automatically." },
              { num: "03", title: "Explore Your Insights", desc: "Log into your clean dashboard to see your combined growth timeline and start sharing your custom profile card." }
            ].map((step, i) => (
              <div key={i} className="relative flex-1 text-center group w-full bg-white dark:bg-transparent p-5 md:p-0 rounded-2xl border border-zinc-100 dark:border-transparent shadow-sm md:shadow-none">
                <div className="w-20 h-20 mx-auto bg-zinc-50 dark:bg-zinc-950 border-2 border-zinc-200 dark:border-zinc-900 rounded-2xl flex items-center justify-center mb-5 relative z-10 group-hover:border-zinc-400 dark:group-hover:border-zinc-700 transition-colors">
                  <span className="text-xl font-bold text-zinc-400 dark:text-zinc-600 group-hover:text-zinc-900 dark:group-hover:text-zinc-300 transition-colors">{step.num}</span>
                </div>
                <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-2 uppercase tracking-wide">{step.title}</h3>
                <p className="text-zinc-500 dark:text-zinc-400 text-xs font-medium max-w-xs mx-auto leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* WHO IT IS FOR */}
        <section className="py-20 bg-zinc-100/60 dark:bg-zinc-900/20 border-y border-zinc-200/50 dark:border-zinc-900">
          <div className="max-w-5xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">Built For Every Type of Developer</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { title: "Competitive Programmers", desc: "Follow your active contest history, overall global percentiles, and score rankings effortlessly.", icon: <TrendingUp className="h-4 w-4 text-emerald-500" /> },
                { title: "Interview Candidates", desc: "Maintain your consistency and see exactly how many easy, medium, or hard problems you solve.", icon: <Terminal className="h-4 w-4 text-blue-500" /> },
                { title: "Open Source Developers", desc: "Highlight your public project commits, repository stars, and language breakdowns automatically.", icon: <Layers className="h-4 w-4 text-purple-500" /> }
              ].map((audience, i) => (
                <div key={i} className="bg-white dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-900 p-6 rounded-2xl shadow-sm text-center flex flex-col items-center">
                  <div className="w-9 h-9 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl flex items-center justify-center mb-4">
                    {audience.icon}
                  </div>
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-1.5 uppercase tracking-wide">{audience.title}</h3>
                  <p className="text-zinc-500 dark:text-zinc-400 text-xs font-medium leading-relaxed">{audience.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA HUB */}
        <section className="py-24 px-6 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-[280px] bg-gradient-to-r from-zinc-200 via-transparent to-zinc-200 dark:from-zinc-900 dark:via-transparent dark:to-zinc-900 blur-3xl opacity-40 rounded-full pointer-events-none"></div>

          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-extrabold text-zinc-900 dark:text-white tracking-tight mb-4">Start building your unified coding identity today</h2>
            <p className="text-sm sm:text-base text-zinc-500 dark:text-zinc-400 mb-8 font-medium">Join developers who are tracking their combined achievements in a cleaner way.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <Link href="/signup" className="bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 px-6 py-3 rounded-xl text-sm font-bold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition shadow-md">
                Create Your Account Now
              </Link>
              <a href="#demo" className="px-6 py-3 rounded-xl text-sm font-bold border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-sm shadow-sm hover:bg-zinc-100 dark:hover:bg-zinc-900 transition">
                Interactive Preview
              </a>
            </div>
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="bg-zinc-100 dark:bg-zinc-950 text-zinc-500 dark:text-zinc-400 py-12 border-t border-zinc-200 dark:border-zinc-900 transition-colors">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="grid h-6 w-6 place-items-center rounded-md bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 font-bold">
                <Layers className="h-3 w-3" />
              </div>
              <span className="text-base font-bold text-zinc-900 dark:text-white tracking-tight">CodeAtlas</span>
            </div>
            <p className="text-xs leading-relaxed text-zinc-400 dark:text-zinc-500 font-medium">
              A clean analytics dashboard combining all your coding profiles into a single portfolio page.
            </p>
          </div>

          <div>
            <h4 className="text-zinc-800 dark:text-zinc-200 text-xs font-bold tracking-widest uppercase mb-4">Product</h4>
            <ul className="space-y-2 text-xs font-semibold">
              <li><a href="#" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Platform Features</a></li>
              <li><a href="#demo" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Interactive Demo</a></li>
              <li><a href="#" className="hover:text-zinc-900 dark:hover:text-white transition-colors flex items-center gap-1.5">Pro Accounts <Badge className="text-[8px] font-bold bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded px-1 py-0 border-0 uppercase">Coming Soon</Badge></a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-zinc-800 dark:text-zinc-200 text-xs font-bold tracking-widest uppercase mb-4">Company</h4>
            <ul className="space-y-2 text-xs font-semibold">
              <li><a href="#" className="hover:text-zinc-900 dark:hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Support</a></li>
              <li><a href="#" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Privacy Policy</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-zinc-800 dark:text-zinc-200 text-xs font-bold tracking-widest uppercase mb-4">Resources</h4>
            <ul className="space-y-2 text-xs font-semibold">
              <li><a href="#" className="hover:text-zinc-900 dark:hover:text-white transition-colors flex items-center gap-1.5">Help Documentation <ExternalLink className="h-3 w-3 text-zinc-400" /></a></li>
              <li><a href="#" className="hover:text-zinc-900 dark:hover:text-white transition-colors flex items-center gap-1.5">GitHub Repository <FaGithub className="h-3 w-3" /></a></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 pt-6 border-t border-zinc-200 dark:border-zinc-900/60 flex flex-col md:flex-row justify-between items-center text-[11px] font-bold text-zinc-400 dark:text-zinc-600 tracking-wide uppercase">
          <p>© 2026 CodeAtlas. All rights reserved.</p>
          <div className="mt-4 md:mt-0 flex gap-4">
            <a href="#" className="hover:text-zinc-700 dark:text-zinc-300">Terms of Service</a>
            <a href="#" className="hover:text-zinc-700 dark:hover:text-zinc-300">Security</a>
          </div>
        </div>
      </footer>

    </div>
  );
}

// Button Primitive Component
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "secondary";
  size?: "default" | "icon" | "sm";
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  className = "", 
  variant = "default", 
  size = "default", 
  ...props 
}) => {
  const base = "inline-flex items-center justify-center font-bold transition focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 select-none";
  
  const variants = {
    default: "bg-zinc-900 text-zinc-50 hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 shadow-sm",
    outline: "border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-200 shadow-sm",
    secondary: "bg-zinc-100 text-zinc-900 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-50 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-700/50",
    ghost: "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900"
  };

  const sizes = {
    default: "h-10 px-4 py-2 text-sm rounded-xl",
    sm: "h-8 px-3 text-xs rounded-lg",
    icon: "h-10 w-10 rounded-xl"
  };

  return (
    <button 
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} 
      {...props}
    >
      {children}
    </button>
  );
};