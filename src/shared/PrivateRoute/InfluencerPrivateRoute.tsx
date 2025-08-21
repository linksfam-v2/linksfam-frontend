import { Navigate } from "react-router-dom";

const InfluencerPrivateRoute = ({ children }: { children: React.ReactNode }) => {

  const token = localStorage.getItem("token");

  return token ? children : <Navigate to="/creator/login" />;
};

export default InfluencerPrivateRoute;
