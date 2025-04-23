import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="App">
      <h1>Welcome to Password App</h1>
      <Link to="/login"><button>Login</button></Link>
      <Link to="/register"><button>Register</button></Link>
    </div>
  );
}

export default Home;
