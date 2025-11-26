export interface HotItem {
  index: string;
  title: string;
  url: string;
  mobil_url: string;
  hot: string; // 有时为空字符串或热度数值
  update_v?: string;
  type?: string;
}

export interface PlatformData {
  name: string;
  subtitle?: string;
  update_time: string;
  data: HotItem[];
}

export interface ApiResponse {
  data: PlatformData[];
  code?: number;
  message?: string;
}

export enum LayoutMode {
    List = 'LIST',
    Grid = 'GRID'
}