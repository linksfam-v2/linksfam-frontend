import { useQuery } from "@tanstack/react-query";
import { URL } from "../../../constants/URL";
import { influencerGetShortLink } from "../../../services/influencer/shortlink/shortlink";
import influencerAuthStore from "../../../store/company/influencerAuth";
import Bounce from "../../../assets/images/Bounce.svg";
import { toast } from "react-toastify";
import { IoClose } from "react-icons/io5";
import { IoQrCodeOutline } from "react-icons/io5";
import { FaRegCopy } from "react-icons/fa6";
import Modal from "react-responsive-modal";
import { useEffect, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { MdFileDownload } from "react-icons/md";
import { IoMdShareAlt } from "react-icons/io";
import { getInfluencerId } from "../../../services/influencer/profile/profile";
import InfluencerSocials from "../Social/Social";
export interface DeviceInfo {
  ip: string; // IPv4 address
  ip6: string; // IPv6 address
  mac: string; // MAC addres
}

export interface Link {
  fee: string; // Fee as a string
  company: any;
  link: string;
  category: any;
  brand: any
  // Add additional properties if the `link` object has more fields
}

export interface VisitData {
  id: number;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  deviceInfo: DeviceInfo; // Nested object for device information
  influencerId: number;
  isBot: any[]; // Array of any type (if the type is known, replace `any` with it)
  link: Link; // Object for link details
  linkId: number;
  shLinkCode: string; // Shortened link code
  visit: number; // Visit count
}

const InfluencerLinks = () => {

  const { influencerId } = influencerAuthStore();

  const [_item] = useState<any>({});
  const [_shLink, setshLink] = useState("");
  const [_shlinks, setshlinks] = useState<{ [key: number]: string }>({});
  const [i] = useState<number>(0);


  const [open, setOpen] = useState(false);

  const [linker, setLinker] = useState("");

  const { data: _profile, isLoading: profileLoading } = useQuery({
    queryKey: ['INFLUENCER_PROFILE'],
    queryFn: () => getInfluencerId(URL.infuencerProfileGet),
  });

  const { data: shortLinks, isLoading } = useQuery({
    queryKey: ['INFLUENCER_MY_LINKS'],
    queryFn: () => influencerGetShortLink({ url: URL.influencerMyLinks(), influencerId }),
    enabled: Boolean(influencerId)
  });


  useEffect(() => {
    if (shortLinks?.data && shortLinks?.data?.length > 0) {
      const currentItem: VisitData | undefined = shortLinks.data.find((item: VisitData) => item.id === i);
      if (currentItem) {
        const shortLink = currentItem?.shLinkCode;
        const url = "https://s.linksfam.com/" + shortLink;
        setshLink(url);
        setshlinks((prev) => ({ ...prev, [i]: url }));
      }
    }
  }, [shortLinks, i]);


  const copy = async (code: string) => {
    await navigator.clipboard.writeText('https://s.linksfam.com/' + code);
    toast('Link copied!')
  };

  const onCloseModal = () => setOpen(false);

  const downloadQRCode = () => {
    const canvas = document.getElementById(`qrcode-${linker}`) as HTMLCanvasElement;
    const pngUrl = canvas?.toDataURL("image/png")?.replace("image/png", "image/octet-stream");
    const downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = `qrcode-${linker}.png`;
    downloadLink.click();
  };

  const handleShare = async (code: string) => {
    if (navigator.share) {
      navigator.share({
        url: 'https://s.linksfam.com/' + code,
      });
    }
  }

  if (isLoading || profileLoading) {
    return <div className="Loader">
      <img src={Bounce} alt="LinksFam" />
    </div>
  }

  if(_profile?.data[0]?.is_yt_eligible === false && _profile?.data[0]?.is_insta_eligible === false){
    return <InfluencerSocials />
  }

  return (
    <div className="">
      {shortLinks?.data?.length ? shortLinks?.data?.map((item: VisitData, index: number) => {
        return (
          <div className="" key={index}>
            <div className="">
              <div className="">
                <span>
                  <p>Brand</p>
                  <span>{item?.link?.company?.name || item?.link?.brand?.brand_name || '-'}</span>
                </span>
                <span>
                  <p>Total Visits</p>
                  <span className="">{item?.visit}</span>
                </span>
                <span>
                  <p>Category</p>
                  <span>{item?.link?.category?.name}</span>
                </span>
              </div>

            </div>
            <div className="">
              <div className="">
                <div className="">
                  <p>{'https://s.linksfam.com/' + item?.shLinkCode}</p>
                  &nbsp;&nbsp;
                  <FaRegCopy onClick={() => copy(item?.shLinkCode)} />
                </div>
              </div>
              <div className="">
                <div className="">
                  <button className="" onClick={() => { setLinker(item?.shLinkCode); setOpen(true); }} >
                    <IoQrCodeOutline />
                  </button>
                  <button className="" onClick={() => { handleShare(item?.shLinkCode) }} >
                    <IoMdShareAlt />
                  </button>
                  <button className="" onClick={() => copy(item?.shLinkCode)} >
                    <FaRegCopy />
                  </button>
                </div>
              </div>
            </div>

          </div>
        );
      }) : <p className="NotFound">No Links Found</p>}
      <Modal open={open} onClose={onCloseModal} closeIcon={<IoClose />} center styles={{
        modal: { minWidth: "180px" },
      }}>
        <center className="">
          <QRCodeCanvas
            id={`qrcode-${linker}`}
            value={'https://s.linksfam.com/' + linker}
            size={75}
            level="H"
            includeMargin={true}
          />
        </center>
        <div className="" ><MdFileDownload onClick={() => downloadQRCode()} /></div>
      </Modal>
    </div>
  )
}

export default InfluencerLinks
