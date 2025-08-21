import { SocialMediaData } from '../../types/social';

// Import the SCSS module

interface Props {
  data: SocialMediaData;
}

export default function ProfileCard({ data }: Props) {
  // Format numbers for display (e.g., 1000 -> 1k)
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num;
  };

  // Extract links from biography
  const extractLinks = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.match(urlRegex) || [];
  };

  // Format biography with line breaks
  const formatBio = (bio: any) => {
    if (!bio) return [];
    return bio.split('\n').filter((line: string) => line.trim() !== '');
  };

  const bioLines = formatBio(data?.biography ?? '');
  const links = extractLinks(data?.biography ?? '');

  return (
    <div className="">
      <div className="">
        <div className="">
          <img
            src={data.profile_picture_url || '/api/placeholder/96/96'}
            alt={data.name}
            className=""
          />
        </div>

        <div className="">
          <div className="">
            <h3 className="">{data.username}</h3>
          </div>
          <p className="">{data.name}</p>
        </div>
       
      </div>

      <div className="">
        <div className="">
          <p className="">
            {formatNumber(data?.media_count ?? 0)}
          </p>
          <p className="">
            {data?.socialMediaType === 'youtube' ? 'Videos' : 'Posts'}
          </p>
        </div>
        <div className="">
          <p className="">
            {formatNumber(data?.followers_count ?? 0)}
          </p>
          <p className="">
            {data?.socialMediaType === 'youtube' ? 'Subscribers' : 'Followers'}
          </p>
        </div>
        <div className="">
          <p className="">
            {formatNumber(data?.follows_count ?? 0) || ''}
          </p>
          <p className="">
            {data?.socialMediaType === 'instagram' ? 'Following' : ''}
          </p>
        </div>
      </div>

      <div className="">
        {bioLines.map((line: string, index: number) => (
          <p key={index} className="">
            {line}
          </p>
        ))}
      </div>

      {links.length > 0 && (
        <div className="">
          {links.map((link, index) => (
            <a
              key={index}
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className=""
            >
              {link}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}