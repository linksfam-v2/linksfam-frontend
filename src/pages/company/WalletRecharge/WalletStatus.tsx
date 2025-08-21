import { useMutation } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom"
import { walletRechargeAmount } from "../../../services/company/wallet/wallet";
import Bounce from "../../../assets/images/Bounce.svg";
import { useEffect, useState } from "react";
import {
  CheckCircle,
  XCircle,
  Clock,
  ArrowRight,
  Wallet,
  CreditCard,
  AlertTriangle,
  Home
} from "lucide-react";

const WalletStatus = () => {
  const params = useParams();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState<'success' | 'failed' | 'pending' | null>(null);

  const { status: statusParam } = params;

  const { data, mutate } = useMutation({
    mutationFn: ({ status }: { status: string }) => walletRechargeAmount({ status })
  });

  useEffect(() => {
    if (statusParam) {
      mutate({ status: statusParam });
    }
  }, [statusParam, mutate]);

  useEffect(() => {
    if (data?.data?.length) {
      setStatus('success');
      setIsLoading(false);
      // Auto redirect after 3 seconds
      setTimeout(() => {
        navigate("/brand/wallet");
      }, 3000);
    } else if (data && !data?.data?.length) {
      setStatus('failed');
      setIsLoading(false);
    }
  }, [data, navigate]);

  useEffect(() => {
    // Set status based on URL parameter if mutation hasn't completed
    if (statusParam) {
      const paramStatus = statusParam.toLowerCase();
      if (paramStatus.includes('success')) {
        setStatus('success');
        setIsLoading(false);
      } else if (paramStatus.includes('fail') || paramStatus.includes('error')) {
        setStatus('failed');
        setIsLoading(false);
      } else {
        setStatus('pending');
        setIsLoading(false);
      }
    }
  }, [statusParam]);

  const getStatusConfig = () => {
    switch (status) {
      case 'success':
        return {
          icon: CheckCircle,
          color: 'text-green-600',
          bgColor: 'bg-green-100',
          gradientFrom: 'from-green-600',
          gradientTo: 'to-emerald-600',
          title: 'Payment Successful!',
          message: 'Your wallet has been recharged successfully. The amount has been credited to your account.',
          actionText: 'Go to Wallet',
          actionIcon: Wallet
        };
      case 'failed':
        return {
          icon: XCircle,
          color: 'text-red-600',
          bgColor: 'bg-red-100',
          gradientFrom: 'from-red-600',
          gradientTo: 'to-pink-600',
          title: 'Payment Failed',
          message: 'Unfortunately, your payment could not be processed. Please try again or contact support if the issue persists.',
          actionText: 'Try Again',
          actionIcon: CreditCard
        };
      case 'pending':
        return {
          icon: Clock,
          color: 'text-orange-600',
          bgColor: 'bg-orange-100',
          gradientFrom: 'from-orange-600',
          gradientTo: 'to-yellow-600',
          title: 'Payment Pending',
          message: 'Your payment is being processed. Please wait while we confirm your transaction.',
          actionText: 'Check Status',
          actionIcon: AlertTriangle
        };
      default:
        return {
          icon: Clock,
          color: 'text-gray-600',
          bgColor: 'bg-gray-100',
          gradientFrom: 'from-gray-600',
          gradientTo: 'to-gray-600',
          title: 'Processing...',
          message: 'Please wait while we process your payment.',
          actionText: 'Wait',
          actionIcon: Clock
        };
    }
  };

  const statusConfig = getStatusConfig();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <img src={Bounce} alt="LinksFam" className="h-16 w-auto mx-auto mb-4" />
            <div className="absolute -inset-4 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-full blur-xl"></div>
          </div>
          <p className="text-gray-600 font-medium">Processing your payment...</p>
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

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="max-w-md w-full">
          {/* Status Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className={`bg-gradient-to-r ${statusConfig.gradientFrom} ${statusConfig.gradientTo} p-8 text-white text-center`}>
              <div className={`w-20 h-20 ${statusConfig.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
                <statusConfig.icon size={40} className={statusConfig.color} />
              </div>
              <h1 className="text-2xl font-bold mb-2">{statusConfig.title}</h1>
              <p className="text-white/90 text-sm">{statusConfig.message}</p>
            </div>

            {/* Content */}
            <div className="p-8">
              {/* Transaction Details */}
              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Transaction Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                                         <span className={`font-medium ${statusConfig.color}`}>
                       {status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unknown'}
                     </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Transaction ID:</span>
                    <span className="font-medium text-gray-800">
                      {statusParam || 'TXN-' + Date.now()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date & Time:</span>
                    <span className="font-medium text-gray-800">
                      {new Date().toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <button
                  onClick={() => navigate("/brand/wallet")}
                  className={`w-full bg-gradient-to-r ${statusConfig.gradientFrom} ${statusConfig.gradientTo} hover:shadow-lg text-white py-3 px-4 rounded-xl font-medium transition-all duration-300 flex items-center justify-center space-x-2`}
                >
                  <statusConfig.actionIcon size={18} />
                  <span>{statusConfig.actionText}</span>
                  <ArrowRight size={16} />
                </button>

                {status === 'failed' && (
                  <button
                    onClick={() => navigate("/brand/wallet/recharge")}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-xl font-medium transition-colors flex items-center justify-center space-x-2"
                  >
                    <CreditCard size={18} />
                    <span>Retry Payment</span>
                  </button>
                )}

                <button
                  onClick={() => navigate("/brand/home")}
                  className="w-full bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 py-3 px-4 rounded-xl font-medium transition-colors flex items-center justify-center space-x-2"
                >
                  <Home size={18} />
                  <span>Go to Dashboard</span>
                </button>
              </div>

              {/* Auto redirect notice for success */}
              {status === 'success' && (
                <div className="mt-6 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-800 text-sm text-center">
                    🎉 You will be automatically redirected to your wallet in a few seconds...
                  </p>
                </div>
              )}

              {/* Help text */}
              <div className="mt-6 text-center">
                <p className="text-xs text-gray-500">
                  Need help? Contact our{' '}
                  <a href="#" className="text-purple-600 hover:text-purple-700 font-medium">
                    support team
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WalletStatus
