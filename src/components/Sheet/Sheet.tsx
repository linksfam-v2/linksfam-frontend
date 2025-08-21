
import {
  FacebookIcon,
  FacebookShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  TelegramIcon,
  TelegramShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from "react-share";
import { FaRegCopy } from "react-icons/fa6";
import { QRCodeCanvas } from 'qrcode.react';
import { MdFileDownload } from "react-icons/md";
import { Sheet } from 'react-modal-sheet';
import { toast } from "react-toastify";

interface BottomSheetProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  shLink: string;
  item: any;
  shlinks: { [key: number]: string };
  downloadQRCode: (id: number) => void;
}

function BottomSheet({ downloadQRCode, shlinks, open, setOpen, shLink, item }: BottomSheetProps) {
  const copyWithParam = async (x: string) => {
    await navigator.clipboard.writeText(x);
    toast('Link copied!');
  };

  return (
    <div>
      <Sheet
        onClose={() => setOpen(false)}
        snapPoints={[0.4, 1]}
        isOpen={open}>
        <Sheet.Container style={{
          width: '100%',
          maxWidth: "480px",
          textAlign: 'center',
          left: "50%",
          borderRadius: '0px',
          position: 'fixed',
        }} className="transform">
          <Sheet.Header />
          <Sheet.Content>
            {shlinks[item.id] && <div className="flex items-center justify-center gap-2">
              <p>{shlinks[item.id]}</p>
              <FaRegCopy onClick={() => copyWithParam(shlinks[item.id])} />
            </div>}
            <div className="flex gap-2 justify-center py-4">
              <FacebookShareButton
                url={shLink}
                className="share-button">
                <FacebookIcon size={32} round />
              </FacebookShareButton>
              <WhatsappShareButton
                url={shLink}
                separator=":: ">
                <WhatsappIcon size={32} round />
              </WhatsappShareButton>
              <TelegramShareButton url={shLink}>
                <TelegramIcon size={32} round />
              </TelegramShareButton>
              <LinkedinShareButton
                url={shLink}
                windowWidth={750}
                windowHeight={600}>
                <LinkedinIcon size={32} round />
              </LinkedinShareButton>
            </div>
            <div>
              {shlinks[item.id] && (
                <div className="flex flex-col items-center gap-2">
                  <QRCodeCanvas
                    id={`qrcode-${item.id}`}
                    value={shlinks[item.id]}
                    size={75}
                    level="H"
                    includeMargin={true}
                  />
                  <MdFileDownload onClick={() => downloadQRCode(item.id)} />
                </div>
              )}
            </div>
          </Sheet.Content>
        </Sheet.Container>
        <Sheet.Backdrop onTap={() => setOpen(false)} />
      </Sheet>
    </div>
  )
}

export default BottomSheet