import { createFileRoute } from '@tanstack/react-router';

// Define the route
export const Route = createFileRoute('/')({
  beforeLoad: async () => {
    // return redirect({
    //   to: '/sutra',
    // });
    return (window.location.href = 'https://buddha-nature.firebaseapp.com/');
  },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <article>
        <meta charSet='UTF-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
        <title>Buddhaword</title>
        <meta name='description' content='The Word of Buddha' />
        <meta
          name='keywords'
          content='Buddhaword, ຄຳສອນພຣະພຸດທະເຈົ້າ, ທັມມະ, ທັມມະຊາດ, lao, laos, the word of buddha, buddha, nature'
        />
        <link rel='manifest' href='/manifest.json' />

        <meta property='og:title' content='Buddhaword | The Word of Buddha' />
        <meta property='og:description' content='ຄຳສອນພຣະພຸດທະເຈົ້າ' />
        <meta
          property='og:image'
          content='https://buddhaword.netlify.appimages/logo_shared.png'
        />
        <meta property='og:type' content='website' />
        <meta property='og:url' content='https://buddhaword.netlify.app' />

        <meta name='twitter:card' content='summary_large_image' />
        <meta name='twitter:title' content='Buddhaword' />
        <meta name='twitter:description' content='The Word of Buddha' />
        <meta
          name='twitter:image'
          content='https://buddhaword.netlify.appimages/logo_shared.png'
        />

        <link rel='icon' type='image/png' href='/images/logo_shared.png' />

        <meta name='mobile-web-app-capable' content='yes' />
        <meta name='apple-mobile-web-app-status-bar-style' content='#FFAF5D' />
        <meta name='apple-mobile-web-app-title' content='Buddha-Nature' />
        <meta name='theme-color' content='#FFAF5D' />
        <link rel='apple-touch-icon' href='/images/logo_shared.png' />
      </article>
    </>
  );
}
