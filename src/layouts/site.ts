export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Buddhaword",
  description: "The Word of Buddha",
  navItems: [
    {
      label: "ຂໍ້ມູນຕິດຕໍ່",
      href: "/about",
    },
  ],
  navMenuItems: [
    {
      label: "ພຣະສູດ",
      href: "/sutra",
    },
    { label: "ປື້ມ", href: "/book" },
    {
      label: "ປະຕິທິນທັມ",
      href: "/calendar",
    },
    {
      label: "Video",
      href: "/video",
    },
    {
      label: "ຂໍ້ມູນຕິດຕໍ່",
      href: "/about",
    },
  ],
  tabMenuItems: [
    {
      label: "ພຣະສູດ",
      href: "/sutra",
    },
    { label: "ປື້ມ", href: "/book" },
    {
      label: "Video",
      href: "/video",
    },
    {
      label: "ປະຕິທິນທັມ",
      href: "/calendar",
    },
   
  ],
  links: {
    github: "https://github.com/nextui-org/nextui",
    twitter: "https://twitter.com/getnextui",
    docs: "https://nextui.org",
    discord: "https://discord.gg/9b6yyZKmH4",
    sponsor: "https://patreon.com/jrgarciadev",
  },
};
