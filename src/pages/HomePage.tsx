import { useEffect, useState } from 'react';
import {
  ArrowRight,
  ArrowLeft,
  Play,
  Truck,
  RotateCcw,
  Shield,
  Star,
  Heart,
} from 'lucide-react';
import { motion } from 'framer-motion';
import ScrollReveal from '../components/ScrollReveal';
import { mockProducts } from '../lib/mockData';
import { formatPrice } from '../lib/currency';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import cover1 from '../assets/images/cover (1).jpg';
import cover2 from '../assets/images/cover (2).jpg';
import dress1 from '../assets/images/dress (1).jpg';
import tops1 from '../assets/images/tops (1).jpg';
import shoes1 from '../assets/images/shoes (1).jpg';
import bag1 from '../assets/images/bag (1).jpg';
import aac5 from '../assets/images/acc (5).jpg';
import acc7 from '../assets/images/acc (7).jpg';
import cover3 from '../assets/images/cover (3).jpg';
import promo from '../assets/images/promo.jpg';
import men1 from '../assets/images/men.jpg';




interface HomePageProps {
  onNavigate: (page: string) => void;
}

const categoryCircles = [
  { label: 'Women', slug: 'women', image: cover1 },
  { label: 'Men', slug: 'men', image: men1 },
  { label: 'Dresses', slug: 'dresses', image: dress1 },
  { label: 'Tops', slug: 'tops', image: tops1 },
  { label: 'Shoes', slug: 'shoes', image: shoes1 },
  { label: 'Bags', slug: 'bags', image: bag1 },
  { label: 'Accessories', slug: 'accessories', image: aac5 },
  { label: 'Sale', slug: 'sale', image: acc7 },
];

const shopCategories = [
  {
    title: "Women's Collection",
    slug: 'women',
    image: cover3,
  },
  {
    title: "Men's Collection",
    slug: 'men',
    image: men1,
  },
  {
    title: 'Dresses',
    slug: 'dresses',
    image: dress1,
  },
  {
    title: 'Accessories',
    slug: 'accessories',
    image: aac5,
  },
];

const heroSlides = [
  {
    image: cover1,
    alt: 'Model in tan blazer',
  },
  {
    image: cover2,
    alt: 'Fashion editorial',
  },
  {
    image: cover3,
    alt: 'Street style look',
  },
];

