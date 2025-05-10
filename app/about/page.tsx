export default function AboutPage() {
  return (
    <section className="container mx-auto px-4 py-12 max-w-4xl ">
      <div className="min-h-screen  flex items-center justify-center">
        <div className="-mt-[40%]">
          <h1 className="text-4xl font-bold mb-4 text-indigo-600">About Us</h1>
          <p className="text-gray-700 text-lg mb-6">
            Welcome to <span className="font-semibold">Shop</span> — a demo
            eCommerce site built to showcase development skills using modern web
            technologies.
          </p>
          <p className="text-gray-600 mb-4">
            This platform simulates a complete online shopping experience using
            React, Next.js 15, Tailwind CSS, and backend technologies such as
            Node.js, Express, and MongoDB. All data displayed here is fictional
            and used solely for demonstration purposes.
          </p>
          <p className="text-gray-600">
            From user authentication to cart, wishlist, order management, and
            admin control — this site was built to highlight practical
            full-stack skills in action.
          </p>
        </div>
      </div>
    </section>
  );
}
