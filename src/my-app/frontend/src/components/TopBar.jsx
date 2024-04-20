import '../index.css';
import { Link } from 'react-router-dom';

// TODO: use login logic to set the following data
const isLoggedIn = true;
const userInfo = {
  id: "user_id",
  is_organization: false
};

const VisitorOptions = () => {
  return(
    <>
      <a href='/'>EVENTS</a>
      <a href='/artists'>ARTISTS</a>
      <Link to='/login'>
        <button className="py-2 px-4 rounded-full border border-white hover:bg-white hover:bg-opacity-15">
          LOGIN
        </button>
      </Link>
    </>
  );
}

const OrganizationOptions = () => {
  return (
    <>
      <a>MY EVENTS</a>
      <Link to='/new_event'>
        <button className="py-2 px-4 rounded-full border border-white hover:bg-white hover:bg-opacity-15">
          CREATE EVENT
        </button>
      </Link>
      <Link to='/profile'>
        <div className='profile-pic'></div>
      </Link>
    </>
  );
}

const ConsumerOptions = () => {
  return (
    <>
      <a href='/'>EVENTS</a>
      <a href='/artists'>ARTISTS</a>
      <Link to='/'>
        <img src='favorites.svg' alt="Favorites" />
      </Link>
      <Link to='/'>
        <img src='shoppingCart.svg' alt="Shopping Cart" />
      </Link>
      <Link to='/profile'>
        <div className='profile-pic'></div>
      </Link>
    </>
  );
}


const TopBar = () => {
  return (
    <header className='p-3 flex justify-between bg-blue-950'>

      <Link to='/'>
        <img className='w-36 ml-4' src='logo.svg' alt="ComforTix Logo" />
      </Link>
      
      <div className='flex items-center gap-x-8 me-4 text-l text-white font-light .header-options'>
        {isLoggedIn && userInfo.is_organization && <OrganizationOptions/>}
        {isLoggedIn && !userInfo.is_organization && <ConsumerOptions/>}
        {!isLoggedIn && <VisitorOptions/>}
      </div>
    </header>
  );
}
export default TopBar;