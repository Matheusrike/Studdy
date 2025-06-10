import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export default function Home() {
  const token = Cookies.get('token')?.value;

  window.location.reload();
  if (!token) {
    redirect('/pages/login');
  }

  redirect('/pages/painel');
}
