import React from 'react';
import { Formik } from 'formik';
import Input from '../Input/Input';
import { RateCardData } from '../../services/influencer/rate-card/rate-card';
import { Instagram, Youtube, DollarSign, Package, CheckCircle } from 'lucide-react';

interface RateCardFormProps {
  onSubmit: (data: RateCardData) => void;
  isSubmitting?: boolean;
}

const RateCardForm: React.FC<RateCardFormProps> = ({ onSubmit, isSubmitting = false }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-4 sm:p-6 lg:p-8">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-100/20 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-100/20 rounded-full translate-y-24 -translate-x-24"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <DollarSign className="text-white" size={24} />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Set Your Rate Card</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Let brands know your pricing for different types of content. Fill in the rates for services you offer.
          </p>
        </div>
        
        <Formik
          initialValues={{
            reelCharge: '',
            storyCharge: '',
            carouselPostCharge: '',
            linkInBioCharge: '',
            instagramComboPackage: '',
            youtubeShortCharge: '',
            youtubeIntegrationCharge: '',
            youtubeDedicatedVideoCharge: '',
            customComboPackage: '',
            minimumCollaborationValue: '',
            availableForBarterDeals: false,
          }}
          validate={(values) => {
            const errors: any = {};
            
            // Check if at least one rate is provided
            const hasAnyRate = Object.entries(values).some(([key, value]) => {
              if (key === 'customComboPackage' || key === 'availableForBarterDeals') return false;
              return value && value.toString().trim() !== '';
            });
            
            if (!hasAnyRate) {
              errors.reelCharge = 'Please provide at least one rate or service pricing.';
            }
            
            // Validate numeric fields
            const numericFields = [
              'reelCharge', 'storyCharge', 'carouselPostCharge', 'linkInBioCharge',
              'instagramComboPackage', 'youtubeShortCharge', 'youtubeIntegrationCharge',
              'youtubeDedicatedVideoCharge', 'minimumCollaborationValue'
            ];
            
            numericFields.forEach(field => {
              const value = values[field as keyof typeof values];
              if (value && value.toString().trim() !== '') {
                const numValue = parseFloat(value.toString());
                if (isNaN(numValue) || numValue <= 0) {
                  errors[field] = 'Please enter a valid positive number.';
                }
              }
            });
            
            return errors;
          }}
          onSubmit={(values, { setSubmitting }) => {
            const cleanedValues: RateCardData = {};
            
            // Only include fields that have values
            if (values.reelCharge && values.reelCharge.toString().trim())
              cleanedValues.reelCharge = parseFloat(values.reelCharge.toString());
            if (values.storyCharge && values.storyCharge.toString().trim())
              cleanedValues.storyCharge = parseFloat(values.storyCharge.toString());
            if (values.carouselPostCharge && values.carouselPostCharge.toString().trim())
              cleanedValues.carouselPostCharge = parseFloat(values.carouselPostCharge.toString());
            if (values.linkInBioCharge && values.linkInBioCharge.toString().trim())
              cleanedValues.linkInBioCharge = parseFloat(values.linkInBioCharge.toString());
            if (values.instagramComboPackage && values.instagramComboPackage.toString().trim())
              cleanedValues.instagramComboPackage = parseFloat(values.instagramComboPackage.toString());
            if (values.youtubeShortCharge && values.youtubeShortCharge.toString().trim())
              cleanedValues.youtubeShortCharge = parseFloat(values.youtubeShortCharge.toString());
            if (values.youtubeIntegrationCharge && values.youtubeIntegrationCharge.toString().trim())
              cleanedValues.youtubeIntegrationCharge = parseFloat(values.youtubeIntegrationCharge.toString());
            if (values.youtubeDedicatedVideoCharge && values.youtubeDedicatedVideoCharge.toString().trim())
              cleanedValues.youtubeDedicatedVideoCharge = parseFloat(values.youtubeDedicatedVideoCharge.toString());
            if (values.customComboPackage && values.customComboPackage.toString().trim())
              cleanedValues.customComboPackage = values.customComboPackage.toString();
            if (values.minimumCollaborationValue && values.minimumCollaborationValue.toString().trim())
              cleanedValues.minimumCollaborationValue = parseFloat(values.minimumCollaborationValue.toString());
            
            cleanedValues.availableForBarterDeals = values.availableForBarterDeals;
            
            onSubmit(cleanedValues);
            setSubmitting(false);
          }}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting: formSubmitting,
          }) => (
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Instagram Services Section */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-6 text-white">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                      <Instagram size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">Instagram Services</h3>
                      <p className="text-pink-100 text-sm">Set your rates for Instagram content</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Instagram Reel Charge (₹)"
                    hintText={errors.reelCharge}
                    isError={!!(errors.reelCharge && touched.reelCharge)}
                    name="reelCharge"
                    id="reelCharge"
                    value={values.reelCharge}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    type="number"
                    placeholder="Enter your rate for Instagram Reels"
                  />
                  
                  <Input
                    label="Instagram Story Charge (₹)"
                    hintText={errors.storyCharge}
                    isError={!!(errors.storyCharge && touched.storyCharge)}
                    name="storyCharge"
                    id="storyCharge"
                    value={values.storyCharge}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    type="number"
                    placeholder="Enter your rate for Instagram Stories"
                  />
                  
                  <Input
                    label="Instagram Carousel Post Charge (₹)"
                    hintText={errors.carouselPostCharge}
                    isError={!!(errors.carouselPostCharge && touched.carouselPostCharge)}
                    name="carouselPostCharge"
                    id="carouselPostCharge"
                    value={values.carouselPostCharge}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    type="number"
                    placeholder="Enter your rate for Carousel Posts"
                  />
                  
                  <Input
                    label="Link in Bio Charge (7 Days) (₹)"
                    hintText={errors.linkInBioCharge}
                    isError={!!(errors.linkInBioCharge && touched.linkInBioCharge)}
                    name="linkInBioCharge"
                    id="linkInBioCharge"
                    value={values.linkInBioCharge}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    type="number"
                    placeholder="Enter your rate for Link in Bio"
                  />
                  
                  <div className="md:col-span-2">
                    <Input
                      label="Instagram Combo Package (₹)"
                      hintText={errors.instagramComboPackage}
                      isError={!!(errors.instagramComboPackage && touched.instagramComboPackage)}
                      name="instagramComboPackage"
                      id="instagramComboPackage"
                      value={values.instagramComboPackage}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      type="number"
                      placeholder="Enter your rate for Instagram Combo Package"
                    />
                  </div>
                </div>
              </div>
              
              {/* YouTube Services Section */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 text-white">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                      <Youtube size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">YouTube Services</h3>
                      <p className="text-red-100 text-sm">Set your rates for YouTube content</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="YouTube Short Charge (₹)"
                    hintText={errors.youtubeShortCharge}
                    isError={!!(errors.youtubeShortCharge && touched.youtubeShortCharge)}
                    name="youtubeShortCharge"
                    id="youtubeShortCharge"
                    value={values.youtubeShortCharge}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    type="number"
                    placeholder="Enter your rate for YouTube Shorts"
                  />
                  
                  <Input
                    label="YouTube Integration Charge (₹)"
                    hintText={errors.youtubeIntegrationCharge}
                    isError={!!(errors.youtubeIntegrationCharge && touched.youtubeIntegrationCharge)}
                    name="youtubeIntegrationCharge"
                    id="youtubeIntegrationCharge"
                    value={values.youtubeIntegrationCharge}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    type="number"
                    placeholder="Enter your rate for YouTube Integration"
                  />
                  
                  <div className="md:col-span-2">
                    <Input
                      label="YouTube Dedicated Video Charge (₹)"
                      hintText={errors.youtubeDedicatedVideoCharge}
                      isError={!!(errors.youtubeDedicatedVideoCharge && touched.youtubeDedicatedVideoCharge)}
                      name="youtubeDedicatedVideoCharge"
                      id="youtubeDedicatedVideoCharge"
                      value={values.youtubeDedicatedVideoCharge}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      type="number"
                      placeholder="Enter your rate for YouTube Dedicated Video"
                    />
                  </div>
                </div>
              </div>
              
              {/* Additional Services Section */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-white">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                      <Package size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">Additional Services</h3>
                      <p className="text-green-100 text-sm">Custom packages and special offers</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-6 space-y-6">
                  <Input
                    isTextArea
                    label="Custom Combo Package Description"
                    hintText={errors.customComboPackage}
                    isError={!!(errors.customComboPackage && touched.customComboPackage)}
                    name="customComboPackage"
                    id="customComboPackage"
                    value={values.customComboPackage}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    type="text"
                    placeholder="Describe your custom combo package (e.g., 1 Reel + 3 Stories + Link in Bio for 1 week)"
                  />
                  
                  <Input
                    label="Minimum Collaboration Value (₹)"
                    hintText={errors.minimumCollaborationValue}
                    isError={!!(errors.minimumCollaborationValue && touched.minimumCollaborationValue)}
                    name="minimumCollaborationValue"
                    id="minimumCollaborationValue"
                    value={values.minimumCollaborationValue}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    type="number"
                    placeholder="Enter minimum collaboration value"
                  />
                  
                  <div className="bg-gray-50 rounded-xl p-4">
                    <label className="flex items-start space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="availableForBarterDeals"
                        checked={values.availableForBarterDeals}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="mt-1 w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-2"
                      />
                      <div>
                        <span className="text-sm font-medium text-gray-800">
                          I'm available for barter deals
                        </span>
                        <p className="text-xs text-gray-600 mt-1">
                          Accept product collaborations in exchange for content creation
                        </p>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
              
              {/* Submit Button */}
              <div className="flex justify-center pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting || formSubmitting}
                  className="flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl font-medium transition-all duration-300 transform hover:scale-[1.02] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <CheckCircle size={18} />
                  <span>{isSubmitting || formSubmitting ? 'Saving...' : 'Continue to Profile Setup'}</span>
                </button>
              </div>
            </form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default RateCardForm; 