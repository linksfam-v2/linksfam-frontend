import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="">
      <Link to="/=">Home</Link>&nbsp;
      <Link to="/contact">Contact</Link>&nbsp;
      <Link to="/terms">Terms</Link>&nbsp;
      <Link to="/privacy">Privacy</Link>

      <h1>Coming Soon!</h1>
    </div>
  )
}

export default HomePage
