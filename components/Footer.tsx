import { Copyright, Facebook, Instagram, Store, Twitter } from "lucide-react";
// import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  const socialMedia = [
    { src: Facebook, alt: "facebook logo" },
    { src: Twitter, alt: "twitter logo" },
    { src: Instagram, alt: "instagram logo" },
  ];
  const footerLinks = [
    {
      title: "Products",
      links: [
        { name: "Electronics", link: "/category/Electronics" },
        { name: "Phone", link: "/category/Phone" },
        { name: "Laptop", link: "/category/Laptop" },
        { name: "Accessories", link: "/category/Accessories" },
      ],
    },
    {
      title: "Help",
      links: [
        { name: "About us", link: "/about" },
        { name: "FAQs", link: "/" },
        { name: "How it works", link: "/" },
        { name: "Privacy policy", link: "/" },
        { name: "Payment policy", link: "/" },
      ],
    },
    {
      title: "Get in touch",
      links: [
        { name: "dummy@abc.com", link: "mailto:dummy@abc.com" },
        { name: "+92554862354", link: "tel:+92554862354" },
      ],
    },
  ];
  return (
    <footer className="container mb-2 mt-4">
      <div className="flex justify-between items-start gap-20 flex-wrap max-lg:flex-col">
        <div className="flex flex-col items-start">
          <div className="flex items-center gap-2">
            <span className="sr-only"> Company Logo</span>
            <Link
              href={"/"}
              className="text-2xl font-bold text-indigo-600 flex items-center gap-1 flex-shrink-0  "
            >
              <Store />
              Shop
            </Link>
          </div>
          <p className="mt-6 text-base leading-7 font-montserrat text-white-400 sm:max-w-sm">
            All data displayed is for demonstration purposes only and intended
            to showcase my development skills. All images are sourced from
            publicly available data on Amazon for demonstration purposes only.
          </p>
          <div className="flex items-center gap-5 mt-8">
            {socialMedia.map((icon) => (
              <div
                className="flex justify-center items-center w-12 h-12 bg-white rounded-full"
                key={icon.alt}
              >
               
                <span>
                  <icon.src />
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-1 justify-between lg:gap-10 gap-20 flex-wrap">
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h4 className="font-montserrat text-2xl leading-normal font-medium mb-6 text-white">
                {section.title}
              </h4>
              <ul>
                {section.links.map((link) => (
                  <li
                    className="mt-3 font-montserrat text-base leading-normal text-white-400 hover:text-slate-gray"
                    key={link.name}
                  >
                    <Link href={link.link}>{link.name}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between text-white-400 mt-24 max-sm:flex-col max-sm:items-center">
        <div className="flex flex-1 justify-start items-center gap-2 font-montserrat cursor-pointer">
          <Copyright />
          <p>Copyright. All rights reserved.</p>
        </div>
        <p className="font-montserrat cursor-pointer">Terms & Conditions</p>
      </div>
    </footer>
  );
};

export default Footer;
