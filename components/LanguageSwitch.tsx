'use client'

import { Button } from '@nextui-org/react'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

interface LanguageSwitchProps {
  post: any
}

const LANGUAGE_STORAGE_KEY = 'userLanguage';

const LanguageSwitch = ({ post }: LanguageSwitchProps) => {
  let englishSlug=`${post.slug.split('/')[0]}/${post.englishSlug}`
  let polishSlug=`${post.slug.split('/')[0]}/${post.polishSlug}`
  const router = useRouter();
  
  // 1. Use useState to manage the current language in the component's state.
  // Initialize it with a function that checks localStorage.
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    if (typeof window !== 'undefined') {
      // Get the stored language, default to 'en' if not found
      return localStorage.getItem(LANGUAGE_STORAGE_KEY) || 'en';
    }
    return 'en'; // Default to 'en' during server-side rendering
  });

  // 2. Use useEffect to update localStorage whenever currentLanguage changes.
  useEffect(() => {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, currentLanguage);
  }, [currentLanguage]);


  const handleLanguageSwitch = () => {
    let targetSlug: string | null = null;
    let newLanguage: 'en' | 'pl';

    if (currentLanguage === 'en') {
      targetSlug = polishSlug;
      newLanguage = 'pl';
    } else {
      targetSlug = englishSlug;
      newLanguage = 'en';
    }

    // 3. Update the state, which triggers the useEffect to update localStorage.
    setCurrentLanguage(newLanguage);
    
    console.log(`Switching to language: ${newLanguage} with slug: ${targetSlug}`);

    // If targetSlug is null, it means there's no corresponding translation, 
    // but we'll assume the props always provide valid slugs for simplicity.
    if (targetSlug) {
      router.push(`/blog/${targetSlug}`);
    } else {
      // Optional: Handle case where no slug is provided for the target language
      router.push(`/blog/${currentLanguage === 'en' ? englishSlug : polishSlug}`);
    }
  };

  return (
    <>
      <Button
        id="language-switch"
        onClick={handleLanguageSwitch}
        color="default"
        isDisabled={post.polishSlug === null || post.englishSlug === null}
        variant="faded"
        aria-label="Change the language"
      >
        <span className="uppercase">{currentLanguage !== 'pl' ? 'Po polsku' : 'In English'}</span>
      </Button>
    </>
  )
}

export default LanguageSwitch
