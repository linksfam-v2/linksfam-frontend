import { Formik } from 'formik';
import Input from '../../../components/Input/Input';
import Button from '../../../components/Button/Button';
import { useMutation, useQuery } from '@tanstack/react-query';
import { companyCreate } from '../../../services/company/create/create';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCompanyProfile } from '../../../services/company/profile/profile';
import { URL } from '../../../constants/URL';
import authStore, { CompanyUser } from '../../../store/company/auth';
import { extractCompanyInfo } from './utils';
import { trackCustomEvent, trackConversion, setUserProperties } from '../../../services/Ga4Analytics';

const CompanyCreate = () => {
  const navigate = useNavigate();

  const {
    setCompanyId,
    companyUser,
  }: { setCompanyId: (_id: number) => void; companyUser: CompanyUser | '' } =
    authStore();

  const { mutate, data } = useMutation({
    mutationFn: ({ name, url }: { name: string; url: string }) =>
      companyCreate({ name, url }),
    onSuccess: (_data) => {
      // Track successful brand profile creation
      trackCustomEvent('profile_created', {
        user_type: 'brand',
        method: 'form_submission',
        has_prefilled_data: !!companyUser
      });
      
      // Track signup completion conversion
      trackConversion('sign_up', 1);
      
      // Set additional user properties
      setUserProperties({
        profile_completed: true,
        signup_source: companyUser ? 'email_prefilled' : 'manual'
      });
    },
    onError: (error) => {
      // Track brand profile creation failure
      trackCustomEvent('profile_creation_failed', {
        user_type: 'brand',
        error_message: error?.message || 'Unknown error',
        has_prefilled_data: !!companyUser
      });
    }
  });

  const { data: profile } = useQuery({
    queryKey: ['COMPANY_PROFILE'],
    queryFn: () => getCompanyProfile(URL.getCompanyProfile),
  });

  useEffect(() => {
    ////redirecting to free consultation form
    if (data?.data?.stepTwo === false) {
      // Track consultation form redirection
      trackCustomEvent('consultation_redirect', {
        user_type: 'brand',
        step: 'after_profile_creation',
        brand_id: data?.data?.id
      });
      
      navigate('/brand/consultation');
    } else if (data?.data?.id) {
      setCompanyId(data?.data?.id);
      
      // Track successful brand onboarding completion
      trackCustomEvent('brand_onboarding_complete', {
        user_type: 'brand',
        brand_id: data?.data?.id,
        flow: 'direct_to_links'
      });
      
      navigate('/brand/links');
    }
  }, [data]);

  useEffect(() => {
    //redirecting to free consultation form
    if (data?.data?.stepTwo === false) {
      navigate('/brand/consultation');
    } else if (profile?.data?.length) {
      // Track returning user with existing profile
      trackCustomEvent('existing_profile_detected', {
        user_type: 'brand',
        profile_count: profile?.data?.length
      });
      
      navigate('/brand/links');
    }
  }, [profile]);

  // Track page view for brand profile creation
  useEffect(() => {
    trackCustomEvent('profile_page_viewed', {
      user_type: 'brand',
      has_prefilled_data: !!companyUser,
      step: 'profile_creation'
    });
  }, []);

  return (
    <div className="">
      <div className="">
        <p className="">Brand Create</p>
        <p className="">
          Please fill in the brand details
        </p>
      </div>
      <Formik
        key={'CompanyCreate'}
        initialValues={{
          name: companyUser
            ? extractCompanyInfo(companyUser?.email).companyName
            : '',
          url: companyUser
            ? extractCompanyInfo(companyUser?.email).companyURL
            : '',
        }}
        validate={(values) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const errors: any = {};
          if (!values?.name) {
            errors.name = 'Name is a required field!';
          }
          if (!values?.url) {
            errors.url = 'URL is a required field!';
          }
          if (
            !/^(https?:\/\/)([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}\/?/.test(
              values?.url!
            )
          ) {
            errors.url =
              'Please enter a valid URL starting with http or https!';
          }
          return errors;
        }}
        onSubmit={async (values, { setSubmitting }) => {
          setSubmitting(false);
          
          // Track brand profile creation attempt
          trackCustomEvent('profile_creation_attempted', {
            user_type: 'brand',
            has_name: !!values?.name?.trim(),
            has_url: !!values?.url?.trim(),
            data_source: companyUser ? 'email_prefilled' : 'manual_entry'
          });
          
          mutate({
            name: values?.name?.trim(),
            url: values?.url!, // Assert that `url` is not undefined
          });
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
          <>
            <form
              className=""
              onSubmit={handleSubmit}
            >
              <Input
                label="Brand Name"
                hintText={
                  typeof errors?.name === 'string' ? errors.name : undefined
                } // Ensure hintText is a string
                isError={!!(errors?.name && touched?.name)} // Simplified check
                name="name"
                id="name"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                type="text"
                placeholder="Enter Brand Name"
                isRequired
              />
              <Input
                label="Brand Url"
                hintText={errors.url}
                isError={errors?.url && touched?.url}
                name="url"
                id="url"
                value={values.url!}
                onChange={handleChange}
                onBlur={handleBlur}
                type="text"
                placeholder="Enter Brand URL"
                isRequired
              />
              <Button
                disabled={isSubmitting}
                type="submit"
                title={'Complete SignUp'}
                variant={'primary'}
                size="small"
              />
            </form>
          </>
        )}
      </Formik>
    </div>
  );
};

export default CompanyCreate;
