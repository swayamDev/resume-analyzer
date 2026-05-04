import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { usePuterStore } from "~/services/puter";

export function meta() {
  return [
    { title: "Analytiq | Sign In" },
    { name: "description", content: "Sign in to continue your job journey with Analytiq." },
  ];
}

const Auth = () => {
  const { isLoading, auth } = usePuterStore();
  const location = useLocation();
  const next = location.search.split("next=")[1] ?? "/";
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.isAuthenticated) navigate(next);
  }, [auth.isAuthenticated, next, navigate]);

  return (
    <main className="bg-[url('/images/bg-auth.svg')] bg-cover min-h-screen flex items-center justify-center p-4">
      <div className="gradient-border shadow-xl">
        <section className="flex flex-col gap-8 bg-white rounded-2xl p-10 max-sm:p-6 w-full max-w-lg">
          <div className="flex flex-col items-center gap-2 text-center">
            <span className="text-3xl font-bold text-gradient tracking-tight">RESUMIND</span>
            <h1 className="text-2xl font-bold text-gray-900 mt-2">Welcome Back</h1>
            <p className="text-gray-500 text-sm">Sign in to continue your job journey</p>
          </div>

          <div className="flex flex-col gap-3">
            {isLoading ? (
              <button
                disabled
                className="auth-button animate-pulse opacity-70 cursor-not-allowed"
                aria-busy="true"
                aria-label="Signing you in"
              >
                Signing you in…
              </button>
            ) : auth.isAuthenticated ? (
              <button className="auth-button" onClick={auth.signOut} aria-label="Sign out">
                Sign Out
              </button>
            ) : (
              <button className="auth-button" onClick={auth.signIn} aria-label="Sign in with Puter">
                Sign In with Puter
              </button>
            )}
            <p className="text-xs text-center text-gray-400">
              Powered by{" "}
              <a
                href="https://puter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-indigo-500 transition-colors"
              >
                Puter.com
              </a>{" "}
              | free, no credit card required.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Auth;
