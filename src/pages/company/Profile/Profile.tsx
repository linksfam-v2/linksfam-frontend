import { useMutation, useQuery } from "@tanstack/react-query";
import { URL } from "../../../constants/URL";
import { getCompanyProfile } from "../../../services/company/profile/profile";
import { useEffect, useState } from "react";
import { CompanyProfile } from "./types";
import { Formik } from "formik";
import { companyCreate } from "../../../services/company/create/create";
import { useNavigate } from "react-router-dom";
import Input from "../../../components/Input/Input";
import { USER_TYPE } from "../../../constants/conts";
import Bounce from "../../../assets/images/Bounce.svg";
import { getLocationDetails } from "./utils";
import { toast } from "react-toastify";
import { 
  Building2, 
  Globe, 
  MapPin, 
  User, 
  Phone, 
  Briefcase, 
  Hash,
  Save,
  LogOut,
  Edit3,
  Shield,
  Users,
  Link as LinkIcon,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Github,
  Linkedin
} from "lucide-react";

const Profile = () => {

  const navigate = useNavigate();

  const [profile, setProfile] = useState<CompanyProfile>();

  const [latlng, setlatlng] = useState("");

  const [locs, setLocs] = useState("");

  const [activeTab, setActiveTab] = useState<'basic' | 'contact' | 'social'>('basic');

  const { data, isLoading } = useQuery({
    queryKey: ['COMPANY_PROFILE'],
    queryFn: () => getCompanyProfile(URL.getCompanyProfile),
  });

  useEffect(() => {
    if (data?.data?.length) {
      setProfile(data?.data[0]);
    }
  }, [data]);

  const { mutate, data: profileData } = useMutation({
    mutationFn: ({
      name,
      url,
      gst,
      nameOfPerson,
      phoneOfPerson,
      desgOfPerson,
      country,
      areaOfSpecialty,
      fb,
      instagram,
      linkedin,
      git,
      x,
      yt,
      pin,
      snap,
      tiktok,
      twitch,
      latlng
    }: {
      name: string;
      url: string;
      gst?: string;
      nameOfPerson?: string;
      phoneOfPerson?: string;
      desgOfPerson?: string;
      country?: string;
      areaOfSpecialty?: string;
      fb?: string;
      instagram?: string;
      linkedin?: string;
      git?: string;
      x?: string;
      yt?: string;
      pin?: string;
      snap?: string;
      tiktok?: string;
      twitch?: string;
      latlng?: string;
    }) =>
      companyCreate({
        name,
        url,
        gst,
        nameOfPerson,
        phoneOfPerson,
        desgOfPerson,
        country,
        areaOfSpecialty,
        fb,
        instagram,
        linkedin,
        git,
        x,
        yt,
        pin,
        snap,
        tiktok,
        twitch,
        latlng
      }),
  });

  useEffect(() => {
    if (profileData?.data?.id && profileData?.code >= 200) {
      navigate("/brand/profile");
      toast('Successfully Updated!');
    } else if (profileData?.code >= 400) {
      toast('Something went wrong! Try Again Later');
    }
  }, [profileData]);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          setlatlng(`${position.coords.latitude},${position.coords.longitude}`);
          console.log(latlng);
          const result = await getLocationDetails(position.coords.latitude, position.coords.longitude);
          setLocs(result?.address?.state_district || result?.address?.country);
        },
        (_error) => {
          console.log(_error);
          setlatlng("");
        }
      );
    } else {
      setlatlng('');
    }
  }, [data]);

  const logout = () => {
    const type = localStorage.getItem("type");
    localStorage.removeItem("token");
    localStorage.removeItem("type");
    if (type === USER_TYPE.COMPAMY) {
      navigate("/brand/login");
    } else {
      navigate("/creator/login");
    }
  }

  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'facebook': case 'fb': return <Facebook size={16} />;
      case 'instagram': return <Instagram size={16} />;
      case 'twitter': case 'x': return <Twitter size={16} />;
      case 'linkedin': return <Linkedin size={16} />;
      case 'youtube': case 'yt': return <Youtube size={16} />;
      case 'github': case 'git': return <Github size={16} />;
      default: return <LinkIcon size={16} />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <img src={Bounce} alt="LinksFam" className="h-16 w-auto mx-auto mb-4" />
            <div className="absolute -inset-4 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-full blur-xl"></div>
          </div>
          <p className="text-gray-600 font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-100/20 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-100/20 rounded-full translate-y-24 -translate-x-24"></div>
      </div>

      <div className="relative z-10 p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Brand Profile</h1>
              <p className="text-gray-600">Manage your company information and social presence</p>
            </div>
            <button
              onClick={logout}
              className="flex items-center space-x-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors font-medium"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>

          {profile?.name && (
            <Formik
              key={'CompanyUpdate'}
              initialValues={{
                name: profile?.name,
                url: profile?.url,
                gst: profile?.gst,
                nameOfPerson: profile?.nameOfPerson,
                phoneOfPerson: profile?.phoneOfPerson,
                desgOfPerson: profile?.desgOfPerson,
                country: profile.country,
                areaOfSpecialty: profile?.areaOfSpecialty,
                fb: profile?.fb,
                instagram: profile?.instagram,
                linkedin: profile?.linkedin,
                git: profile?.git,
                x: profile?.x,
                yt: profile?.yt,
                pin: profile?.pin,
                snap: profile?.snap,
                tiktok: profile?.tiktok,
                twitch: profile?.twitch,
              }}
              validate={values => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const errors: any = {};
                if (!values?.name) {
                  errors.name = 'Name is a required field!';
                }
                if (!values?.url) {
                  errors.url = 'URL is a required field!';
                }

                if (
                  !/^(https?:\/\/)([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}\/?/.test(values?.url!)
                ) {
                  errors.url = 'Please enter a valid URL starting with http or https!';
                }
                if (values.phoneOfPerson && (values.phoneOfPerson.length !== 10 || !/^\d+$/.test(values.phoneOfPerson))) {
                  errors.phoneOfPerson = 'Please enter a valid phone number!';
                }

                return errors;
              }}
              onSubmit={async (values, { setSubmitting }) => {
                setSubmitting(false);
                const filterValues: any = { ...values };
                for (let i in filterValues) {
                  filterValues[i] = filterValues[i]?.toString()?.trim();
                }

                mutate({ ...filterValues, latlng });
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
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                  {/* Form Header */}
                  <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                        <Edit3 size={24} />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold">Update Profile</h2>
                        <p className="text-purple-100 text-sm">Keep your brand information up to date</p>
                      </div>
                    </div>
                  </div>

                  {/* Tabs */}
                  <div className="border-b border-gray-200">
                    <div className="flex space-x-0 bg-gray-50">
                      <button
                        type="button"
                        onClick={() => setActiveTab('basic')}
                        className={`flex-1 flex items-center justify-center space-x-2 py-4 px-6 text-sm font-medium transition-colors ${
                          activeTab === 'basic'
                            ? 'bg-white text-purple-600 border-b-2 border-purple-600'
                            : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                        }`}
                      >
                        <Building2 size={16} />
                        <span>Basic Info</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab('contact')}
                        className={`flex-1 flex items-center justify-center space-x-2 py-4 px-6 text-sm font-medium transition-colors ${
                          activeTab === 'contact'
                            ? 'bg-white text-purple-600 border-b-2 border-purple-600'
                            : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                        }`}
                      >
                        <Users size={16} />
                        <span>Contact Details</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab('social')}
                        className={`flex-1 flex items-center justify-center space-x-2 py-4 px-6 text-sm font-medium transition-colors ${
                          activeTab === 'social'
                            ? 'bg-white text-purple-600 border-b-2 border-purple-600'
                            : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                        }`}
                      >
                        <LinkIcon size={16} />
                        <span>Social Media</span>
                      </button>
                    </div>
                  </div>

                  {/* Form Content */}
                  <form onSubmit={handleSubmit} className="p-6">
                    {/* Basic Information Tab */}
                    {activeTab === 'basic' && (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2 mb-2">
                              <Building2 size={16} className="text-purple-600" />
                              <label className="text-sm font-medium text-gray-700">Brand Name *</label>
                            </div>
                            <Input
                              hintText={errors.name}
                              isError={errors?.name && touched?.name}
                              name="name"
                              id="name"
                              value={values.name}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              type="text"
                              placeholder="Enter Company Name"
                              isRequired
                            />
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center space-x-2 mb-2">
                              <Globe size={16} className="text-blue-600" />
                              <label className="text-sm font-medium text-gray-700">Brand URL *</label>
                            </div>
                            <Input
                              hintText={errors.url}
                              isError={errors?.url && touched?.url}
                              name="url"
                              id="url"
                              value={values.url}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              type="text"
                              placeholder="https://yourbrand.com"
                              isRequired
                            />
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center space-x-2 mb-2">
                              <MapPin size={16} className="text-green-600" />
                              <label className="text-sm font-medium text-gray-700">City</label>
                            </div>
                            <Input
                              hintText={errors.country}
                              isError={errors?.country && touched?.country}
                              name="country"
                              id="country"
                              value={values?.country || locs}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              type="text"
                              placeholder="Enter City"
                            />
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center space-x-2 mb-2">
                              <Briefcase size={16} className="text-orange-600" />
                              <label className="text-sm font-medium text-gray-700">Industry Sector</label>
                            </div>
                            <Input
                              hintText={errors.areaOfSpecialty}
                              isError={errors?.areaOfSpecialty && touched?.areaOfSpecialty}
                              name="areaOfSpecialty"
                              id="areaOfSpecialty"
                              value={values?.areaOfSpecialty || ''}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              type="text"
                              placeholder="e.g., Technology, Fashion, Food"
                            />
                          </div>

                          <div className="space-y-2 md:col-span-2">
                            <div className="flex items-center space-x-2 mb-2">
                              <Hash size={16} className="text-purple-600" />
                              <label className="text-sm font-medium text-gray-700">GSTIN</label>
                            </div>
                            <Input
                              hintText={errors.gst}
                              isError={errors?.gst && touched?.gst}
                              name="gst"
                              id="gst"
                              value={values?.gst || ''}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              type="text"
                              placeholder="Enter GST Number (Optional)"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Contact Details Tab */}
                    {activeTab === 'contact' && (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2 mb-2">
                              <User size={16} className="text-blue-600" />
                              <label className="text-sm font-medium text-gray-700">Contact Person Name</label>
                            </div>
                            <Input
                              hintText={errors.nameOfPerson}
                              isError={errors?.nameOfPerson && touched?.nameOfPerson}
                              name="nameOfPerson"
                              id="nameOfPerson"
                              value={values?.nameOfPerson || ''}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              type="text"
                              placeholder="Full Name"
                            />
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center space-x-2 mb-2">
                              <Phone size={16} className="text-green-600" />
                              <label className="text-sm font-medium text-gray-700">Phone Number</label>
                            </div>
                            <Input
                              hintText={errors.phoneOfPerson}
                              isError={errors?.phoneOfPerson && touched?.phoneOfPerson}
                              name="phoneOfPerson"
                              id="phoneOfPerson"
                              value={values?.phoneOfPerson || ''}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              type="text"
                              placeholder="10-digit phone number"
                            />
                          </div>

                          <div className="space-y-2 md:col-span-2">
                            <div className="flex items-center space-x-2 mb-2">
                              <Briefcase size={16} className="text-purple-600" />
                              <label className="text-sm font-medium text-gray-700">Designation</label>
                            </div>
                            <Input
                              hintText={errors.desgOfPerson}
                              isError={errors?.desgOfPerson && touched?.desgOfPerson}
                              name="desgOfPerson"
                              id="desgOfPerson"
                              value={values?.desgOfPerson || ''}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              type="text"
                              placeholder="e.g., Marketing Manager, CEO"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Social Media Tab */}
                    {activeTab === 'social' && (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Professional Networks */}
                          <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
                              <Shield size={18} className="text-blue-600" />
                              <span>Professional</span>
                            </h3>
                            
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2 mb-2">
                                {getSocialIcon('linkedin')}
                                <label className="text-sm font-medium text-gray-700">LinkedIn</label>
                              </div>
                              <Input
                                hintText={errors.linkedin}
                                isError={errors?.linkedin && touched?.linkedin}
                                name="linkedin"
                                id="linkedin"
                                value={values?.linkedin || ''}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                type="text"
                                placeholder="LinkedIn profile URL"
                              />
                            </div>

                            <div className="space-y-2">
                              <div className="flex items-center space-x-2 mb-2">
                                {getSocialIcon('git')}
                                <label className="text-sm font-medium text-gray-700">GitHub</label>
                              </div>
                              <Input
                                hintText={errors.git}
                                isError={errors?.git && touched?.git}
                                name="git"
                                id="git"
                                value={values?.git || ''}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                type="text"
                                placeholder="GitHub profile URL"
                              />
                            </div>
                          </div>

                          {/* Social Platforms */}
                          <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
                              <Users size={18} className="text-pink-600" />
                              <span>Social Media</span>
                            </h3>

                            <div className="space-y-2">
                              <div className="flex items-center space-x-2 mb-2">
                                {getSocialIcon('facebook')}
                                <label className="text-sm font-medium text-gray-700">Facebook</label>
                              </div>
                              <Input
                                hintText={errors.fb}
                                isError={errors?.fb && touched?.fb}
                                name="fb"
                                id="fb"
                                value={values?.fb || ''}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                type="text"
                                placeholder="Facebook page URL"
                              />
                            </div>

                            <div className="space-y-2">
                              <div className="flex items-center space-x-2 mb-2">
                                {getSocialIcon('instagram')}
                                <label className="text-sm font-medium text-gray-700">Instagram</label>
                              </div>
                              <Input
                                hintText={errors.instagram}
                                isError={errors?.instagram && touched?.instagram}
                                name="instagram"
                                id="instagram"
                                value={values?.instagram || ''}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                type="text"
                                placeholder="Instagram profile URL"
                              />
                            </div>

                            <div className="space-y-2">
                              <div className="flex items-center space-x-2 mb-2">
                                {getSocialIcon('x')}
                                <label className="text-sm font-medium text-gray-700">X (Twitter)</label>
                              </div>
                              <Input
                                hintText={errors.x}
                                isError={errors?.x && touched?.x}
                                name="x"
                                id="x"
                                value={values?.x || ''}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                type="text"
                                placeholder="X (Twitter) profile URL"
                              />
                            </div>

                            <div className="space-y-2">
                              <div className="flex items-center space-x-2 mb-2">
                                {getSocialIcon('youtube')}
                                <label className="text-sm font-medium text-gray-700">YouTube</label>
                              </div>
                              <Input
                                hintText={errors.yt}
                                isError={errors?.yt && touched?.yt}
                                name="yt"
                                id="yt"
                                value={values?.yt || ''}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                type="text"
                                placeholder="YouTube channel URL"
                              />
                            </div>
                          </div>

                          {/* Additional Platforms */}
                          <div className="md:col-span-2">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                              <LinkIcon size={18} className="text-gray-600" />
                              <span>Other Platforms</span>
                            </h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <Input
                                hintText={errors.pin}
                                isError={errors?.pin && touched?.pin}
                                name="pin"
                                id="pin"
                                value={values?.pin || ''}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                type="text"
                                placeholder="Pinterest"
                              />

                              <Input
                                hintText={errors.snap}
                                isError={errors?.snap && touched?.snap}
                                name="snap"
                                id="snap"
                                value={values?.snap || ''}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                type="text"
                                placeholder="Snapchat"
                              />

                              <Input
                                hintText={errors.tiktok}
                                isError={errors?.tiktok && touched?.tiktok}
                                name="tiktok"
                                id="tiktok"
                                value={values?.tiktok || ''}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                type="text"
                                placeholder="TikTok"
                              />

                              <Input
                                hintText={errors.twitch}
                                isError={errors?.twitch && touched?.twitch}
                                name="twitch"
                                id="twitch"
                                value={values?.twitch || ''}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                type="text"
                                placeholder="Twitch"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Submit Button */}
                    <div className="flex justify-end pt-6 border-t border-gray-200 mt-8">
                      <button
                        disabled={isSubmitting}
                        type="submit"
                        className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl font-medium transition-all duration-300 transform hover:scale-[1.02] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Save size={16} />
                        <span>{isSubmitting ? 'Updating...' : 'Update Profile'}</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </Formik>
          )}
        </div>
      </div>
    </div>
  )
}

export default Profile
