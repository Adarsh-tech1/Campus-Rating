import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Input from "../common/Input.jsx";

/**
 * Password input with a show/hide toggle. Used by every credential form so the
 * control (and its keyboard-accessible toggle) behaves identically.
 */
export default function PasswordField({ label, hint, id, ...props }) {
  const [visible, setVisible] = useState(false);

  return (
    <Input
      id={id}
      label={label}
      hint={hint}
      type={visible ? "text" : "password"}
      {...props}
      trailing={
        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
          className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-muted transition-colors duration-300 hover:bg-ivory-soft hover:text-forest"
        >
          {visible ? (
            <EyeOff className="size-4" strokeWidth={1.75} aria-hidden="true" />
          ) : (
            <Eye className="size-4" strokeWidth={1.75} aria-hidden="true" />
          )}
          <span aria-hidden="true">{visible ? "Hide" : "Show"}</span>
        </button>
      }
    />
  );
}