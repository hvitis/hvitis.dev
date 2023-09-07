const { withContentlayer } = require('next-contentlayer')

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

// You might need to insert additional domains in script-src if you are using external services
const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' giscus.app analytics.umami.is;
  style-src 'self' 'unsafe-inline';
  img-src * blob: data:;
  media-src *.s3.amazonaws.com;
  connect-src *;
  font-src 'self';
  frame-src giscus.app
`

const securityHeaders = [
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP
  {
    key: 'Content-Security-Policy',
    value: ContentSecurityPolicy.replace(/\n/g, ''),
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Content-Type-Options
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-DNS-Prefetch-Control
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains',
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Feature-Policy
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()',
  },
]

/**
 * @type {import('next/dist/next-server/server/config').NextConfig}
 **/
module.exports = () => {
  const plugins = [withContentlayer, withBundleAnalyzer]
  return plugins.reduce((acc, next) => next(acc), {
    reactStrictMode: true,
    pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
    eslint: {
      dirs: ['app', 'components', 'layouts', 'scripts'],
    },
    images: {
      domains: ['picsum.photos'],
    },
    experimental: {
      appDir: true,
    },
    async headers() {
      return [
        {
          source: '/(.*)',
          headers: securityHeaders,
        },
      ]
    },
    async redirects() {
      return [
        {
          source: '/4-worst-things-i-had-to-debug-ever',
          destination: '/blog/4-worst-things-i-had-to-debug-ever',
          permanent: true,
        },
        {
          source: '/5-lessons-for-intermediate-jedi-how-to-learn-postman',
          destination: '/blog/5-lessons-for-intermediate-jedi-how-to-learn-postman',
          permanent: true,
        },
        {
          source: '/5-ways-you-could-improve-your-automated-postman-tests',
          destination: '/blog/5-ways-you-could-improve-your-automated-postman-tests',
          permanent: true,
        },
        {
          source: '/create-maintain-and-publish-technical-documentation-obsidian-nextjs',
          destination: '/blog/create-maintain-and-publish-technical-documentation-obsidian-nextjs',
          permanent: true,
        },
        {
          source: '/django-oauth-social-tutorial-how-to-implement-google-login-with-djoser',
          destination:
            '/blog/django-oauth-social-tutorial-how-to-implement-google-login-with-djoser',
          permanent: true,
        },
        {
          source:
            '/geolocation-tutorial-geodjango-demo-and-gis-postgis-data-to-build-app-using-rest-api',
          destination:
            '/blog/geolocation-tutorial-geodjango-demo-and-gis-postgis-data-to-build-app-using-rest-api',
          permanent: true,
        },
        {
          source: '/google-qa-testing-article-on-manual-and-automation-test-engineers-sdet',
          destination:
            '/blog/google-qa-testing-article-on-manual-and-automation-test-engineers-sdet',
          permanent: true,
        },
        {
          source:
            '/how-to-code-simple-like-soundcloud-javascript-audio-player-with-django-tutorial',
          destination:
            '/blog/how-to-code-simple-like-soundcloud-javascript-audio-player-with-django-tutorial',
          permanent: true,
        },
        {
          source: '/how-to-connect-filepond-reactjs-and-drf-extension',
          destination: '/blog/how-to-connect-filepond-reactjs-and-drf-extension',
          permanent: true,
        },
        {
          source: '/how-to-connect-gatsby-js-with-netlify-forms',
          destination: '/blog/how-to-connect-gatsby-js-with-netlify-forms',
          permanent: true,
        },

        {
          source: '/how-to-convert-audio-files-with-python-and-django',
          destination: '/blog/how-to-convert-audio-files-with-python-and-django',
          permanent: true,
        },
        {
          source: '/how-to-encapsulate-your-earth-presence-in-lego',
          destination: '/blog/how-to-encapsulate-your-earth-presence-in-lego',
          permanent: true,
        },
        {
          source: '/how-to-fix-modulenotfoundrrror-in-django',
          destination: '/blog/how-to-fix-modulenotfoundrrror-in-django',
          permanent: true,
        },
        {
          source:
            '/how-to-implement-recaptcha-v3-with-vuejs-front-end-framework-and-django-rest-api',
          destination:
            '/blog/how-to-implement-recaptcha-v3-with-vuejs-front-end-framework-and-django-rest-api',
          permanent: true,
        },
        {
          source: '/how-to-make-cheap-dome-with-gaudi-architecture-and-modular-nature',
          destination: '/blog/how-to-make-cheap-dome-with-gaudi-architecture-and-modular-nature',
          permanent: true,
        },
        {
          source: '/how-to-shrink-your-droplet-on-digital-ocean-downgrading',
          destination: '/blog/how-to-shrink-your-droplet-on-digital-ocean-downgrading',
          permanent: true,
        },
        {
          source: '/how-to-start-developing-a-game-like-stardew-valley-using-monogames-xna',
          destination:
            '/blog/how-to-start-developing-a-game-like-stardew-valley-using-monogames-xna',
          permanent: true,
        },
        {
          source: '/how-to-translate-books-for-free-to-any-language-with-python',
          destination: '/blog/how-to-translate-books-for-free-to-any-language-with-python',
          permanent: true,
        },
        {
          source: '/how-to-upload-files-with-filepond-and-drf-extension',
          destination: '/blog/how-to-upload-files-with-filepond-and-drf-extension',
          permanent: true,
        },
        {
          source: '/jab-code-and-everything-you-need-to-know-about-color-bar-code',
          destination: '/blog/jab-code-and-everything-you-need-to-know-about-color-bar-code',
          permanent: true,
        },
        {
          source: '/let-anybody-deploy-your-code-deploy-to-heroku-button',
          destination: '/blog/let-anybody-deploy-your-code-deploy-to-heroku-button',
          permanent: true,
        },
        {
          source: '/mosaic-art-creator-mosaic-and-portraits-free-online-editor',
          destination: '/blog/mosaic-art-creator-mosaic-and-portraits-free-online-editor',
          permanent: true,
        },
        {
          source: '/oauth-django-djoser-tutorial-vuejs-facebook-one-click-button',
          destination: '/blog/oauth-django-djoser-tutorial-vuejs-facebook-one-click-button',
          permanent: true,
        },
        {
          source: '/peer-testing-and-everything-you-should-know-about-it',
          destination: '/blog/peer-testing-and-everything-you-should-know-about-it',
          permanent: true,
        },
        {
          source: '/project-django-2-crm-app-for-learning-polish',
          destination: '/blog/project-django-2-crm-app-for-learning-polish',
          permanent: true,
        },
        {
          source: '/project-free-podcasts-blog-template-based-on-django',
          destination: '/blog/project-free-podcasts-blog-template-based-on-django',
          permanent: true,
        },
        {
          source: '/project-ionic-4-beginner-learning-adventure-of-how-to-make-app',
          destination: '/blog/project-ionic-4-beginner-learning-adventure-of-how-to-make-app',
          permanent: true,
        },
        {
          source:
            '/project-lego-art-creator-mosaic-and-portraits-free-tutorial-using-javascript-react-gatsbyjs',
          destination:
            '/blog/project-lego-art-creator-mosaic-and-portraits-free-tutorial-using-javascript-react-gatsbyjs',
          permanent: true,
        },
        {
          source: '/project-react-based-lego-name-maker',
          destination: '/blog/project-react-based-lego-name-maker',
          permanent: true,
        },
        {
          source: '/qr-code',
          destination: '/blog/qr-code',
          permanent: true,
        },
        {
          source: '/rest-api-design-best-practices',
          destination: '/blog/rest-api-design-best-practices',
          permanent: true,
        },
        {
          source: '/the-best-and-easiest-django-gallery-with-elegant-css',
          destination: '/blog/the-best-and-easiest-django-gallery-with-elegant-css',
          permanent: true,
        },
        {
          source: '/why-you-might-start-learning-to-code',
          destination: '/blog/why-you-might-start-learning-to-code',
          permanent: true,
        },
      ]
    },
    webpack: (config, options) => {
      config.module.rules.push({
        test: /\.svg$/,
        use: ['@svgr/webpack'],
      })

      return config
    },
  })
}
