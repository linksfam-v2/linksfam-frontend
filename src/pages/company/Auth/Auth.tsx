import Input from "../../../components/Input/Input"
import { Formik } from "formik"
import { useMutation } from "@tanstack/react-query";
import { googleLogin, postLogin, postotp, postOtp } from "../../../services/company/auth/auth";
import { useEffect, useState } from "react";
import OTPInput from "react-otp-input";
import authStore from "../../../store/company/auth";
import { useLocation, useNavigate } from "react-router-dom";
import { USER_TYPE } from "../../../constants/conts";
import Logo from "../../../assets/images/Logo.svg";
import { GoogleLogin } from '@react-oauth/google';
import { URL } from "../../../constants/URL";
import { jwtDecode } from 'jwt-decode';
import { toast } from "react-toastify";
import { trackAuth, trackCustomEvent, setUserProperties } from "../../../services/Ga4Analytics";
import { Building2, Mail, Shield, ArrowRight } from "lucide-react";

const CompanyAuth = () => {

  const navigate = useNavigate();

  const { setCompanyUser } = authStore();

  const [toggleForm, setToggleForm] = useState(false);

  const [resendTimer, setResendTimer] = useState(30); // 30-second timer

  const [isTimerActive, setIsTimerActive] = useState(false); // Controls when the timer starts

  const location = useLocation(); // Get location at the top level

  const queryParams = new URLSearchParams(location.search);

  const shareParam = queryParams.get("share") || ""; // Extract `share` param

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isTimerActive && resendTimer > 0) {
      timer = setTimeout(() => setResendTimer((prev) => prev - 1), 1000);
    }
    if (resendTimer === 0) {
      setIsTimerActive(false); // Stop the timer when it reaches 0
    }
    return () => clearTimeout(timer); // Cleanup on unmount
  }, [resendTimer, isTimerActive]);

  const handleResendOtp = () => {
    resendOtp(email) // Call resend OTP API
    setResendTimer(30); // Reset the timer
    setIsTimerActive(true); // Start the timer
    
    // Track OTP resend event
    trackCustomEvent('otp_resend', {
      user_type: 'brand',
      method: 'email'
    });
  };

  const [otp, setOtp] = useState<string>("");

  const [email, setEmail] = useState<string>("");

  const { mutate, data } = useMutation({
    mutationFn: (email: string) => postLogin(email)
  });

  const { mutate: resendOtp } = useMutation({
    mutationFn: (email: string) => postotp(email)
  });

  const { mutate: otpMutate, data: otpData } = useMutation({
    mutationFn: ({ otp, email }: { otp: string, email: string }) => postOtp({ otp, email, share: shareParam })
  });

  const { mutate: fetchGoogleData, data: googleData, } = useMutation({
    mutationFn: ({ name, email }: { email: string, name: string }) => googleLogin(URL.googlelogin(), name, email, shareParam), // Function to fetch data
  });

  useEffect(() => {
    if (googleData?.data) {
      localStorage.setItem("token", googleData?.data?.token);
      localStorage.setItem("type", googleData?.data?.type);
      setCompanyUser(googleData?.data);
      
      // Track Google login success and set user properties
      trackAuth('google', 'success', {
        user_type: 'brand',
        signup_method: 'google'
      });
      
      // Set user properties for better analytics
      setUserProperties({
        user_type: 'brand',
        login_method: 'google'
      });
      
      // Track conversion event for successful signup/login
      trackCustomEvent('brand_auth_complete', {
        method: 'google',
        user_type: 'brand'
      });
    }
  }, [googleData])

  useEffect(() => {
    if (data?.code >= 400) {
      toast(data?.message || "Something went wrong!");
      
      // Track OTP request failure
      trackAuth('email', 'failure', {
        user_type: 'brand',
        error_message: data?.message,
        step: 'otp_request'
      });
    } else if (data?.code >= 200) {
      setToggleForm(true);
      setIsTimerActive(true); // Start the timer
      
      // Track successful OTP request
      trackCustomEvent('otp_requested', {
        user_type: 'brand',
        method: 'email'
      });
    } else { }
  }, [data]);

  useEffect(() => {
    if (otpData?.code >= 400) {
      toast(otpData?.message || "Something went wrong!");
      
      // Track OTP verification failure
      trackAuth('email', 'failure', {
        user_type: 'brand',
        error_message: otpData?.message,
        step: 'otp_verification'
      });
      return;
    } else if (otpData?.code >= 200) {
      // set LocalStorage
      if (otpData?.data?.token) {
        localStorage.setItem("token", otpData?.data?.token);
        localStorage.setItem("type", otpData?.data?.type);

        setCompanyUser(otpData?.data);
        
        // Track email login success and set user properties
        trackAuth('email', 'success', {
          user_type: 'brand',
          signup_method: 'email'
        });
        
        // Set user properties for better analytics
        setUserProperties({
          user_type: 'brand',
          login_method: 'email'
        });
        
        // Track conversion event for successful signup/login
        trackCustomEvent('brand_auth_complete', {
          method: 'email',
          user_type: 'brand'
        });
      }
    } else { }
  }, [otpData]);

  const otpHandler = (e: any) => {
    e.preventDefault();
    otpMutate({ otp, email });
  };

  useEffect(() => {
    const token = localStorage?.getItem("token");
    const type = localStorage?.getItem("type");
    if (token && type === USER_TYPE.COMPAMY) {
      navigate("/brand/create/");
    } else if (token && type === USER_TYPE.INFLUENCER) {
      navigate("/influencer/overview");
    }
  }, [localStorage?.getItem("token")])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-100/30 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-100/30 rounded-full translate-y-24 -translate-x-24"></div>
        <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-pink-100/20 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Header Section */}
          <div className="text-center mb-8">
            <a href="https://linksfam.com" className="inline-block mb-6">
              <img src={Logo} alt="LinksFam" className="h-12 w-auto mx-auto" />
            </a>
            <div className="mb-6">
              <div className="flex items-center justify-center mb-3">
                <Building2 className="text-purple-600 mr-2" size={24} />
                <h1 className="text-2xl font-bold text-gray-800">Brand Portal</h1>
              </div>
              <p className="text-gray-600 text-sm flex items-center justify-center space-x-2">
                <span>Link</span>
                <span className="text-purple-500">●</span>
                <span>Collaborate</span>
                <span className="text-blue-500">●</span>
                <span>Grow</span>
              </p>
            </div>
          </div>

          {/* Auth Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
            {/* Card Header */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white">
              <div className="flex items-center justify-center space-x-2">
                <Shield size={20} />
                <h2 className="text-xl font-semibold">
                  {!toggleForm ? 'Brand Login' : 'Verify Email'}
                </h2>
              </div>
              <p className="text-purple-100 text-sm text-center mt-2">
                {!toggleForm 
                  ? 'Access your brand dashboard' 
                  : 'Enter the OTP sent to your email'
                }
              </p>
            </div>

            {/* Card Content */}
            <div className="p-6 space-y-6">
              {!toggleForm ? (
                <Formik
                  key={'Email'}
                  initialValues={{ email: '' }}
                  validate={values => {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const errors: any = {};

                    const excludedDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com'];

                    const domain = values.email.split('@')[1];

                    if (!values?.email) {
                      errors.email = 'Email is a required field!';
                    } else if (
                      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
                    ) {
                      errors.email = 'Invalid email address!';
                    } else if (excludedDomains.includes(domain)) {
                      errors.email = 'Please enter a valid brand email address!';
                    }
                    return errors;
                  }}
                  onSubmit={async (values, { setSubmitting }) => {
                    setSubmitting(false);
                    setEmail(values?.email);
                    mutate(values?.email);
                  }}
                >
                  {({
                    values,
                    errors,
                    touched,
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    isSubmitting,
                  }) => (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="relative">
                        <Input
                          label="Brand Email"
                          hintText={errors.email}
                          isError={errors?.email && touched?.email}
                          name="email"
                          id="email"
                          value={values.email}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          type="text"
                          placeholder="Enter your brand email"
                          isRequired
                        />
                      </div>

                      <button
                        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium py-3 rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg flex items-center justify-center space-x-2"
                        disabled={isSubmitting}
                        type="submit"
                      >
                        <span>Proceed</span>
                        <ArrowRight size={16} />
                      </button>
                    </form>
                  )}
                </Formik>
              ) : (
                <form onSubmit={otpHandler} className="space-y-6">
                  <div className="text-center">
                    <label className="block text-lg font-semibold text-gray-800 mb-4">Verify Email</label>
                    <div className="bg-gray-50 rounded-2xl p-4 mb-4">
                      <OTPInput
                        value={otp}
                        onChange={setOtp}
                        numInputs={4}
                        inputStyle="w-12 h-12 mx-2 text-center text-xl font-bold border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none transition-colors bg-white"
                        renderSeparator={<span className="mx-1"></span>}
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        renderInput={(props: any) => <input type="text" {...props} />}
                        inputType='number'
                        skipDefaultStyles={true}
                      />
                    </div>
                    <p className="text-sm text-gray-600 mb-6">
                      The OTP has been sent to <span className="font-semibold text-purple-600">{email}</span>
                    </p>
                  </div>

                  <div className="space-y-4">
                    <button
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium py-3 rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg flex items-center justify-center space-x-2"
                      type="submit"
                    >
                      <span>Verify & Login</span>
                      <Shield size={16} />
                    </button>
                    
                    <div className="text-center">
                      <p
                        onClick={!isTimerActive ? handleResendOtp : undefined}
                        className={`text-sm cursor-pointer transition-colors ${
                          isTimerActive 
                            ? "text-gray-400 cursor-not-allowed" 
                            : "text-purple-600 hover:text-purple-800 font-medium"
                        }`}
                      >
                        <span>Haven't received the OTP?</span>{" "}
                        {isTimerActive ? (
                          <span className="text-gray-500">Resend OTP in {resendTimer}s</span>
                        ) : (
                          <span className="underline">Resend OTP</span>
                        )}
                      </p>
                    </div>
                  </div>
                </form>
              )}

              {!toggleForm && (
                <>
                  {/* Divider */}
                  <div className="flex items-center space-x-4">
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                    <p className="text-gray-500 font-medium text-sm">OR</p>
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                  </div>

                  {/* Google Login */}
                  <div className="w-full flex justify-center">
                    <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
                      <GoogleLogin
                        onSuccess={(credentialResponse) => {
                          const { email, name }: { email: string, name: string } = (jwtDecode(credentialResponse?.credential as string));
                          fetchGoogleData({ email, name });
                          
                          // Track Google login attempt
                          trackAuth('google', 'attempt', {
                            user_type: 'brand'
                          });
                        }}
                        onError={() => {
                          console.log('Login Failed');
                          
                          // Track Google login failure
                          trackAuth('google', 'failure', {
                            user_type: 'brand',
                            error_message: 'Google login failed'
                          });
                        }}
                        theme="outline"
                        size="large"
                        width="100%"
                        text="continue_with"
                        shape="rectangular"
                      />
                    </div>
                  </div>

                  {/* Switch to Creator */}
                  <div className="text-center pt-4 border-t border-gray-100">
                    <p 
                      onClick={() => navigate("/creator/login")} 
                      className="text-sm text-gray-600 cursor-pointer hover:text-purple-600 transition-colors"
                    >
                      <span>Are you a Creator?</span>{" "}
                      <span className="font-semibold text-purple-600 hover:underline">Continue here</span>
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Features */}
          <div className="mt-8 text-center">
            <div className="grid grid-cols-3 gap-4 text-xs text-gray-600">
              <div className="flex flex-col items-center space-y-1">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <Building2 size={16} className="text-purple-600" />
                </div>
                <span>Brand Dashboard</span>
              </div>
              <div className="flex flex-col items-center space-y-1">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Shield size={16} className="text-blue-600" />
                </div>
                <span>Secure Platform</span>
              </div>
              <div className="flex flex-col items-center space-y-1">
                <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center">
                  <Mail size={16} className="text-pink-600" />
                </div>
                <span>Email Verified</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CompanyAuth
