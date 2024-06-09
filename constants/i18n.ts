export const LANGUAGES = {
  en: {
    en: 'English',
    vi: 'Vietnamese',
    zh: 'Chinese',
    ko: 'Korean',
    ja: 'Japanese'
  },
  vi: {
    en: 'Tiếng Anh',
    vi: 'Tiếng Việt',
    zh: 'Tiếng Trung',
    ko: 'Tiếng Hàn',
    ja: 'Tiếng Nhật'
  },
  zh: {
    en: '英语',
    vi: '越南语',
    zh: '中文',
    ko: '韩语',
    ja: '日语'
  },
  ko: {
    en: '영어',
    vi: '베트남어',
    zh: '중국어',
    ko: '한국어',
    ja: '일본어'
  },
  ja: {
    en: '英語',
    vi: 'ベトナム語',
    zh: '中国語',
    ko: '韓国語',
    ja: '日本語'
  }
}

export const LOCALES = Object.keys(LANGUAGES)
export const DEFAULT_LOCALE = 'en'
