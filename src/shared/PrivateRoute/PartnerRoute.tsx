import { Navigate, useParams } from "react-router-dom";

const PartnerRoutes = ({ children }: { children: React.ReactNode }) => {

  const token = localStorage.getItem("token");

  const { brand = "feather-&-spun" } = useParams();

  return token ? children : <Navigate to={`/creator/login?redirect=${brand}`} />
};

export default PartnerRoutes;
