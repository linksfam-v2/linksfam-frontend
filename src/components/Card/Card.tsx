import Chip from '../Chip/Chip';
import Button from '../Button/Button';
import { cn } from '@/lib/utils';

const Card = ({
  title = '',
  subtitle,
  supportext,
  subtitleColor = false,
}: TypeCard) => {
  return (
    <div className="p-3 px-4 rounded-2xl border border-[#dfdfdf] bg-white max-w-full">
      <div className="mt-2 flex justify-between items-start">
        <p className="text-base font-normal">{title}</p>
      </div>
      <p
        className={cn(
          "text-2xl font-semibold mt-1",
          {
            "text-[#1ea369]": subtitleColor,
          }
        )}
      >
        {subtitle}
      </p>
      <p className="text-xs font-normal text-[#475467] mt-2">{supportext}</p>
    </div>
  );
};

export default Card;

type TypeCard = {
  title?: string;
  subtitle?: string;
  chip?: string;
  supportext?: string;
  link?: string;
  img?: string | any;
  subtitleColor?: boolean;
};

export const SocialCard = ({
  title = '',
  subtitle,
  chip = '',
  img = '',
}: TypeCard) => {
  return (
    <div className="p-3 px-4 rounded-2xl border border-[#dfdfdf] bg-white max-w-full flex flex-col items-start gap-4">
      <div className="w-full pb-2 flex items-start border-b border-[#cfcfcf]">
        <div className="w-12 h-12">
          <img src={img} alt={title} className="w-12 h-12" />
        </div>
        <div className="flex flex-col justify-start ml-4">
          <p className="text-2xl font-semibold text-[#101828]">{title}</p>
          <span className="text-sm font-normal mb-2 text-[#6e7784]">{subtitle}</span>
          <div className="w-max">
            <Chip title={chip} variant="secondary" />
          </div>
        </div>
      </div>
      <div>
        <Button title="Submit" />
      </div>
    </div>
  );
};

export const ConversionStatsCard = () => {
  return (
    <div className="p-3 px-4 rounded-2xl border border-[#dfdfdf] bg-white max-w-full mt-4">
      <div className="flex justify-between items-center w-full mb-2">
        <div className="flex-1 text-center px-3 flex justify-center items-center">
          <p className="font-semibold">Clicks</p>
        </div>
        <div className="flex-1 text-center px-3 flex justify-center items-center">
          <p className="font-semibold">Items</p>
        </div>
        <div className="flex-1 text-center px-3 flex justify-center items-center">
          <p className="font-semibold">Ad Fees</p>
        </div>
        <div className="flex-1 text-center px-3 flex justify-center items-center">
          <p className="font-semibold">Status</p>
        </div>
      </div>
      <div className="flex justify-between items-center w-full mb-0">
        <div className="flex-1 text-center px-3 flex justify-center items-center">
          <p className="my-2 text-center w-full">0</p>
        </div>
        <div className="flex-1 text-center px-3 flex justify-center items-center">
          <p className="my-2 text-center w-full">0</p>
        </div>
        <div className="flex-1 text-center px-3 flex justify-center items-center">
          <p className="my-2 text-center w-full">0</p>
        </div>
        <div className="flex-1 text-center px-3 flex justify-center items-center">
          <Chip title="Pending" />
        </div>
      </div>
    </div>
  );
};
