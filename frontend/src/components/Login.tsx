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

    onSuccess: () => {
      navigate('/');
      auth.refetch();
    },
  });

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    mutation.mutate({ username, password });
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="card border border-base-300 bg-base-100 shadow-md">
        <div className="card-body gap-4">
          <div>
            <h1 className="card-title text-2xl">Sign in</h1>
            <p className="text-sm text-base-content/70">
              Access your account to continue.
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <label className="form-control w-full">
              <span className="label-text mb-1">Username</span>
              <input
                type="text"
                placeholder="you@example.com"
                className="input input-bordered w-full"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </label>

            <label className="form-control w-full">
              <span className="label-text mb-1">Password</span>
              <input
                type="password"
                placeholder="••••••••"
                className="input input-bordered w-full"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>

            {mutation.isError && (
              <div className="alert alert-error py-2 text-sm">
                <span>Invalid username or password.</span>
              </div>
            )}

            <button
              type="submit"
              className={`btn btn-primary w-full ${mutation.isPending ? 'btn-disabled' : ''}`}
              disabled={mutation.isPending}
            >
              {mutation.isPending ? 'Signing in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
