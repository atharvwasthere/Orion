import {
  DribbleLogo,
  HotjarLogo,
  PipedriveLogo,
  TumblerLogo,
  OutestartLogo,
  WalletConnectLogo,
  RobinhoodLogo,
} from "./logo/TrustedByLogos";

const logos = [
  DribbleLogo,
  HotjarLogo,
  PipedriveLogo,
  TumblerLogo,
  OutestartLogo,
  WalletConnectLogo,
  RobinhoodLogo,
];

export const TrustedBy = () => {
  return (
    <section className="py-20 flex flex-col items-center text-center">
      <p className="text-lg text-gray-500 mb-8">
        Loved by thousands of small businesses
      </p>

      <div className="relative w-full overflow-hidden">
        {/* gradient fade edges */}
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[var(--paper)] to-transparent pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[var(--paper)] to-transparent pointer-events-none" />

        {/* marquee track */}
        <div className="flex animate-marquee whitespace-nowrap items-center">
          {[...logos, ...logos].map((Logo, i) => (
            <div
              key={i}
              className="mx-12 flex items-center justify-center opacity-40 hover:opacity-100 transition-opacity duration-300"
            >
              <Logo
                className="h-10 md:h-12 w-auto"
                preserveAspectRatio="xMidYMid meet"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
