import { Plan } from '@/types';

export const appDevPlans: Plan[] = [
    {
        title: 'Basic Mobile App',
        price: 4999,
        category: 'App Development',
        // specs: {
        //     ram: 'N/A',
        //     cpu: 'N/A',
        //     storage: '500 MB',
        // },
        features: [
            'Simple UI',
            'Basic Features',
            'Single Platform (iOS or Android)',
        ],
        href: '/store/app-dev/basic',
    },
    {
        title: 'MVP Mobile App',
        price: 8999,
        category: 'App Development',
        // specs: {
        //     ram: 'N/A',
        //     cpu: 'N/A',
        //     storage: '1 GB',
        // },
        features: [
            'Cross-Platform (React Native)',
            'User Auth',
            'API Integration',
            'UI/UX Design',
        ],
        href: '/store/app-dev/mvp',
    },
    {
        title: 'Standard Mobile App',
        price: 14999,
        category: 'App Development',
        // specs: {
        //     ram: 'N/A',
        //     cpu: 'N/A',
        //     storage: '2 GB',
        //     backup: 'Weekly',
        // },
        features: [
            'Cross-Platform',
            'Push Notifications',
            'Social Media Integration',
            'In-App Purchases',
        ],
        href: '/store/app-dev/standard',
    },
    {
        title: 'Full-Stack App',
        price: 22999,
        category: 'App Development',
        // specs: {
        //     ram: 'N/A',
        //     cpu: 'N/A',
        //     storage: '5 GB',
        //     backup: 'Weekly',
        // },
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
        title: 'Enterprise App',
        price: 49999,
        category: 'App Development',
        // specs: {
        //     ram: 'N/A',
        //     cpu: 'N/A',
        //     storage: 'Unlimited',
        //     backup: 'Daily',
        // },
        features: [
            'Custom Architecture',
            'CI/CD Pipeline',
            'High Availability Setup',
            'End-to-End Security',
        ],
        href: '/store/app-dev/enterprise',
    },
    {
        title: 'Custom App Development',
        price: 0, // custom quote
        category: 'App Development',
        // specs: {
        //     ram: 'Custom',
        //     cpu: 'Custom',
        //     storage: 'Custom',
        //     backup: 'Custom',
        // },
        features: [
            'Tailored to Your Business Needs',
            'Flexible Technologies',
            'Dedicated Team',
            'Ongoing Support',
        ],
        href: '/contact/custom-app-dev',
    },
];
