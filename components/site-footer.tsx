import Link from "next/link"
import Image from "next/image"

const GithubIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
)

const TwitterIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
)

const MessageCircleIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
)

export function SiteFooter() {
  return (
    <footer className="relative border-t border-white/10 bg-black/50 backdrop-blur-xl">
      <div className="absolute inset-0 bg-gradient-to-t from-[#EC4899]/5 to-transparent pointer-events-none" />

      <div className="relative py-16 md:py-20 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-5">
            <Link href="/" className="inline-flex items-center space-x-3 mb-6 group">
              <div className="relative h-12 w-12 transition-transform group-hover:scale-110">
                <Image src="/polkahub-logo.jpg" alt="PolkaHub" fill className="object-contain mix-blend-lighten" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                PolkaHub
              </span>
            </Link>
            <p className="text-base text-white/60 max-w-sm leading-relaxed mb-6">
              Connecting Polkadot open-source projects with talented developers through transparent, reward-backed
              contributions.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white/60 transition-all hover:border-[#EC4899] hover:text-[#EC4899] hover:bg-[#EC4899]/10"
              >
                <GithubIcon className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white/60 transition-all hover:border-[#EC4899] hover:text-[#EC4899] hover:bg-[#EC4899]/10"
              >
                <TwitterIcon className="h-5 w-5" />
              </a>
              <a
                href="https://discord.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white/60 transition-all hover:border-[#EC4899] hover:text-[#EC4899] hover:bg-[#EC4899]/10"
              >
                <MessageCircleIcon className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div className="md:col-span-7 grid grid-cols-2 gap-8 md:grid-cols-3">
            <div>
              <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Platform</h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/projects"
                    className="text-white/60 hover:text-[#EC4899] transition-colors text-sm inline-flex items-center group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform">Browse Projects</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/tasks"
                    className="text-white/60 hover:text-[#EC4899] transition-colors text-sm inline-flex items-center group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform">Find Tasks</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard"
                    className="text-white/60 hover:text-[#EC4899] transition-colors text-sm inline-flex items-center group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform">Dashboard</span>
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Resources</h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/docs"
                    className="text-white/60 hover:text-[#EC4899] transition-colors text-sm inline-flex items-center group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform">Documentation</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="text-white/60 hover:text-[#EC4899] transition-colors text-sm inline-flex items-center group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform">About</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog"
                    className="text-white/60 hover:text-[#EC4899] transition-colors text-sm inline-flex items-center group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform">Blog</span>
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Legal</h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/privacy"
                    className="text-white/60 hover:text-[#EC4899] transition-colors text-sm inline-flex items-center group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform">Privacy</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="text-white/60 hover:text-[#EC4899] transition-colors text-sm inline-flex items-center group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform">Terms</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-white/60 hover:text-[#EC4899] transition-colors text-sm inline-flex items-center group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform">Contact</span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-white/40">&copy; {new Date().getFullYear()} PolkaHub. Built on Polkadot.</p>
            <div className="flex items-center gap-6 text-sm text-white/40">
              <span className="flex items-center gap-2">
                Made with <span className="text-[#EC4899]">♥</span> for Web3
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
