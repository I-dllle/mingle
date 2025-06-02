export interface GoodsOrder {
  orderId: string;
  goods: {
    itemName: string;
    imgUrl?: string;
  };
  purAmount: number;
  orderedAt: string;
  purStatus: string;
  purDeliveryStatus: string;
}
