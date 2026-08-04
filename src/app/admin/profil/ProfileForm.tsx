'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { updateSiteProfileAction, type ProfileFormState } from './actions';

type Profile = {
  about: string | null;
  vision: string | null;
  mission: string | null;
  address: string | null;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  facebook_url: string | null;
  instagram_url: string | null;
  youtube_url: string | null;
  map_embed_url: string | null;
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-primary disabled:opacity-60">
      {pending ? 'Menyimpan...' : 'Simpan Perubahan'}
    </button>
  );
}

export default function ProfileForm({ profile }: { profile: Profile }) {
  const [state, formAction] = useFormState<ProfileFormState, FormData>(
    updateSiteProfileAction,
    undefined
  );

  return (
    <form action={formAction} className="max-w-2xl space-y-5 rounded-2xl bg-white p-6 shadow-soft">
      <div>
        <label className="mb-1.5 block text-xs font-semibold text-slate-600">Tentang Kami</label>
        <textarea name="about" rows={4} defaultValue={profile.about ?? ''} className="input-field" />
      </div>
      <div>
        <label className="mb-1.5 block text-xs font-semibold text-slate-600">Visi</label>
        <textarea name="vision" rows={2} defaultValue={profile.vision ?? ''} className="input-field" />
      </div>
      <div>
        <label className="mb-1.5 block text-xs font-semibold text-slate-600">Misi</label>
        <textarea name="mission" rows={3} defaultValue={profile.mission ?? ''} className="input-field" />
      </div>
      <div>
        <label className="mb-1.5 block text-xs font-semibold text-slate-600">Alamat</label>
        <input type="text" name="address" defaultValue={profile.address ?? ''} className="input-field" />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-slate-600">Telepon</label>
          <input type="text" name="phone" defaultValue={profile.phone ?? ''} className="input-field" />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-slate-600">WhatsApp</label>
          <input type="text" name="whatsapp" defaultValue={profile.whatsapp ?? ''} className="input-field" />
        </div>
      </div>
      <div>
        <label className="mb-1.5 block text-xs font-semibold text-slate-600">Email</label>
        <input type="email" name="email" defaultValue={profile.email ?? ''} className="input-field" />
      </div>
      <div className="grid gap-5 sm:grid-cols-3">
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-slate-600">Facebook</label>
          <input type="text" name="facebook_url" defaultValue={profile.facebook_url ?? ''} className="input-field" />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-slate-600">Instagram</label>
          <input type="text" name="instagram_url" defaultValue={profile.instagram_url ?? ''} className="input-field" />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-slate-600">YouTube</label>
          <input type="text" name="youtube_url" defaultValue={profile.youtube_url ?? ''} className="input-field" />
        </div>
      </div>
      <div>
        <label className="mb-1.5 block text-xs font-semibold text-slate-600">URL Embed Google Maps</label>
        <input type="text" name="map_embed_url" defaultValue={profile.map_embed_url ?? ''} className="input-field" />
      </div>

      {state?.error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{state.error}</p>
      )}

      <SubmitButton />
    </form>
  );
}
