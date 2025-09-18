/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/firebase/config';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

type Role = 'attendee' | 'speaker' | 'organizer';

export default function SignUp() {
  const router = useRouter();

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    company: '',
    email: '',
    password: '',
  });

  // Role selection (no auto-attendee anymore)
  const [wantsAttendee, setWantsAttendee] = useState(false);
  const [wantsSpeaker, setWantsSpeaker] = useState(false);

  // APPOEMN
  const [isAppoemnMember, setIsAppoemnMember] = useState(false);
  const [memberId, setMemberId] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ---------- APPOEMN helpers (unchanged) ----------
  const generateDiscountCode = (role: 'exco' | 'member') => {
    const suffix = Math.floor(100000 + Math.random() * 900000); // 6 digits
    return role === 'exco' ? `APPO50-${suffix}` : `APPO20-${suffix}`;
  };

  const validateMembership = async (id: string, firstName: string, lastName: string) => {
    const res = await fetch('/api/appoemn/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ memberId: id.trim(), firstName, lastName }),
    });
    return res.json(); // { ok: boolean, role?: 'exco'|'member', message?: string }
  };

  const sendDiscountEmail = async (to: string, fullName: string, discountCode: string) => {
    try {
      await fetch('/api/send-discount', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to, fullName, discountCode }),
      });
    } catch {
      // non-blocking
    }
  };

  const deriveRoles = (email: string, attendee: boolean, speaker: boolean): Role[] => {
    const roles: Role[] = [];
    const isOrganizer = email.trim().toLowerCase().endsWith('@atinuda.africa');
    if (isOrganizer) roles.push('organizer');
    if (attendee) roles.push('attendee');
    if (speaker) roles.push('speaker');

    // Must have at least one role: either organizer (by domain) or a selected box
    if (roles.length === 0) {
      throw new Error('Please select at least one role (Attendee or Speaker).');
    }
    return roles;
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { email, password, firstName, lastName, company } = form;

      // APPOEMN validation first if checked
      let detectedRole: 'exco' | 'member' | null = null;
      if (isAppoemnMember) {
        if (!memberId.trim()) {
          setLoading(false);
          return setError('Please enter your APPOEMN Membership ID');
        }
        const check = await validateMembership(memberId, firstName, lastName);
        if (!check?.ok) {
          setLoading(false);
          return setError(check?.message || 'Membership validation failed');
        }
        detectedRole = check.role; // 'exco' | 'member'
      }

      // Build roles from selections + email domain
      const roles = deriveRoles(email, wantsAttendee, wantsSpeaker);

      // Create auth user
      const res = await createUserWithEmailAndPassword(auth, email, password);

      // Set display name
      await updateProfile(res.user, { displayName: `${firstName} ${lastName}` });

      // Discount code (if APPOEMN)
      const discountCode =
        isAppoemnMember && detectedRole ? generateDiscountCode(detectedRole) : null;

      // Base user profile
      const baseProfile = {
        uid: res.user.uid,
        firstName,
        lastName,
        company,
        email,
        createdAt: new Date().toISOString(),
        roles, // <— final roles, including auto organizer if @atinuda.africa

        // APPOEMN
        isAppoemnMember,
        appoemnMemberId: isAppoemnMember ? memberId.trim() : null,
        appoemnRole: detectedRole || null,
        appoemnValidated: !!detectedRole,
        discountCode,
        discountUsed: false,
      };

      await setDoc(doc(db, 'users', res.user.uid), baseProfile, { merge: true });

      // Discount email (non-blocking)
      if (discountCode) {
        sendDiscountEmail(email, `${firstName} ${lastName}`, discountCode);
      }

      // Continue to checkout or your next step
      router.push('/ticket-payment');
    } catch (err: any) {
      setError(err?.message || 'Sign up failed');
    } finally {
      setLoading(false);
    }
  };

  const isOrganizerByDomain =
    form.email.trim().toLowerCase().endsWith('@atinuda.africa');

  return (
    <section
      id="nohero"
      className="min-h-screen bg-[url('/assets/images/elementsix.png')] bg-cover bg-center flex items-center justify-center px-4"
    >
      <div className="max-w-xl w-full text-black bg-white shadow-md rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-6 text-center">Create Your Atinuda Account</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-4">
            <input
              name="firstName"
              onChange={handleChange}
              placeholder="First Name"
              className="w-1/2 input"
              required
            />
            <input
              name="lastName"
              onChange={handleChange}
              placeholder="Last Name"
              className="w-1/2 input"
              required
            />
          </div>

          <input
            name="company"
            onChange={handleChange}
            placeholder="Company"
            className="input"
            required
          />
          <input
            name="email"
            type="email"
            onChange={handleChange}
            placeholder="Email"
            className="input"
            required
          />
          <input
            name="password"
            type="password"
            onChange={handleChange}
            placeholder="Password"
            className="input"
            required
          />

          {/* Roles */}
          <div className="mt-3 rounded-md border border-gray-200 p-3">
            <p className="text-sm font-semibold mb-2">Choose your role(s)</p>

            <label className="flex items-center gap-2 text-sm mb-2">
              <input
                type="checkbox"
                checked={wantsAttendee}
                onChange={(e) => setWantsAttendee(e.target.checked)}
              />
              <span>Attendee</span>
            </label>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={wantsSpeaker}
                onChange={(e) => setWantsSpeaker(e.target.checked)}
              />
              <span>Speaker</span>
            </label>

            {/* <p className="mt-2 text-xs text-gray-600">
              <strong>Organizer</strong> role is automatically granted for emails ending with{' '}
              <code>@atinuda.africa</code>.
            </p> */}
            {isOrganizerByDomain && (
              <p className="mt-1 text-xs font-medium text-green-700">
                ✅ This email will be created as an <strong>organizer</strong>.
              </p>
            )}
            {/* {!isOrganizerByDomain && (
              <p className="mt-1 text-xs text-gray-500">
                If you are staff, use your <code>@atinuda.africa</code> email to get organizer access.
              </p>
            )} */}
          </div>

          {/* APPOEMN membership toggle + ID (unchanged) */}
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={isAppoemnMember}
              onChange={(e) => setIsAppoemnMember(e.target.checked)}
            />
            Are you an APPOEMN member?
          </label>

          {isAppoemnMember && (
            <input
              value={memberId}
              onChange={(e) => setMemberId(e.target.value)}
              placeholder="APPOEMN Membership ID (e.g. APP/F/217)"
              className="input"
              required
            />
          )}

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button
            className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition disabled:opacity-60"
            disabled={loading}
          >
            {loading ? 'Processing…' : 'Sign Up'}
          </button>
        </form>

        <p className="mt-4 text-sm text-center">
          Already have an account?{' '}
          <a href="/login" className="text-blue-600 underline">
            Login
          </a>
        </p>
      </div>
    </section>
  );
}
