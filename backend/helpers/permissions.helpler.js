const normailzePermissions = (permArray) => {
    const unique = new Map();
    permArray.forEach(perm => {
        if(!perm) return;
        const name = perm.name instanceof Map ? Object.fromEntries(perm.name): perm.name;
        const description = perm.description instanceof Map ? Object.fromEntries(perm.description): perm.description;
        unique.set(perm.key, {
            _iid: perm._id,
            key: perm.key,
            name,
            description
        });
    });
    return [...unique.values()];
};

export const getUserPermissions = (user) => {
    if(!user) return [];
    const rolesPerms = user.roles?.flatMap(role => role.permissions || []) || [];
    const extraPerms = user.extraPermission || [];
    const normalized = normailzePermissions([...rolesPerms, ...extraPerms]);
    return normalized;
};

export const getPermissionScopeList = (user) => {
    const perms = getUserPermissions(user);
    return perms.map(p => p.key);
};

export const userHasPermission = (user, permissionKey) => {
    const perms = getUserPermissions(user);
    return perms.some(p => p.key === permissionKey);
};