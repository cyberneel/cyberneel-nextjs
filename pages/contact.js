import Head from 'next/head';
import ContactForm from '../components/ContactForm';

export default function Contact() {
  return (
    <>
      <Head>
        <title>Contact Us</title>
      </Head>
      <div className="container">
        <h1>Contact Us</h1>
        <ContactForm />
      </div>
    </>
  );
}
