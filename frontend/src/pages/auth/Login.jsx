import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, LogIn } from "lucide-react";
import AuthBrand from "../../components/auth/AuthBrand.jsx";
import AuthPanel from "../../components/auth/AuthPanel.jsx";
import FormAlert from "../../components/auth/FormAlert.jsx";
import PasswordField from "../../components/auth/PasswordField.jsx";
import Button from "../../components/common/Button.jsx";
import Input from "../../components/common/Input.jsx";
import useAuth from "../../hooks/useAuth.js";
import { ROLE_HOME } from "../../utils/constants.js";
import { getErrorMessage } from "../../utils/helpers.js";

export default function Login() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await signIn(form);
      navigate(location.state?.from || ROLE_HOME[user.role] || "/user", {
        replace: true,
      });
    } catch (requestError) {
      setError(getErrorMessage(requestError, "Unable to sign in."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AuthBrand
        image="/images/auth/coffee-morning.jpg"
        eyebrow="The campus guide"
        heading={
          <>
            Find the places
            <br />
            that make campus
            <br />
            feel like home.
          </>
        }
        body="Cafés, libraries, kitchens, and study corners — rated by the people who actually use them."
      />

      <AuthPanel>
        <section className="animate-rise">
          <header className="mb-10">
            <p className="mb-4 text-[0.6875rem] font-semibold uppercase tracking-[0.26em] text-gold-deep">
              Welcome back
            </p>
            <h1 className="display-tight text-[3rem] leading-none text-forest sm:text-[3.5rem]">
              Sign in
            </h1>
            <p className="mt-5 text-[1.125rem] leading-relaxed text-muted">
              Pick up where you left off and see what is new on campus.
            </p>
          </header>

          {location.state?.message ? (
            <FormAlert tone="success" className="mb-7">
              {location.state.message}
            </FormAlert>
          ) : null}

          {error ? <FormAlert className="mb-7">{error}</FormAlert> : null}

          {/* The API authenticates on email + password only; the account's role
              is returned by the server and drives the redirect below. */}
          <form className="grid gap-6" onSubmit={handleSubmit}>
            <Input
              label="Email"
              type="email"
              autoComplete="email"
              required
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
            />
            <PasswordField
              label="Password"
              autoComplete="current-password"
              required
              value={form.password}
              onChange={(event) =>
                setForm({ ...form, password: event.target.value })
              }
            />
            <Button
              type="submit"
              loading={loading}
              size="lg"
              icon={LogIn}
              className="mt-1 w-full"
            >
              Sign in
            </Button>
          </form>

          <p className="mt-10 border-t border-line pt-7 text-[1rem] text-muted">
            Need an account?{" "}
            <Link
              className="link-underline inline-flex items-center gap-1.5 font-semibold text-forest"
              to="/register"
            >
              Register
              <ArrowRight className="size-4" strokeWidth={2} aria-hidden="true" />
            </Link>
          </p>
        </section>
      </AuthPanel>
    </>
  );
}
