import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import type { LibraryItem } from '../../api/library';
import {
  adminLibrarySchema,
  type AdminLibraryFormValues,
} from '../../schema/adminLibrary.schema';
import { useSaveLibraryItemMutation } from './mutations/useSaveLibraryItemMutation';

const emptyForm: AdminLibraryFormValues = {
  title: '',
  author: '',
  subject: '',
  curriculum: '',
  country: '',
  description: '',
  itemType: 'AUDIO',
  fileUrl: '',
  fileName: '',
};

function getDefaultValues(item?: LibraryItem): AdminLibraryFormValues {
  if (!item) return emptyForm;
  return {
    title: item.title,
    author: item.author ?? '',
    subject: item.subject ?? '',
    curriculum: item.curriculum ?? '',
    country: item.country ?? '',
    description: item.description ?? '',
    itemType: item.itemType,
    fileUrl: item.fileUrl,
    fileName: item.fileName,
  };
}

export function useAdminLibraryForm(
  item: LibraryItem | undefined,
  onClose: () => void,
) {
  const form = useForm<AdminLibraryFormValues>({
    resolver: zodResolver(adminLibrarySchema),
    defaultValues: getDefaultValues(item),
  });

  const mutation = useSaveLibraryItemMutation(item, onClose);

  return {
    ...form,
    mutation,
    onSubmit: form.handleSubmit((data) => mutation.mutate(data)),
  };
}
