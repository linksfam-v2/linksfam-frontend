import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { URL } from "../../../constants/URL";
import { createMiscInfluencer, getPartner } from "../../../services/company/partner/partner";
import Bounce from "../../../assets/images/Bounce.svg";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import { getInfluencerId, getUserid } from "../../../services/influencer/profile/profile";
import { FaAmazon } from "react-icons/fa6";
import { useEffect } from "react";
import { toast } from "react-toastify";
const Partner = () => {

  const params = useParams();

  const navigate = useNavigate();

  const { data: user } = useQuery({
    queryKey: ['USER_ID'], // Wrap the key in an array
    queryFn: () => getUserid(URL.getUserid),  // The function to fetch data  // The function to fetch data
  });

  const userDetails = user?.data?.length > 0 && user?.data[0];

  const { data: partner, isLoading } = useQuery({
    queryKey: ['PARTNER_DETAIL'],
    queryFn: () => getPartner(URL.getPartner(params?.brand || "")),
    enabled: !!params?.brand,
  });

  const { data: products } = useQuery({
    queryKey: ['PARTNER_DETAIL_PRODUCTS'],
    queryFn: () => getPartner(URL.getPartnerProducts(params?.brand || "")),
    enabled: !!params?.brand,
  });

  const { data: inf } = useQuery({
    queryKey: ['INFLUENCER_ID'], // Wrap the key in an array
    queryFn: () => getInfluencerId(URL.infuencerProfileGet),  // The function to fetch data  // The function to fetch data
  });

  const influencer = inf?.data?.length > 0 && inf?.data[0]?.amazon_tag;

  const influencerId = inf?.data?.length > 0 && inf?.data[0]?.id;

  const partnerDetail = partner?.data?.length > 0 && partner?.data[0];

  const partnerProducts = products?.data?.length > 0 && products?.data[0]?.partnerBrandProduct;

  const { mutate, data: urlData } = useMutation({
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

  const handleShare = async (code: string, id: string) => {
    toast("Generating Link...");
    mutate({
      influencerId,
      otherInfo: `${code}?tag=${influencer}`,
      partnerId: params?.brand!,
      bulkLink: `https://app.linksfam.com/bulk-order/${params?.brand}/${id}`
    });
  };

  if (isLoading) {
    return <div className="Loader">
      <img src={Bounce} alt="LinksFam" />
    </div>
  }

  return (
    <div className="">
      {partnerDetail?.heroMediaUrl ?
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
            <p className="">PRODUCTS</p>
            {partnerProducts?.length && partnerProducts?.map((item: any, index: number) => {
              return (<div key={index} onClick={() => navigate(`/partner/${params?.brand}/${item?.id}`)} className="">
                <div className="">
                  {item?.productImage?.length > 0 && <Carousel swipeable={false} showIndicators={false} emulateTouch={false} autoPlay={false} showStatus={false} showThumbs={false} infiniteLoop dynamicHeight={false} >
                    {
                      item?.productImage?.length > 0 && item?.productImage?.map((item: string, index: String) => {
                        return (
                          <div key={index as string}>
                            <img style={{ width: "100%", height: "300px", objectFit: "cover" }} className="" src={item} alt="LinksFam" />
                          </div>
                        );
                      })
                    }
                  </Carousel>}
                  <p>{item?.productName + item?.id}</p>

                </div>
                <div className="">
                  {userDetails?.type !== "COMPANY" ? <button className="" onClick={(e) => {
                    e.stopPropagation(); // Prevents triggering the parent div's onClick
                    handleShare(item?.redirectUrl, item?.id);
                  }}><FaAmazon />{'Get Amazon link'}</button> : <p style={{ color: 'red' }}>You are logged in as Brand! Only Linksfam Creator are allowed to share link</p>}

                  <button onClick={() => navigate(`/partner/${params?.brand}/${item?.id}`)}>VIEW</button>
                </div>
              </div>);
            })}
          </div>
        </div>
        : null}
    </div>
  )
}

export default Partner;
