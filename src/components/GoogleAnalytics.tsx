import { MIA } from "@/lib/mia";

const ga4Id = MIA.tracking.ga4Id.trim();

export function GoogleAnalytics() {
  if (!ga4Id) return null;

  const initScript = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', ${JSON.stringify(ga4Id)});
  `;

  return (
    <>
      <script async src={`https://www.googletagmanager.com/gtag/js?id=${ga4Id}`} />
      <script id="ga4-init" dangerouslySetInnerHTML={{ __html: initScript }} />
    </>
  );
}
