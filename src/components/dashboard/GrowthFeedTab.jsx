import { useState, useRef, useEffect } from 'react'
import { Heart, MessageCircle, Share2, TrendingUp, Sparkles } from 'lucide-react'

// Using real Instagram Reel shortcodes for food/restaurant content
const FEED_DATA = [
  {
    id: 1,
    shortcode: 'C-2XG3Xl_0w', // Replace with any valid reel shortcode
    trend: 'ASMR Sizzling Food',
    title: 'POV: Dinner at Truffles',
    desc: 'Record a 7-second high-quality close up of your Chicken Steak sizzling on the grill with natural sound. High engagement potential.',
    likes: '12.4K',
    comments: 89,
    impact: 'Estimated +20% local reach'
  },
  {
    id: 2,
    shortcode: 'C9_Mv_aB_wT', // Replace with any valid reel shortcode
    trend: 'Behind The Scenes',
    title: 'How we make our Signature Burger',
    desc: 'Show the layers of your All American Burger being assembled. Customers love transparency and authenticity. Use fast cuts.',
    likes: '8.1K',
    comments: 42,
    impact: 'Builds trust & cravings'
  },
  {
    id: 3,
    shortcode: 'C-0h2oYg_wT', // Replace with any valid reel shortcode
    trend: 'Student Combo Hack',
    title: 'The ₹199 College Hack',
    desc: 'Target the nearby college fest. Show students enjoying the combo. Clear CTA to "Tag a friend who owes you lunch".',
    likes: '24.5K',
    comments: 532,
    impact: 'Direct sales conversion'
  }
]

export default function GrowthFeedTab({ pushToast }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const containerRef = useRef(null)

  // Track active slide based on scroll position
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleScroll = () => {
      const index = Math.round(container.scrollTop / container.clientHeight)
      if (index !== currentIndex) {
        setCurrentIndex(index)
      }
    }

    container.addEventListener('scroll', handleScroll, { passive: true })
    return () => container.removeEventListener('scroll', handleScroll)
  }, [currentIndex])

  return (
    <div className="h-full max-w-lg mx-auto flex flex-col relative py-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4 px-4 shrink-0">
        <div>
          <h2 className="text-xl font-black font-head text-white flex items-center gap-2">
            <TrendingUp size={20} className="text-emerald-400" /> AI Growth Feed
          </h2>
          <p className="text-xs text-slate-400">Personalized marketing trends for your restaurant</p>
        </div>
      </div>

      {/* Feed Container - Native CSS Snap Scrolling */}
      <div 
        ref={containerRef}
        className="flex-1 w-full h-[600px] overflow-y-auto snap-y snap-mandatory rounded-[2rem] border border-slate-800 bg-black shadow-2xl relative scroll-smooth hide-scrollbar"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {FEED_DATA.map((item, index) => (
          <div key={item.id} className="w-full h-full snap-start relative flex flex-col justify-end">
            
            {/* Instagram Iframe Overlay */}
            <div className="absolute inset-0 z-0 bg-slate-900 flex items-center justify-center overflow-hidden">
              <iframe
                src={`https://www.instagram.com/p/${item.shortcode}/embed/captioned/?cr=1&v=14&wp=1080&rd=http%3A%2F%2Flocalhost%3A5173`}
                className="w-full h-[calc(100%+80px)] -mt-10 border-0"
                scrolling="no"
                allowTransparency="true"
                allow="encrypted-media"
                title={`Instagram Reel ${index + 1}`}
              />
            </div>

            {/* Fade Gradient to make text readable */}
            <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black via-black/80 to-transparent z-10 pointer-events-none" />

            {/* AI Badge */}
            <div className="absolute top-6 left-6 z-20 badge badge-green bg-emerald-500/20 backdrop-blur-md border-emerald-500/30">
              <Sparkles size={12} /> AI Strategy
            </div>

            {/* Pagination Dots */}
            <div className="absolute top-6 right-6 z-20 flex gap-1.5 flex-col">
              {FEED_DATA.map((_, i) => (
                <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all ${i === index ? 'bg-emerald-400 h-4' : 'bg-white/30'}`} />
              ))}
            </div>

            {/* Right Action Bar */}
            <div className="absolute right-4 bottom-24 flex flex-col gap-6 items-center z-20">
              <button className="group flex flex-col items-center gap-1 cursor-pointer">
                <div className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center group-hover:bg-emerald-500/40 transition-colors">
                  <Heart size={24} className="text-white group-hover:fill-emerald-400 group-hover:text-emerald-400" />
                </div>
                <span className="text-[10px] text-white font-bold drop-shadow-md">{item.likes}</span>
              </button>
              <button className="group flex flex-col items-center gap-1 cursor-pointer">
                <div className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                  <MessageCircle size={24} className="text-white" />
                </div>
                <span className="text-[10px] text-white font-bold drop-shadow-md">{item.comments}</span>
              </button>
              <button className="group flex flex-col items-center gap-1 cursor-pointer" onClick={() => pushToast('Strategy saved to clipboard', 'success')}>
                <div className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                  <Share2 size={24} className="text-white" />
                </div>
                <span className="text-[10px] text-white font-bold drop-shadow-md">Share</span>
              </button>
            </div>

            {/* Bottom Content Area */}
            <div className="relative z-20 p-6 pr-16 space-y-3 w-full pointer-events-none">
              <div className="inline-block px-2.5 py-1 rounded bg-black/40 backdrop-blur-md border border-emerald-500/30 text-xs font-bold text-emerald-400 uppercase tracking-wide">
                Trend: {item.trend}
              </div>
              
              <h3 className="text-xl font-bold font-head text-white drop-shadow-lg leading-tight">
                {item.title}
              </h3>
              
              <p className="text-sm text-slate-200 drop-shadow-md leading-relaxed line-clamp-3">
                {item.desc}
              </p>
              
              <div className="text-xs font-semibold text-emerald-300 drop-shadow-md pt-2 bg-emerald-900/40 w-fit px-3 py-1.5 rounded-lg border border-emerald-500/20">
                💡 {item.impact}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="text-center mt-4 text-xs text-slate-500">
        Scroll up/down to explore AI-curated trends
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
      `}} />
    </div>
  )
}
