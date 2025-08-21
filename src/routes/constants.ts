import CompanyAuth from "../pages/company/Auth/Auth";
import CompanyCreate from "../pages/company/CompanyCreate/CompanyCreate";
import CompanyOverview from "../pages/company/Overview/Overview";
import Profile from "../pages/company/Profile/Profile";
import Wallet from "../pages/company/Wallet/Wallet";
// import WalletRecharge from "../pages/company/WalletRecharge/WalletRecharge";
import Home from "../pages/company/Home/Home";
import InfluencerAccount from "../pages/influencer/Account/Account";
import InfluencerAuth from "../pages/influencer/Auth/Auth";
import InfluencerBrand from "../pages/influencer/Brand/Brand";
import InfluencerLinks from "../pages/influencer/Links/Links";
import InfluencerOverview from "../pages/influencer/Overview/Overview";
import InfluencerProfile from "../pages/influencer/Profile/Profile";
import Redeem from "../pages/influencer/RedeemEarnings/Redeem";
import InfluencerSocials from "../pages/influencer/Social/Social";
import TableOverview from "../pages/influencer/TableOverview/TableOverview";
import Creator from "../pages/company/Creator/Creator";
import AddBank from "../pages/company/AddBank/AddBank";
import MyLinks from "../pages/company/MyLinks/MyLinks";
import ExploreBrands from "../pages/influencer/ExploreBrands/ExploreBrands";
import WalletStatus from "../pages/company/WalletRecharge/WalletStatus";
import RefundPolicy from "../pages/misc/refund-policy";
import CookiesPolicy from "../pages/misc/cookies-policy";
import Terms from "../pages/misc/terms";
import Privacy from "../pages/misc/privacy";
import NotFound from "../pages/NotFound/NotFound";
import Refer from "../pages/general/Refer/Refer";
import Consultation from "../pages/company/ConsultationFormpage/Consultation";
import MyShop from "../pages/influencer/MyShop/myShop";
import AddPost from "../pages/influencer/MyShop/AddPost/addPost";
import HomePage from "../pages/influencer/Home/Home";
import ProductsPage from "../pages/influencer/Products/Products";
import CrossPost from "../pages/influencer/CrossPost/CrossPost";

export const UNRESTRICTED_ROUTES = [
  {
    path: '/brand/welcome',
    component:Home
  },
  {
    path: '/brand/login',
    component: CompanyAuth,
  },
  {
    path: '/creator/login',
    component: InfluencerAuth,
  },
  {
    path: "/refund-policy",
    component: RefundPolicy
  },
  {
    path: "/cookies-policy",
    component: CookiesPolicy
  },
  {
    path: "/terms",
    component: Terms
  },
  {
    path: "/privacy",
    component: Privacy
  },
  {
    path: "/404",
    component: NotFound
  },
  {
    path: "/refer",
    component: Refer
  },
  // {
  //   path: 'bulk-order/:opartner/:pid',
  //   component: PartnerForm
  // }
]

export const COMPAMY_ROUTES_WITHOUT_BOTTOM_NAV = [
  {
    path: '/brand/create',
    component: CompanyCreate,
  },
]

export const INFLUENCER_ROUTES_WITHOUT_BOTTOM_NAV = [
  {
    path: '/creator/create',
    component: InfluencerProfile,
  },
];

export const COMPANY_ROUTES = [
  {
    path: '/brand/overview',
    component: CompanyOverview,
  },
  {
    path: '/brand/creators',
    component: Creator,
  },
  {
    path: '/brand/links',
    component: MyLinks
  },
  {
    path: '/brand/profile',
    component: Profile
  },
  {
    path: '/brand/wallet',
    component: Wallet
  },
  {
    path: '/brand/wallet/recharge',
    component: AddBank
  },
  {
    path: '/brand/wallet/pg/:status',
    component: WalletStatus
  },
  {
    path: '/brand/add-bank',
    component: AddBank
  },
  {
    path: '/brand/consultation',
    component: Consultation
  }
]


export const INFLUENCER_ROUTES = [
  {
    path: '/creator/overview',
    component: InfluencerOverview,
  },
  {
    path: '/creator/table/overview',
    component: TableOverview,
  },
  {
    path: '/creator/social',
    component: InfluencerSocials,
  },
  {
    path: '/creator/account',
    component: InfluencerAccount,
  },
  {
    path: '/creator/brands',
    component: InfluencerBrand,
  },
  {
    path: '/creator/my-links',
    component: InfluencerLinks,
  },
  {
    path: '/creator/my-links',
    component: InfluencerLinks,
  },
  {
    path: '/creator/wallet/redeem',
    component: Redeem,
  },
  {
    path: '/creator/brands/explore',
    component: ExploreBrands,
  },
  {
    path:'/creator/home',
    component:HomePage
  },
  {
    path:'/creator/my-shop',
    component:MyShop
  },
  {
    path:'/creator/my-shop/add-post',
    component:AddPost
  },
  {
    path: '/creator/products',
    component: ProductsPage
  },
  {
    path: '/creator/socials',
    component: InfluencerSocials
  },
  {
    path: '/creator/cross-post',
    component: CrossPost
  }
]

export const PARTNER_ROUTES = [
  // {
  //   path: '/partner/:brand',
  //   component: Partner
  // },
  // {
  //   path: '/partner/:brand/:pid',
  //   component: PartnerProductDetail
  // },
];