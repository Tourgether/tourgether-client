export function getLanguageId(): number {
  const id = localStorage.getItem("languageId");
  return id ? Number(id) : 1;
}

export function getNaverMapLanguageCode(): 'ko' | 'en' | 'ja' | 'zh' {
  const id = Number(localStorage.getItem("languageId"));
  switch (id) {
    case 1: return 'ko';
    case 2: return 'en';
    case 3: return 'ja';
    case 4: return 'zh';
    default: return 'en';
  }
}