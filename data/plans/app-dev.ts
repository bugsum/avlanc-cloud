import { Plan } from '@/types';

export const appDevPlans: Plan[] = [
    {
        id: 'app-dev-basic',
        title: 'Basic Mobile App',
        price: 4999,
        category: 'App Development',
        description: 'A basic mobile app with essential features',
        features: [
            'Simple UI',
            'Basic Features',
            'Single Platform (iOS or Android)',
        ],
        href: '/store/app-dev/basic',
    },
    {
        id: 'app-dev-mvp',
        title: 'MVP Mobile App',
        price: 8999,
        category: 'App Development',
        description: 'A minimum viable product mobile app with essential features',
        features: [
            'Cross-Platform (React Native)',
            'User Auth',
            'API Integration',
            'UI/UX Design',
        ],
        href: '/store/app-dev/mvp',
    },
    {
        id: 'app-dev-standard',
        title: 'Standard Mobile App',
        price: 14999,
        category: 'App Development',
        description: 'A standard mobile app with advanced features',
        features: [
            'Cross-Platform',
            'Push Notifications',
            'Social Media Integration',
            'In-App Purchases',
        ],
        href: '/store/app-dev/standard',
    },
    {
        id: 'app-dev-fullstack',
        title: 'Full-Stack App',
        price: 22999,
        category: 'App Development',
        description: 'A comprehensive full-stack mobile app solution',
        features: [
            'iOS & Android',
            'Admin Dashboard',
            'Cloud Sync',
            'Push Notifications',
        ],
        popular: true,
        href: '/store/app-dev/fullstack',
    },
    {
        id: 'app-dev-enterprise',
        title: 'Enterprise App',
        price: 49999,
        category: 'App Development',
        description: 'Enterprise-grade mobile application solution',
        features: [
            'Custom Architecture',
            'CI/CD Pipeline',
            'High Availability Setup',
            'End-to-End Security',
        ],
        href: '/store/app-dev/enterprise',
    },
    // {
    //     title: 'Custom App Development',
    //     price: 0, // custom quote
    //     category: 'App Development',
    //     // specs: {
    //     //     ram: 'Custom',
    //     //     cpu: 'Custom',
    //     //     storage: 'Custom',
    //     //     backup: 'Custom',
    //     // },
    //     features: [
    //         'Tailored to Your Business Needs',
    //         'Flexible Technologies',
    //         'Dedicated Team',
    //         'Ongoing Support',
    //     ],
    //     href: '/contact/custom-app-dev',
    // },
];
