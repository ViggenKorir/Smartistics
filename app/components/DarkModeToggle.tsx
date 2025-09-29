import React, { useEffect, useState } from 'react';

export default function DarkModeToggle() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    if (dark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [dark]);
  return (
    <button onClick={() => setDark((s) => !s)} className="px-3 py-2 rounded bg-slate-100 dark:bg-slate-800">
      {dark ? 'Light' : 'Dark'}
    </button>
  );
}
