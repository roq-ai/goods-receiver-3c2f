const mapping: Record<string, string> = {
  'goods-receipts': 'goods_receipt',
  organizations: 'organization',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
