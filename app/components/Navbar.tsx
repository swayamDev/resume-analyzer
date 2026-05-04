import { Link } from "react-router";

const Navbar = () => {
  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <Link to="/" aria-label="Analytiq home">
        <span className="text-2xl font-bold text-gradient tracking-tight">ANALYTIQ</span>
      </Link>
      <Link to="/upload" className="primary-button w-fit text-sm font-semibold">
        Upload Resume
      </Link>
    </nav>
  );
};

export default Navbar;
