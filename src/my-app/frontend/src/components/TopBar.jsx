import "../index.css";
import { Link } from "react-router-dom";

// TODO: use login logic to set the following data
const isLoggedIn = true;
const userInfo = {
  id: "user_id",
  is_organization: false,
};

const VisitorOptions = () => {
  return (
    <>
      <a href="/">EVENTS</a>
      <a href="/artists">ARTISTS</a>
      <Link to="/login">
        <button className="py-2 px-4 rounded-full border border-white hover:bg-white hover:bg-opacity-15">
          LOGIN
        </button>
      </Link>
    </>
  );
};

const OrganizationOptions = () => {
  return (
    <>
      <a>MY EVENTS</a>
      <Link to="/new_event">
        <button className="py-2 px-4 rounded-full border border-white hover:bg-white hover:bg-opacity-15">
          CREATE EVENT
        </button>
      </Link>
      <Link to="/profile">
        <div className="profile-pic"></div>
      </Link>
    </>
  );
};

const ConsumerOptions = () => {
  return (
    <>
      <a href="/">EVENTS</a>
      <a href="/artists">ARTISTS</a>
      <Link to="/favorites">
        <img src="/favorites.svg" alt="Favorites" />
      </Link>
      <Link to="/shopping-cart">
        <img src="/shoppingCart.svg" alt="Shopping Cart" />
      </Link>
      <Link to="/profile">
        <svg class="h-6 w-6 text-white-500"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round">  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />  <circle cx="12" cy="7" r="4" /></svg>      </Link>
      <Link to="/">
        <svg class="h-6 w-6 text-white-500"  width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">  <path stroke="none" d="M0 0h24v24H0z"/>  <path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" />  <path d="M7 12h14l-3 -3m0 6l3 -3" /></svg>
      </Link>
    </>
  );
};

const TopBar = () => {
  return (
    <header className="p-3 flex justify-between bg-blue-950">
      <Link to="/">
        <img className="w-36 ml-4" src="/logo.svg" alt="ComforTix Logo" />
      </Link>

      <div className="flex items-center gap-x-8 me-4 text-l text-white font-light .header-options">
        {isLoggedIn && userInfo.is_organization && <OrganizationOptions />}
        {isLoggedIn && !userInfo.is_organization && <ConsumerOptions />}
        {!isLoggedIn && <VisitorOptions />}
      </div>
    </header>
  );
};
export default TopBar;
