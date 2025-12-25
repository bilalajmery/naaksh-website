import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Calendar, User, ArrowRight } from "lucide-react";
import { Helmet } from "react-helmet-async";

export default function Blog() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/blog/data.json")
            .then((res) => (res.ok ? res.json() : []))
            .then((data) => {
                setPosts(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Failed to load blog posts:", err);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black">
                <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <>
            <Helmet>
                <title>Blog | NAAKSH | Streetwear Insights & Fashion Trends</title>
                <meta name="description" content="Read the latest insights into Pakistan's streetwear culture, fashion tips, and urban style guides on the NAAKSH blog." />
                <link rel="canonical" href="https://naakshofficial.com/blog" />
            </Helmet>

            <div className="bg-black min-h-screen">
                {/* HERO SECTION */}
                <section className="relative py-32 px-6 overflow-hidden">
                    {/* Background Image with Overlay */}
                    <div className="absolute inset-0 z-0">
                        <img
                            src="/hero-section/1.jpg"
                            alt="Blog Background"
                            className="w-full h-full object-cover opacity-60"
                        />
                        <div className="absolute inset-0 bg-linear-to-b from-black/80 via-black/40 to-black"></div>
                    </div>

                    <div className="max-w-7xl mx-auto text-center relative z-10">
                        <h4 className="text-yellow-500 font-black tracking-[0.3em] uppercase text-xs mb-4">Inside the Culture</h4>
                        <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter mb-6 uppercase">
                            THE <span className="text-yellow-500">JOURNAL</span>
                        </h1>
                        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto font-medium">
                            Deep dives into urban culture, street style, and the stories behind our collections.
                        </p>
                    </div>
                </section>

                {/* BLOG GRID */}
                <section className="py-24 px-6">
                    <div className="max-w-7xl mx-auto">
                        {posts.length === 0 ? (
                            <div className="text-center py-20">
                                <p className="text-gray-500 text-xl font-medium">No stories published yet. Stay tuned.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                                {posts.map((post) => (
                                    <NavLink
                                        key={post.id}
                                        to={`/blog/${post.slug}`}
                                        className="group bg-zinc-900/50 border border-white/5 rounded-3xl overflow-hidden hover:border-yellow-500/50 transition-all duration-500 flex flex-col"
                                    >
                                        {/* Image Container */}
                                        <div className="relative h-64 overflow-hidden">
                                            <img
                                                src={post.image}
                                                alt={post.title}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                            <div className="absolute top-4 left-4">
                                                <span className="bg-yellow-500 text-black text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                                                    {post.category}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="p-8 flex-grow flex flex-col">
                                            <div className="flex items-center gap-4 text-gray-500 text-xs font-bold uppercase tracking-widest mb-4">
                                                <div className="flex items-center gap-1.5">
                                                    <Calendar size={14} className="text-yellow-500" />
                                                    {post.date}
                                                </div>
                                            </div>

                                            <h3 className="text-2xl font-black text-white mb-4 leading-tight group-hover:text-yellow-500 transition-colors">
                                                {post.title}
                                            </h3>

                                            <p className="text-gray-400 text-sm leading-relaxed mb-8 flex-grow">
                                                {post.excerpt}
                                            </p>

                                            <div className="flex items-center text-yellow-500 text-xs font-black uppercase tracking-[0.2em] group/btn">
                                                READ STORY
                                                <ArrowRight size={16} className="ml-2 transition-transform duration-300 group-hover/btn:translate-x-2" />
                                            </div>
                                        </div>
                                    </NavLink>
                                ))}
                            </div>
                        )}
                    </div>
                </section>

                {/* NEWSLETTER PREVIEW (Optional but adds aesthetic) */}
                <section className="py-24 px-6 bg-yellow-500">
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="text-3xl md:text-5xl font-black text-black tracking-tight mb-8">
                            NEVER MISS A CHAPTER.
                        </h2>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <input
                                type="email"
                                placeholder="YOUR EMAIL ADDRESS"
                                className="bg-black/5 border-2 border-black/10 text-black placeholder:text-black/40 px-6 py-4 rounded-xl focus:outline-none focus:border-black/30 flex-grow max-w-md font-bold text-sm tracking-wider"
                            />
                            <button className="bg-black text-white px-8 py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-zinc-800 transition shadow-xl">
                                SUBSCRIBE
                            </button>
                        </div>
                        <p className="text-black/60 text-xs font-bold mt-6 tracking-widest">
                            BY SUBSCRIBING, YOU AGREE TO OUR TERMS AND PRIVACY POLICY.
                        </p>
                    </div>
                </section>
            </div>
        </>
    );
}
