/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useAuth } from '@/hooks/useAuth';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { auth, db } from '@/firebase/config';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import toast, { Toaster } from 'react-hot-toast';

const AuthModal = () => {
  const { isAuthModalOpen, closeAuthModal } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    company: '',
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const { firstName, lastName, email, password, company } = form;
    if (!email || !password) return 'Email and password are required';
    if (!isLogin && (!firstName || !lastName || !company)) return 'Please fill all fields';
    return '';
  };

  const handleAuth = async () => {
    const error = validateForm();
    if (error) return toast.error(error);

    setLoading(true);
    try {
      const { email, password, firstName, lastName, company } = form;

      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        toast.success('Login successful');
      } else {
        const res = await createUserWithEmailAndPassword(auth, email, password);

        // 🧠 Set Firebase displayName
        await updateProfile(res.user, {
          displayName: `${firstName} ${lastName}`,
        });

        // 📄 Store extra fields in Firestore
        await setDoc(doc(db, 'users', res.user.uid), {
          firstName,
          lastName,
          company,
          email,
          createdAt: new Date().toISOString(),
        });

        toast.success('Account created!');
      }

      closeAuthModal();
    } catch (err: any) {
      toast.error(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-[9999]">
      <Toaster position="top-center" />
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-lg p-8 w-full max-w-md shadow-xl"
      >
        <h2 className="text-xl mb-4 text-center hero-text text-gray-600">
          {isLogin ? 'Login to Atinuda' : 'Create Your Atinuda Account'}
        </h2>

        <form onSubmit={(e) => { e.preventDefault(); handleAuth(); }} className="space-y-3">
          {!isLogin && (
            <>
              <div className="flex gap-3">
                <input
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  placeholder="First Name"
                  className="w-1/2 border border-gray-300 focus:border-[#1B365D] focus:ring-0 rounded px-3 py-2 text-sm transition text-gray-600 focus:outline-none"
                  required
                />
                <input
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  placeholder="Last Name"
                  className="w-1/2 border border-gray-300 focus:border-[#1B365D] focus:ring-0 rounded px-3 py-2 text-sm transition text-gray-600 focus:outline-none"
                  required
                />
              </div>
              <input
                name="company"
                value={form.company}
                onChange={handleChange}
                placeholder="Company Name"
                className="w-full border border-gray-300 focus:border-[#1B365D] focus:ring-0 rounded px-3 py-2 text-sm transition text-gray-600 focus:outline-none"
                required
              />
            </>
          )}

          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full border border-gray-300 focus:border-[#1B365D] focus:ring-0 rounded px-3 py-2 text-sm transition text-gray-600 focus:outline-none"
            required
          />
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full border border-gray-300 focus:border-[#1B365D] focus:ring-0 rounded px-3 py-2 text-sm transition text-gray-600 focus:outline-none"
          />

          <button
            type="submit"
            className="w-full bg-[#ff7f41] text-white py-2 rounded hover:bg-[#e66a30] transition"
            disabled={loading}
          >
            {loading ? 'Processing...' : isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>

        <p className="text-sm text-center mt-4">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button
            className="text-[#ff7f41] underline"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? 'Sign Up' : 'Login'}
          </button>
        </p>
        <button
          className="mt-6 text-sm text-gray-600 hover:underline block mx-auto"
          onClick={closeAuthModal}
        >
          Cancel
        </button>
      </motion.div>
    </div>
  );
};

export default AuthModal;
