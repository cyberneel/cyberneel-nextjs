import Head from 'next/head';
import ContactForm from '../components/ContactForm';

export default function Contact() {
  return (
    <>
      <Head>
        <title>Contact CyberNeel</title>
      </Head>
      <div className="container">
        <h1 className='p-3'></h1>
        <ContactForm />
      </div>
      <div className="p-5"></div>
      <div className="p-1"></div>
    </>
  );
}
