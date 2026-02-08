export function useUpdateProfileField(
  field: 'displayName' | 'timezone'
) {
  return {
    update: async (value: string) => { /* PATCH */ },
    isSaving: boolean
  };
}
