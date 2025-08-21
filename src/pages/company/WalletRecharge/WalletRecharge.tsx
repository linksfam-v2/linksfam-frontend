import { Formik } from "formik";

import Input from "../../../components/Input/Input";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { initRechargeAmount } from "../../../services/company/wallet/wallet";
import authStore from "../../../store/company/auth";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { addMoneyCheckout } from "../../../services/company/pg/pg";
import {
  ArrowLeft,
  CreditCard,
  Wallet,
  Shield,
  CheckCircle,
  AlertCircle,
  IndianRupee,
  Banknote,
  Zap,
  Info
} from "lucide-react";

const WalletRecharge = () => {

  const navigate = useNavigate();

  const { companyId } = authStore();

  const MID: string = uuidv4();

  const [currentAmout, setCurrentAmout] = useState<any>();
  const [latMid, setLatMid] = useState("");
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);

  // Predefined amounts for quick selection
  const quickAmounts = [500, 1000, 2000, 5000, 10000, 25000];

  const { data: initData, mutate: initMutate, isPending: isInitiating } = useMutation({
    mutationFn: ({ company_id, amount, merchantOrderId }: { company_id: string, amount: string, merchantOrderId: string }) => initRechargeAmount({ company_id, amount, merchantOrderId })
  });

  const { mutate: checkoutMutate, data: checkoutData, isPending: isProcessing } = useMutation({
    mutationFn: ({ amount, merchantOrderId }: { amount: string, merchantOrderId: string }) => addMoneyCheckout({ amount, merchantOrderId })
  });

  useEffect(() => {
    if (initData?.data) {
      checkoutMutate({ amount: currentAmout, merchantOrderId: latMid });
    }
  }, [initData]);

  useEffect(() => {
    if (checkoutData?.data) {
      window.location.href = checkoutData.data?.redirectUrl;
    }
  }, [checkoutData])

  const isLoading = isInitiating || isProcessing;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-100/20 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-100/20 rounded-full translate-y-24 -translate-x-24"></div>
      </div>

      <div className="relative z-10 p-4 sm:p-6 lg:p-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate("/brand/wallet")}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors mb-4"
            >
              <ArrowLeft size={20} />
              <span className="font-medium">Back to Wallet</span>
            </button>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Wallet className="text-white" size={24} />
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Recharge Wallet</h1>
              <p className="text-gray-600">Add funds to your wallet for seamless transactions</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Payment Form Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              {/* Card Header */}
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 text-white">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <CreditCard size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Add Funds</h2>
                    <p className="text-green-100 text-sm">Secure and instant payment processing</p>
                  </div>
                </div>
              </div>

              {/* Form Content */}
              <div className="p-6">
                <Formik
                  key={'Recharge'}
                  initialValues={{ amount: '' }}
                  validate={values => {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const errors: any = {};
                    if (!values?.amount) {
                      errors.amount = 'Amount is a required field!';
                    }
                    const amount = parseFloat(values?.amount);
                    if (amount < 100) {
                      errors.amount = 'Minimum amount is ₹100!';
                    }
                    if (amount > 100000) {
                      errors.amount = 'Maximum amount is ₹1,00,000!';
                    }
                    return errors;
                  }}
                  onSubmit={async (values, { setSubmitting, resetForm }) => {
                    setSubmitting(false);
                    initMutate({ company_id: companyId, amount: values?.amount, merchantOrderId: MID });
                    setCurrentAmout(values?.amount);
                    setLatMid(MID);
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
                    setFieldValue
                  }) => (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Quick Amount Selection */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          Quick Select Amount
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {quickAmounts.map((amount) => (
                            <button
                              key={amount}
                              type="button"
                              onClick={() => {
                                setSelectedAmount(amount);
                                setFieldValue('amount', amount.toString());
                              }}
                              className={`p-3 rounded-xl border-2 transition-all duration-300 text-center font-medium ${
                                selectedAmount === amount || values.amount === amount.toString()
                                  ? 'border-purple-500 bg-purple-50 text-purple-700'
                                  : 'border-gray-200 hover:border-purple-300 hover:bg-purple-25 text-gray-700'
                              }`}
                            >
                              <div className="flex items-center justify-center space-x-1">
                                <IndianRupee size={16} />
                                <span>{amount.toLocaleString()}</span>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Custom Amount Input */}
                      <div>
                        <div className="flex items-center space-x-2 mb-2">
                          <Banknote size={16} className="text-green-600" />
                          <label className="text-sm font-medium text-gray-700">
                            Enter Custom Amount
                          </label>
                        </div>
                        <div className="relative">
                          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                            <IndianRupee size={18} />
                          </div>
                          <Input
                            hintText={errors.amount}
                            isError={errors?.amount && touched?.amount}
                            name="amount"
                            id="amount"
                            value={values.amount}
                            onChange={(e) => {
                              handleChange(e);
                              setSelectedAmount(null);
                            }}
                            onBlur={handleBlur}
                            type="number"
                            placeholder="Enter amount (Min: ₹100, Max: ₹1,00,000)"
                            isRequired
                          />
                        </div>
                        <div className="mt-2 text-xs text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Info size={12} />
                            <span>Amount will be processed securely through our payment gateway</span>
                          </div>
                        </div>
                      </div>

                      {/* Submit Button */}
                      <div className="pt-4">
                        <button
                          disabled={isSubmitting || isLoading}
                          type="submit"
                          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-4 px-6 rounded-xl font-medium transition-all duration-300 transform hover:scale-[1.02] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
                        >
                          {isLoading ? (
                            <>
                              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              <span>
                                {isInitiating ? 'Initiating...' : 'Processing...'}
                              </span>
                            </>
                          ) : (
                            <>
                              <Zap size={18} />
                              <span>Proceed to Payment</span>
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  )}
                </Formik>
              </div>
            </div>

            {/* Security Information */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Shield className="text-blue-600" size={20} />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Secure Payment</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <CheckCircle size={14} className="text-green-500" />
                      <span>256-bit SSL encryption for all transactions</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle size={14} className="text-green-500" />
                      <span>PCI DSS compliant payment gateway</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle size={14} className="text-green-500" />
                      <span>Instant credit to your wallet after successful payment</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle size={14} className="text-green-500" />
                      <span>24/7 transaction monitoring and fraud protection</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                <CreditCard size={18} className="text-purple-600" />
                <span>Supported Payment Methods</span>
              </h3>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-xl">
                  <CreditCard className="mx-auto mb-2 text-gray-600" size={24} />
                  <span className="text-sm text-gray-700 font-medium">Credit Card</span>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-xl">
                  <Banknote className="mx-auto mb-2 text-gray-600" size={24} />
                  <span className="text-sm text-gray-700 font-medium">Debit Card</span>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-xl">
                  <Wallet className="mx-auto mb-2 text-gray-600" size={24} />
                  <span className="text-sm text-gray-700 font-medium">Net Banking</span>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-xl">
                  <Zap className="mx-auto mb-2 text-gray-600" size={24} />
                  <span className="text-sm text-gray-700 font-medium">UPI</span>
                </div>
              </div>
            </div>

            {/* Important Notice */}
            <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4">
              <div className="flex items-start space-x-3">
                <AlertCircle className="text-orange-600 mt-0.5" size={18} />
                <div className="text-sm text-orange-800">
                  <p className="font-medium mb-1">Important Notice</p>
                  <p>
                    Amount will be instantly deducted from your selected payment method and 
                    credited to your LinksFam wallet. Please ensure you have sufficient balance 
                    before proceeding with the transaction.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WalletRecharge
