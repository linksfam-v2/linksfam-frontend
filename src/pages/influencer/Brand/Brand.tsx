import { useInfiniteQuery, useMutation } from '@tanstack/react-query';
import { URL } from '../../../constants/URL';
import { getBrandsFilter } from '../../../services/influencer/brands/brands';
import Bounce from '../../../assets/images/Bounce.svg';
import Button from '../../../components/Button/Button';
import { influencerShortLinkCreate } from '../../../services/influencer/shortlink/shortlink';
import influencerAuthStore from '../../../store/company/influencerAuth';
import { useEffect, useRef, useState, useCallback } from 'react';
import Chip from '../../../components/Chip/Chip';


// CSS imports removed - using Tailwind instead
import { IoIosArrowDown } from 'react-icons/io';
import SortFilterDropdown from '../../../components/SortFilterDropdown/SortFilterDropdown';
import { CompanyProfile } from '../../company/Profile/types';
import Dropdown, { ListProps } from '../../../components/Dropdown/Dropdown';
import BottomSheet from '../../../components/Sheet/Sheet';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getCategories } from '../../../services/company/category/category';
import mixpanel from 'mixpanel-browser';
import { getInfluencerId } from '../../../services/influencer/profile/profile';
import InfluencerSocials from '../Social/Social';
export interface InfluencerCategory {
  id: number;
  name: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface Brands {
  id: number;
  categoryId: number;
  companyId: number;
  company: CompanyProfile;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  currency: string; // e.g., "INR"
  fee: string; // Fee as a string
  isActive: boolean;
  link: string; // URL link
  category: InfluencerCategory;
  type?: string;
  product_link?: string;
  brandId: any;
  brand: any;
  isExploreBrandlink?: boolean;
}

const variants: ListProps[] = [
  {
    label: 'New to Old',
    value: '0',
  },
  {
    label: 'Old to New',
    value: '1',
  },
  {
    label: 'High to Low Fee',
    value: '3',
  },
  {
    label: 'Low to High Fee',
    value: '2',
  },
  {
    label: 'Most Shared',
    value: '4',
  },
  {
    label: 'Least Shared',
    value: '5',
  },
];

const InfluencerBrand = () => {
  const observer = useRef<IntersectionObserver | null>(null);
  const { influencerId } = influencerAuthStore();

  const [open, setOpen] = useState(false);

  const onOpenModal = () => setOpen(true);

  const [loadingButtons, setLoadingButtons] = useState<{
    [key: number]: boolean;
  }>({});

  const [shlinks, setshlinks] = useState<{ [key: number]: string }>({});

  const [shLink, setshLink] = useState('');

  const [i, setI] = useState<number>(0);

  const [children, setChildren] = useState<ListProps>(variants[0]);

  const [categoryFilter, setCategoryFilter] = useState({
    label: 'Filter by Category',
    value: '0',
  });
  const [expand, setExpand] = useState<any>({});

  const [item, setItem] = useState<any>({});

  const navigate = useNavigate();

  const { data: _profile, isLoading: profileLoading } = useQuery({
    queryKey: ['INFLUENCER_PROFILE'],
    queryFn: () => getInfluencerId(URL.infuencerProfileGet),
  });

  const { mutate, data } = useMutation({
    mutationFn: ({
      influencerId,
      linkId,
    }: {
      influencerId: string;
      linkId: string;
    }) => influencerShortLinkCreate({ influencerId, linkId }),
  });

  const {
    data: brandsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch: refetchBrands,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ['GET_BRANDS', children.value, categoryFilter.value],
    queryFn: ({ pageParam = 1 }) =>
      getBrandsFilter(
        URL.brands,
        children.value,
        categoryFilter.value !== '0' ? categoryFilter.value : undefined,
        pageParam
      ),
    getNextPageParam: (lastPage, _allPages) => {
      const nextPage = lastPage?.data?.pagination?.currentPage + 1;
      return nextPage <= lastPage?.data?.pagination?.totalPages ? nextPage : undefined;
    },
    initialPageParam: 1,
  });

  const { data: categories, isLoading: isLoadingcat } = useQuery({
    queryKey: ['GET_CATEGORY'],
    queryFn: () => getCategories(URL.getCategory),
  });

  const filterCategories = categories?.data?.map((item: any) => {
    return {
      label: item.name,
      value: item.id.toString(),
    };
  });
  filterCategories?.unshift({
    label: 'All Categories',
    value: '0',
  });

  useEffect(() => {
    if (data?.data) {
      const shortLink = data?.data?.shLinkCode;
      const url = 'https://s.linksfam.com/' + shortLink;
      setshLink(url);
      onOpenModal();
      setLoadingButtons({});
      setshlinks((prev) => ({ ...prev, [i]: url }));
    }
  }, [data]);

  const downloadQRCode = (index: number) => {
    const canvas = document.getElementById(
      `qrcode-${index}`
    ) as HTMLCanvasElement;
    const pngUrl = canvas
      ?.toDataURL('image/png')
      ?.replace('image/png', 'image/octet-stream');
    const downloadLink = document.createElement('a');
    downloadLink.href = pngUrl;
    downloadLink.download = `qrcode-${index}.png`;
    downloadLink.click();
  };

