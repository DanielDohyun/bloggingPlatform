"use client"; // This is a client component
import { useEffect, useState } from 'react';

export const useScrollDirection = (): 'up' | 'down' => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const lastScrollY = scrollY;
  const currentScrollY = window.scrollY;

  console.log('lastScrollY: ', lastScrollY)
  console.log('currentScrollY: ', currentScrollY)

  if (currentScrollY > lastScrollY) {
    return 'down';
  } else if (currentScrollY < lastScrollY) {
    return 'up';
  } else {
    return 'down';
  }
};