import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.dirname(fileURLToPath(import.meta.url));
const config = JSON.parse(await readFile(path.join(root, 'config/site.config.json'), 'utf8'));
const escape = (value) => String(value).replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const c = config;
const arrow = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15m-6-6 6 6-6 6"/></svg>';
const whatsappIcon = '<svg class="whatsapp-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.52 3.48A11.89 11.89 0 0 0 12.04 0C5.45 0 .08 5.36.08 11.95c0 2.11.55 4.17 1.6 5.99L0 24l6.2-1.63a11.97 11.97 0 0 0 5.83 1.49h.01c6.59 0 11.96-5.36 11.96-11.95 0-3.19-1.24-6.2-3.48-8.43zM12.04 21.85a9.9 9.9 0 0 1-5.04-1.38l-.36-.21-3.68.97.98-3.59-.23-.37a9.87 9.87 0 0 1-1.51-5.32c0-5.48 4.46-9.94 9.95-9.94 2.65 0 5.14 1.04 7.01 2.92a9.87 9.87 0 0 1 2.91 7.03c0 5.48-4.46 9.94-9.94 9.94zm5.45-7.44c-.3-.15-1.77-.88-2.05-.98-.27-.1-.47-.15-.67.15-.2.3-.77.98-.94 1.18-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.38-.03-.53-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.49s1.07 2.89 1.22 3.09c.15.2 2.11 3.22 5.1 4.51.71.31 1.27.49 1.7.63.71.23 1.36.2 1.87.12.57-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.18-1.42-.08-.13-.28-.2-.58-.35z"/></svg>';
const imageMarkup = (image, className, sizes, priority = false) => `<figure class="${className}"><img src="${escape(image.src)}"${image.smallSrc ? ` srcset="${escape(image.smallSrc)} ${image.smallWidth || 640}w, ${escape(image.src)} ${image.width}w" sizes="${sizes}"` : ''} width="${image.width}" height="${image.height}" alt="${escape(image.alt)}"${image.position ? ` style="object-position:${escape(image.position)}"` : ''} ${priority ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async"></figure>`;
const wordmark = c.brand.logo
  ? `<img class="original-logo" src="${escape(c.brand.logo)}" alt="${escape(c.brand.fullName + ' — ' + c.brand.description)}" width="${c.brand.logoWidth}" height="${c.brand.logoHeight}" decoding="async">`
  : `<span class="brand-name">Camila Meilãn<span>do Nascimento</span></span><span class="brand-description">${escape(c.brand.description)}</span>`;
