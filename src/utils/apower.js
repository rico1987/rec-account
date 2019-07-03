export function getMyAccountDomain(language) {
    return language === 'zh' ? 'https://myaccount.apowersoft.cn' : 'https://myaccount.apowersoft.com';
}

export function getApowersoftDomain(language) {
    const langDomainMappings = {
        pt: '.com.br',
        en: '.com',
        zh: '.cn',
        tr: '-tr.com',
        no: '-no.com',
        cs: '.cz',
        da: '.dk',
        ja: '.jp',
        sv: '.se',
        el: '.gr',
    };

    const otherDomains = 'fr de it nl es fi pl tw hu'.split(' ');	//ru id ar in

    if (!langDomainMappings[language] && !otherDomains.includes(language)) {
        language = 'en';
    }

    let dotcom = langDomainMappings[language] || '.' + language;

    return 'https://www.apowersoft' + dotcom 
}