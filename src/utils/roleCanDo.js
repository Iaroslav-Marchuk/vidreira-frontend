export const roleCanDo = (rolesList, roleValue, action) => {
  const roleData = rolesList.find(r => r.value === roleValue);
  if (!roleData) return false;
  return roleData.permissions.includes(action);
};
