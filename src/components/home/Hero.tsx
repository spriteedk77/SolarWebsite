import { Container } from '@/components/ui/Container';
import { ButtonLink } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { quoteLinks } from '@/lib/site';
import { getSiteData } from '@/cms/site';

export async function Hero() {
  const { contact, cta, serviceAreas, homepage } = await getSiteData();
  return (
    <section aria-labelledby="hero-title" className="on-navy bg-navy-900">
      <Container width="wide">
        <div className="grid gap-10 py-14 md:py-20 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)] lg:items-center lg:gap-12 lg:py-24">
          <div className="min-w-0">
            <p className="text-caption font-medium text-navy-100">
              {homepage.serviceMessage}
            </p>
            <h1
              id="hero-title"
              className="hero-headline mt-5 whitespace-pre-line text-white"
            >
              {homepage.headline}
            </h1>
            <p className="mt-6 max-w-2xl text-body-lg text-navy-100">
              {homepage.description}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <ButtonLink
                href={quoteLinks.general}
                variant="primary"
                size="lg"
                data-analytics="hero-quote"
              >
                {cta.primary}
                <Icon name="arrow-right" className="h-5 w-5 shrink-0" />
              </ButtonLink>
              <ButtonLink href="/projects" variant="outline-light" size="lg">
                {cta.projects}
              </ButtonLink>
            </div>
            <p className="mt-5 flex items-start gap-2 text-caption text-navy-200">
              <Icon name="map-pin" className="mt-1 h-4 w-4 shrink-0" />
              <span>{serviceAreas.map((area) => area.name).join(' · ')}</span>
            </p>
          </div>
          <aside
            aria-label="ติดต่อทีมงาน"
            className="min-w-0 border-t border-white/25 pt-7 lg:border-t-0 lg:border-l lg:py-3 lg:pl-10 xl:pl-14"
          >
            <p className="text-caption font-medium tracking-widest text-navy-200">
              CONTACT
            </p>
            <p className="mt-3 text-body text-white">
              คุยกับทีมงานเรื่องระบบของคุณ
            </p>
            <a
              href={contact.phoneHref}
              className="mt-6 flex min-h-11 items-center gap-3 text-xl font-semibold text-white underline-offset-4 hover:underline xl:text-2xl"
            >
              <Icon name="phone" className="h-5 w-5 shrink-0 text-navy-200" />
              <span className="break-words">{contact.phone}</span>
            </a>
            <a
              href={contact.lineUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 flex min-h-11 items-center gap-3 text-body-lg font-medium text-white underline-offset-4 hover:underline"
            >
              <Icon name="line" className="h-5 w-5 shrink-0 text-line-500" />
              <span className="break-all">LINE {contact.lineId}</span>
            </a>
            <p className="mt-5 max-w-xs text-caption text-navy-200">
              ส่งบิลค่าไฟและรูปหลังคา เพื่อเริ่มประเมินระบบที่เหมาะกับการใช้งาน
            </p>
          </aside>
        </div>
      </Container>
    </section>
  );
}
