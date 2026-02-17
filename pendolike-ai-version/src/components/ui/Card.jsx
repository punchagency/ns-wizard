import { motion } from 'framer-motion'

const Card = ({ children, className = '', hover = true, ...props }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={hover ? { y: -4, transition: { duration: 0.2 }, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)' } : {}}
      className={`bg-white rounded-xl shadow-md border border-gray-200 p-6 transition-shadow duration-200 ${hover ? 'hover:shadow-lg' : ''} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export default Card