const phone = c.contact.whatsapp?.replace(/\D/g, '');
const displayPhone = phone?.replace(/^55(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
if (phone && !/^\d{10,15}$/.test(phone)) throw new Error('Confirme o número de WhatsApp com código do país.');
const contactHref = phone ? `https://wa.me/${phone}?text=${encodeURIComponent(c.contact.message)}` : c.contact.email ? `mailto:${c.contact.email}` : c.contact.phone ? `tel:${c.contact.phone.replace(/[^+\d]/g,'')}` : null;
const contactLabel = phone ? 'Conversar pelo WhatsApp' : c.contact.email ? 'Enviar um e-mail' : 'Ligar para o consultório';
const contactNav = contactHref ? '<a href="#contato">Contato</a>' : '';
const servicesNav = c.confirmedTreatments.length ? '<a href="#servicos">Serviços</a>' : '';
const officeNav = c.images.office ? '<a href="#consultorio">Consultório</a>' : '';
const externalAttrs = phone ? ' target="_blank" rel="noopener noreferrer"' : '';
const contact = contactHref ? `
<section class="contact section" id="contato" aria-labelledby="contact-title">
  <div class="container contact-inner"><p class="eyebrow">Contato</p><h2 id="contact-title">${escape(c.contact.title)}</h2><p>${escape(c.contact.description)}</p>
  <a class="button button-light" href="${escape(contactHref)}"${externalAttrs}>${contactLabel}${phone ? whatsappIcon : arrow}</a>
  ${phone ? `<p class="contact-detail">WhatsApp · ${escape(displayPhone)}</p>` : ''}
  ${c.contact.address ? `<p class="contact-detail">${escape(c.contact.address)}</p>` : ''}
  ${c.contact.hours ? `<p class="contact-detail">${escape(c.contact.hours)}</p>` : ''}
  ${c.contact.mapsUrl && c.contact.address ? `<a class="text-link" href="${escape(c.contact.mapsUrl)}" target="_blank" rel="noopener noreferrer">Como chegar ${arrow}</a>` : ''}
  </div>
</section>` : '';
const services = c.confirmedTreatments.length ? `
<section class="services section" id="servicos" aria-labelledby="services-title"><div class="container">
  <div class="services-intro"><p class="eyebrow">${escape(c.services.label)}</p><div><h2 id="services-title">${escape(c.services.title)}<br><em>${escape(c.services.titleEmphasis)}</em></h2><p class="services-description">${escape(c.services.intro)}</p></div></div>
  <ul class="services-list">${c.confirmedTreatments.map(item=>`<li>${item.image ? imageMarkup(item.image,'service-photo','(max-width: 700px) calc(100vw - 48px), (max-width: 1024px) 44vw, 280px') : ''}<div class="service-copy"><h3>${escape(item.title)}</h3><p>${escape(item.description)}</p></div></li>`).join('')}</ul>
  ${phone ? `<a class="text-link services-action" href="${escape(contactHref)}"${externalAttrs}>${escape(c.services.action)}${arrow}</a>` : ''}
</div></section>` : '';
const office = c.images.office ? `<section class="office section" id="consultorio" aria-labelledby="office-title"><div class="container office-layout"><div><p class="eyebrow">${escape(c.office.label)}</p><h2 id="office-title">${escape(c.office.title)}<br><em>${escape(c.office.titleEmphasis)}</em></h2><p class="office-description">${escape(c.office.description)}</p></div>${imageMarkup(c.images.office,'office-photo','(max-width: 700px) calc(100vw - 48px), (max-width: 1024px) 60vw, 760px')}</div></section>` : '';
const html = `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#FBF8F4">
  <meta name="description" content="${escape(c.meta.description)}">
  <meta name="robots" content="noindex,nofollow">
  <meta property="og:title" content="${escape(c.meta.title)}">
  <meta property="og:description" content="${escape(c.meta.description)}">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="pt_BR">
  <title>${escape(c.meta.title)}</title>
  <link rel="preload" href="assets/fonts/cormorant-garamond.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="assets/fonts/manrope.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" as="image" href="${escape(c.images.hero.src)}" imagesrcset="${escape(c.images.hero.smallSrc)} ${c.images.hero.smallWidth}w, ${escape(c.images.hero.src)} ${c.images.hero.width}w" imagesizes="(max-width: 700px) calc(100vw - 48px), (max-width: 1024px) 44vw, 550px">
  <link rel="stylesheet" href="styles.css">
  <link rel="stylesheet" href="motion.css">
  <script src="main.js" defer></script>
  <script src="motion.js" defer></script>
</head>
<body id="inicio">
  <a class="skip-link" href="#conteudo">Pular para o conteúdo</a>
  <header class="site-header">
    <div class="container header-inner">
      <a class="brand" href="#inicio" aria-label="${escape(c.brand.fullName)} — início">${wordmark}</a>
      <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="main-nav"><span class="menu-label">Menu</span><span class="menu-icon" aria-hidden="true"><span></span><span></span></span></button>
      <nav class="main-nav" id="main-nav" aria-label="Navegação principal"><div class="nav-links"><a href="#sobre">Sobre</a>${servicesNav}${officeNav}${contactNav}</div>${contactHref ? `<a class="header-action" href="${escape(contactHref)}"${externalAttrs}>${phone ? whatsappIcon : ''}<span>Agendar consulta</span>${phone ? '' : arrow}</a>` : ''}</nav>
    </div>
  </header>
  <main id="conteudo" tabindex="-1">
    <section class="hero" aria-labelledby="hero-title">
      <div class="container hero-inner">
        <div class="hero-copy">
        <p class="eyebrow hero-eyebrow">${escape(c.brand.description)}</p>
        <h1 id="hero-title"><span class="hero-first">${escape(c.hero.firstLine)}</span> <span class="hero-last">${escape(c.hero.secondLine)}</span></h1>
        <div class="hero-bottom"><p class="hero-description">${escape(c.hero.description)}</p><div class="hero-actions"><a class="button" href="${contactHref ? escape(contactHref) : '#sobre'}"${contactHref ? externalAttrs : ''}>${contactHref ? 'Agendar uma consulta' : escape(c.hero.action)}${arrow}</a>${contactHref ? '<a class="hero-secondary" href="#sobre">Conheça a Dra. Camila</a>' : ''}</div></div>
        </div>
        ${imageMarkup(c.images.hero,'hero-photo','(max-width: 700px) calc(100vw - 48px), (max-width: 1024px) 44vw, 550px',true)}
        <a class="section-cue" href="#sobre"><span>${escape(c.hero.nextSection)}</span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v15m-6-6 6 6 6-6"/></svg></a>
      </div>
    </section>
    <section class="about section" id="sobre" aria-labelledby="about-title">
      <div class="container about-layout">
        ${c.images.professional ? imageMarkup(c.images.professional,'professional-photo','(max-width: 700px) calc(100vw - 48px), 350px') : ''}
        <div class="about-content"><p class="eyebrow">${escape(c.about.label)}</p><h2 id="about-title">${escape(c.about.title)}<br><em>${escape(c.about.titleEmphasis)}</em></h2><div class="about-copy">${c.about.paragraphs.map(p=>`<p>${escape(p)}</p>`).join('')}</div><div class="professional-name"><p>${escape(c.brand.fullName)}</p><span>${escape(c.brand.description)}</span></div></div>
      </div>
    </section>
    ${services}
    <section class="care section" id="atendimento" aria-labelledby="care-title">
      <div class="container">
        <div class="care-heading"><p class="eyebrow">${escape(c.care.label)}</p><div><h2 id="care-title">${escape(c.care.title)}<br><em>${escape(c.care.titleEmphasis)}</em></h2><p class="care-intro">${escape(c.care.intro)}</p></div></div>
        <ul class="care-list">${c.care.items.map(item=>`<li><h3>${escape(item.title)}</h3><p>${escape(item.description)}</p></li>`).join('')}</ul>
      </div>
    </section>
    ${office}
    ${contact}
  </main>
  <footer class="site-footer"><div class="container">
    <div class="footer-main">
      <div class="footer-identity"><a class="footer-brand" href="#inicio" aria-label="${escape(c.brand.fullName)} — voltar ao início">${wordmark}</a><p class="footer-note">${escape(c.hero.description)}</p>${c.brand.professionalRegistration ? `<p>${escape(c.brand.professionalRegistration)}</p>` : ''}</div>
      <div class="footer-navigation"><p class="footer-label">Navegue</p><nav aria-label="Navegação do rodapé"><a href="#sobre">Sobre</a>${servicesNav}<a href="#atendimento">Atendimento</a>${officeNav}${contactNav}</nav></div>
      ${contactHref ? `<div class="footer-contact"><p class="footer-label">Vamos conversar</p><a class="footer-phone" href="${escape(contactHref)}"${externalAttrs}>${phone ? whatsappIcon : arrow}<span>${phone ? `<small>WhatsApp</small>${escape(displayPhone)}` : contactLabel}</span></a><p class="footer-contact-note">Entre em contato para agendar sua consulta.</p></div>` : ''}
    </div>
    <div class="footer-bottom"><span>© ${new Date().getFullYear()} ${escape(c.brand.fullName)}</span><a class="back-top" href="#inicio">Voltar ao início<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20V5m-6 6 6-6 6 6"/></svg></a></div>
  </div></footer>
  ${phone ? `<a class="whatsapp-float" href="${escape(contactHref)}" aria-label="Conversar com a Dra. Camila pelo WhatsApp (abre em nova aba)" title="Conversar pelo WhatsApp" target="_blank" rel="noopener noreferrer">${whatsappIcon}</a>` : ''}
</body>
</html>`;
await mkdir(path.join(root, 'docs'), {recursive:true});
await writeFile(path.join(root,'docs/index.html'), html, 'utf8');
console.log('Site gerado em docs/index.html.');
