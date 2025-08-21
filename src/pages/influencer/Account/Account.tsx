
import { useQuery } from "@tanstack/react-query";
import { URL } from "../../../constants/URL";
import Button from "../../../components/Button/Button";
import { CiBank } from "react-icons/ci";
import Chip from "../../../components/Chip/Chip";
import moment from "moment";
import jsPDF from "jspdf";
import Bounce from "../../../assets/images/Bounce.svg";
import { getInfluencerTransactions } from "../../../services/influencer/transaction/transaction";
import influencerAuthStore from "../../../store/company/influencerAuth";
import { getInfluencerWalletBalance } from "../../../services/influencer/wallet/wallet";
import { useNavigate } from "react-router-dom";
import { FaDownload } from "react-icons/fa6";
import { toast } from "react-toastify";
import cx from 'classnames';
import { getInfluencerId } from "../../../services/influencer/profile/profile";
import InfluencerSocials from "../Social/Social";

const InfluencerAccount = () => {

  const navigate = useNavigate();

  const { influencerId } = influencerAuthStore();

  const { data: _profile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ['INFLUENCER_PROFILE'],
    queryFn: () => getInfluencerId(URL.infuencerProfileGet),
  });

  const { data: wallet } = useQuery({
    queryKey: ['GET_INFLUENCER_WALLET'],
    queryFn: () => getInfluencerWalletBalance(URL.getInfluencerWalletValue(influencerId)),
    enabled: Boolean(influencerId),
  });

  const { data: transaction, isLoading } = useQuery({
    queryKey: ['GET_INFLUENCER_TRANSACTION'],
    queryFn: () => getInfluencerTransactions(URL.getInfluencerTransaction(influencerId)),
    enabled: Boolean(influencerId),
  });


  const handleDownloadPDF = (item: any) => {
    const doc = new jsPDF();

    // Colors
    const primaryColor = [0, 84, 230]; // Blue

    // Add Header Section
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(0, 0, 210, 30, "F"); // Blue Header Background
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255); // White text
    doc.setFontSize(20);
    doc.text("Invoice", 105, 20, { align: "center" });

    // Add Company Information
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.text("Company", 10, 10);

    // Invoice Details Section
    doc.setTextColor(0, 0, 0); // Reset text color to black
    doc.setFontSize(12);
    doc.text("Invoice Details", 10, 40);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(50, 50, 50);
    doc.text(`Invoice Type: ${item?.transType}`, 10, 50);
    doc.text(`Invoice Serial No: ${item?.invoiceSerialNo}`, 10, 60);

    // Add Invoice Amount Section
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]); // Blue Text
    doc.text(`Invoice Amount: Rs ${item?.invoiceAmount}`, 10, 70);

    // Transaction Details Section
    doc.setTextColor(0, 0, 0); // Reset text color
    const transactionDetail = item?.transType === "EARNING"
      ? `Credited for - ${item?.invoiceSerialNo}`
      : `Debited for  - ${item?.invoiceSerialNo}`;
    const transactionDate =
      item?.transType === "EARNING" ? moment(item?.createdAt).format("YYYY-MMM-DD hh:mm A")
        : `${moment(item?.start).format("YYYY-MMM-DD hh:mm A")} to ${moment(item?.end).format("YYYY-MMM-DD hh:mm A")}`;

    doc.text(transactionDetail, 10, 90);
    doc.text(`Transaction Date: ${transactionDate}`, 10, 80);

    // Horizontal Line Separator
    doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.line(10, 100, 200, 100); // Draw a line

    // Footer Section
    doc.setFont("helvetica", "italic");
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text("Thank you for your business!", 105, 280, { align: "center" });
    doc.text("Linksfam | www.Linksfam.com", 105, 290, { align: "center" });

    // Save the PDF
    const fileName = `${item?.invoiceSerialNo}_invoice.pdf`;
    doc.save(fileName);
  };

  if (isLoading || isLoadingProfile) {
    return <div className="Loader">
      <img src={Bounce} alt="LinksFam" />
    </div>
  }

  if(_profile?.data[0]?.is_yt_eligible === false && _profile?.data[0]?.is_insta_eligible === false){
    return <InfluencerSocials />
  }

  return (
    <div className="">
      <div className="">
        <div className="">
          <div className="">
            <p className="">Total earnings</p>
            <Button isOutlined size="medium" onClick={() => navigate("/creator/wallet/redeem")} title="Redeem" />
          </div>

          <div className="">
            <h1>&#8377;{wallet?.data?.length && Number(wallet?.data[0]?.walletBalance)?.toFixed(2)}</h1>
          </div>
          <div></div>
        </div>
        <div className="">
          <div onClick={() => toast("Coming soon!")} className="">
            <CiBank />
            <p>Add Bank Account</p>
          </div>
        </div>
      </div>
      <div className="">
        <p className="">Transaction History</p>
        <div className="">
          {
            transaction?.data?.transaction?.length ? transaction?.data?.transaction?.map((item: any) => {
              return (item?.invoiceSerialNo ? <div className="">
                <div className="">
                  <Chip title={item?.transType === "REDEEM" ? 'REDEEM' : 'WEEKLY INVOICE'} variant={item?.transType === "EARNING" ? 'primary' : 'secondary'} />
                  <FaDownload onClick={() => handleDownloadPDF(item)} />
                </div>
                <div className="">
                  <div>
                    <p>Invoice - <span>{item?.invoiceSerialNo}</span></p>
                    {item?.transType === "REDEEM" ? <h5>{moment(item?.createdAt).format("YYYY-MMM-DD HH:mm A")}</h5> : <h5>{moment(item?.start).format("YYYY-MMM-DD HH:mm A")} <span className="">to</span> {moment(item?.end).format("YYYY-MMM-DD HH:mm A")}</h5>}
                  </div>
                  <h1 className={cx({
                    ["colorError"]: item?.transType === "REDEEM"
                  })}>{item?.transType === "EARNING" ? '' : '-'}&#8377;{item?.invoiceAmount?.toString()}</h1>
                </div>
              </div> : (+item?.amountRecieved > 0) ? <div className="">
                <div className="">
                  <Chip title={'DAILY EARNING'} variant={'success'} />

                </div>
                <div className="">
                  <div>
                    <h5>Date: {moment(item?.dateScheduled).format("YYYY-MMM-DD HH:mm A")} </h5>
                  </div>
                  <h1 className="">+&#8377;{item?.amountRecieved?.toString()}</h1>
                </div>
              </div> : null);
            })
              : <p className="NotFound">No Transaction Found</p>}
        </div>
      </div>
    </div>
  )
}

export default InfluencerAccount
