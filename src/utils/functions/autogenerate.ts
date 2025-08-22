import { dummy } from '@/constants/strings';

const autogenerate = (): string => {
    return new Array(Math.floor(1 + Math.random() * 10))
        .fill(() => '')
        .map(
            () =>
                dummy.split(' ')[
                    Math.floor(Math.random() * dummy.split(' ').length)
                ]
        )
        .join(' ');
};

export { autogenerate };
