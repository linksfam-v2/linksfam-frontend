import Button from '../../../components/Button/Button';
import { useEffect, useState } from 'react';
import Modal from 'react-responsive-modal';
import Input from '../../../components/Input/Input';
import { Formik } from 'formik';
import { getBrandThirdParty, PostLinkData2 } from '../../../services/influencer/brands/brands';
import { URL as url } from '../../../constants/URL';
import { useMutation, useQuery } from '@tanstack/react-query';
import Bounce from "../../../assets/images/Bounce.svg";
import influencerAuthStore from '../../../store/company/influencerAuth';
import { influencerShortLinkCreate } from '../../../services/influencer/shortlink/shortlink';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
interface Brand {
    image_url: string;
    brand_name: string;
    brand_url: string;
    id: string;
    categoryId: string;
}

export default function ExploreBrands() {
    const [open, setOpen] = useState(false);
    const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
    const { influencerId } = influencerAuthStore();

    const { data: brands, isLoading } = useQuery({
        queryKey: ['GET_CAMPAIGNS'],
        queryFn: () => getBrandThirdParty(url.getBrandURL()),
        enabled: Boolean(influencerId)
    });

    const campaigns = brands?.data;

    const navigate = useNavigate();

    const onClose = () => setOpen(false);

    const { mutate, data: linkData } = useMutation({
        mutationFn: ({ link, input_type, status, fee, categoryId, brandId, type }: { link: string, input_type: string, status: boolean, fee: string, categoryId: string, brandId: string, type: string }) => PostLinkData2({ categoryId, link, input_type, status, fee, brandId, type }),
    });

    useEffect(() => {
        if (linkData?.data) {
            shortLinkMutate({ influencerId, linkId: linkData?.data?.id })
        }
    }, [linkData])

    const { mutate: shortLinkMutate, data } = useMutation({
        mutationFn: ({ influencerId, linkId }: { influencerId: string, linkId: string }) => influencerShortLinkCreate({ influencerId, linkId })
    });

    useEffect(() => {
        if (data?.data) {
            toast("Shortlink created!");
            setOpen(false);
            navigate("/creator/my-links")
        }
    }, [data])

    if (isLoading) {
        return <div className="Loader">
            <img src={Bounce} alt="LinksFam" />
        </div>
    }
    return (
        <div className="">
            <h1 className="">Explore Brands</h1>
            <p className=""> Copy link of the product. Create short link and earn commission.</p>
            <div className="">
                {campaigns?.length > 0 && campaigns?.map((brand: Brand, index: number) => (
                    <div key={index} className="">
                        <div className="">
                            <img src={brand?.image_url} alt={brand?.brand_name} />
                        </div>
                        <div className="">
                            <Button className="" title='Create Short Link' onClick={() => {
                                setSelectedBrand(brand);
                                setOpen(true);
                            }} />
                        </div>
                    </div>
                ))}
            </div>
            <Modal
                open={open}
                onClose={onClose}
                center
                classNames={{
                    modal: "modal",
                    overlay: "modalOverlay",
                    closeButton: "modalClose",
                }}
            >
                <h3>Create Short Link</h3>
                {selectedBrand && (
                    <div className="">
                        <img src={selectedBrand?.image_url} alt={selectedBrand?.brand_name} />
                        <div className="">
                            <p>{selectedBrand?.brand_name}</p>
                            <p><a href={selectedBrand?.brand_url} target='_blank' >{selectedBrand?.brand_name}</a></p>
                        </div>
                    </div>
                )}

                <Formik
                    key={'createShortLink'}
                    initialValues={{ link: '' }}
                    validate={values => {
                        const errors: { link?: string } = {};
                        if (!values.link) {
                            errors.link = 'Product link is required';
                        } else {
                            try {
                                const linkUrl = new URL(values.link);
                                const previewUrl = new URL(selectedBrand?.brand_url!);
                                const normalizedLinkHost = linkUrl.hostname.replace(/^www\./, '');
                                const normalizedPreviewHost = previewUrl.hostname.replace(/^www\./, '');
                                if (normalizedLinkHost !== normalizedPreviewHost) {
                                    errors.link = `Please enter a valid URL from the same domain as ${previewUrl.hostname}`;
                                }
                            } catch (e) {
                                errors.link = 'Please enter a valid URL';
                            }
                        }
                        return errors;
                    }}
                    onSubmit={(values, { setSubmitting }) => {
                        setSubmitting(false);
                        mutate({
                            status: true,
                            link: values?.link,
                            input_type: 'link',
                            categoryId: selectedBrand?.categoryId!,
                            brandId: selectedBrand?.id!,
                            type: "conversion",
                            fee: "0",
                        });
                    }}
                >
                    {({
                        values,
                        errors,
                        touched,
                        handleChange,
                        handleBlur,
                        handleSubmit,
                        isSubmitting,
                    }) => (
                        <form onSubmit={handleSubmit}>
                            <Input
                                label="Product Link"
                                name="link"
                                type="text"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.link}
                                placeholder="Paste your product link here"
                                isError={touched?.link && Boolean(errors?.link)}
                                hintText={errors?.link}
                                isRequired
                            />
                            <Button
                                title='Create Short Link'
                                type='submit'
                                disabled={isSubmitting}
                            />
                        </form>
                    )}
                </Formik>
            </Modal>
        </div>
    )
}
