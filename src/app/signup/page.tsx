/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/firebase/config';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export default function SignUp() {
  const router = useRouter();
  const [form, setForm] = useState({ firstName: '', lastName: '', company: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const { email, password, firstName, lastName, company } = form;
      const res = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, 'users', res.user.uid), {
        firstName,
        lastName,
        company,
        email,
        createdAt: new Date().toISOString(),
      });
      router.push('/ticket-payment');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-[url('/assets/images/elementsix.png')] bg-cover bg-center flex items-center justify-center px-4">
        <div className="max-w-xl w-full text-black bg-white shadow-md rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">Create Your Atinuda Account</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-4">
              <input name="firstName" onChange={handleChange} placeholder="First Name" className="w-1/2 input" required />
              <input name="lastName" onChange={handleChange} placeholder="Last Name" className="w-1/2 input" required />
            </div>
            <input name="company" onChange={handleChange} placeholder="Company" className="input" required />
            <input name="email" type="email" onChange={handleChange} placeholder="Email" className="input" required />
            <input name="password" type="password" onChange={handleChange} placeholder="Password" className="input" required />
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <button className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition">
              Sign Up
            </button>
          </form>
          <p className="mt-4 text-sm text-center">
            Already have an account? <a href="/login" className="text-blue-600 underline">Login</a>
          </p>
        </div>
      </div>
    </>
  );
}