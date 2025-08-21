import { useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { URL } from "../../../constants/URL";
import { bulkReqCreate, getPartner, getPartnerProduct } from "../../../services/company/partner/partner";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import Bounce from "../../../assets/images/Bounce.svg";

import { Formik } from "formik";
import Input from "../../../components/Input/Input";
import Button from "../../../components/Button/Button";
import { useEffect } from "react";
import { toast } from "react-toastify";
const PartnerForm = () => {

  const { opartner, pid } = useParams();

  const { mutate, data } = useMutation({
    mutationFn: ({ name, phone, qty }: { name: string, phone: string, qty: string }) =>
      bulkReqCreate({ name, phone, qty, pName: product?.productName })
  });

  useEffect(() => {
    if (data) {
      toast("We will get back soon!");
    }
  }, [data]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { data: partner, isLoading } = useQuery({
    queryKey: ['PARTNER_DETAIL'],
    queryFn: () => getPartner(URL.getPartner(opartner || "")),
    enabled: !!opartner,
  });

  const { data: products } = useQuery({
    queryKey: ['PARTNER_DETAIL_PRODUCT'],
    queryFn: () => getPartnerProduct(URL.getPartnerProduct(opartner || "", pid!)),
    enabled: !!pid,
  });

  const product = products?.data.length > 0 ? products?.data[0]?.partnerBrandProduct[0] : null;

  const partnerDetail = partner?.data?.length > 0 && partner?.data[0];

  if (isLoading) {
    return <div className="Loader">
      <img src={Bounce} alt="LinksFam" />
    </div>
  }
  return (
    <div className="">
      <div className="">
        <video className="" autoPlay loop muted playsInline>
          <source src={partnerDetail?.heroMediaUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <img className="" src={partnerDetail?.logoUrl} />
        <div className="">
          <p className="">{partnerDetail?.heroTitle}</p>
        </div>
      </div>
      <div className="">
        <h4>BULK ORDER</h4>
        <Formik
          key={'BulkRequestForm'}
          initialValues={{
            qty: '',
            name: '',
            phone: ""
          }}
          validate={values => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const errors: any = {};
            if (!values?.qty) {
              errors.qty = 'Quantity is a required field!';
            }
            if (Number(values?.qty) > 999) {
              errors.qty = 'Min Order Request is 999!';
            }
            if (!values?.phone) {
              errors.phone = 'Enter 10 digit valid phone number!';
            }
            if (values?.name?.length < 3) {
              errors.name = 'Name should be at least 3 letters!';
            }
            if (
              values?.phone.toString().length !== 10
            ) {
              errors.phone = 'Enter 10 Digit mobile number!';
            }
            if (!values?.name) {
              errors.name = 'Name is a required field!';
            }

            return errors;
          }}
          onSubmit={async (values, { setSubmitting, resetForm }) => {
            setSubmitting(false);
            mutate(values);
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
            <>
              <form className="" onSubmit={handleSubmit}>
                <Input
                  label="Quantity"
                  hintText={typeof errors?.qty === 'string' ? errors.qty : undefined} // Ensure hintText is a string
                  isError={!!(errors?.qty && touched?.qty)} // Simplified check
                  name="qty"
                  id="qty"
                  value={values.qty}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  type="number"
                  placeholder="Enter Qty"
                  isRequired
                />
                <Input
                  label="Name"
                  hintText={typeof errors?.name === 'string' ? errors.name : undefined} // Ensure hintText is a string
                  isError={!!(errors?.qty && touched?.qty)} // Simplified check
                  name="name"
                  id="name"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  type="text"
                  placeholder="Enter Name"
                  isRequired
                />
                <Input
                  label="Phone"
                  hintText={typeof errors?.phone === 'string' ? errors.phone : undefined} // Ensure hintText is a string
                  isError={!!(errors?.phone && touched?.phone)} // Simplified check
                  name="phone"
                  id="phone"
                  value={values.phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  type="number"
                  placeholder="Enter Phone"
                  isRequired
                />
                <br />
                <Button
                  disabled={isSubmitting}
                  type="submit"
                  title={'Submit Order'}
                  variant={'primary'}
                  size="small"
                />
              </form>
            </>
          )}
        </Formik>
      </div>
    </div >
  )
}

export default PartnerForm;
