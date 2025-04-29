"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import loginPic from "@/public/auth/login_cart.svg";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { login } from "@/http/api";
import { Eye, EyeClosed, LoaderCircle } from "lucide-react";
import { useAppDispatch } from "@/lib/hooks";
import { addUserDetails } from "@/lib/store/features/user/authSlice";

interface FormFields {
  email: string;
  password: string;
}

interface ErrorResponse {
  message: string;
}

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().trim().min(6, "Password must be 6 character is long"),
});

const LoginPage = () => {
  const [isPasswordHide, setIsPasswordHide] = useState(true);
  const [errMsg, setErrMsg] = useState("");
  const router = useRouter();
  const dispatch = useAppDispatch();
  const mutation = useMutation({
    mutationFn: login,
    onSuccess: (response) => {
      console.log("res", response);
      const { refreshToken, userDetails, accessToken } = response.data;
      const { id, email, name } = userDetails;
      console.log("refreshToken,userDetails", refreshToken, userDetails);
      // dispatch call
      dispatch(
        addUserDetails({
          isLogin: true,
          accessToken,
          refreshToken,
          userId: id,
          useremail: email,
          userName: name,
        })
      );
      // Save user data in sessionStorage
      const user = { id, name, email, accessToken, refreshToken };
      sessionStorage.setItem("user", JSON.stringify(user));

      router.push('/')
    },
    onError: (err: AxiosError<ErrorResponse>) => {
      const errorMsg =
        err.response?.data.message || "Something went wrong.Try it again!";
      setErrMsg(errorMsg);
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormFields>({
    resolver: zodResolver(formSchema),
  });
  const onSubmit: SubmitHandler<FormFields> = (data) => {
    console.log(data);
    mutation.mutate(data);
  };
  return (
    <div className="container flex min-h-screen">
      {/* image */}
      <div className="hidden lg:flex items-center justify-center flex-1 bg-white text-black mt-12">
        <Image src={loginPic} alt="Picture of the women with cart" />
      </div>
      {/* form */}
      <div className="w-full  lg:w-1/2 flex items-center justify-center mt-12">
        <div className="max-w-md w-full p-6  rounded-lg shadow-md bg-sky-100">
          <h1 className="text-3xl font-semibold mb-6 text-black text-center">
            Login
          </h1>
          
          <h2 className="text-sm font-semibold mb-6 text-gray-500 text-center">
            Enter your email below to login to your account.
          </h2>
          <div className="mx-auto  text-center">
            {mutation.isError && (
                <span className=" mb-1 text-sm text-red-500 text-center ">
                    {errMsg}
                </span>
                )}
          </div>
            

          <div className="mt-4 flex flex-col lg:flex-row items-center justify-between lg:w-full ">
          
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-6 rounded border border-sky-200  p-8 bg-white rounded-tr-4xl rounded-bl-4xl shadow lg:w-full"
            >
              {/* <div className="relative">
                                <input id="userName"  type="text"
                                {...register("name")}
                                className="peer h-10 w-full border border-sky-400 text-gray-900 placeholder-transparent focus:outline-none focus:border-rose-600 p-2 rounded" placeholder="john@doe.com" />
                                
                                <label htmlFor="userName" className="absolute left-1 -top-3.5 text-gray-600 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm bg-slate-50 px-1">User name</label>
                                {errors.name && <span className="text-sm font-medium text-red-600"> {errors.name.message}</span> }
                            </div> */}
              <div className="relative">
                <input
                  id="email"
                  {...register("email")}
                  type="email"
                  className="peer h-10 w-full border border-sky-400 text-gray-900 placeholder-transparent focus:outline-none focus:border-rose-600 p-2 rounded"
                  placeholder="john@doe.com"
                />

                <label
                  htmlFor="email"
                  className="absolute left-1 -top-3.5 text-gray-600 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm bg-slate-50 px-1"
                >
                  Email address
                </label>
                {errors.email && (
                  <span className="text-sm font-medium text-red-600">
                    {" "}
                    {errors.email.message}
                  </span>
                )}
              </div>
              <div className="relative">
                <div className="flex">
                  <input
                    id="password"
                    {...register("password")}
                    type={`${isPasswordHide ? `password` : `text`}`}
                    className="peer h-10 w-full border border-sky-400 text-gray-900 placeholder-transparent focus:outline-none focus:border-rose-600 p-2 rounded"
                    placeholder="john@doe.com"
                  />
                  <span
                    className="absolute right-2 top-1.5 bg-white cursor-pointer"
                    onClick={() => {
                      setIsPasswordHide(!isPasswordHide);
                    }}
                  >
                    {isPasswordHide ? <EyeClosed /> : <Eye />}
                  </span>
                  <label
                    htmlFor="password"
                    className="absolute left-1 -top-3.5 text-gray-600 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm bg-slate-50 px-1 "
                  >
                    Password
                  </label>
                </div>
                {errors.password && (
                  <span className="text-sm font-medium text-red-600">
                    {errors.password.message}
                  </span>
                )}
              </div>
              {/* <div className="relative">
                                <input id="confirmPassword" {...register('confirmPassword')} type="password" className="peer h-10 w-full border border-sky-400 text-gray-900 placeholder-transparent focus:outline-none focus:border-rose-600 p-2 rounded" placeholder="john@doe.com" />
                                
                                <label htmlFor="confirmPassword" className="absolute left-1 -top-3.5 text-gray-600 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm bg-slate-50 px-1">Confirm password</label>
                                {errors.confirmPassword && <span className="text-sm font-medium text-red-600">{errors.confirmPassword.message}</span>}
                            </div> */}
              <button
                className={` bg-sky-400 hover:bg-sky-500 transition-colors text-stone-800 hover:text-stone-900 font-semibold w-full py-2 rounded-md mt-6 mb-4 flex items-center justify-center gap-2 ${
                  mutation.isPending ? "cursor-not-allowed opacity-45" : ""
                }`}
                type="submit"
                disabled={mutation.isPending}
              >
                {mutation.isPending && (
                  <span>
                    <LoaderCircle
                      strokeWidth={2}
                      className="text-bg-cta animate-spin"
                    />
                  </span>
                )}
                Submit
              </button>
              <div className="">
                <p className="text-sm ">
                  By continuing, I agree to the Terms of Use & Privacy Policy
                </p>

                <p className="font-normal ">
                  Don&apos;t have an Account?{" "}
                  <Link
                    href={"/register"}
                    className="font-semibold cursor-pointer hover:border-b-2 hover:border-amber-400"
                  >
                    Create Account
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

//client/src/components/BestSellerCard.tsx
//EnhancedSearchInput
// className='bg-sky-400 p-1 text-stone-800 font-medium hover:text-stone-900 rounded px-2 hover:bg-sky-500 shadow w-full'
