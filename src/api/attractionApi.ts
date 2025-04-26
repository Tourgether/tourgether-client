import axios from 'axios';

export interface AttractionSummary {
  id: number;
  name: string;
  address: string;
  summary: string;
  thumbnailImgUrl: string;
}

export const fetchAttractionsByKeyword = async (lang: number, keyword: string): Promise<AttractionSummary[]> => {
  const response = await axios.get('/api/v1/attractions', {
    params: { lang, keyword },
  });

  if (!response.data.success) {
    throw new Error(response.data.message || 'API 호출 실패');
  }

  return response.data.data;
};
