import axios from 'axios';
import queryString from 'query-string';
import { GoodsReceiptInterface, GoodsReceiptGetQueryInterface } from 'interfaces/goods-receipt';
import { GetQueryInterface } from '../../interfaces';

export const getGoodsReceipts = async (query?: GoodsReceiptGetQueryInterface) => {
  const response = await axios.get(`/api/goods-receipts${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createGoodsReceipt = async (goodsReceipt: GoodsReceiptInterface) => {
  const response = await axios.post('/api/goods-receipts', goodsReceipt);
  return response.data;
};

export const updateGoodsReceiptById = async (id: string, goodsReceipt: GoodsReceiptInterface) => {
  const response = await axios.put(`/api/goods-receipts/${id}`, goodsReceipt);
  return response.data;
};

export const getGoodsReceiptById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/goods-receipts/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteGoodsReceiptById = async (id: string) => {
  const response = await axios.delete(`/api/goods-receipts/${id}`);
  return response.data;
};
