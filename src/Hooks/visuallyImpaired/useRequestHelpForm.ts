import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';
import {
  requestHelpSchema,
  type RequestHelpFormValues,
} from '../../schema/requestHelp.schema';
import { useCreateHelpRequestMutation } from './mutations/useCreateHelpRequestMutation';

export function useRequestHelpForm(onSuccess: () => void) {
  const form = useForm<RequestHelpFormValues>({
    resolver: zodResolver(requestHelpSchema),
    defaultValues: {
      requestType: 'PDF_TO_WORD',
      bookName: '',
      details: '',
      totalPages: '',
    },
  });
  const requestType = useWatch({
    control: form.control,
    name: 'requestType',
  });
  const isPdfRequest = requestType !== 'ACCOMPANIMENT';
  const mutation = useCreateHelpRequestMutation(() => {
    form.reset();
    onSuccess();
  });

  return {
    ...form,
    isPdfRequest,
    mutation,
    onSubmit: form.handleSubmit((values) =>
      mutation.mutate({
        data: {
          requestType: values.requestType,
          ...(isPdfRequest
            ? { bookName: values.bookName?.trim() }
            : {}),
          details: values.details.trim(),
          ...(isPdfRequest
            ? { totalPages: Number(values.totalPages) }
            : {}),
        },
        file: isPdfRequest ? values.pdfFile?.[0] : undefined,
      }),
    ),
  };
}
