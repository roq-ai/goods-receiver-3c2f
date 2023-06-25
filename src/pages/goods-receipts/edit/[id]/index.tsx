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
  Center,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useFormik, FormikHelpers } from 'formik';
import { getGoodsReceiptById, updateGoodsReceiptById } from 'apiSdk/goods-receipts';
import { Error } from 'components/error';
import { goodsReceiptValidationSchema } from 'validationSchema/goods-receipts';
import { GoodsReceiptInterface } from 'interfaces/goods-receipt';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { UserInterface } from 'interfaces/user';
import { OrganizationInterface } from 'interfaces/organization';
import { getUsers } from 'apiSdk/users';
import { getOrganizations } from 'apiSdk/organizations';

function GoodsReceiptEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<GoodsReceiptInterface>(
    () => (id ? `/goods-receipts/${id}` : null),
    () => getGoodsReceiptById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: GoodsReceiptInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateGoodsReceiptById(id, values);
      mutate(updated);
      resetForm();
      router.push('/goods-receipts');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<GoodsReceiptInterface>({
    initialValues: data,
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
            Edit Goods Receipt
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {formError && (
          <Box mb={4}>
            <Error error={formError} />
          </Box>
        )}
        {isLoading || (!formik.values && !error) ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
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
        )}
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'goods_receipt',
  operation: AccessOperationEnum.UPDATE,
})(GoodsReceiptEditPage);
