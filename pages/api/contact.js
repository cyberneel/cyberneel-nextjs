import fetch from 'node-fetch';

export default async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { name, email, message } = req.body;

  const googleFormUrl = process.env.GOOGLE_FORM_URL;
  const formData = new URLSearchParams();
  formData.append(process.env.GOOGLE_FORM_ENTRY_NAME, name);
  formData.append(process.env.GOOGLE_FORM_ENTRY_EMAIL, email);
  formData.append(process.env.GOOGLE_FORM_ENTRY_MESSAGE, message);

  try {
    const response = await fetch(googleFormUrl, {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    res.status(200).json({ message: 'Form submitted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error submitting form' });
  }
};
