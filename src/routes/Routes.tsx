import { Navigate, Route, Routes } from 'react-router-dom';
import { COMPANY_ROUTES, COMPAMY_ROUTES_WITHOUT_BOTTOM_NAV, INFLUENCER_ROUTES, INFLUENCER_ROUTES_WITHOUT_BOTTOM_NAV, UNRESTRICTED_ROUTES } from './constants';
import CompanyBase from '../shared/Base/CompanyBase';
import InfluencerBase from '../shared/Base/InfluencerBase';
import CompanyBaseWithoutNav from '../shared/Base/CompanyBaseWithoutNav';
import InfluencerBaseWithoutNav from '../shared/Base/InfluencerBaseWithoutNav';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/creator/login" />} />
      
      {/* Unrestricted routes - no navigation wrapper needed */}
      {UNRESTRICTED_ROUTES.map(({ path, component: Component }) => (
        <Route key={path} path={path} element={<Component />} />
      ))}
      
      {/* Company routes with bottom navigation */}
      <Route path="/brand" element={<CompanyBase />}>
        {COMPANY_ROUTES.map(({ path, component: Component }) => {
          const childPath = path.startsWith('/brand/') ? path.slice(7) : path.replace('/brand', '');
          return <Route key={path} path={childPath} element={<Component />} />;
        })}
      </Route>
      
      {/* Company routes without bottom navigation */}
      <Route path="/brand" element={<CompanyBaseWithoutNav />}>
        {COMPAMY_ROUTES_WITHOUT_BOTTOM_NAV.map(({ path, component: Component }) => {
          const childPath = path.startsWith('/brand/') ? path.slice(7) : path.replace('/brand', '');
          return <Route key={path} path={childPath} element={<Component />} />;
        })}
      </Route>
      
      {/* Influencer routes with bottom navigation */}
      <Route path="/creator" element={<InfluencerBase />}>
        {INFLUENCER_ROUTES.map(({ path, component: Component }) => {
          const childPath = path.startsWith('/creator/') ? path.slice(9) : path.replace('/creator', '');
          return <Route key={path} path={childPath} element={<Component />} />;
        })}
      </Route>
      
      {/* Influencer routes without bottom navigation */}
      <Route path="/creator" element={<InfluencerBaseWithoutNav />}>
        {INFLUENCER_ROUTES_WITHOUT_BOTTOM_NAV.map(({ path, component: Component }) => {
          const childPath = path.startsWith('/creator/') ? path.slice(9) : path.replace('/creator', '');
          return <Route key={path} path={childPath} element={<Component />} />;
        })}
      </Route>
      
      {/* Catch-all route */}
      <Route path="*" element={<Navigate to="/creator/login" />} />
    </Routes>
  );
};

export default AppRoutes;