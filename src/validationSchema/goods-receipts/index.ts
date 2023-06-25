import * as yup from 'yup';

export const goodsReceiptValidationSchema = yup.object().shape({
  po_date: yup.date().required(),
  po_value: yup.number().integer().required(),
  po_number: yup.number().integer().required(),
  user_id: yup.string().nullable(),
  organization_id: yup.string().nullable(),
});
