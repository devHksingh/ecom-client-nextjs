// import Image from "next/image";
"use client";

import Carousel from "@/components/Carousel";
// import ImageCarousel from "@/components/ImageCarousel";
import useToast from "@/hook/useToast";

export default function Home() {
  const toast = useToast();
  const carouselItems = [
    {
      id: 1,
      imgSrc: '/assets/Boldfit_Badminton_Shoes-removebg-preview.webp',
      title: 'Find Your Sole Mate',
      description: 'Shoes for work, play, and everything between.',
      tagLine:"All-day support without sacrificing looks.",
      color: "bg-amber-100"
    },
    {
      id: 2,
      imgSrc: '/assets/Dell_Alienware_m16_R1-removebg-preview.webp',
      title: 'Power Up Productivity',
      description: 'Laptops made to work, play, and create faster.',
      tagLine:"From gaming to grind—performance meets design.",
      color: "bg-blue-100"
    },
    {
      id: 3,
      imgSrc: '/assets/MacBook_Air_15-removebg-preview.webp',
      title: 'Sleek Meets Smart',
      description: 'From coffee shops to boardrooms, the MacBook Air 15” brings effortless portability and all-day battery life to your daily workflow.',
      tagLine:"New Arrival: Built to Impress, Ready to Go",
      color: "bg-amber-100"
    },
    {
      id: 4,
      imgSrc: '/assets/Fossil_Men_Leather-removebg-preview.webp',
      title: 'Timeless Craftsmanship in Leather',
      description: 'Elevate your everyday look with Fossil’s premium leather collection—where rugged charm meets refined detail. Perfectly aged, endlessly versatile.',
      tagLine:"Featured: Classic Meets Modern Elegance",
      color: "bg-blue-100"
    },
    {
      id: 5,
      imgSrc: '/assets/Sony_WH-1000XM5-removebg-preview.webp',
      title: 'Crystal Clear Sound',
      description: 'Wireless audio that doesn’t miss a beat.',
      tagLine:" Featured: Studio-Quality Sound Anywhere",
      color: "bg-green-100"
    },
    {
      id: 6,
      imgSrc: '/assets/Men_s_Casual_Shirt1-removebg-preview.webp',
      title: 'New Arrivals: Elegant Essentials',
      description: 'Streetwear, formal, or laid-back. Dress the way you feel.',
      tagLine:"From errands to evenings out—dress with ease.",
      color: "bg-orange-100"
    },
    {
      id: 7,
      imgSrc: '/assets/twilightGray.png',
      title: 'Silence the World, Hear the Music',
      description: 'With active noise cancellation and long battery life, tune in to what matters most.',
      tagLine:"Sleek, sharp, and seriously powerful.",
      color: "bg-green-100"
    },
  ];
  const showSuccessToast = () => {
    console.log("btn click");
    
    toast.success("Success!", "Your action was completed successfully.", 5000);
  };

  const showErrorToast = () => {
    toast.error("Error!", "Something went wrong. Please try again.", 5000);
  };

  const showInfoToast = () => {
    toast.info("Information", "This is an informational message.", 5000);
  };

  const showDefaultToast = () => {
    toast.default("Note", "This is a default notification.", 5000);
  };
  return (
    <div className="container bg-white">
      <div className=" mx-auto py-4">
      
      {/* <ImageCarousel items={carouselItems} autoSlideInterval={5000} /> */}
    </div>
    <div>
      <Carousel items={carouselItems} autoSlideInterval={5000}/>
    </div>
      <p className="font-text font-medium">sdfsfsdfesf</p>
      <div className="flex flex-col space-y-4">
        <button
          onClick={showSuccessToast}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Show Success Toast
        </button>

        <button
          onClick={showErrorToast}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Show Error Toast
        </button>

        <button
          onClick={showInfoToast}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Show Info Toast
        </button>

        <button
          onClick={showDefaultToast}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Show Default Toast
        </button>
      </div>
    </div>
  );
}

/*
const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

<div className="min-h-screen flex items-center justify-center">
      <button
        onClick={openModal}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Open Modal
      </button>

      <Modal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        title="Example Modal"
      >
        <p className="text-gray-600">
          This is an example modal that closes when you click outside of it.
          You can put any content here you want.
        </p>
        
        <div className="mt-4">
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Example input field"
          />
        </div>
      </Modal>
    </div>
*/
