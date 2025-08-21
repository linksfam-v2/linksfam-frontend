import { Formik } from "formik";
import Input from "../../../components/Input/Input";
import Button from "../../../components/Button/Button";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getInfluencerWalletBalance, walletRedeemAmount } from "../../../services/influencer/wallet/wallet";
import influencerAuthStore from "../../../store/company/influencerAuth";
import { URL } from "../../../constants/URL";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Redeem = () => {

  const navigate = useNavigate();

  const { influencerId } = influencerAuthStore();

  const { data: wallet } = useQuery({
    queryKey: ['GET_INFLUENCER_WALLET'],
    queryFn: () => getInfluencerWalletBalance(URL.getInfluencerWalletValue(influencerId)),
    enabled: Boolean(influencerId),
  });


  const { mutate, data } = useMutation({
    mutationFn: ({ influencerId, amount }: { influencerId: string, amount: string }) => walletRedeemAmount({ influencerId, amount })
  });

  useEffect(() => {
    if (data?.data) {
      navigate('/creator/account');
    }
    if (data?.error) {
      toast(data?.message);
    }
  }, [data]);


  return (
    <div className="">
      <div className="">
        <div className="">
          <p>Redeem Amount</p>
          <span>Available: &#8377;{wallet?.data?.length && Number(wallet?.data[0]?.walletBalance)?.toFixed(2)}</span>
        </div>
        <div className="">
          <Formik
            key={'Redeem'}
            initialValues={{ amount: '' }}
            validate={values => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const errors: any = {};
              if (!values?.amount) {
                errors.amount = 'Amount is a required field!';
              }
              if (+values?.amount < 1) {
                errors.amount = 'Amount should be greater than 0!';
              }
              if ((Number(values?.amount) > (wallet?.data?.length && Number(wallet?.data[0]?.walletBalance)?.toFixed(2)))) {
                errors.amount = 'Amount should be less than available amount!';
              }
              return errors;
            }}
            onSubmit={async (values, { setSubmitting, resetForm }) => {
              setSubmitting(false);
              mutate({ influencerId, amount: values?.amount });
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
                <form onSubmit={handleSubmit}>
                  <Input
                    label="Redeem Amount"
                    hintText={errors.amount}
                    isError={errors?.amount && touched?.amount}
                    name="amount"
                    id="amount"
                    value={values.amount}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    type="number"
                    placeholder="Enter Amount"
                    isRequired
                  />
                  <br />
                  <div>
                    <Button
                      disabled={isSubmitting}
                      type="submit"
                      title={'Proceed'}
                      variant={'primary'}
                      size="small"
                    />
                  </div>
                </form>
              </>
            )}
          </Formik>
        </div>
      </div>
    </div>
  )
}

export default Redeem
