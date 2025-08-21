import Input from "../../../components/Input/Input";
import UPI from "../../../assets/images/upi.png";
import Modal from "react-responsive-modal";
import { useState } from "react";
import { IoClose } from "react-icons/io5";
import { Formik } from "formik";
import authStore from "../../../store/company/auth";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";
import { companyCreateTempTxn } from "../../../services/company/createTempTxn/Transaction";
import {
  CreditCard,
  Smartphone,
  Copy,
  CheckCircle,
  AlertCircle,
  Building2,
  Hash,
  User,
  Clock,
  Shield,
  ArrowRight,
  Receipt,
  DollarSign
} from "lucide-react";

const AddBank = () => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const onCloseModal = () => setOpen(false);

  const { companyId } = authStore();
  const { mutate } = useMutation({
    mutationFn: (variables: { companyId: string, amount: string, transId: string }) => companyCreateTempTxn(variables),
  });

  const copy = async (text: string, fieldName: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      toast.success(`${fieldName} copied to clipboard!`);
      
      // Reset copied state after 2 seconds
      setTimeout(() => {
        setCopiedField(null);
      }, 2000);
    } catch (error) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const bankDetails = {
    accountNumber: "597 1114 9866",
    ifscCode: "IDFB 0021 003",
    accountName: "INDSLAV JOOG PRIVATE LIMITED",
    upiId: "indslavjoog@idfcbank"
  };

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
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <CreditCard className="text-white" size={24} />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Add Funds to Account</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Transfer funds using bank transfer or UPI to your LinksFam account. 
              After payment, submit your transaction details for verification.
            </p>
          </div>

          {/* Payment Instructions */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <AlertCircle className="text-blue-600" size={20} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Payment Instructions</h2>
                <p className="text-gray-600 text-sm">Follow these steps to add funds to your account</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-xl p-4 text-center">
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <span className="text-white font-bold">1</span>
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Make Payment</h3>
                <p className="text-sm text-gray-600">Transfer funds using bank transfer or UPI</p>
              </div>
              
              <div className="bg-purple-50 rounded-xl p-4 text-center">
                <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <span className="text-white font-bold">2</span>
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Submit Details</h3>
                <p className="text-sm text-gray-600">Provide transaction ID and amount</p>
              </div>
              
              <div className="bg-green-50 rounded-xl p-4 text-center">
                <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <span className="text-white font-bold">3</span>
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Verification</h3>
                <p className="text-sm text-gray-600">Wait 5-7 hours for payment validation</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Bank Transfer Section */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-6 text-white">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <Building2 size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Bank Transfer</h2>
                    <p className="text-blue-100 text-sm">Transfer directly to our bank account</p>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-4">
                {/* Account Number */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Hash size={16} className="text-blue-600" />
                    <label className="text-sm font-medium text-gray-700">Account Number</label>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                    <span className="flex-1 font-mono text-gray-800">{bankDetails.accountNumber}</span>
                    <button
                      onClick={() => copy(bankDetails.accountNumber, 'Account Number')}
                      className={`p-2 rounded-lg transition-colors ${
                        copiedField === 'Account Number' 
                          ? 'bg-green-100 text-green-600' 
                          : 'bg-gray-200 hover:bg-gray-300 text-gray-600'
                      }`}
                    >
                      {copiedField === 'Account Number' ? <CheckCircle size={16} /> : <Copy size={16} />}
                    </button>
                  </div>
                </div>

                {/* IFSC Code */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Building2 size={16} className="text-blue-600" />
                    <label className="text-sm font-medium text-gray-700">IFSC Code</label>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                    <span className="flex-1 font-mono text-gray-800">{bankDetails.ifscCode}</span>
                    <button
                      onClick={() => copy(bankDetails.ifscCode, 'IFSC Code')}
                      className={`p-2 rounded-lg transition-colors ${
                        copiedField === 'IFSC Code' 
                          ? 'bg-green-100 text-green-600' 
                          : 'bg-gray-200 hover:bg-gray-300 text-gray-600'
                      }`}
                    >
                      {copiedField === 'IFSC Code' ? <CheckCircle size={16} /> : <Copy size={16} />}
                    </button>
                  </div>
                </div>

                {/* Account Name */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <User size={16} className="text-blue-600" />
                    <label className="text-sm font-medium text-gray-700">Account Name</label>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                    <span className="flex-1 font-medium text-gray-800">{bankDetails.accountName}</span>
                    <button
                      onClick={() => copy(bankDetails.accountName, 'Account Name')}
                      className={`p-2 rounded-lg transition-colors ${
                        copiedField === 'Account Name' 
                          ? 'bg-green-100 text-green-600' 
                          : 'bg-gray-200 hover:bg-gray-300 text-gray-600'
                      }`}
                    >
                      {copiedField === 'Account Name' ? <CheckCircle size={16} /> : <Copy size={16} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* UPI Section */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <Smartphone size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">UPI Payment</h2>
                    <p className="text-purple-100 text-sm">Quick and instant payment via UPI</p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                {/* UPI ID */}
                <div className="space-y-4 mb-6">
                  <div className="flex items-center space-x-2">
                    <Smartphone size={16} className="text-purple-600" />
                    <label className="text-sm font-medium text-gray-700">UPI ID</label>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                    <span className="flex-1 font-mono text-gray-800">{bankDetails.upiId}</span>
                    <button
                      onClick={() => copy(bankDetails.upiId, 'UPI ID')}
                      className={`p-2 rounded-lg transition-colors ${
                        copiedField === 'UPI ID' 
                          ? 'bg-green-100 text-green-600' 
                          : 'bg-purple-100 hover:bg-purple-200 text-purple-600'
                      }`}
                    >
                      {copiedField === 'UPI ID' ? <CheckCircle size={16} /> : <Copy size={16} />}
                    </button>
                  </div>
                </div>

                {/* QR Code */}
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-700 mb-3">Scan QR Code to Pay</p>
                  <div className="inline-block p-4 bg-white rounded-2xl shadow-lg border border-gray-200">
                    <img src={UPI} alt="UPI QR Code" className="w-48 h-48 mx-auto" />
                  </div>
                  <p className="text-xs text-gray-500 mt-3">
                    Scan with any UPI app like PhonePe, Google Pay, or Paytm
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Payment Details Button */}
          <div className="mt-8 text-center">
            <button
              onClick={() => setOpen(true)}
              className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-medium transition-all duration-300 transform hover:scale-[1.02] shadow-lg"
            >
              <Receipt size={20} />
              <span>Confirm Payment & Submit Details</span>
              <ArrowRight size={16} />
            </button>
          </div>

          {/* Security Notice */}
          <div className="mt-8 bg-orange-50 border border-orange-200 rounded-2xl p-6">
            <div className="flex items-start space-x-3">
              <Shield className="text-orange-600 mt-1" size={20} />
              <div>
                <h3 className="font-semibold text-orange-800 mb-2">Important Security Notice</h3>
                <ul className="text-sm text-orange-700 space-y-1">
                  <li>• Only transfer to the bank details mentioned above</li>
                  <li>• Keep your transaction receipt safe until verification</li>
                  <li>• Payment verification takes 5-7 hours during business days</li>
                  <li>• Contact support if you don't receive confirmation within 24 hours</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction Submission Modal */}
      <Modal 
        open={open} 
        onClose={onCloseModal} 
        closeIcon={<IoClose className="text-gray-500" />} 
        center
        classNames={{
          modal: 'bg-white rounded-2xl shadow-2xl border-0 max-w-md w-full mx-4',
          overlay: 'bg-black/50 backdrop-blur-sm',
        }}
      >
        <div className="p-6">
          {/* Modal Header */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Receipt className="text-green-600" size={24} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Submit Payment Details</h2>
            <p className="text-gray-600 text-sm">Provide your transaction details for verification</p>
          </div>

          <Formik
            key={'txnForm'}
            initialValues={{ txnId: '', amount: '' }}
            validate={values => {
              const errors: Record<string, string> = {};
              if (!values?.txnId.trim()) {
                errors.txnId = 'Transaction ID is required!';
              }
              if (!values?.amount.trim()) {
                errors.amount = 'Amount is required!';
              } else if (isNaN(Number(values.amount)) || Number(values.amount) <= 0) {
                errors.amount = 'Please enter a valid amount';
              }
              return errors;
            }}
            onSubmit={async (values, { setSubmitting, resetForm }) => {
              try {
                setIsSubmitting(true);
                mutate({ companyId, amount: values?.amount, transId: values?.txnId });
                toast.success("Payment details submitted successfully!");
                resetForm();
                setOpen(false);
              } catch (error) {
                toast.error(error instanceof Error ? error.message : 'Failed to submit payment details');
              } finally {
                setIsSubmitting(false);
                setSubmitting(false);
              }
            }}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
            }) => (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <Hash size={16} className="text-blue-600" />
                    <label className="text-sm font-medium text-gray-700">Transaction ID / UTR Number</label>
                  </div>
                  <Input
                    type="text"
                    hintText={errors?.txnId}
                    isError={errors?.txnId && touched?.txnId}
                    name="txnId"
                    id="txnId"
                    value={values?.txnId}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter transaction ID or UTR number"
                    isRequired
                  />
                </div>

                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <DollarSign size={16} className="text-green-600" />
                    <label className="text-sm font-medium text-gray-700">Amount Transferred</label>
                  </div>
                  <Input
                    type="number"
                    hintText={errors?.amount}
                    isError={errors?.amount && touched?.amount}
                    name="amount"
                    id="amount"
                    value={values?.amount}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter transferred amount"
                    isRequired
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={onCloseModal}
                    className="flex-1 px-4 py-3 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle size={16} />
                        <span>Submit Details</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </Formik>

          {/* Processing Time */}
          <div className="mt-6 p-4 bg-blue-50 rounded-xl">
            <div className="flex items-start space-x-2">
              <Clock className="text-blue-600 mt-0.5" size={16} />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Processing Time</p>
                <p>Your payment will be verified within 5-7 hours during business days. You'll receive a confirmation once verified.</p>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default AddBank
