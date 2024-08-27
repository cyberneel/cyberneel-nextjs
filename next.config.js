module.exports = {
  env: {
    CONTENTFUL_SPACE_ID: process.env.CONTENTFUL_SPACE_ID,
    CONTENTFUL_ACCESS_TOKEN: process.env.CONTENTFUL_ACCESS_TOKEN,
    NEXT_PUBLIC_GOOGLE_FORM_URL: process.env.NEXT_PUBLIC_GOOGLE_FORM_URL,
    NEXT_PUBLIC_GOOGLE_FORM_ENTRY_NAME: process.env.NEXT_PUBLIC_GOOGLE_FORM_ENTRY_NAME,
    NEXT_PUBLIC_GOOGLE_FORM_ENTRY_EMAIL: process.env.NEXT_PUBLIC_GOOGLE_FORM_ENTRY_EMAIL,
    NEXT_PUBLIC_GOOGLE_FORM_ENTRY_MESSAGE: process.env.NEXT_PUBLIC_GOOGLE_FORM_ENTRY_MESSAGE,
  },
  
  reactStrictMode: true,

  images: {
    loader: 'akamai',
    path: '',
  },

  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      'react/jsx-runtime.js': require.resolve('react/jsx-runtime'),
    }

    config.resolve = {
      ...config.resolve,

      fallback: {
        ...config.resolve.fallback,
        child_process: false,
        fs: false,
        // 'builtin-modules': false,
        // worker_threads: false,
      },
    }

    return config
  },
}