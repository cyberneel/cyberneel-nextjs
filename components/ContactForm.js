import React, { useState, useEffect } from 'react';

const ContactForm = () => {
  const [submitted, setSubmitted] = useState(false);
  const [mathAnswer, setMathAnswer] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [mathQuestion, setMathQuestion] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState(0);
  
  const formAction = process.env.NEXT_PUBLIC_GOOGLE_FORM_URL;
  const nameID = process.env.NEXT_PUBLIC_GOOGLE_FORM_ENTRY_NAME;
  const emailID = process.env.NEXT_PUBLIC_GOOGLE_FORM_ENTRY_EMAIL;
  const messageID = process.env.NEXT_PUBLIC_GOOGLE_FORM_ENTRY_MESSAGE;

  // random math question
  useEffect(() => {
    const num1 = Math.floor(Math.random() * 100);
    const num2 = Math.floor(Math.random() * 100);
    setMathQuestion(`What is ${num1} + ${num2}?`);
    setCorrectAnswer(num1 + num2);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (honeypot) {
      alert('Bot detected!');
      return;
    }

    if (parseInt(mathAnswer) !== correctAnswer) {
      alert('Please answer the math question correctly.');
      return;
    }

    const form = e.target;

    fetch(formAction, {
      method: 'POST',
      body: new FormData(form),
      mode: 'no-cors',
    })
      .then(() => setSubmitted(true))
      .catch((error) => console.error('Error:', error));
  };

  if (!formAction || !nameID || !emailID || !messageID) {
    return <div>Form configuration is missing.</div>;
  }

  if (submitted) {
    return <div>Thank you for your message!</div>;
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2>Talk to me!</h2>
      <form action={formAction} method="POST" onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label>Name:</label>
          <input
            type="text"
            name={nameID}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>Email:</label>
          <input
            type="email"
            name={emailID}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>Message:</label>
          <textarea
            name={messageID}
            required
            rows="4"
            style={{ width: '100%', padding: '8px' }}
          ></textarea>
        </div>
        <input
          type="text"
          name="honeypot"
          style={{ display: 'none' }}
          onChange={(e) => setHoneypot(e.target.value)}
        />
        <div style={{ marginBottom: '15px' }}>
          <label>{mathQuestion}</label>
          <input
            type="text"
            value={mathAnswer}
            onChange={(e) => setMathAnswer(e.target.value)}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <button className="btn btn-danger" type="submit" style={{ padding: '10px 15px' }}>
          Submit
        </button>
      </form>
    </div>
  );
};

export default ContactForm;
