'use client';

import React, { useEffect, useState } from 'react';

import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './page.module.css';
import Logo from '@/components/Logo';
import { sendVerificationEmail, websiteName } from '@/lib';
import Card from '@/components/Card';
import Faq from '@/components/Faq';
import Footer from '@/components/Footer';
import Banner from '@/components/Banner';

function GetStarted() {
  const user = useSelector((state) => state.user);
  const router = useRouter();
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (user?._id) {
      if (user?.emailVerified) {
        console.log('Moving to / route');

        router.replace('/home');
      } else {
        sendVerificationEmail({ email: user?.email, userId: user?._id });
        console.log('Moving to /verify-email route');

        router.push('/verify-email');
      }
    }
  }, [user]);

  const cards = [
    {
      img: '/cardBanner1.png',
      title: 'Enjoy on your TV.',
      subtitle:
        'Enjoy on your TV. Watch on Smart TVs, Playstation, Xbox, Chromecast, Apple TV, Blu-ray players, and more.',
    },
    {
      img: '/cardBanner2.png',
      title: 'Watch everywhere.',
      subtitle: 'Stream unlimited movies and TV shows on your phone, tablet, laptop, and TV.',
    },

    {
      img: '/cardBanner3.png',
      title: 'Create profiles for kids.',
      subtitle:
        'Send kids on adventures with their favorite characters in a space made just for them—free with your membership.',
    },
    {
      img: '/cardBanner4.png',
      title: 'Download your shows to watch offline.',
      subtitle: 'Save your favorites easily and always have something to watch.',
    },
  ];

  const faqs = [
    {
      question: `What is ${websiteName}?`,
      answer: `${websiteName} is a streaming service that offers a wide variety of award-winning TV shows, movies, anime, documentaries, and more on thousands of internet-connected devices.
            
            You can watch as much as you want, whenever you want without a single commercial - all for one low monthly price.There's always something new to discover and new TV shows and movies are added every week!`,
    },
    {
      question: `How much does ${websiteName} cost?`,
      answer: `Watch ${websiteName} on your smartphone, tablet, Smart TV, laptop, or streaming device, all for one fixed monthly fee. Plans range from USD2.99 to USD9.99 a month. No extra costs, no contracts.`,
    },
    {
      question: `Where can I watch?`,
      answer: `Watch anywhere, anytime. Sign in with your ${websiteName} account to watch instantly on the web at ${websiteName}.com from your personal computer or on any internet-connected device that offers the ${websiteName} app, including smart TVs, smartphones, tablets, streaming media players and game consoles.

            You can also download your favorite shows with the iOS, Android, or Windows 10 app. Use downloads to watch while you're on the go and without an internet connection. Take ${websiteName} with you anywhere.`,
    },
    {
      question: `How do I cancel?`,
      answer: `${websiteName} is flexible. There are no pesky contracts and no commitments. You can easily cancel your account online in two clicks. There are no cancellation fees – start or stop your account anytime.`,
    },
    {
      question: `What can I watch on ${websiteName}?`,
      answer: `${websiteName} has an extensive library of feature films, documentaries, TV shows, anime, award-winning ${websiteName} originals, and more. Watch as much as you want, anytime you want.

            `,
    },
    {
      question: `Is ${websiteName} good for Kids?`,
      answer: `The ${websiteName} Kids experience is included in your membership to give parents control while kids enjoy family-friendly TV shows and movies in their own space.

            Kids profiles come with PIN-protected parental controls that let you restrict the maturity rating of content kids can watch and block specific titles you don’t want kids to see.`,
    },
  ];

  return (
    <>
      {/* { */}
      {/* !user && ( */}

      <div className={styles.signup}>
        <div className={styles.signup__header}>
          <div className={styles.signup__logo}>
            <Logo link={'/'} />
          </div>
          <div className={styles.signup__headerSwitch}>
            <Link href='/login'>Log In</Link>
          </div>
        </div>

        <div className={styles.signup__hero}>
          <Banner />
          <div className={styles.signup__heroContent}>
            <h1 className={styles.signup__heroTitle}>Unlimited movies, TV shows, and more.</h1>
            <h6 className={styles.signup__heroSubtitle}>
              Ready to watch? Enter your email to create or restart your membership.
            </h6>
            <div className={styles.signup__heroForm}>
              <div className={styles.signup__heroEmail}>
                <input
                  type='text'
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.code === 'Enter' && router.push('/signup?email=' + email)}
                />
                <label>Email address</label>
              </div>
              <button className={styles.getStarted}>
                <Link href={`/signup?e=${email}`}>Get Started</Link>
              </button>
            </div>
          </div>
        </div>

        <div className={styles.signup__body}>
          <div className={styles.signup__cardsContainer}>
            {cards.map(({ img, title, subtitle }, index) => (
              <Card key={index} image={img} title={title} subtitle={subtitle} />
            ))}
          </div>
          <div className={styles.signup__faqContainer}>
            <h1 className={styles.signup__faqTitle}>FAQs</h1>
            {faqs.map(({ question, answer }, index) => (
              <Faq key={index} question={question} answer={answer} />
            ))}

            <div className={styles.signup__heroForm}>
              <div className={styles.signup__heroEmail}>
                <input type='text' required value={email} onChange={(e) => setEmail(e.target.value)} />
                <label>Email address</label>
              </div>
              <button className={styles.getStarted} onClick={() => router.push(`/signup?e=${email}`)}>
                Get Started
              </button>
            </div>
          </div>
        </div>

        <Footer />
      </div>
      {/* ) */}
      {/* } */}
    </>
  );
}

export default GetStarted;
