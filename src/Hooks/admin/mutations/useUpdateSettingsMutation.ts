import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  settingsApi,
  type UpdateSettingsDto,
} from '../../../api/settings';
import { ADMIN_QUERY_KEYS } from '../../../constants/admin.constants';

export function useUpdateSettingsMutation(onSuccess?: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: UpdateSettingsDto) => settingsApi.update(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.settings });
      onSuccess?.();
    },
  });
}
