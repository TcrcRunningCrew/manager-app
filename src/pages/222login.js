
import { signIn } from 'next-auth/react';

const LoginPage = () => {
  const handleLogin = async (e) => {
    e.preventDefault();

    const email = e.target.email.value;
    const password = e.target.password.value;

    // Authenticate using your custom credential provider
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false, // Set to true if you want to redirect after authentication
    });

    // Handle authentication result (success or failure)
    if (result.error) {
      // Handle authentication error
      console.error('Authentication failed:', result.error);
    } else {
      // Authentication succeeded
      // Redirect or perform other actions as needed
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input type="email" name="email" placeholder="Email" required />
      <input type="password" name="password" placeholder="Password" required />
      <button type="submit">Login</button>
    </form>
  );
};

export default LoginPage;