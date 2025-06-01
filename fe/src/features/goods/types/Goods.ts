export enum PaymentMethod {
  TOSS = "TOSS",
}

export interface Goods {
  id: number;
  itemName: string;
  imgUrl: string[]; // 여러 이미지
  description: string;
  itemPrice: number;
  isActive: boolean; // 판매중/품절
  createdBy?: {
    id: number;
    nickname: string;
    email: string;
  };
}
