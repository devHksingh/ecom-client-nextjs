"use client";

import Image from "next/image";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useToast from "@/hook/useToast";

const formSchema = z.object({
  name: z.string().trim().min(1, "UserName is required"),
  email: z.string().email(),
  message: z.string().trim().min(1, "Message is required"),
});

interface FormFields {
  name: string;
  email: string;
  message: string;
}

export default function ContactPage() {
  const toast = useToast();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormFields>({
    resolver: zodResolver(formSchema),
  });
  const onSubmit: SubmitHandler<FormFields> = () => {
    // console.log(data);
    toast.success(
      "Your message has been sent successfully.",
      "Our team will get back to you shortly."
    );
    reset();
  };

  return (
    <section className="min-h-screen flex flex-col lg:flex-row bg-white">
      {/* Image Section */}
      <div className=" hidden lg:flex lg:w-1/2 w-full relative h-64 lg:h-auto">
        <Image
          src="/assets/contact imgae_webp_compressed.webp"
          alt="Contact Illustration"
          layout="fill"
          objectFit="cover"
          className="rounded"
          priority
        />
      </div>

      {/* Form Section */}
      <div className="lg:w-1/2 w-full flex items-center justify-center p-8">
        <div className="max-w-md w-full">
          <h1 className="text-4xl font-bold text-indigo-600 mb-6">
            Contact Us
          </h1>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Your Name
              </label>
              <input
                type="text"
                required
                {...register("name")}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring focus:ring-indigo-300"
              />
              {errors.name && (
                <span className="text-sm font-medium text-red-600">
                  {errors.name.message}
                </span>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                required
                {...register("email")}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring focus:ring-indigo-300"
              />
              {errors.email && (
                <span className="text-sm font-medium text-red-600">
                  {errors.email.message}
                </span>
              )}
            </div>

            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-700"
              >
                Message
              </label>
              <textarea
                rows={4}
                required
                {...register("message")}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring focus:ring-indigo-300"
              />
              {errors.message && (
                <span className="text-sm font-medium text-red-600">
                  {errors.message.message}
                </span>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
