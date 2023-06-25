import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
} from '@chakra-ui/react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { createGoodsReceipt } from 'apiSdk/goods-receipts';
import { Error } from 'components/error';
import { goodsReceiptValidationSchema } from 'validationSchema/goods-receipts';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { UserInterface } from 'interfaces/user';
import { OrganizationInterface } from 'interfaces/organization';
import { getUsers } from 'apiSdk/users';
import { getOrganizations } from 'apiSdk/organizations';
import { GoodsReceiptInterface } from 'interfaces/goods-receipt';

function GoodsReceiptCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: GoodsReceiptInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createGoodsReceipt(values);
      resetForm();
      router.push('/goods-receipts');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<GoodsReceiptInterface>({
    initialValues: {
      po_date: new Date(new Date().toDateString()),
      po_value: 0,
      po_number: 0,
      user_id: (router.query.user_id as string) ?? null,
      organization_id: (router.query.organization_id as string) ?? null,
    },
    validationSchema: goodsReceiptValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Create Goods Receipt
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="po_date" mb="4">
            <FormLabel>Po Date</FormLabel>
            <Box display="flex" maxWidth="100px" alignItems="center">
              <DatePicker
                dateFormat={'dd/MM/yyyy'}
                selected={formik.values?.po_date ? new Date(formik.values?.po_date) : null}
                onChange={(value: Date) => formik.setFieldValue('po_date', value)}
              />
              <Box zIndex={2}>
                <FiEdit3 />
              </Box>
            </Box>
          </FormControl>
          <FormControl id="po_value" mb="4" isInvalid={!!formik.errors?.po_value}>
            <FormLabel>Po Value</FormLabel>
            <NumberInput
              name="po_value"
              value={formik.values?.po_value}
              onChange={(valueString, valueNumber) =>
                formik.setFieldValue('po_value', Number.isNaN(valueNumber) ? 0 : valueNumber)
              }
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            {formik.errors.po_value && <FormErrorMessage>{formik.errors?.po_value}</FormErrorMessage>}
          </FormControl>
          <FormControl id="po_number" mb="4" isInvalid={!!formik.errors?.po_number}>
            <FormLabel>Po Number</FormLabel>
            <NumberInput
              name="po_number"
              value={formik.values?.po_number}
              onChange={(valueString, valueNumber) =>
                formik.setFieldValue('po_number', Number.isNaN(valueNumber) ? 0 : valueNumber)
              }
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            {formik.errors.po_number && <FormErrorMessage>{formik.errors?.po_number}</FormErrorMessage>}
          </FormControl>
          <AsyncSelect<UserInterface>
            formik={formik}
            name={'user_id'}
            label={'Select User'}
            placeholder={'Select User'}
            fetcher={getUsers}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.email}
              </option>
            )}
          />
          <AsyncSelect<OrganizationInterface>
            formik={formik}
            name={'organization_id'}
            label={'Select Organization'}
            placeholder={'Select Organization'}
            fetcher={getOrganizations}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.name}
              </option>
            )}
          />
          <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
            Submit
          </Button>
        </form>
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'goods_receipt',
  operation: AccessOperationEnum.CREATE,
})(GoodsReceiptCreatePage);
