import Script from "next/script";

/**
 * Google Analytics 4, só se NEXT_PUBLIC_GA_ID estiver preenchido (ex.: G-XXXXXXXXXX).
 * Usa o modo de consentimento v2: começa NEGADO (sem cookies de estatística) e só vira "granted" se o
 * visitante aceitou no aviso de cookies (escolha guardada em 'multsystems:cookies:v1', ver src/lib/cookies.ts).
 * A mudança de escolha chama gtag('consent','update',...) na hora.
 */
export function GoogleAnalytics() {
  const id = process.env.NEXT_PUBLIC_GA_ID;
  if (!id) return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${id}`} strategy="afterInteractive" />
      <Script id="ga-inicio" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}window.gtag=gtag;
var c=null;try{c=JSON.parse(localStorage.getItem('multsystems:cookies:v1'))}catch(e){}
gtag('consent','default',{analytics_storage:c&&c.analytics?'granted':'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
gtag('js',new Date());gtag('config','${id}');`}
      </Script>
    </>
  );
}
