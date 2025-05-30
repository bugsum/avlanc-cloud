import { LucideIcon } from 'lucide-react';

/* -------------------------------------------------------------------------- */
/*         Type Interfaces for Header Navigation Menu Props (Desktop)         */
/* -------------------------------------------------------------------------- */

export interface HeaderNavigationItem {
    title: string;
    href: string;
    description: string;
}

export interface HeaderNavigationItems {
    title: string;
    href?: string;
    icon?: LucideIcon;
    triggerIcon?: LucideIcon; // Added for icons next to triggers
    description?: string;
    featured?: {
        title: string;
        href: string;
        icon: LucideIcon;
        description: string;
    };
    items?: HeaderNavigationItem[];
}

export interface HeaderNavigationProps {
    items: HeaderNavigationItems[];
    className?: string;
}

/* -------------------------------------------------------------------------- */
/*             Type Interfaces for Header Navigation Menu (Mobile)            */
/* -------------------------------------------------------------------------- */
export interface HeaderNavigationMobileItem {
    title: string;
    href: string;
    icon?: React.ComponentType<{ className?: string }>;
}

export interface HeaderNavigationMobileSection {
    title: string;
    items: HeaderNavigationMobileItem[];
}

export interface HeaderNavigationMobileProps {
    sections: HeaderNavigationMobileSection[];
    logo?: {
        src: string;
        alt: string;
    };
    actions?: {
        primary?: {
            title: string;
            href: string;
        };
        secondary?: {
            title: string;
            href: string;
        };
    };
}

/* -------------------------------------------------------------------------- */
/*                     Type Interfaces for Hero Component                     */
/* -------------------------------------------------------------------------- */

interface TrustedByLogo {
    src: string;
    alt: string;
    width?: number;
    height?: number;
}

interface TrustedByText {
    text: string;
}

export interface HeroProps {
    title: React.ReactNode;
    description: string;
    showCards?: boolean;
    showTrustedBy?: boolean;
    showCTA?: boolean;
    ctaText?: string;
    ctaLink?: string;
    secondaryCTA?: {
        text: string;
        link: string;
    };
    cards?: {
        icon: LucideIcon;
        title: string;
        description: string;
    }[];
    badge?: {
        text: string;
        copyText?: string;
        variant?: 'success' | 'warning' | 'info' | 'magic';
    };
    trustedBy?: {
        title?: string;
        items: (TrustedByLogo | TrustedByText)[];
    };
}

/* -------------------------------------------------------------------------- */
/*                          Type Interfaces for Plans                         */
/* -------------------------------------------------------------------------- */

export interface Plan {
    title: string;
    price: number;
    category: string;
    // specs: {
    //   ram: string;
    //   cpu: string;
    //   disk?: string;
    //   backup?: string;
    //   port?: string;
    //   database?: string;
    //   storage?: string;
    // };
    features: string[];
    popular?: boolean; // optional property
    location?: string; // optional property
    href?: string;
}

/* -------------------------------------------------------------------------- */
/*                     Type Interfaces for Legal Policies                     */
/* -------------------------------------------------------------------------- */
export type LegalPolicy = {
    title: string;
    lastUpdated: string;
    content: string;
};
