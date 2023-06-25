import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { goodsReceiptValidationSchema } from 'validationSchema/goods-receipts';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getGoodsReceipts();
    case 'POST':
      return createGoodsReceipt();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getGoodsReceipts() {
    const data = await prisma.goods_receipt
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'goods_receipt'));
    return res.status(200).json(data);
  }

  async function createGoodsReceipt() {
    await goodsReceiptValidationSchema.validate(req.body);
    const body = { ...req.body };

    const data = await prisma.goods_receipt.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
