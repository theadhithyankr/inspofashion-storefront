import { Instagram, Facebook, Twitter, Chrome, Youtube } from 'lucide-react'
import { useStoreSettings } from '../../hooks/useStoreSettings'

export function Footer() {
  const currentYear = new Date().getFullYear()
  const { settings, loading } = useStoreSettings('footer_settings')

  if (loading) return null; // Don't visibly flicker

  // Destructure with default fallback object mapped to UI expectations
  const {
    is_visible = true,
    company_info = {
      newsletter_heading: "Subscribe to our emails",
      social_heading: "Follow the Flock",
      email: "help@inspofashions.com"
    },
    social = {
      instagram: "#",
      facebook: "#",
      twitter: "#",
      youtube: "#"
    },
    sections = [
      {
        id: '1', title: 'Help', links: [
          { name: 'Live Chat', url: '#' },
          { name: 'FAQ/Contact Us', url: '#' },
          { name: 'Returns/Exchanges', url: '#' }
        ]
      },
      {
        id: '2', title: 'Shop', links: [
          { name: "Men's Shoes", url: "#" },
          { name: "Women's Shoes", url: "#" },
          { name: "Gift Cards", url: "#" }
        ]
      },
      {
        id: '3', title: 'Company', links: [
          { name: 'Store Locator', url: '#' },
          { name: 'Our Story', url: '#' }
        ]
      }
    ]
  } = (settings || {})

  if (!is_visible) return null;

  return (
    <footer className="bg-[#212121] text-white font-sans text-sm pb-10">
      <div className="container-wide py-16 px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-8">
          
          {/* Social and Contact */}
          <div className="md:col-span-12 lg:col-span-4 lg:pr-8">
            <div>
              <h3 className="text-[13px] font-bold tracking-widest mb-6 uppercase">{company_info.social_heading}</h3>
              <div className="flex gap-4">
                {social.instagram && (
                  <a href={social.instagram} className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-600 hover:border-white transition-colors">
                    <Instagram className="w-4 h-4" />
                  </a>
                )}
                {social.facebook && (
                  <a href={social.facebook} className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-600 hover:border-white transition-colors">
                    <Facebook className="w-4 h-4" />
                  </a>
                )}
                {social.twitter && (
                  <a href={social.twitter} className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-600 hover:border-white transition-colors">
                    <Twitter className="w-4 h-4" />
                  </a>
                )}
                {social.youtube && (
                  <a href={social.youtube} className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-600 hover:border-white transition-colors">
                    <Youtube className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
            {company_info.email && (
               <div className="mt-8 text-gray-400 font-medium">
                  {company_info.email}
               </div>
            )}
          </div>

          {/* Dynamic Footer Columns generated from Admin */}
          {sections.map((section, idx) => (
            <div key={section.id} className="md:col-span-4 lg:col-span-2 space-y-4">
              <h4 className="text-[13px] font-bold uppercase tracking-widest text-white mb-6">{section.title}</h4>
              <ul className="space-y-4">
                {section.links.map((link, linkIdx) => (
                  <li key={linkIdx}>
                    <a href={link.url} className="text-gray-300 hover:text-white transition-colors">
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700/50">
        <div className="container-wide py-6 px-6 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-400 text-xs">
            © {currentYear} Inspofashions. All Rights Reserved
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-gray-400 text-xs font-medium">
            <a href="#" className="hover:text-white transition-colors">Refund policy</a>
            <a href="#" className="hover:text-white transition-colors">Privacy policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of service</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
