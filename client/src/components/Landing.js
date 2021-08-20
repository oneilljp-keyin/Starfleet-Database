function Login({ setAuth, setUserId, getProfile, userName }) {
  return (
    <>
      <div>
        <h3>
          Welcome to Sector 709 {userName && ","} {userName}
        </h3>
      </div>
    </>
  );
}

export default Login;
