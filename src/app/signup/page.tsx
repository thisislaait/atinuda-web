/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/firebase/config';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export default function SignUp() {
  const router = useRouter();

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    company: '',
    email: '',
    password: '',
  });

  const [isAppoemnMember, setIsAppoemnMember] = useState(false);
  const [memberId, setMemberId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

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
    // expected: { ok: boolean, role?: 'exco'|'member', message?: string }
    return res.json();
  };

  const sendDiscountEmail = async (to: string, fullName: string, discountCode: string) => {
    try {
      await fetch('/api/send-discount', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to, fullName, discountCode }),
      });
    } catch {
      // Don't block signup on email failure
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { email, password, firstName, lastName, company } = form;

      // If ticking APPOEMN, validate ID before creating account
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

      // Create auth user
      const res = await createUserWithEmailAndPassword(auth, email, password);

      // Set display name (handy across app)
      await updateProfile(res.user, { displayName: `${firstName} ${lastName}` });

      // Prepare discount code (if member)
      const discountCode =
        isAppoemnMember && detectedRole ? generateDiscountCode(detectedRole) : null;

      // Save profile to Firestore
      await setDoc(doc(db, 'users', res.user.uid), {
        firstName,
        lastName,
        company,
        email,
        createdAt: new Date().toISOString(),
        // APPOEMN fields
        isAppoemnMember,
        appoemnMemberId: isAppoemnMember ? memberId.trim() : null,
        appoemnRole: detectedRole || null,
        appoemnValidated: !!detectedRole,
        discountCode,
        discountUsed: false,
      });

      // Send discount code email (non-blocking)
      if (discountCode) {
        sendDiscountEmail(email, `${firstName} ${lastName}`, discountCode);
      }

      // Go to payment page — your checkout will auto-apply based on user in context
      router.push('/ticket-payment');
    } catch (err: any) {
      setError(err?.message || 'Sign up failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="nohero" className="min-h-screen bg-[url('/assets/images/elementsix.png')] bg-cover bg-center flex items-center justify-center px-4">
      <div className="max-w-xl w-full text-black bg-white shadow-md rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-6 text-center">Create Your Atinuda Account</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-4">
            <input 
            name="firstName" 
            onChange={handleChange} 
            placeholder="First Name" 
            className="w-1/2 input" 
            required />
            <input name="lastName" onChange={handleChange} placeholder="Last Name" className="w-1/2 input" required />
          </div>

          <input name="company" onChange={handleChange} placeholder="Company" className="input" required />
          <input name="email" type="email" onChange={handleChange} placeholder="Email" className="input" required />
          <input name="password" type="password" onChange={handleChange} placeholder="Password" className="input" required />

          {/* APPOEMN membership toggle + ID */}
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
          Already have an account? <a href="/login" className="text-blue-600 underline">Login</a>
        </p>
      </div>
    </section>
  );
}
