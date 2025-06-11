'use client';

import { redirect } from 'next/navigation';
import Cookies from 'js-cookie';
import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    const token = Cookies.get('token');
    
    if (!token) {
      window.location.href = '/pages/login';
    } else {
      window.location.href = '/pages/painel';
    }
  }, []);

  return null;
}
