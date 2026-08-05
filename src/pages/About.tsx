import { motion } from 'framer-motion';

interface Review {
  id: number;
  name: string;
  content: string;
  rating: number;
}

const reviews: Review[] = [
  {
    id: 1,
    name: 'Sophia L.',
    content: 'Absolutely love my Silk Dream Bonnet! It keeps my hair protected and looks great.',
    rating: 5,
  },
  {
    id: 2,
    name: 'James T.',
    content: 'The quality is outstanding! Definitely worth every penny.',
    rating: 4,
  },
  {
    id: 3,
    name: 'Emma W.',
    content: 'I bought this as a gift for my sister, and she loves it! Highly recommend.',
    rating: 5,
  },
];

export default function About() {
  return (
    <div className="pt-24 px-4 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold text-gray-800">About Us</h1>
        <p className="mt-4 text-lg text-gray-600">
          At Luxe Bonnets, we believe in providing high-quality hair care products that enhance your beauty and confidence.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-lg shadow-lg p-6 mb-8"
      >
        <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
        <p className="text-gray-700 mb-4">
          Founded with a passion for hair care, Luxe Bonnets offers a range of premium silk and satin bonnets designed to protect your hair while you sleep. 
          Our products are crafted with the finest materials to ensure comfort and durability.
        </p>
        <p className="text-gray-700">
          Join us on our journey to help everyone embrace their natural beauty and promote healthy hair care practices.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-lg shadow-lg p-6 mb-8"
      >
        <h2 className="text-2xl font-semibold mb-4">Customer Reviews</h2>
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="border border-gray-200 rounded p-4 hover:shadow-lg transition-shadow">
              <h3 className="font-semibold text-gray-800">{review.name}</h3>
              <p className="text-gray-600">{review.content}</p>
              <p className="text-gray-500">Rating: {review.rating} ★</p>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-lg shadow-lg p-6"
      >
        <h2 className="text-2xl font-semibold mb-4">Connect with Us</h2>
        <p className="text-gray-700 mb-4">
          Follow us on social media to stay updated on our latest products and promotions!
        </p>
        <div className="flex space-x-4 justify-center">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
            Facebook
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-pink-500 hover:underline">
            Instagram
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
            Twitter
          </a>
        </div>
      </motion.div>
    </div>
  );
}
