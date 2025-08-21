import { useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { URL } from "../../../constants/URL";
import { createMiscInfluencer, getPartnerProduct } from "../../../services/company/partner/partner";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import Bounce from "../../../assets/images/Bounce.svg";
import { FaAmazon } from "react-icons/fa6";
import { useEffect } from "react";
import { getInfluencerId, getUserid } from "../../../services/influencer/profile/profile";
const PartnerProductDetail = () => {

  const { data: inf } = useQuery({
    queryKey: ['INFLUENCER_ID'], // Wrap the key in an array
    queryFn: () => getInfluencerId(URL.infuencerProfileGet),  // The function to fetch data  // The function to fetch data
  });

  const { data: user } = useQuery({
    queryKey: ['USER_ID'], // Wrap the key in an array
    queryFn: () => getUserid(URL.getUserid),  // The function to fetch data  // The function to fetch data
  });

  const userDetails = user?.data?.length > 0 && user?.data[0];

  const influencer = inf?.data?.length > 0 && inf?.data[0]?.amazon_tag;

  const influencerId = inf?.data?.length > 0 && inf?.data[0]?.id;

  const params = useParams();

  const { data: products, isLoading } = useQuery({
    queryKey: ['PARTNER_DETAIL_PRODUCT'],
    queryFn: () => getPartnerProduct(URL.getPartnerProduct(params?.brand || "", params?.pid!)),
    enabled: !!params?.pid,
  });

  const product = products?.data.length > 0 ? products?.data[0]?.partnerBrandProduct[0] : null;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { mutate, data: urlData, isPending } = useMutation({
    mutationFn: ({ influencerId, partnerId, otherInfo, bulkLink }: { influencerId: string, partnerId: string, otherInfo: string, bulkLink: string }) => createMiscInfluencer({ otherInfo, influencerId, partnerId, bulkLink })
  });

  useEffect(() => {
    navis();
  }, [urlData]);

  async function navis() {
    if (urlData?.data) {
      const urlsDataFetch = urlData?.data?.shLinkCode;
      const bulkFetch = urlData?.data?.bulkLink
      if (navigator.share) {
        await navigator.share({
          title: 'Check this out!',
          text: `1. Buy now: https://s.linksfam.com/${urlsDataFetch}\n
2. Bulk Order Inquiry: https://s.linksfam.com/${bulkFetch}\n
3. Join us: https://app.linksfam.com/login`
        });
      } else {
        alert("Share not supported on this browser.");
      }
    }
  }

  const handleShare = async (code: string) => {
    mutate({
      influencerId,
      otherInfo: `${code}?tag=${influencer}`,
      partnerId: params?.pid!,
      bulkLink: `https://app.linksfam.com/bulk-order/${params?.brand}/${params?.pid}`
    });
  };


  if (isLoading) {
    return <div className="Loader">
      <img src={Bounce} alt="LinksFam" />
    </div>
  }
  return (
    <div className="">

      <div className="">
        {product && product?.productImage?.length && <Carousel showThumbs={false} showStatus={false} autoPlay infiniteLoop dynamicHeight={false} >
          {
            product?.productImage?.length > 0 && product?.productImage?.map((item: string, index: String) => {
              return (
                <div key={index as string}>
                  <img style={{ width: "100%", height: "300px", objectFit: "cover" }} className="" src={item} alt="LinksFam" />
                </div>
              );
            })
          }
        </Carousel>}
      </div>

      <div className="">
        <h1>{product?.productName}</h1>

        <h2>Price: {product?.discount > 0 ? <><span>Rs {Math.ceil(product?.price * (100 - product?.discount) / 100)}/-</span>&nbsp;<span className="">Rs {product?.price}/-</span></> : <span>Rs ${product?.price}</span>}</h2>

        <p>{product?.productDescription}</p>

        {userDetails?.type !== "COMPANY" ? <button onClick={() => handleShare(product?.redirectUrl)} className=""><FaAmazon />{isPending ? 'Loading...' : 'Get Amazon link'}</button> : <p style={{ color: 'red' }}>You are logged in as Brand! Only Linksfam Creator are allowed to share link</p>}
        <hr className="" />
      </div>
    </div >
  )
}

export default PartnerProductDetail;
