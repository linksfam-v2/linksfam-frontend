import { useMutation, useQuery } from "@tanstack/react-query";
import { getWalletBalance } from "../../../services/company/wallet/wallet";
import { URL } from "../../../constants/URL";
import authStore from "../../../store/company/auth";
import { getTransactions } from "../../../services/company/wallet/transaction";
import Chip from "../../../components/Chip/Chip";
import moment from "moment";
import Bounce from "../../../assets/images/Bounce.svg";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { IoClose } from "react-icons/io5";
import { useEffect, useState } from "react";
import Modal from "react-responsive-modal";
import Input from "../../../components/Input/Input";
import { addRefund } from "../../../services/company/refund/refund";
import InvoiceDownload from "../../../components/Invoice/Invoice";
import { 
  Wallet as WalletIcon, 
  RefreshCw, 
  Plus, 
  ArrowUpRight, 
  ArrowDownLeft,
  Receipt,
  Clock,
  AlertCircle,
  CheckCircle,
  Calendar,
  Activity
} from "lucide-react";

const Wallet = () => {
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();

  const onCloseModal = () => setOpen(false);

  const { companyId } = authStore();

  const [reason, setReson] = useState("");

  const { data: wallet } = useQuery({
    queryKey: ['GET_WALLET'],
    queryFn: () => getWalletBalance(URL.getWalletCurrentBalance(companyId)),
    enabled: Boolean(companyId)
  });

  const { data: transaction, isLoading } = useQuery({
    queryKey: ['GET_TRANSACTION'],
    queryFn: () => getTransactions(URL.getTransaction(companyId)),
    enabled: Boolean(companyId)
  });

  const { mutate, data } = useMutation({
    mutationFn: ({ company_id, reason }: { company_id: string, reason: string }) => addRefund({ company_id, reason })
  });

  useEffect(() => {
    if (data && data.data?.reson) {
      toast("Request Received! Please wait for 24 hours!")
      setOpen(false);
      setReson("")
    }
  }, [data])

  const walletBalance = wallet?.data?.length ? Number(wallet?.data[0]?.walletBalance) : 0;
  const transactions = transaction?.data?.transaction || [];

  // Calculate stats
  const totalCredits = transactions
    .filter((t: any) => t.transType === "CREDIT")
    .reduce((sum: number, t: any) => sum + (Number(t.invoiceAmount) || 0), 0);
    
  const totalDebits = transactions
    .filter((t: any) => t.transType !== "CREDIT" && t.amountSpent > 0)
    .reduce((sum: number, t: any) => sum + (Number(t.amountSpent) || 0), 0);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <img src={Bounce} alt="LinksFam" className="h-16 w-auto mx-auto mb-4" />
            <div className="absolute -inset-4 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-full blur-xl"></div>
          </div>
          <p className="text-gray-600 font-medium">Loading wallet...</p>
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
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Wallet</h1>
            <p className="text-gray-600">Manage your funds and view transaction history</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Wallet Balance Section */}
            <div className="lg:col-span-1 space-y-6">
              {/* Balance Card */}
              <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl p-6 text-white shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                      <WalletIcon size={24} />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">Wallet Balance</h2>
                      <p className="text-purple-100 text-sm">Available funds</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setOpen(true)}
                    className="p-2 bg-white/20 hover:bg-white/30 rounded-xl transition-colors"
                    title="Request Refund"
                  >
                    <RefreshCw size={20} />
                  </button>
                </div>

                <div className="mb-4">
                  <h1 className="text-4xl font-bold mb-2">₹{walletBalance.toFixed(2)}</h1>
                  <div className="flex items-center space-x-2 text-purple-100 text-sm">
                    <Clock size={14} />
                    <span>Last updated {moment(new Date()).format("MMM DD, YYYY")} at 11:55 PM</span>
                  </div>
                </div>

                <button 
                  className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl p-3 transition-all duration-300 flex items-center justify-center space-x-2 font-medium"
                  onClick={() => navigate('/brand/wallet/recharge')}
                >
                  <Plus size={18} />
                  <span>Recharge Wallet</span>
                </button>
              </div>

              {/* Quick Stats */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Stats</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <ArrowUpRight className="text-green-500" size={16} />
                      <span className="text-sm text-gray-600">Total Credits</span>
                    </div>
                    <span className="font-semibold text-green-600">₹{totalCredits.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <ArrowDownLeft className="text-red-500" size={16} />
                      <span className="text-sm text-gray-600">Total Spent</span>
                    </div>
                    <span className="font-semibold text-red-600">₹{totalDebits.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                    <div className="flex items-center space-x-2">
                      <Activity className="text-blue-500" size={16} />
                      <span className="text-sm text-gray-600">Transactions</span>
                    </div>
                    <span className="font-semibold text-blue-600">{transactions.length}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Transaction History */}
            <div className="lg:col-span-2">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                {/* Transaction Header */}
                <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-6 text-white">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                      <Receipt size={20} />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">Transaction History</h2>
                      <p className="text-blue-100 text-sm">View all your wallet transactions</p>
                    </div>
                  </div>
                </div>

                {/* Transaction Content */}
                <div className="p-6">
                  {transactions.length ? (
                    <div className="space-y-4">
                      {transactions.map((item: any, i: number) => {
                        if (item?.invoiceSerialNo) {
                          return (
                            <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                              {/* Transaction Header */}
                              <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center space-x-3">
                                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                                    item?.transType === "CREDIT" 
                                      ? 'bg-green-100 text-green-600' 
                                      : 'bg-blue-100 text-blue-600'
                                  }`}>
                                    {item?.transType === "CREDIT" ? <ArrowUpRight size={20} /> : <Receipt size={20} />}
                                  </div>
                                  <div>
                                    <div className="flex items-center space-x-2 mb-1">
                                      <Chip 
                                        title={item?.transType === "CREDIT" ? item?.transType : 'WEEKLY INVOICE'} 
                                        variant={item?.transType === "CREDIT" ? 'success' : 'primary'} 
                                      />
                                      {item?.transType === "CREDIT" && item?.creditInfo?.status && (
                                        <Chip 
                                          title={'PAYMENT ' + item?.creditInfo?.status || 'FAILED'} 
                                          variant="ternary" 
                                        />
                                      )}
                                    </div>
                                    <p className="text-sm text-gray-600">Invoice: {item?.invoiceSerialNo}</p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <h3 className={`text-xl font-bold ${
                                    item?.transType === "CREDIT" ? 'text-green-600' : 'text-blue-600'
                                  }`}>
                                    ₹{item?.invoiceAmount?.toString()}
                                  </h3>
                                  <InvoiceDownload
                                    invoiceNumber={item?.invoiceSerialNo}
                                    date={moment(item?.createdAt).format("YYYY-MMM-DD, HH:mm A")}
                                    amount={item?.invoiceAmount ?? 0}
                                    billTo={{ name: item?.company?.name || "Company name", address: item?.company?.address ?? "" }}
                                    placeOfSupply={item?.company.address || "Gurgaon, Haryana, India, 122002"}
                                    description={item?.description || `Advertising services`}
                                    sacCode={item?.sacCode || "998361"}
                                    discount={item?.discount || 0}
                                    taxRate={18}
                                  />
                                </div>
                              </div>

                              {/* Transaction Details */}
                              <div className="bg-gray-50 rounded-lg p-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                  <div className="flex items-center space-x-2">
                                    <Calendar size={14} className="text-gray-400" />
                                    <span className="text-gray-600">
                                      {item?.transType === "CREDIT" 
                                        ? moment(item?.createdAt).format("YYYY-MMM-DD, HH:mm A")
                                        : moment(item?.start).format("YYYY-MMM-DD HH:mm A") + " to " + moment(item?.end).format("YYYY-MMM-DD HH:mm A")
                                      }
                                    </span>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Receipt size={14} className="text-gray-400" />
                                    <span className="text-gray-600">Invoice #{item?.invoiceSerialNo}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        } else if (+item?.amountSpent > 0) {
                          return (
                            <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                              <div className="flex items-start justify-between">
                                <div className="flex items-center space-x-3">
                                  <div className="w-12 h-12 bg-red-100 text-red-600 rounded-xl flex items-center justify-center">
                                    <ArrowDownLeft size={20} />
                                  </div>
                                  <div>
                                    <div className="mb-1">
                                      <Chip title="DEBIT" variant="secondary" />
                                    </div>
                                    <p className="text-sm text-gray-600">
                                      Date: {moment(item?.dateScheduled).format("YYYY-MMM-DD, HH:mm A")}
                                    </p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <h3 className="text-xl font-bold text-red-600">
                                    -₹{item?.amountSpent?.toString()}
                                  </h3>
                                </div>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-2xl flex items-center justify-center">
                        <Receipt size={24} className="text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-500 mb-2">No Transactions Found</h3>
                      <p className="text-sm text-gray-400">Your transaction history will appear here</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Refund Request Modal */}
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
            <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="text-orange-600" size={24} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Request Refund</h2>
            <p className="text-gray-600 text-sm">Please provide a reason for your refund request</p>
          </div>

          {/* Form */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Reason for Refund</label>
              <Input 
                type="text" 
                placeholder="Please describe why you need a refund..." 
                value={reason} 
                onChange={(e: any) => setReson(e.target.value)} 
                isTextArea 
              />
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                onClick={onCloseModal}
                className="flex-1 px-4 py-3 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => mutate({ company_id: companyId, reason: reason })}
                disabled={!reason.trim()}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white rounded-xl font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                <CheckCircle size={16} />
                <span>Submit Request</span>
              </button>
            </div>
          </div>

          {/* Info */}
          <div className="mt-6 p-4 bg-blue-50 rounded-xl">
            <div className="flex items-start space-x-2">
              <AlertCircle className="text-blue-600 mt-0.5" size={16} />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Processing Time</p>
                <p>Refund requests are typically processed within 24-48 hours during business days.</p>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default Wallet
