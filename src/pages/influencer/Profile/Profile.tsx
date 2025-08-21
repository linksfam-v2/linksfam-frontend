import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { URL } from "../../../constants/URL";
import { getInfluencerId, influencerCreate } from "../../../services/influencer/profile/profile";
import { Formik } from "formik";
import Input from "../../../components/Input/Input";
import influencerAuthStore from "../../../store/company/influencerAuth";
import authInfluencerStore from "../../../store/influencer/auth";
import { trackCustomEvent, trackConversion, setUserProperties } from "../../../services/Ga4Analytics";
import RateCardForm from "../../../components/RateCardForm/RateCardForm";
import { createRateCard } from "../../../services/influencer/rate-card/rate-card";
// import YT from "../../../assets/images/youtube.png";
const InfluencerProfile = () => {
  const navigate = useNavigate();
  const [showProfileForm, setShowProfileForm] = useState(false);

  const { setInfluencerId  } = influencerAuthStore();

  const { googleName = "" } = authInfluencerStore();

  // Rate card mutation
  const { mutate: createRateCardMutate, isPending: isRateCardSubmitting } = useMutation({
    mutationFn: createRateCard,
    onSuccess: (data) => {
      // Track successful rate card creation
      trackCustomEvent('rate_card_created', {
        user_type: 'influencer',
        rate_card_id: data.data.id,
        has_instagram_rates: !!(data.data.reelCharge || data.data.storyCharge || data.data.carouselPostCharge),
        has_youtube_rates: !!(data.data.youtubeShortCharge || data.data.youtubeIntegrationCharge || data.data.youtubeDedicatedVideoCharge),
        has_custom_package: !!data.data.customComboPackage,
        available_for_barter: data.data.availableForBarterDeals
      });
      
      // Show profile form after rate card is created
      setShowProfileForm(true);
    },
    onError: (error: any) => {
      // Check if rate card already exists
      if (error?.response?.data?.code === 400 && 
          error?.response?.data?.message === "Rate card already exists. Use update endpoint to modify") {
        // Rate card already exists, proceed to next step (profile form)
        trackCustomEvent('rate_card_already_exists', {
          user_type: 'influencer',
          action: 'proceed_to_profile'
        });
        setShowProfileForm(true);
      } else {
        // Track rate card creation failure for other errors
        trackCustomEvent('rate_card_creation_failed', {
          user_type: 'influencer',
          error_message: error?.message || 'Unknown error'
        });
      }
    }
  });

  const { mutate, data } = useMutation({
    mutationFn: ({ name, city, whatsapp, email }: { name: string, city: string, whatsapp: string, email: string }) => influencerCreate({ name, city, whatsapp, email }),
    onSuccess: (_data) => {
      // Track successful profile creation
      trackCustomEvent('profile_created', {
        user_type: 'influencer',
        method: 'form_submission',
        has_google_name: !!googleName,
        has_whatsapp: !!_data?.whatsapp,
        has_email: !!_data?.email,
        collaboration_consent: true // Since form can only be submitted if this is checked
      });
      
      // Track signup completion conversion
      trackConversion('sign_up', 1);
      
      // Set additional user properties
      setUserProperties({
        profile_completed: true,
        signup_source: googleName ? 'google_prefilled' : 'manual'
      });
    },
    onError: (error) => {
      // Track profile creation failure
      trackCustomEvent('profile_creation_failed', {
        user_type: 'influencer',
        error_message: error?.message || 'Unknown error',
        has_google_name: !!googleName
      });
    }
  });

  const { data: profile, isLoading } = useQuery({
    queryKey: ['INFLUENCER_PROFILE'],
    queryFn: () => getInfluencerId(URL.infuencerProfileGet),
  });

  // const handleYT = () => {
  //   window.location.href = `${BASEURL}/social/yt/connect`;
  // };

  useEffect(() => {
    if (data?.data?.id) {
      setInfluencerId(data?.data?.id);
      
      // Track successful profile setup completion
      trackCustomEvent('influencer_onboarding_complete', {
        user_type: 'influencer',
        influencer_id: data?.data?.id,
        signup_method: googleName ? 'google' : 'phone'
      });
      
      navigate("/creator/home");
    }
  }, [data]);

  useEffect(() => {
    if (profile?.data?.length > 0 && !isLoading) {
      // Track returning user with existing profile
      trackCustomEvent('existing_profile_detected', {
        user_type: 'influencer',
        profile_count: profile?.data?.length
      });
      
      // Only redirect if the profile has a name (indicates completed profile)
      // This prevents redirect on page refresh when profile is incomplete
      if (profile?.data?.[0]?.name) {
        navigate('/creator/home');
      }
    }
  }, [profile, isLoading, navigate]);

  // Track page view for profile creation
  useEffect(() => {
    if (showProfileForm) {
      trackCustomEvent('profile_page_viewed', {
        user_type: 'influencer',
        has_google_name: !!googleName,
        step: 'profile_creation'
      });
    } else {
      trackCustomEvent('rate_card_page_viewed', {
        user_type: 'influencer',
        has_google_name: !!googleName,
        step: 'rate_card_setup'
      });
    }
  }, [showProfileForm, googleName]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  // Show rate card form first, then profile form
  if (!showProfileForm) {
    return (
      <RateCardForm
        onSubmit={createRateCardMutate}
        isSubmitting={isRateCardSubmitting}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-4 sm:p-6 lg:p-8">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-100/20 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-100/20 rounded-full translate-y-24 -translate-x-24"></div>
      </div>

      <div className="relative z-10 max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Complete Your Profile</h1>
          <p className="text-gray-600">Please fill in your details to get started</p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="p-6 sm:p-8">
            <Formik
              key={'InfluencerCreate'}
              initialValues={{ name: googleName, city: "", whatsapp: "", email: "", allowContact: true }}
              validate={values => {
                const errors: any = {};

                if (!values?.name?.trim()) {
                  errors.name = 'Name is a required!';
                }

                if (!values?.city?.trim()) {
                  errors.city = 'City is a required!';
                }

                // At least one of email or whatsapp must be provided
                if (!values?.email?.trim() && !values?.whatsapp?.trim()) {
                  errors.email = 'Either email or WhatsApp number is required!';
                  errors.whatsapp = 'Either email or WhatsApp number is required!';
                }

                // Validate email format if provided
                if (values?.email?.trim()) {
                  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                  if (!emailRegex.test(values.email)) {
                    errors.email = 'Please enter a valid email address!';
                  }
                }

                // Validate whatsapp format if provided
                if (values?.whatsapp?.trim()) {
                  const whatsappRegex = /^[+]?[1-9][\d]{0,15}$/;
                  if (!whatsappRegex.test(values.whatsapp.replace(/\s/g, ''))) {
                    errors.whatsapp = 'Please enter a valid WhatsApp number!';
                  }
                }

                // Validate collaboration consent checkbox
                if (!values?.allowContact) {
                  errors.allowContact = 'You must agree to allow contact for collaboration opportunities to continue.';
                }

                return errors;
              }}
              onSubmit={async (values, { setSubmitting, resetForm }) => {
                setSubmitting(false);

                // Track profile creation attempt
                trackCustomEvent('profile_creation_attempted', {
                  user_type: 'influencer',
                  has_name: !!values?.name?.trim(),
                  has_city: !!values?.city?.trim(),
                  has_email: !!values?.email?.trim(),
                  has_whatsapp: !!values?.whatsapp?.trim(),
                  name_source: googleName ? 'google_prefilled' : 'manual_entry',
                  collaboration_consent: values?.allowContact
                });

                mutate({ 
                  name: values?.name, 
                  city: values?.city,
                  whatsapp: values?.whatsapp?.trim(),
                  email: values?.email?.trim()
                });
                resetForm();
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
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <Input
                    label="Confirm Your Name"
                    hintText={errors.name}
                    isError={errors?.name && touched?.name}
                    name="name"
                    id="name"
                    value={values.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    type="text"
                    placeholder="Enter Your Name"
                    isRequired
                  />

                  <Input
                    label="Your City"
                    hintText={errors.city}
                    isError={errors?.city && touched?.city}
                    name="city"
                    id="city"
                    value={values.city}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    type="text"
                    placeholder="Enter Your City"
                    isRequired
                  />

                  <Input
                    label="Email Address"
                    hintText={errors.email}
                    isError={errors?.email && touched?.email}
                    name="email"
                    id="email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    type="email"
                    placeholder="Enter Your Email"
                  />

                  <Input
                    label="WhatsApp Number"
                    hintText={errors.whatsapp}
                    isError={errors?.whatsapp && touched?.whatsapp}
                    name="whatsapp"
                    id="whatsapp"
                    value={values.whatsapp}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    type="tel"
                    placeholder="Enter Your WhatsApp Number"
                  />

                  <div className="bg-gray-50 rounded-xl p-4">
                    <label className="flex items-start space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="allowContact"
                        checked={values.allowContact}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="mt-1 w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 focus:ring-2"
                      />
                      <div>
                        <span className="text-sm font-medium text-gray-800">
                          I agree to allow people to contact me for collaboration opportunities on the email and WhatsApp number provided above.*
                        </span>
                        {errors.allowContact && touched.allowContact && (
                          <p className="text-red-600 text-sm mt-1">
                            {errors.allowContact}
                          </p>
                        )}
                      </div>
                    </label>
                  </div>

                  <div className="flex justify-center pt-4">
                    <button
                      disabled={isSubmitting}
                      type="submit"
                      className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl font-medium transition-all duration-300 transform hover:scale-[1.02] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? 'Creating Profile...' : 'Complete SignUp'}
                    </button>
                  </div>
                </form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InfluencerProfile