const customerReviews = [
  {
    quote: 'Every piece feels considered, beautifully made, and easy to wear. Lunora has become my first stop for everyday dressing.',
    name: 'Amelia R.',
    detail: 'Verified customer',
    rating: 5,
  },
  {
    quote: 'The fit is impeccable and the quality is even better in person. I found the kind of wardrobe staples I will keep forever.',
    name: 'Maya T.',
    detail: 'Verified customer',
    rating: 5,
  },
  {
    quote: 'Thoughtful design, quick delivery, and pieces that make getting dressed feel effortless. A truly lovely experience.',
    name: 'Sofia K.',
    detail: 'Verified customer',
    rating: 5,
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-3 h-3 ${i < Math.floor(rating) ? 'fill-amber-400 text-amber-400' : 'fill-neutral-200 text-neutral-200'}`}
        />
      ))}
    </div>
  );
}

export default function HomePage({ onNavigate }: HomePageProps) {
  const [bestSellers, setBestSellers] = useState<typeof mockProducts>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentReview, setCurrentReview] = useState(0);
  const [email, setEmail] = useState('');
  const { user } = useAuth();
  const { isWishlisted, toggleWishlist } = useWishlist();

  useEffect(() => {
    setBestSellers(mockProducts.filter((p) => p.is_featured).slice(0, 6));
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentReview((prev) => (prev + 1) % customerReviews.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleWishlist = (e: React.MouseEvent, productId: string) => {
    e.stopPropagation();
    if (!user) {
      onNavigate('auth');
      return;
    }
    toggleWishlist(productId);
  };

  return (
    <div className="min-h-screen bg-cream">
      {/* Hero */}
      <section className="relative pt-24 pb-8 md:pt-28 md:pb-12 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[520px] md:min-h-[580px]">
            {/* Left content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="order-2 lg:order-1"
            >
              <h1 className="heading-serif text-4xl sm:text-5xl md:text-6xl lg:text-[3.5rem] font-semibold text-neutral-900 leading-[1.1] mb-5">
                Elevate Your<br />Everyday Style
              </h1>
              <p className="text-neutral-500 text-base md:text-lg leading-relaxed max-w-md mb-8">
                Discover timeless pieces crafted for the modern wardrobe. From casual essentials to statement looks — find your perfect fit.
              </p>
              <div className="flex flex-wrap items-center gap-3 mb-10">
                <button onClick={() => onNavigate('shop')} className="btn-primary">
                  Shop Now
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button className="btn-ghost">
                  <Play className="w-4 h-4 fill-neutral-800" />
                  Watch Lookbook
                </button>
              </div>

              {/* Mini trust badges */}
              {/* <div className="flex flex-wrap gap-6 text-xs text-neutral-500">
                <span className="flex items-center gap-2">
                  <Truck className="w-4 h-4" /> Free Shipping
                </span>
                <span className="flex items-center gap-2">
                  <RotateCcw className="w-4 h-4" /> Easy Returns
                </span>
                <span className="flex items-center gap-2">
                  <Shield className="w-4 h-4" /> Secure Payment
                </span>
              </div> */}
            </motion.div>

            {/* Right image */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="order-1 lg:order-2 relative"
            >
              <div className="relative rounded-2xl overflow-hidden aspect-[4/5] max-h-[580px]">
                {heroSlides.map((slide, index) => (
                  <motion.img
                    key={index}
                    src={slide.image}
                    alt={slide.alt}
                    loading={index === 0 ? 'eager' : 'lazy'}
                    initial={false}
                    animate={{ opacity: index === currentSlide ? 1 : 0 }}
                    transition={{ duration: 1 }}
                    className="absolute inset-0 w-full h-full object-cover object-top"
                  />
                ))}
              </div>

              {/* Vertical slide indicator */}
              <div className="absolute -right-2 top-1/2 -translate-y-1/2 hidden md:flex flex-col gap-3 items-center">
                {heroSlides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`text-xs font-medium tracking-widest transition-all duration-300 ${
                      index === currentSlide ? 'text-black scale-110' : 'text-neutral-300 hover:text-neutral-500'
                    }`}
                  >
                    {String(index + 1).padStart(2, '0')}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Category circles */}
      <section className="py-10 md:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <ScrollReveal>
            <div className="flex gap-5 md:gap-8 overflow-x-auto hide-scrollbar pb-2 justify-start md:justify-center">
              {categoryCircles.map((cat, i) => (
                <motion.button
                  key={cat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  onClick={() => onNavigate(`category-${cat.slug}`)}
                  className="flex flex-col items-center gap-2.5 flex-shrink-0 group"
                >
                  <div
                    className={`w-16 h-16 md:w-[72px] md:h-[72px] rounded-full overflow-hidden transition-transform duration-300 group-hover:scale-110 ${
                      cat.label === 'Sale' ? 'bg-black flex items-center justify-center' : 'ring-2 ring-neutral-200/60'
                    }`}
                  >
                    {cat.image ? (
                      <img src={cat.image} alt={cat.label} loading="lazy" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-white text-[10px] font-bold tracking-widest">SALE</span>
                    )}
                  </div>
                  <span className="text-[10px] md:text-xs uppercase tracking-widest text-neutral-500 group-hover:text-black transition-colors">
                    {cat.label}
                  </span>
                </motion.button>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Shop by Category */}
      <section className="py-10 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <ScrollReveal className="flex items-end justify-between mb-8 md:mb-10">
            <h2 className="section-heading">Find Your Perfect Style</h2>
            <button onClick={() => onNavigate('shop')} className="link-arrow hidden sm:inline-flex">
              View All Categories
              <ArrowRight className="w-4 h-4" />
            </button>
          </ScrollReveal>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            {shopCategories.map((cat, i) => (
              <ScrollReveal key={cat.slug} delay={i * 0.08}>
                <button
                  onClick={() => onNavigate(`category-${cat.slug}`)}
                  className="group relative w-full aspect-[3/4] rounded-2xl overflow-hidden"
                >
                  <img
                    src={cat.image}
                    alt={cat.title}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5 glass-dark text-left">
                    <h3 className="heading-serif text-white text-base md:text-lg font-medium mb-1">{cat.title}</h3>
                    <span className="inline-flex items-center gap-1 text-xs text-white/80 group-hover:text-white transition-colors">
                      Explore Now
                      <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </button>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Promotional banners */}
      <section className="py-6 md:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-4 md:gap-5">
            <ScrollReveal direction="left">
              <div className="group relative rounded-2xl overflow-hidden aspect-[16/9] md:aspect-[2/1]">
                <img
                  src= {promo}
                  alt="Spring sale"
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
                <div className="absolute inset-0 flex flex-col justify-center p-6 md:p-8">
                  <span className="text-[10px] uppercase tracking-[0.3em] text-white/70 mb-2">Limited Time Offer</span>
                  <h3 className="heading-serif text-white text-2xl md:text-3xl font-semibold mb-4 max-w-xs">
                    Spring Sale Up to 50% Off
                  </h3>
                  <button
                    onClick={() => onNavigate('category-sale')}
                    className="btn-primary w-fit text-xs py-2.5 px-5"
                  >
                    Shop The Sale
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="right">
              <div className="group relative rounded-2xl overflow-hidden aspect-[16/9] md:aspect-[2/1]">
                <img
                  src="https://images.pexels.com/photos/2983465/pexels-photo-2983465.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="New arrivals"
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
                <div className="absolute inset-0 flex flex-col justify-center p-6 md:p-8">
                  <span className="text-[10px] uppercase tracking-[0.3em] text-white/70 mb-2">New Arrivals</span>
                  <h3 className="heading-serif text-white text-2xl md:text-3xl font-semibold mb-4 max-w-xs">
                    Fresh Styles Just Landed
                  </h3>
                  <button
                    onClick={() => onNavigate('category-new-arrivals')}
                    className="btn-primary w-fit text-xs py-2.5 px-5"
                  >
                    Explore New In
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-10 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <ScrollReveal className="flex items-end justify-between mb-8 md:mb-10">
            <h2 className="section-heading">Our Most Loved Picks</h2>
            <button onClick={() => onNavigate('shop')} className="link-arrow hidden sm:inline-flex">
              View All Products
              <ArrowRight className="w-4 h-4" />
            </button>
          </ScrollReveal>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-5">
            {bestSellers.map((product, i) => (
              <ScrollReveal key={product.id} delay={i * 0.05}>
                <div
                  onClick={() => onNavigate(`product-${product.slug}`)}
                  className="group cursor-pointer"
                >
                  <div className="relative aspect-square rounded-xl overflow-hidden bg-neutral-100 mb-3">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <button
                      onClick={(e) => handleWishlist(e, product.id)}
                      className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full glass flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    >
                      <Heart
                        className={`w-3.5 h-3.5 ${isWishlisted(product.id) ? 'fill-red-500 text-red-500' : 'text-neutral-600'}`}
                      />
                    </button>
                  </div>
                  <h3 className="text-sm font-medium text-neutral-900 mb-1 line-clamp-1">{product.name}</h3>
                  <p className="text-sm font-semibold text-neutral-900 mb-1.5">
                    {formatPrice(product.sale_price ?? product.base_price)}
                  </p>
                  <div className="flex items-center gap-1.5">
                    <StarRating rating={product.rating} />
                    <span className="text-[11px] text-neutral-400">({product.review_count})</span>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Customer reviews */}
      <section className="py-10 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid overflow-hidden rounded-2xl bg-white/60 md:grid-cols-2">
            <ScrollReveal className="flex min-h-[390px] flex-col justify-between p-8 md:min-h-[470px] md:p-12">
              <div>
                <span className="text-[10px] uppercase tracking-[0.3em] text-neutral-400">From Our Community</span>
                <h2 className="heading-serif mt-4 max-w-sm text-3xl font-semibold leading-tight text-neutral-900 md:text-4xl">
                  Loved for the way you live.
                </h2>
              </div>

              <div key={currentReview} className="animate-fade-in-up">
                <div className="mb-5 flex items-center gap-1">
                  {Array.from({ length: customerReviews[currentReview].rating }).map((_, index) => (
                    <Star key={index} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <blockquote className="heading-serif max-w-lg text-xl leading-relaxed text-neutral-800 md:text-2xl">
                  “{customerReviews[currentReview].quote}”
                </blockquote>
                <div className="mt-6">
                  <p className="text-sm font-medium text-neutral-900">{customerReviews[currentReview].name}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.2em] text-neutral-400">{customerReviews[currentReview].detail}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-8">
                <div className="flex gap-2" aria-label="Review slides">
                  {customerReviews.map((review, index) => (
                    <button
                      key={review.name}
                      onClick={() => setCurrentReview(index)}
                      aria-label={`Show review ${index + 1}`}
                      className={`h-px transition-all duration-300 ${index === currentReview ? 'w-8 bg-neutral-900' : 'w-4 bg-neutral-300'}`}
                    />
                  ))}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentReview((currentReview - 1 + customerReviews.length) % customerReviews.length)}
                    aria-label="Previous review"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 text-neutral-600 transition-colors hover:border-neutral-900 hover:text-neutral-900"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setCurrentReview((currentReview + 1) % customerReviews.length)}
                    aria-label="Next review"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 text-neutral-600 transition-colors hover:border-neutral-900 hover:text-neutral-900"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </ScrollReveal>

            <div className="relative min-h-[320px] md:min-h-[470px]">
              <img
                src={cover1}
                alt="Model wearing a Lunora look"
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover object-top"
              />
            </div>
          </div>
        </div>
      </section>
      {/* Newsletter */}
      <section className="py-10 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <ScrollReveal>
            <div className="relative rounded-2xl overflow-hidden">
              <div className="grid md:grid-cols-2">
                <div className="relative aspect-[4/3] md:aspect-auto md:min-h-[320px]">
                  <img
                    src={promo}
                    alt="Join our style list"
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col justify-center p-8 md:p-12 bg-white/80 backdrop-blur-sm">
                  <span className="text-[10px] uppercase tracking-[0.3em] text-neutral-400 mb-3">
                    Get 10% Off Your First Order
                  </span>
                  <h2 className="heading-serif text-3xl md:text-4xl font-semibold text-neutral-900 mb-3">
                    Join Our Style List
                  </h2>
                  <p className="text-neutral-500 text-sm leading-relaxed mb-6 max-w-sm">
                    Be the first to know about new arrivals, exclusive offers, and style inspiration delivered to your inbox.
                  </p>
                  <form
                    onSubmit={(e) => { e.preventDefault(); setEmail(''); }}
                    className="flex gap-2 max-w-md"
                  >
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                      className="flex-1 rounded-full border border-neutral-200 bg-white/70 backdrop-blur-sm px-5 py-3 text-sm outline-none focus:border-neutral-400 transition-colors"
                    />
                    <button type="submit" className="btn-primary flex-shrink-0 px-6">
                      Subscribe
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
