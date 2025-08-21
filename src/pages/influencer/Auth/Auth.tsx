import { Formik } from "formik"
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import OTPInput from "react-otp-input";
import { useLocation, useNavigate } from "react-router-dom";
import { googleLoginInf, postInfluencerLogin, postInfluencerOTP, postInfluencerOtp } from "../../../services/influencer/auth/auth";
import authInfluencerStore from "../../../store/influencer/auth";
import { USER_TYPE } from "../../../constants/conts";
import Logo from "../../../assets/images/Logo.svg";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { URL } from "../../../constants/URL";
import { toast } from "react-toastify";
import { trackAuth, trackCustomEvent, setUserProperties } from "../../../services/Ga4Analytics";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { Separator } from "../../../components/ui/separator";
import { Smartphone, Sparkles, ArrowRight, Timer, RotateCcw } from "lucide-react";

const InfluencerAuth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const shareParam = queryParams.get("share") || "";
  const redirectParam = queryParams.get("redirect") || null;
  const { setInfluencerUser, setGoogleName } = authInfluencerStore();
  const [resendTimer, setResendTimer] = useState(30);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [toggleForm, setToggleForm] = useState(false);
  const [otp, setOtp] = useState<string>("");
  const [phone, setPhone] = useState<string>("");

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isTimerActive && resendTimer > 0) {
      timer = setTimeout(() => setResendTimer((prev) => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendTimer, isTimerActive]);

  const { mutate, data } = useMutation({
    mutationFn: (phone: string) => postInfluencerLogin(phone)
  });

  const { mutate: otpMutate, data: otpData } = useMutation({
    mutationFn: ({ otp, phone }: { otp: string, phone: string }) => postInfluencerOtp({ otp, phone, share: shareParam })
  });

  const { mutate: resendOtp } = useMutation({
    mutationFn: (phone: string) => postInfluencerOTP(phone)
  });

  const { mutate: fetchGoogleData, data: googleData } = useMutation({
    mutationFn: ({ name, email }: { email: string, name: string }) => googleLoginInf(URL.googlelogin(), name, email, shareParam),
  });

  useEffect(() => {
    if (googleData?.data) {
      localStorage.setItem("token", googleData?.data?.token);
      localStorage.setItem("type", googleData?.data?.type);
      setInfluencerUser(googleData?.data);
      
      trackAuth('google', 'success', {
        user_type: 'influencer',
        signup_method: 'google'
      });
      
      setUserProperties({
        user_type: 'influencer',
        login_method: 'google'
      });
      
      trackCustomEvent('influencer_auth_complete', {
        method: 'google',
        user_type: 'influencer'
      });
    }
  }, [googleData])

  useEffect(() => {
    if (data?.code >= 400) {
      toast(data?.message || "Something went wrong!");
      
      trackAuth('phone', 'failure', {
        user_type: 'influencer',
        error_message: data?.message,
        step: 'otp_request'
      });
    } else if (data?.code >= 200) {
      setToggleForm(true);
      setIsTimerActive(true);
      
      trackCustomEvent('otp_requested', {
        user_type: 'influencer',
        method: 'phone'
      });
    }
  }, [data])

  useEffect(() => {
    if (otpData?.code >= 400) {
      toast(otpData?.message || "Something went wrong!");
      
      trackAuth('phone', 'failure', {
        user_type: 'influencer',
        error_message: otpData?.message,
        step: 'otp_verification'
      });
      return;
    } else if (otpData?.code >= 200) {
      if (otpData?.data?.token) {
        localStorage.setItem("token", otpData?.data?.token);
        localStorage.setItem("type", otpData?.data?.type);
        setInfluencerUser(otpData?.data);
        
        trackAuth('phone', 'success', {
          user_type: 'influencer',
          signup_method: 'phone'
        });
        
        setUserProperties({
          user_type: 'influencer',
          login_method: 'phone'
        });
        
        trackCustomEvent('influencer_auth_complete', {
          method: 'phone',
          user_type: 'influencer'
        });
      }
    }
  }, [otpData])

  const otpHandler = (e: any) => {
    e.preventDefault();
    otpMutate({ otp, phone });
  };

  const handleResendOtp = () => {
    resendOtp(phone);
    setResendTimer(30);
    setIsTimerActive(true);
    
    trackCustomEvent('otp_resend', {
      user_type: 'influencer',
      method: 'phone'
    });
  };

  useEffect(() => {
    const token = localStorage?.getItem("token");
    const type = localStorage?.getItem("type");
    if (redirectParam && token) {
      navigate("/partner/" + redirectParam);
    } else {
      if (token && type === USER_TYPE.COMPAMY) {
        navigate("/brand/links");
      } else if (token && type === USER_TYPE.INFLUENCER) {
        navigate("/creator/create");
      }
    }
  }, [localStorage?.getItem("token")])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-pink-400 to-red-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-gradient-to-br from-indigo-400 to-cyan-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <a href="https://linksfam.com" className="hover:scale-105 transition-transform duration-300">
                <img src={Logo} alt="LinksFam" className="h-12 w-auto" />
              </a>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2 text-sm font-medium text-gray-600">
                <span>Link</span>
                <Sparkles className="h-4 w-4 text-purple-500" />
                <span>Collaborate</span>
                <Sparkles className="h-4 w-4 text-blue-500" />
                <span>Grow</span>
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Creator Login
              </h1>
              <p className="text-gray-600 text-sm">
                Welcome back! Let's continue your journey
              </p>
            </div>
          </div>

          {/* Main Auth Card */}
          <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-2xl shadow-purple-500/10">
            <CardHeader className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                  <Smartphone className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg">
                    {!toggleForm ? "Enter your phone number" : "Verify your phone"}
                  </CardTitle>
                  <CardDescription>
                    {!toggleForm 
                      ? "We'll send you a verification code" 
                      : "Enter the 4-digit code we sent to your phone"
                    }
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {!toggleForm ? (
                <Formik
                  initialValues={{ phone: '' }}
                  validate={values => {
                    const errors: any = {};
                    if (!values?.phone) {
                      errors.phone = 'Phone number is required';
                    } else if (values?.phone.toString().length !== 10) {
                      errors.phone = 'Enter a valid 10-digit mobile number';
                    }
                    return errors;
                  }}
                  onSubmit={async (values, { setSubmitting }) => {
                    setSubmitting(false);
                    setPhone(values?.phone);
                    mutate(values?.phone);
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
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-sm font-medium">
                          Phone Number
                        </Label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-500 text-sm">+91</span>
                          </div>
                          <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            placeholder="Enter your phone number"
                            value={values.phone}
                            onChange={(e) => {
                              const trimmedValue = e.target.value.replace(/\s/g, "");
                              handleChange({ target: { name: "phone", value: trimmedValue } });
                            }}
                            onBlur={handleBlur}
                            className={`pl-12 h-12 text-base ${
                              errors?.phone && touched?.phone 
                                ? 'border-red-500 focus:border-red-500' 
                                : 'border-gray-200 focus:border-blue-500'
                            }`}
                            maxLength={10}
                          />
                        </div>
                        {errors?.phone && touched?.phone && (
                          <p className="text-red-500 text-sm flex items-center gap-1">
                            <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                            {errors.phone}
                          </p>
                        )}
                      </div>

                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        {isSubmitting ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Sending...</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span>Send OTP</span>
                            <ArrowRight className="h-4 w-4" />
                          </div>
                        )}
                      </Button>
                    </form>
                  )}
                </Formik>
              ) : (
                <form onSubmit={otpHandler} className="space-y-6">
                  <div className="space-y-4">
                    <div className="text-center">
                      <Label className="text-sm font-medium text-gray-700">
                        Enter verification code
                      </Label>
                    </div>
                    
                    <div className="flex justify-center">
                      <OTPInput
                        value={otp}
                        onChange={setOtp}
                        numInputs={4}
                        renderSeparator={<span className="w-2"></span>}
                        renderInput={(props: any) => (
                          <input
                            {...props}
                            className="w-12 h-12 text-center text-lg font-semibold border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                          />
                        )}
                        inputType="number"
                        skipDefaultStyles={true}
                      />
                    </div>

                    <div className="text-center">
                      <p className="text-sm text-gray-600">
                        We sent a 4-digit code to <span className="font-medium">+91 {phone}</span>
                      </p>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <div className="flex items-center gap-2">
                      <span>Verify & Continue</span>
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </Button>

                  <div className="text-center">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={resendTimer === 0 ? handleResendOtp : undefined}
                      disabled={resendTimer > 0}
                      className={`text-sm ${
                        resendTimer > 0 
                          ? 'text-gray-400 cursor-not-allowed' 
                          : 'text-blue-600 hover:text-blue-700'
                      }`}
                    >
                      {resendTimer > 0 ? (
                        <div className="flex items-center gap-2">
                          <Timer className="h-4 w-4" />
                          <span>Resend in {resendTimer}s</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <RotateCcw className="h-4 w-4" />
                          <span>Resend OTP</span>
                        </div>
                      )}
                    </Button>
                  </div>
                </form>
              )}

              {!toggleForm && (
                <>
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <Separator className="w-full" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white px-2 text-gray-500">Or continue with</span>
                    </div>
                  </div>

                  <div className="w-full flex justify-center">
                    <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
                      <GoogleLogin
                        onSuccess={(credentialResponse) => {
                          const { email, name }: { email: string, name: string } = (jwtDecode(credentialResponse?.credential as string));
                          fetchGoogleData({ email, name });
                          setGoogleName(name);
                          
                          trackAuth('google', 'attempt', {
                            user_type: 'influencer'
                          });
                        }}
                        onError={() => {
                          console.log('Login Failed');
                          
                          trackAuth('google', 'failure', {
                            user_type: 'influencer',
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
                </>
              )}
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              By continuing, you agree to our{' '}
              <a href="/terms" className="text-blue-600 hover:text-blue-700 font-medium">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="/privacy" className="text-blue-600 hover:text-blue-700 font-medium">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InfluencerAuth
