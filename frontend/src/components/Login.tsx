import { pb } from '@lib/db';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from 'src/hooks/auth';

function Login() {
  const [username, setUsername] = useState('test@example.com');
  const [password, setPassword] = useState('12345678');
  const navigate = useNavigate();
  const auth = useAuth();
  const mutationFn = async (credentials: {
    username: string;
    password: string;
  }) => {
    return pb
      .collection('users')
      .authWithPassword(credentials.username, credentials.password);
  };

  const mutation = useMutation({
    mutationFn: mutationFn,

    onSuccess: (data) => {
      console.log('Login successful:', data);
      navigate('/');
      auth.refetch();
    },
  });

  return (
    <>
      <h1>Login</h1>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={() => mutation.mutate({ username, password })}>
        Login
      </button>
    </>
  );
}

export default Login;
