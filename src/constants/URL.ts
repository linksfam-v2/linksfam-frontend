export const HTTP_METHOD = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
};

export const BASEURL = `https://backend.linksfam.com/api/v1`;

 //export const BASEURL = `http://localhost:3333/api/v1`;

export const URL = {
  companyLogin: `${BASEURL}/auth/email`,
  influencerLogin: `${BASEURL}/auth/phone`,
  companyOtp: `${BASEURL}/auth/otp`,
  getUserid: `${BASEURL}/auth/user`,
  resendcompanyLogin: `${BASEURL}/auth/resend`,
  companyCreate: `${BASEURL}/company/create`,
  getCompanyProfile: `${BASEURL}/company/profile/get`,
  getUserCompanyProfile: `${BASEURL}/company/profile/user`,
  getCompanyLinksById: (id: string) => `${BASEURL}/company/link/${id}`,
  getCategory: `${BASEURL}/company/category`,
  companyCreateLink: `${BASEURL}/company/link/create`,
  getWalletCurrentBalance: (id: string) =>
    `${BASEURL}/company/wallet/${id}/get`,
  rechargeWallet: () => `${BASEURL}/company/wallet/recharge`,
  initWallet: () => `${BASEURL}/company/wallet/init`,
  addReason: (cid: string) => `${BASEURL}/company/request-refund/${cid}/post`,
  getTransaction: (id: string) => `${BASEURL}/company/transaction/${id}/get`,
  getAnlytics: (q: string, companyId: string) =>
    `${BASEURL}/company/analytics/${companyId}/dashboard?q=${q}`,
  views: (q: string, companyId: string) =>
    `${BASEURL}/company/analytics/${companyId}/views-amount?q=${q}`,
  infuencerProfileGet: `${BASEURL}/influencer/profile/get`,
  infuencerUserProfileGet: `${BASEURL}/influencer/profile/user`,
  infuencerSocialGet: `${BASEURL}/social/details`,
  infuencerYTVideos: `${BASEURL}/social/youtube/videos`,
  influencerProfileCreate: `${BASEURL}/influencer/profile/create`,
  brands: `${BASEURL}/company/link/all`,
  createShortLink: () => `${BASEURL}/influencer/link/create/`,
  influencerMyLinks: () => `${BASEURL}/influencer/link/get`,
  getInfluencerTransaction: (id: string) =>
    `${BASEURL}/influencer/transaction/${id}/get`,
  getInfluencerRedeem: () => `${BASEURL}/influencer/wallet/redeem`,
  getInfluencerWalletValue: (id: string) =>
    `${BASEURL}/influencer/wallet/${id}/current-value`,
  getInfAnlytics: (q: string, influencerId: string) =>
    `${BASEURL}/influencer/analytics/${influencerId}/dashboard?q=${q}`,
  Infviews: (q: string, influencerId: string) =>
    `${BASEURL}/influencer/analytics/${influencerId}/views-amount?q=${q}`,
  googlelogin: () => `${BASEURL}/auth/google`,
  getCreators: (page: number) =>
    `${BASEURL}/company/link/creators?page=${page}`,
  createTxn: (companyId: string) =>
    `${BASEURL}/company/wallet/${companyId}/temp-trans`,
  getCampaignFromVCOM: (page: number) =>
    `${BASEURL}/third-party/vcomission?page=${page}`,
  getBrandURL: () => `${BASEURL}/third-party/brands`,
  linkAdd: () => `${BASEURL}/admin/link/add`,
  // Phyllo
  createUser: `${BASEURL}/phyllo/create-user`,
  getAccounts: `${BASEURL}/phyllo/accounts`,
  disconnect: `${BASEURL}/phyllo/disconnect`,
  pgCheckout: `${BASEURL}/pg/`,

  getTableAnalytics: (id: string) =>
    `${BASEURL}/influencer/analytics/${id}/table`,
  getPartner: (slug: string) => `${BASEURL}/partner/${slug}`,
  getPartnerProducts: (slug: string) => `${BASEURL}/partner/${slug}/products`,
  getPartnerProduct: (slug: string, id: string) =>
    `${BASEURL}/partner/${slug}/product/${id}`,
  bulkreq: () => `${BASEURL}/partner/bulk`,
  userGet: () => `${BASEURL}/us/bulk`,
  createMiscShortlink: () => `${BASEURL}/partner/shlink`,
  disconnectSocial: (id:string) => `${BASEURL}/social/det/`+id,
  getInstagramPage: () => `${BASEURL}/social/instagram/pageinfo`,
  getInstagramPosts: () => `${BASEURL}/social/instagram/posts`,
  getYoutubeVideos: () => `${BASEURL}/social/youtube/videos`,
  getShopPosts: () => `${BASEURL}/influencer/shop-post`,
  refreshIGUrls: (id:string) => `${BASEURL}/utility/shop-post/${id}/refresh-media`,
  getPublicProfile: (userId: string) => `${BASEURL}/profile/influencer/${userId}`,
  getPublicProfileWithPosts: (username: string) => `${BASEURL}/profile/influencer/${username}/posts`,
  getOpenGraph: (url: string) => `${BASEURL}/utility/opengraph?url=${encodeURIComponent(url)}`,
  
  // Products API
  getProducts: () => `${BASEURL}/products`,
  addProduct: () => `${BASEURL}/influencer/products`,
  deleteProduct: (productId: number) => `${BASEURL}/influencer/products/${productId}`,
  
  // Eligibility check
  checkEligibility: () => `${BASEURL}/influencer/profile/check-eligibility`,
  
  // Social website update
  updateSocialWebsite: () => `${BASEURL}/influencer/social/website`,
  
  // Rate Card API
  getRateCard: (influencerId: string) => `${BASEURL}/rate-card?influencerId=${influencerId}`,
  addRateCard: () => `${BASEURL}/influencer/rate-card`,
  updateRateCard: () => `${BASEURL}/influencer/rate-card`,
  
  // Cross-posting API
  getYouTubeVideos: () => `${BASEURL}/social/youtube/videos`,
  crossPostToInstagram: () => `${BASEURL}/social/post-youtube-short-to-instagram`,
};
