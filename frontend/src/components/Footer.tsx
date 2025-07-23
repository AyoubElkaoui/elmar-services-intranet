import Link from 'next/link'

export default function Footer() {
    return (
        <footer className="bg-white border-t border-gray-200 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Company Info */}
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center text-white font-bold">
                                E
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">Elmar Services</h3>
                        </div>
                        <p className="text-gray-600 mb-4 leading-relaxed">
                            Uw partner in professionele dienstverlening.
                            Dit intranet biedt toegang tot alle bedrijfsinformatie en tools.
                        </p>
                        <div className="flex space-x-4">
                            <a href="mailto:info@elmarservices.nl" className="text-gray-600 hover:text-blue-600 transition-colors">
                                📧 info@elmarservices.nl
                            </a>
                            <span className="text-gray-600">📞 +31 33 123 4567</span>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-bold text-gray-900 mb-4">Snelkoppelingen</h4>
                        <ul className="space-y-2">
                            <li><Link href="/nieuws" className="text-gray-600 hover:text-blue-600 transition-colors">📰 Nieuws</Link></li>
                            <li><Link href="/kalender" className="text-gray-600 hover:text-blue-600 transition-colors">📅 Kalender</Link></li>
                            <li><Link href="/documenten" className="text-gray-600 hover:text-blue-600 transition-colors">📁 Documenten</Link></li>
                            <li><Link href="/telefoongids" className="text-gray-600 hover:text-blue-600 transition-colors">📞 Telefoongids</Link></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="font-bold text-gray-900 mb-4">Ondersteuning</h4>
                        <ul className="space-y-2">
                            <li><Link href="/it-support" className="text-gray-600 hover:text-blue-600 transition-colors">💻 IT Support</Link></li>
                            <li><Link href="/personeelszaken" className="text-gray-600 hover:text-blue-600 transition-colors">👥 HR</Link></li>
                            <li><Link href="/help" className="text-gray-600 hover:text-blue-600 transition-colors">❓ Help</Link></li>
                            <li><Link href="/contact" className="text-gray-600 hover:text-blue-600 transition-colors">📬 Contact</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-200 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-gray-500 text-sm">
                        © {new Date().getFullYear()} Elmar Services. Alle rechten voorbehouden.
                    </p>
                    <p className="text-gray-500 text-sm mt-4 md:mt-0">
                        Intranet versie 2.0 - Laatst bijgewerkt: {new Date().toLocaleDateString('nl-NL')}
                    </p>
                </div>
            </div>
        </footer>
    )
}