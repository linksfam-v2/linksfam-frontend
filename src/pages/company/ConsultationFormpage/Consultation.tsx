import Button from '../../../components/Button/Button';
import { useNavigate } from 'react-router-dom';
import { companyCreate } from '../../../services/company/create/create';
import { useMutation } from '@tanstack/react-query';
const Consultation = () => {
  const navigate = useNavigate();

  const { mutate, data: profileData } = useMutation({
    mutationFn: ({
      name,
      url,
      gst,
      nameOfPerson,
      phoneOfPerson,
      desgOfPerson,
      country,
      areaOfSpecialty,
      fb,
      instagram,
      linkedin,
      git,
      x,
      yt,
      pin,
      snap,
      tiktok,
      twitch,
      latlng
    }: {
      name: string;
      url: string;
      gst?: string;
      nameOfPerson?: string;
      phoneOfPerson?: string;
      desgOfPerson?: string;
      country?: string;
      areaOfSpecialty?: string;
      fb?: string;
      instagram?: string;
      linkedin?: string;
      git?: string;
      x?: string;
      yt?: string;
      pin?: string;
      snap?: string;
      tiktok?: string;
      twitch?: string;
      latlng?: string;
      steptwo?: boolean
    }) =>
      companyCreate({
        name,
        url,
        gst,
        nameOfPerson,
        phoneOfPerson,
        desgOfPerson,
        country,
        areaOfSpecialty,
        fb,
        instagram,
        linkedin,
        git,
        x,
        yt,
        pin,
        snap,
        tiktok,
        twitch,
        latlng,
        stepTwo: true
      }),
  });


  const handleFlagChange = () => {
    mutate({ ...profileData, steptwo: true });
  };

  return (
    <div className="">
      <iframe
        aria-label="Consultation form"
        frameBorder="0"
        style={{ height: '100vh', width: '99%', border: 'none' }}
        src="https://docs.google.com/forms/d/e/1FAIpQLScmoGJ-kNLLIiRPAgmUvgJA0SL6psXW9IdoAm_St8kj-_fTyg/viewform?embedded=true"
      >
        Loading...
      </iframe>

      <div className="">
        <Button
          variant="primary"
          className=""
          title="Proceed to MyLinks"
          onClick={() => {
            navigate('/company/links');
            handleFlagChange();
          }}
        />
      </div>
    </div>
  );
};

export default Consultation;
