import { router } from '@inertiajs/react';
import { ChevronDown } from 'lucide-react';
import React from 'react';

import { useTranslation } from '@/lib/i18n';

import unitedKingdomFlagUrl from '../../../../public/960px-Flag_of_the_United_Kingdom.svg.svg?url';
import vietnamFlagUrl from '../../../../public/Flag_of_Vietnam.svg?url';

interface LanguageOption {
    value: string;
    label: string;
    flag: string;
}

type LanguageSwitcherSurface = 'content' | 'glass';

interface LanguageSwitcherProps {
    surface?: LanguageSwitcherSurface;
}

export default function LanguageSwitcher({ surface = 'content' }: LanguageSwitcherProps) {
    const { locale } = useTranslation();

    const languageOptions: LanguageOption[] = React.useMemo(
        () => [
            { value: 'vi', label: 'Tiếng Việt', flag: vietnamFlagUrl },
            { value: 'en', label: 'English', flag: unitedKingdomFlagUrl },
        ],
        [],
    );

    const switchLanguage = (newLocale: string) => {
        if (newLocale && newLocale !== locale) {
            router.post(
                '/language',
                { locale: newLocale },
                {
                    preserveState: true,
                    preserveScroll: true,
                },
            );
        }
    };

    const activeOption = languageOptions.find((option) => option.value === locale) ?? languageOptions[0];

    return (
        <div className="sn-lang">
            <div className="sn-lang__control" data-surface={surface}>
                <span className="sn-lang__trigger">
                    <span className="sn-lang__value">
                        <img src={activeOption.flag} alt="" aria-hidden="true" className="sn-lang__flag" />
                        <span className="sn-lang__label">{activeOption.label}</span>
                    </span>
                    <ChevronDown aria-hidden="true" className="sn-lang__chevron" />
                </span>
                <select
                    value={activeOption.value}
                    onChange={(event) => switchLanguage(event.target.value)}
                    className="sn-lang__select"
                    aria-label="Chọn ngôn ngữ"
                >
                    {languageOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}
