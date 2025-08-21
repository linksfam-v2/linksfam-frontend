import { useMutation, useQuery } from "@tanstack/react-query";
import { companyCreateLink, getCompanyLinks } from "../../../services/company/links/links";
import { URL } from "../../../constants/URL";
import authStore from "../../../store/company/auth";
import { useEffect, useState } from "react";
import { Link } from "./types";
import { getCategories } from "../../../services/company/category/category";
import Dropdown, { ListProps } from "../../../components/Dropdown/Dropdown";
import { formatCategories, TYPE } from "./utils";
import { Formik } from "formik";
import Input from "../../../components/Input/Input";
import Chip from "../../../components/Chip/Chip";
import Bounce from "../../../assets/images/Bounce.svg";
import { IoIosArrowDown } from "react-icons/io";
import { toast } from "react-toastify";
import { Autocomplete, useJsApiLoader } from "@react-google-maps/api";
import { 
  Link as LinkIcon, 
  MapPin, 
  Phone, 
  Plus, 
  ExternalLink,
  Copy,
  Activity,
  DollarSign,
  Tag,
  Settings,
  History
} from "lucide-react";

const MyLinks = () => {

  const INPUT_TYPE = ["link", "location", "whatsapp"];

  const [selectedInput, setSelectedInput] = useState("link");

  const { data: categories, isLoading } = useQuery({
    queryKey: ['GET_CATEGORY'],
    queryFn: () => getCategories(URL.getCategory),
  });

  const { companyId } = authStore();

  const [links, setLinks] = useState<Link[]>([]);

  const [category, setCategory] = useState<ListProps | any>();

  const [dropdown, setDropdown] = useState<string>("");

  const [type, setType] = useState<ListProps | any>();

  const [selectedType, setSelectedType] = useState<string>("");

  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);

  const [location, setLocation] = useState("");

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'AIzaSyATNhlOLFeAN2aaqPU9HMExFzuI2LM-9-4',
    libraries: ['places'],
  })

  const { mutate, data } = useMutation({
    mutationFn: (companyId: string) => getCompanyLinks(URL.getCompanyLinksById(companyId)),
  });

  const { mutate: linkMutate, data: linkdata } = useMutation({
    mutationFn: ({ category_id, link, fee, type, input_type }: {
      category_id: string,
      link: string,
      fee: string,
      type: string,
      input_type: string
    }) => companyCreateLink({
      category_id,
      link: link,
      fee,
      company_id: companyId,
      type,
      input_type
    }),
    onSuccess: () => {
      mutate(companyId);
      setLocation(""); // Clearing location after submission
    },
  });

  useEffect(() => {
    if (companyId)
      mutate(companyId);
  }, [companyId])

  useEffect(() => {
    if (data?.data?.length)
      setLinks(data?.data);
  }, [data]);

  useEffect(() => {
    if (linkdata?.data) {
      toast('Link created successfully!');
    }
  }, [linkdata]);

  const copyToClipboard = async (str: string) => {
    await navigator.clipboard.writeText(str);
    toast('Link copied to clipboard!');
  };

  const onLoad = (auto: google.maps.places.Autocomplete) => setAutocomplete(auto);

  const onPlaceChanged = () => {
    if (autocomplete) {
      const place = autocomplete.getPlace();
      setLocation(place.formatted_address || "");
    }
  };

  const getInputIcon = (inputType: string) => {
    switch (inputType) {
      case 'link': return <LinkIcon size={16} />;
      case 'location': return <MapPin size={16} />;
      case 'whatsapp': return <Phone size={16} />;
      default: return <LinkIcon size={16} />;
    }
  };

  const getInputTypeColor = (inputType: string) => {
    switch (inputType) {
      case 'link': return 'from-blue-500 to-cyan-500';
      case 'location': return 'from-green-500 to-emerald-500';
      case 'whatsapp': return 'from-purple-500 to-pink-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  if (isLoading || !isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <img src={Bounce} alt="LinksFam" className="h-16 w-auto mx-auto mb-4" />
            <div className="absolute -inset-4 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-full blur-xl"></div>
          </div>
          <p className="text-gray-600 font-medium">Loading links...</p>
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
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">My Links</h1>
            <p className="text-gray-600">Create and manage your campaign links</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Create New Link Form */}
            <div className="lg:col-span-1">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                {/* Form Header */}
                <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                      <Plus size={20} />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">Create New Link</h2>
                      <p className="text-purple-100 text-sm">Generate a new campaign link</p>
                    </div>
                  </div>
                </div>

                {/* Form Content */}
                <div className="p-6">
                  <Formik
                    key={'CompanyLinks'}
                    initialValues={{ fee: '', link: '' }}
                    validate={values => {
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      const errors: any = {};
                      if (!values?.fee) {
                        errors.fee = 'Fee is a required field!';
                      }
                      if (Number(values?.fee) <= 0) {
                        errors.fee = 'Fee should be a valid amount!';
                      }
                      if (
                        !/^\d{10}$/.test(values.link)
                        && selectedInput.toLowerCase() === "whatsapp"
                      ) {
                        errors.link = 'Enter a valid 10 digit number with WhatsApp!';
                      }

                      if (
                        !/^\d{10}$/.test(values.link)
                        && selectedInput.toLowerCase() === "phone"
                      ) {
                        errors.link = 'Please enter a valid 10-digit number!';
                      }

                      if (
                        !/^(https?:\/\/)([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}\/?/.test(values.link)
                        && selectedInput.toLowerCase() === "link"
                      ) {
                        errors.link = 'Please enter a valid URL starting with http or https!';
                      }
                      if (!type?.value) {
                        setSelectedType("Type is a required field");
                      }
                      if (!category?.value) {
                        setDropdown("Category is a required field");
                      }
                      if (selectedInput === "location" && !location.trim()) {
                        errors.link = 'Location is required!';
                      }

                      return errors;
                    }}
                    onSubmit={async (values, { setSubmitting, resetForm }) => {
                      setSubmitting(false);
                      linkMutate(
                        {
                          category_id: category?.value!,
                          fee: values?.fee,
                          link: selectedInput.toLowerCase() === "location" ?
                            `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}` : selectedInput === "whatsapp" ? `https://api.whatsapp.com/send?phone=${values?.link}&text=Hi` : values?.link,
                          type: type?.value,
                          input_type: selectedInput,
                        }
                      );
                      resetForm();
                      setCategory("");
                      setType("");
                      setLocation("");
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
                        {/* Category Dropdown */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                          {categories?.data?.length ? (
                            <Dropdown 
                              rightIcon={<IoIosArrowDown />} 
                              errorDropdown={setDropdown} 
                              placeholder="Select Category" 
                              setSelectChild={setCategory} 
                              selectedChild={category} 
                              children={formatCategories(categories?.data)} 
                            />
                          ) : null}
                          {dropdown && <p className="text-red-500 text-sm mt-1">{dropdown}</p>}
                        </div>

                        {/* Type Dropdown */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                          <Dropdown 
                            rightIcon={<IoIosArrowDown />} 
                            errorDropdown={setSelectedType} 
                            placeholder="Select Type" 
                            setSelectChild={setType} 
                            selectedChild={type} 
                            children={TYPE} 
                          />
                          {selectedType && <p className="text-red-500 text-sm mt-1">{selectedType}</p>}
                        </div>

                        {/* Input Type Selection */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-3">Link Type</label>
                          <div className="grid grid-cols-3 gap-2">
                            {INPUT_TYPE.map(item => (
                              <label key={item} className={`relative cursor-pointer`}>
                                <input 
                                  type="radio" 
                                  onClick={() => setSelectedInput(item)} 
                                  name="inputType" 
                                  id={item} 
                                  className="sr-only" 
                                  checked={selectedInput === item} 
                                />
                                <div className={`flex flex-col items-center p-3 rounded-xl border-2 transition-all ${
                                  selectedInput === item 
                                    ? 'border-purple-500 bg-purple-50' 
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}>
                                  <div className={`w-8 h-8 rounded-lg mb-2 flex items-center justify-center bg-gradient-to-r ${getInputTypeColor(item)} text-white`}>
                                    {getInputIcon(item)}
                                  </div>
                                  <span className="text-xs font-medium text-gray-700 capitalize">{item}</span>
                                </div>
                              </label>
                            ))}
                          </div>
                        </div>

                        {/* Link Input */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {selectedInput === 'location' ? 'Location' : selectedInput === 'whatsapp' ? 'Phone Number' : 'URL'}
                          </label>
                          {selectedInput === "location" ? (
                            <Autocomplete
                              onLoad={onLoad}
                              onPlaceChanged={onPlaceChanged}
                              options={{ types: ['address'] }}
                            >
                              <Input
                                type="text"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                placeholder="Enter Location"
                                isError={!location && touched?.link}
                                hintText={!location ? 'Location is required!' : ''}
                                onBlur={() => handleBlur({ target: { name: 'link' } })}
                              />
                            </Autocomplete>
                          ) : (
                            <Input
                              type="text"
                              name="link"
                              value={values.link}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              placeholder={`Enter ${capitalizeFirst(selectedInput)}`}
                              isError={errors?.link && touched?.link}
                              hintText={errors.link}
                            />
                          )}
                        </div>

                        {/* Fee Input */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Fee Amount (₹)</label>
                          <Input
                            type="number"
                            hintText={errors.fee}
                            isError={errors?.fee && touched?.fee}
                            name="fee"
                            id="fee"
                            value={values?.fee}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="Enter Fee Amount"
                            isRequired
                          />
                        </div>

                        {/* Submit Button */}
                        <button
                          disabled={isSubmitting}
                          type="submit"
                          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg flex items-center justify-center space-x-2"
                        >
                          <Plus size={16} />
                          <span>{isSubmitting ? 'Creating...' : 'Create Link'}</span>
                        </button>
                      </form>
                    )}
                  </Formik>
                </div>
              </div>
            </div>

            {/* Links History */}
            <div className="lg:col-span-2">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                {/* History Header */}
                <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-6 text-white">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                      <History size={20} />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">Links History</h2>
                      <p className="text-blue-100 text-sm">Manage your existing campaign links</p>
                    </div>
                  </div>
                </div>

                {/* History Content */}
                <div className="p-6">
                  {links.length ? (
                    <div className="space-y-4">
                      {links.map((item, index) => (
                        <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                          {/* Link Header */}
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center space-x-3">
                                                           <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-r ${getInputTypeColor('link')} text-white`}>
                               {getInputIcon('link')}
                             </div>
                             <div>
                               <h3 className="font-semibold text-gray-800">{item?.category?.name}</h3>
                               <p className="text-sm text-gray-500 capitalize">Link • {item?.type || "CPC"}</p>
                             </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Chip 
                                variant={item?.isActive ? 'success' : 'secondary'} 
                                title={item?.isActive ? 'Active' : 'Inactive'} 
                              />
                            </div>
                          </div>

                          {/* Link Details Grid */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            <div className="flex items-center space-x-2">
                              <DollarSign size={16} className="text-green-500" />
                              <div>
                                <p className="text-xs text-gray-500">Fee</p>
                                <span className="font-semibold text-gray-800">₹{item?.fee}</span>
                              </div>
                            </div>

                            <div className="flex items-center space-x-2">
                              <Tag size={16} className="text-blue-500" />
                              <div>
                                <p className="text-xs text-gray-500">Category</p>
                                <span className="font-semibold text-gray-800 text-sm">{item?.category?.name?.split(" ")[0]}</span>
                              </div>
                            </div>

                            <div className="flex items-center space-x-2">
                              <Activity size={16} className={item?.isActive ? "text-green-500" : "text-gray-400"} />
                              <div>
                                <p className="text-xs text-gray-500">Status</p>
                                <span className={`font-semibold text-sm ${item?.isActive ? 'text-green-600' : 'text-gray-600'}`}>
                                  {item?.isActive ? 'Active' : 'Inactive'}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center space-x-2">
                              <Settings size={16} className="text-purple-500" />
                              <div>
                                <p className="text-xs text-gray-500">Type</p>
                                <span className="font-semibold text-gray-800 text-sm">{item?.type || "CPC"}</span>
                              </div>
                            </div>
                          </div>

                          {/* Link URL */}
                          <div className="bg-gray-50 rounded-lg p-3 mb-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2 flex-1 min-w-0">
                                <ExternalLink size={16} className="text-gray-400" />
                                <p className="text-sm text-gray-700 truncate flex-1">{item?.link}</p>
                              </div>
                              <button
                                onClick={() => copyToClipboard(item?.link)}
                                className="ml-2 p-2 hover:bg-gray-200 rounded-lg transition-colors flex-shrink-0"
                                title="Copy link"
                              >
                                <Copy size={16} className="text-gray-500" />
                              </button>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex justify-end space-x-2">
                            <button 
                              onClick={() => toast("Coming Soon!")}
                              className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                            >
                              {item?.isActive ? 'Deactivate' : 'Activate'}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-2xl flex items-center justify-center">
                        <LinkIcon size={24} className="text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-500 mb-2">No Links Found</h3>
                      <p className="text-sm text-gray-400">Create your first campaign link to get started</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MyLinks

function capitalizeFirst(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