  const returnRuppeSymbol = (price: number) => {
    if (price < 6) {
      return '₹';
    } else if (price < 10 || price >= 6) {
      return '₹₹';
    } else if (price > 10) {
      return '₹₹₹';
    } else {
      return '₹';
    }
  };

  // Flatten paginated data
  const brands = brandsData?.pages.flatMap((page) => page?.data.data) || [];

  // Intersection Observer setup
  const lastElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isFetchingNextPage) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      });

      if (node) observer.current.observe(node);
    },
    [isFetchingNextPage, hasNextPage, fetchNextPage]
  );

  // Update filter/sort handlers
  const handleFilterChange = (e: ListProps) => {
    setCategoryFilter(e);
    refetchBrands();
  };

  const handleSortChange = (e: ListProps) => {
    setChildren(e);
    refetchBrands();
  };

  useEffect(() => {
    mixpanel.track('INFLUENCER_BRANDS_PAGE', {
      influencerId
    });
  }, [])

  if(_profile?.data[0]?.is_yt_eligible === false && _profile?.data[0]?.is_insta_eligible === false){
    return <InfluencerSocials />
  }

  if (isLoading || isLoadingcat || profileLoading) {
    return (
      <div className="Loader">
        <img src={Bounce} alt="LinksFam" />
      </div>
    );
  }

  return (
    <div className="">
      <div className="">
        <div>
          <SortFilterDropdown type="sort" className="">
            <Dropdown
              children={variants}
              selectedChild={children}
              placeholder="Sort By"
              setSelectChild={handleSortChange}
              rightIcon={<IoIosArrowDown />}
            />
          </SortFilterDropdown>
          <SortFilterDropdown type="filter" className="">
            <Dropdown
              children={filterCategories}
              selectedChild={categoryFilter}
              placeholder="Filter"
              setSelectChild={handleFilterChange}
              rightIcon={<IoIosArrowDown />}
            />
          </SortFilterDropdown>
        </div>
        <Button
          title="Explore Brands"
          className=""
          size="small"
          type="button"
          onClick={() => navigate('/creator/brands/explore')}
        />
      </div>
      {/* Commented as intructed by Vikram@linksfam.com */}
      {/*<div onClick={() => {
        mixpanel.track('INFLUENCER_FEATHER_SPUN_BANNER', {
          influencerId
        });
        navigate("/partner/feather-and-spun");
      }} className="">
        <img src={Banner} alt="Feather and Spun x LinksFam" />
      </div>*/}

      {brands?.length ? (
        brands?.map(
          (item: Brands, i: number) =>
            !item?.isExploreBrandlink && (
              <div
                className=""
                key={item.id}
                ref={i === brands.length - 1 ? lastElementRef : null}
              >
                <div className="">
                  <div className="">
                    {item?.brand?.image_url ? (
                      <img
                        src={item?.brand?.image_url}
                        alt={item?.brand?.brand_name}
                      />
                    ) : (
                      <h3>{item?.brand?.brand_name ?? item?.company?.name}</h3>
                    )}
                  </div>
                  <div className="">
                    <p>Status</p>
                    <span>
                      <Chip
                        title={item?.isActive ? 'Active' : 'Deactive'}
                        variant={item?.isActive ? 'success' : 'secondary'}
                      />
                    </span>
                  </div>
                  <div className="">
                    <p>Commission</p>
                    <span>
                      Upto{' '}
                      {(item?.brandId
                        ? `${item?.brand?.max_spend}%`
                        : `${returnRuppeSymbol(+item?.fee)}/${item?.type || `cpu`}`) ||
                        '-'}
                    </span>
                  </div>
                </div>
                <div className="">
                  <p>{item?.link}</p>
                </div>
                <div className="">
                  <div>
                    <p>Category</p>
                    <span>{item?.category?.name}</span>
                  </div>
                  <Button
                    title={loadingButtons[item.id] ? 'Loading...' : 'GET LINK'}
                    onClick={() => {
                      setLoadingButtons((prev) => ({
                        ...prev,
                        [item.id]: true,
                      }));
                      setItem(item);
                      mutate({ influencerId, linkId: item?.id?.toString() });
                      setI(item.id);
                      setExpand((prev: any) => ({ ...prev, [i]: !expand[i] }));
                    }}
                  />
                </div>
              </div>
            )
        )
      ) : (
        <p className="NotFound">No Brands Found</p>
      )}
      {isFetchingNextPage && (
        <div className="Loader">
          <img src={Bounce} alt="LinksFam" />
        </div>
      )}
      <BottomSheet
        open={open}
        setOpen={setOpen}
        item={item}
        shLink={shLink}
        shlinks={shlinks}
        downloadQRCode={downloadQRCode}
      />
    </div>
  );
};

export default InfluencerBrand;
