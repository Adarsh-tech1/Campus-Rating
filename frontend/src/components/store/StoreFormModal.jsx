import { useEffect, useState } from "react";
import { Plus, X } from "lucide-react";
import FormAlert from "../auth/FormAlert.jsx";
import Button from "../common/Button.jsx";
import Input from "../common/Input.jsx";
import Modal from "../common/Modal.jsx";
import Select from "../common/Select.jsx";

const emptyForm = { name: "", email: "", address: "", owner_id: "" };

export default function StoreFormModal({
  open,
  onClose,
  onSubmit,
  loading,
  error,
  owners = [],
  ownerRequired = false,
  ownersLoading = false,
}) {
  const [form, setForm] = useState(emptyForm);
  useEffect(() => {
    if (!open) setForm(emptyForm);
  }, [open]);

  const submit = (event) => {
    event.preventDefault();
    onSubmit({
      name: form.name,
      email: form.email,
      address: form.address,
      ...(form.owner_id ? { owner_id: Number(form.owner_id) } : {}),
    });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add a place"
      eyebrow="Campusly"
      footer={
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            form="store-form"
            loading={loading}
            disabled={ownerRequired && !owners.length}
            variant="gold"
            icon={Plus}
          >
            Add place
          </Button>
        </div>
      }
    >
      {error ? <FormAlert className="mb-7">{error}</FormAlert> : null}

      <form id="store-form" className="grid gap-6" onSubmit={submit}>
        <Input
          label="Place name"
          placeholder="e.g. North Quad Coffee"
          minLength={2}
          maxLength={100}
          required
          value={form.name}
          onChange={(event) => setForm({ ...form, name: event.target.value })}
        />
        <Input
          label="Contact email"
          type="email"
          placeholder="hello@place.edu"
          required
          value={form.email}
          onChange={(event) => setForm({ ...form, email: event.target.value })}
        />
        <Input
          label="Address"
          as="textarea"
          rows={2}
          placeholder="Building, street, or neighbourhood"
          maxLength={400}
          required
          value={form.address}
          onChange={(event) => setForm({ ...form, address: event.target.value })}
        />

        {ownerRequired ? (
          ownersLoading ? (
            <div
              role="status"
              className="flex items-center gap-3 rounded-xl border border-line bg-cream px-4 py-3 text-[0.9375rem] text-muted"
            >
              <span
                className="size-4 animate-spin rounded-full border-2 border-line border-t-forest"
                aria-hidden="true"
              />
              Loading store owners…
            </div>
          ) : (
            <Select
              label="Store owner"
              required
              value={form.owner_id}
              onChange={(event) => setForm({ ...form, owner_id: event.target.value })}
              disabled={!owners.length}
              options={
                owners.length
                  ? owners.map((owner) => ({
                      value: owner.id,
                      label: `${owner.name} · ${owner.email}`,
                    }))
                  : [{ value: "", label: "Create a store owner account first" }]
              }
            />
          )
        ) : null}

        {ownerRequired && !ownersLoading && !owners.length ? (
          <p className="flex items-start gap-2.5 rounded-xl border border-danger/20 bg-danger-soft px-4 py-3 text-[0.875rem] leading-relaxed text-danger">
            <X className="mt-0.5 size-3.5 shrink-0" strokeWidth={2} aria-hidden="true" />
            No store owner accounts exist yet. Create one from People, then return to
            add this place.
          </p>
        ) : null}
      </form>
    </Modal>
  );
}
