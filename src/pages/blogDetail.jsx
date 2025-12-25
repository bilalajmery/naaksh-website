import { useState, useEffect } from "react";
import { useParams, NavLink, useNavigate } from "react-router-dom";
import { Calendar, User, Share2, ArrowLeft } from "lucide-react";
import { Helmet } from "react-helmet-async";

export default function BlogDetail() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [suggestedPosts, setSuggestedPosts] = useState([]);

    useEffect(() => {
        fetch("/blog/data.json")
            .then((res) => (res.ok ? res.json() : []))
            .then((data) => {
                const foundPost = data.find((p) => p.slug === slug);
                if (foundPost) {
                    setPost(foundPost);
                    // Suggest other posts
                    setSuggestedPosts(data.filter((p) => p.slug !== slug).slice(0, 2));
                } else {
                    // If not found, go back to blog
                    navigate("/blog");
                }
                setLoading(false);
            })
            .catch((err) => {
                console.error("Failed to load blog post:", err);
                setLoading(false);
            });
    }, [slug, navigate]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black">
                <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!post) return null;

    return (
        <>
            <Helmet>
                <title>{post.title} | NAAKSH Journal</title>
                <meta name="description" content={post.excerpt} />
                <meta property="og:title" content={`${post.title} | NAAKSH Journal`} />
                <meta property="og:description" content={post.excerpt} />
                <meta property="og:image" content={post.image} />
                <link rel="canonical" href={`https://naakshofficial.com/blog/${post.slug}`} />
            </Helmet>

            <div className="bg-black min-h-screen">
                {/* PROGRESSIVE HERO HEADER */}
                <div className="relative h-[60vh] md:h-[80vh] w-full">
                    <img
                        src={post.image}
                        alt={post.title}
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/20 to-black" />

                    {/* Back Button */}
                    <div className="absolute top-8 left-6 md:left-12 z-20">
                        <NavLink
                            to="/blog"
                            className="group flex items-center gap-3 bg-black/50 backdrop-blur-md border border-white/10 text-white px-6 py-3 rounded-full hover:bg-yellow-500 hover:text-black hover:border-yellow-500 transition-all duration-300"
                        >
                            <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
                            <span className="text-sm font-bold uppercase tracking-widest">Back to Journal</span>
                        </NavLink>
                    </div>

                    <div className="absolute bottom-12 left-0 w-full px-6">
                        <div className="max-w-4xl mx-auto">
                            <span className="inline-block bg-yellow-500 text-black text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full mb-6">
                                {post.category}
                            </span>
                            <h1 className="text-4xl md:text-7xl font-black text-white tracking-tighter mb-8 leading-tight uppercase">
                                {post.title}
                            </h1>
                            <div className="flex flex-wrap items-center gap-8 text-gray-300 text-xs font-bold uppercase tracking-widest">
                                <div className="flex items-center gap-2">
                                    <Calendar size={14} className="text-yellow-500" />
                                    {post.date}
                                </div>
                                <div className="flex items-center gap-2">
                                    <User size={14} className="text-yellow-500" />
                                    By {post.author}
                                </div>
                                <button className="flex items-center gap-2 hover:text-yellow-500 transition-colors ml-auto cursor-pointer">
                                    <Share2 size={16} />
                                    Share Story
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CONTENT SECTION */}
                <article className="py-20 px-6">
                    <div className="max-w-3xl mx-auto">
                        {/* Excerpt */}
                        <div className="mb-16">
                            <p className="text-2xl md:text-3xl font-medium text-yellow-500/90 leading-relaxed italic border-l-4 border-yellow-500 pl-8">
                                {post.excerpt}
                            </p>
                        </div>

                        {/* Body Content */}
                        <div
                            className="prose prose-invert prose-yellow max-w-none 
                prose-p:text-gray-300 prose-p:text-lg prose-p:leading-loose text-white
                prose-headings:text-white prose-headings:font-black prose-headings:tracking-tight
                prose-h3:text-2xl prose-h3:mt-12 prose-h3:mb-6
                prose-strong:text-yellow-500 prose-strong:font-bold
                prose-img:rounded-3xl prose-img:border prose-img:border-white/10"
                            dangerouslySetInnerHTML={{ __html: post.body }}
                        />

                        {/* Footer / Meta */}
                        <div className="mt-20 pt-12 border-t border-white/5 flex items-center justify-between">
                            <div className="flex flex-wrap gap-2">
                                {["STREETWEAR", "CULTURE", "NAAKSH"].map(tag => (
                                    <span key={tag} className="bg-zinc-900 text-gray-400 text-[10px] font-bold px-3 py-1 rounded-md border border-white/5 uppercase tracking-widest">#{tag}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </article>

                {/* RELATED POSTS */}
                {suggestedPosts.length > 0 && (
                    <section className="py-24 px-6 border-t border-white/5">
                        <div className="max-w-5xl mx-auto">
                            <h2 className="text-3xl font-black text-white mb-12 uppercase tracking-tighter">
                                Keep <span className="text-yellow-500">Reading</span>
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {suggestedPosts.map((p) => (
                                    <NavLink
                                        key={p.id}
                                        to={`/blog/${p.slug}`}
                                        className="group flex gap-6 items-center bg-zinc-900/40 p-6 rounded-3xl border border-white/5 hover:border-yellow-500/30 transition-all duration-500"
                                    >
                                        <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0">
                                            <img src={p.image} alt={p.title} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                                        </div>
                                        <div>
                                            <span className="text-[10px] text-yellow-500 font-black uppercase tracking-widest block mb-2">{p.category}</span>
                                            <h4 className="text-lg font-bold text-white leading-tight group-hover:text-yellow-500 transition-colors line-clamp-2 uppercase">
                                                {p.title}
                                            </h4>
                                        </div>
                                    </NavLink>
                                ))}
                            </div>
                        </div>
                    </section>
                )}
            </div>
        </>
    );
}
