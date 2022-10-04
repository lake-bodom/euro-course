export interface ICoursesXMLResponse {
  ValCurs: {
    Valute: ICourseValuteItem[];
  };
}

export interface ICourseJSONResp {
  Valute: {
    EUR: ICourseValuteItem
  };
}

export interface ICourseValuteItem {
  Nominal: number;
  CharCode: string;
  Name: string;
  Value: number | string;
}
