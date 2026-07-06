// components/Footer.tsx
import {
    Facebook,
    Twitter,
    Instagram,
    Linkedin,
    SendHorizontal,
    Github,
    Globe,
} from "lucide-react";

const Footer = () => {
    return (
        <footer className="w-full bg-card text-foreground border-t border-border mt-auto">
            <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
                {/* Brand + Social Links */}
                <div className="flex flex-col items-center md:items-start gap-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span role="img" aria-label="Interview Tracly">🎯</span>
                        <span className="font-semibold text-foreground">Interview Tracly</span>
                        <span className="text-muted-foreground">·</span>
                        <span className="text-muted-foreground">Master Coding Interviews</span>
                    </div>
                    <div className="flex gap-4">
                        <a
                            href="https://t.me/"
                            target="_blank"
                             rel="noopener noreferrer"
                            className="hover:text-foreground transition-colors"
                            aria-label="Telegram"
                        >
                            <SendHorizontal size={22} />
                        </a>
                        <a
                            href="https://twitter.com/Rabidas_Prakash"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-foreground transition-colors"
                            aria-label="Twitter"
                        >
                            <Twitter size={22} />
                        </a>
                        <a
                            href="https://www.facebook.com/light144/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-foreground transition-colors"
                            aria-label="Facebook"
                        >
                            <Facebook size={22} />
                        </a>
                        <a
                            href="https://www.instagram.com/__prakash_r__/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-foreground transition-colors"
                            aria-label="Instagram"
                        >
                            <Instagram size={22} />
                        </a>
                        <a
                            href="https://www.linkedin.com/in/prakashrabidas/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-foreground transition-colors"
                            aria-label="LinkedIn"
                        >
                            <Linkedin size={22} />
                        </a>
                        <a
                            href="https://github.com/prakash144"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-foreground transition-colors"
                            aria-label="GitHub"
                        >
                            <Github size={22} />
                        </a>
                        <a
                            href="https://prakashrabidas.in/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-foreground transition-colors"
                            aria-label="Portfolio"
                        >
                            <Globe size={22} />
                        </a>
                    </div>
                </div>

                {/* Copyright */}
                <p className="text-sm md:text-base text-gray-400 text-center leading-relaxed">
                    &copy; {new Date().getFullYear()}{" "}
                    <a
                        href="https://www.prakashrabidas.in"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:underline"
                    >
                        PrakashRabidas.in
                    </a>{" "}
                    · All Rights Reserved.
                </p>
            </div>
        </footer>
    );
};

export default Footer;
