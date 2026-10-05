import { useState } from "react";
import { KeyRound, Lock } from "lucide-react";
import { changePassword } from "../../api/authApi.js";
import FormAlert from "../../components/auth/FormAlert.jsx";
import PasswordField from "../../components/auth/PasswordField.jsx";
import Button from "../../components/common/Button.jsx";
import Input from "../../components/common/Input.jsx";
import PageContainer from "../../components/layout/PageContainer.jsx";
import { getErrorMessage } from "../../utils/helpers.js";

export default function ChangePassword() {
  const [form, setForm] = useState({ currentPassword: "", newPassword: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const { data } = await changePassword(form);
      setSuccess(data.message || "Your password was updated.");
      setForm({ currentPassword: "", newPassword: "" });
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer
      eyebrow="Account"
      title="Change password"
      description="Pick a new password to keep your Campusly account secure."
    >
      <div className="max-w-xl">
        {error ? <FormAlert className="mb-7">{error}</FormAlert> : null}
        {success ? (
          <FormAlert tone="success" className="mb-7">
            {success}
          </FormAlert>
        ) : null}

        <form
          className="grid gap-7 rounded-[2rem] border border-line bg-cream p-7 sm:p-9"
          onSubmit={handleSubmit}
        >
          <Input
            label="Current password"
            type="password"
            icon={Lock}
            autoComplete="current-password"
            required
            value={form.currentPassword}
            onChange={(event) =>
              setForm({ ...form, currentPassword: event.target.value })
            }
          />
          <PasswordField
            label="New password"
            icon={KeyRound}
            autoComplete="new-password"
            minLength={8}
            maxLength={16}
            required
            value={form.newPassword}
            onChange={(event) =>
              setForm({ ...form, newPassword: event.target.value })
            }
            hint="8–16 characters, with an uppercase letter and a special character."
          />

          <div className="flex justify-end border-t border-line pt-6">
            <Button type="submit" loading={loading} icon={KeyRound}>
              Save password
            </Button>
          </div>
        </form>
      </div>
    </PageContainer>
  );
}
