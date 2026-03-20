"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone, MapPin, Linkedin } from 'lucide-react';

const Footer = () => {
    const mainWebsite = "https://www.bitlancetechhub.com";
    
    return (
        <footer className="bg-transparent text-white pt-24 pb-12 border-t border-white/5">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand Column - Left */}
                    <div className="lg:col-span-1">
                        <Link href="/" className="inline-block mb-8">
                            <Image 
                                src="/logo.webp" 
                                alt="Bitlance.ai" 
                                width={140} 
                                height={32} 
                                className="h-8 w-auto object-contain mix-blend-lighten" 
                            />
                        </Link>
                        <p className="text-white/50 text-sm leading-relaxed mb-8 max-w-xs">
                            Empowering businesses with intelligent automation. 24/7 
                            engagement, instant qualification, and seamless scheduling.
                        </p>
                        <div className="flex gap-4">
                            <SocialIcon icon={<Linkedin size={18} />} href="https://www.linkedin.com/company/bitlance-tech-hub-pvt-ltd/" />
                        </div>
                    </div>

                    {/* Company Links - Center */}
                    <div className="lg:col-start-2 lg:justify-self-center">
                        <h3 className="text-base font-bold mb-8 text-white">Company</h3>
                        <ul className="space-y-4">
                            <FooterLink href={`${mainWebsite}/blogs`} label="Blog" />
                            <FooterLink href={`${mainWebsite}/privacy`} label="Privacy Policy" />
                            <FooterLink href={`${mainWebsite}/terms`} label="Terms of Service" />
                        </ul>
                    </div>

                    {/* Compare Links - Center Right */}
                    <div className="lg:col-start-3 lg:justify-self-center">
                        <h3 className="text-base font-bold mb-8 text-white">Compare</h3>
                        <ul className="space-y-4">
                            <li>
                                <Link href="/compare/retell-ai" className="text-white/50 hover:text-white transition-colors text-sm">
                                    Vs Retell AI
                                </Link>
                            </li>
                            <li>
                                <Link href="/compare/vapi-ai" className="text-white/50 hover:text-white transition-colors text-sm">
                                    Vs Vapi AI
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info - Right */}
                    <div className="lg:col-span-1 lg:flex lg:flex-col lg:items-end">
                        <div className="w-full lg:max-w-md">
                            <h3 className="text-base font-bold mb-8 text-white">Contact</h3>
                            <ul className="space-y-6">
                            <ContactItem
                                icon={<MapPin size={18} />}
                                text="Blue Ridge Town Pune, Phase 1, Hinjawadi Rajiv Gandhi Infotech Park, Hinjawadi, Pune, Pimpri-Chinchwad, Maharashtra 411057"
                            />
                            <ContactItem
                                icon={<Mail size={18} />}
                                text="ceo@bitlancetechhub.com"
                                href="mailto:ceo@bitlancetechhub.com"
                            />
                            <ContactItem
                                icon={<Phone size={18} />}
                                text="+91 7391025059"
                                href="tel:+917391025059"
                            />
                        </ul>
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/5 pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-white/30 text-xs">
                        © {new Date().getFullYear()} Bitlance. All rights reserved.
                    </p>
                    <div className="flex gap-8 text-xs text-white/30">
                        <a href={`${mainWebsite}/privacy-policy`} className="hover:text-white transition-colors">Privacy Policy</a>
                        <a href={`${mainWebsite}/terms-policy`} className="hover:text-white transition-colors">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

const SocialIcon = ({ icon, href }: { icon: React.ReactNode, href?: string }) => (
    <a 
        href={href || "#"} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:bg-primary hover:text-white transition-all transform hover:-translate-y-1"
    >
        {icon}
    </a>
);

const FooterLink = ({ href, label }: { href: string, label: string }) => (
    <li>
        <a href={href} className="text-white/50 hover:text-white transition-colors text-sm">
            {label}
        </a>
    </li>
);

const ContactItem = ({ icon, text, href }: { icon: React.ReactNode, text: string, href?: string }) => (
    <li className="flex gap-4">
        <div className="shrink-0 w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/50">
            {icon}
        </div>
        <div className="flex flex-col justify-center">
            {href ? (
                <a href={href} className="text-white/60 hover:text-white transition-colors text-sm">
                    {text}
                </a>
            ) : (
                <span className="text-white/60 text-sm leading-relaxed max-w-sm">
                    {text}
                </span>
            )}
        </div>
    </li>
);

export default Footer;
