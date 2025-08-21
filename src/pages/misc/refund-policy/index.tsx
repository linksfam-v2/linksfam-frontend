import Footer from "../../../ui/footer";
import Header from "../../../ui/header";
const RefundPolicy = () => {
  return (
    <>
      <Header />
      <div className=" refund" style={{ paddingLeft: "7.5%", paddingRight: '7.5%', textAlign: 'justify' }}>
        <div className="row">
          <div>
            <h1>Refund Policy</h1>
            <p>
              You can request a refund of account credit by requesting in your
              Linksfam account. We'll automatically initiate a refund to your
              bank account or credit card associated with your Linksfam account.
            </p>
            <p>
              <strong>Processing time:</strong> 2 weeks for Linksfam to process,
              and additional time for your credit card company to process.
            </p>
               <p>
              <strong>Refund timeframe:</strong> Refund will be credited within 5-7 days to your source account.
            </p>
            <p>
              If you paid by money transfer, we'll ask for your bank account
              details to process the refund. Instructions for how to send us
              your account information can be found below.
            </p>

            <h2>Reasons a refund might not be available</h2>
            <p>Refunds are not issued if:</p>
            <ul>
              <li>
                You have money left over in your account from a promotional
                code.
              </li>
              <li>Your account is still active.</li>
              <li>
                You have an outstanding balance that you still need to pay.
              </li>
            </ul>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default RefundPolicy;
