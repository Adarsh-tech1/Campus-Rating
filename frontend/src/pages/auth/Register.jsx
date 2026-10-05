import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, UserPlus } from "lucide-react";
import { register } from "../../api/authApi.js";
import AuthBrand from "../../components/auth/AuthBrand.jsx";
import AuthPanel from "../../components/auth/AuthPanel.jsx";
import FormAlert from "../../components/auth/FormAlert.jsx";
import PasswordField from "../../components/auth/PasswordField.jsx";
import RolePicker, { ROLE_OPTIONS } from "../../components/auth/RolePicker.jsx";
import Button from "../../components/common/Button.jsx";
import Input from "../../components/common/Input.jsx";
import { ROLES } from "../../utils/constants.js";
import { getErrorMessage } from "../../utils/helpers.js";

const initialForm = {
  name: "",
  email: "",
  address: "",
  password: "",
  role: ROLES.USER,
};

const SUCCESS_MESSAGES = {
  [ROLES.USER]: "Your account is ready. Sign in to explore campus.",
  [ROLES.STORE_OWNER]:
    "Your owner account is ready. Sign in to add your place.",
  [ROLES.ADMIN]:
    "Your administrator account is ready. Sign in to open the dashboard.",
};

export default function Register() {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    // Guard the role explicitly: only values the API accepts may be sent, so a
    // cleared or tampered field can never reach the backend.
    if (!ROLE_OPTIONS.some((option) => option.value === form.role)) {
      setError("Please choose an account type before continuing.");
      return;
    }

    setLoading(true);
    try {
      await register({
        name: form.name,
        email: form.email,
        address: form.address || undefined,
        password: form.password,
        role: form.role,
      });

      // Login shows this message; the chosen role is what ROLE_HOME uses to
      // send the new account to /user or /owner after sign-in.
      navigate("/login", {
        replace: true,
        state: { message: SUCCESS_MESSAGES[form.role] },
      });
    } catch (requestError) {
      setError(getErrorMessage(requestError, "Unable to create your account."));
    } finally {
      setLoading(false);
    }
  };


  return (
    <>
      <AuthBrand
        image="/images/auth/cafe-table.jpg"
        eyebrow="Join the community"
        heading={
          <>
            Your campus
            <br />
            has good taste.
          </>
        }
        body="Two minutes now, and the whole campus guide is yours — as a member, an owner, or both."
      />

      <AuthPanel>
        <section className="animate-rise">
          <header className="mb-10">
            <p className="mb-4 text-[0.6875rem] font-semibold uppercase tracking-[0.26em] text-gold-deep">
              Create your account
            </p>
            <h1 className="display-tight text-[3rem] leading-none text-forest sm:text-[3.5rem]">
              Join Campusly
            </h1>
            <p className="mt-5 text-[1.125rem] leading-relaxed text-muted">
              Choose how you want to take part in the guide.
            </p>
          </header>

          {error ? <FormAlert className="mb-7">{error}</FormAlert> : null}

          <form className="grid gap-6" onSubmit={handleSubmit}>
            <RolePicker value={form.role} onChange={(role) => setForm({ ...form, role })} />

            <Input
              label="Name"
              autoComplete="name"
              minLength={20}
              maxLength={60}
              required
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
            />
            <Input
              label="Email"
              type="email"
              autoComplete="email"
              required
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
            />
            <Input
              label="Address"
              as="textarea"
              rows={2}
              maxLength={400}
              hint="Optional — helps other students find nearby places."
              value={form.address}
              onChange={(event) => setForm({ ...form, address: event.target.value })}
            />
            <PasswordField
              label="Password"
              autoComplete="new-password"
              minLength={8}
              maxLength={16}
              required
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
              hint="8–16 characters, with an uppercase letter and a special character."
            />
            <Button
              type="submit"
              loading={loading}
              size="lg"
              icon={UserPlus}
              className="mt-1 w-full"
            >
              Create account
            </Button>
          </form>

          <p className="mt-10 border-t border-line pt-7 text-[1rem] text-muted">
            Already registered?{" "}
            <Link
              className="link-underline inline-flex items-center gap-1.5 font-semibold text-forest"
              to="/login"
            >
              <ArrowLeft className="size-4" strokeWidth={2} aria-hidden="true" />
              Sign in
            </Link>
          </p>
        </section>
      </AuthPanel>
    </>
  );
}
