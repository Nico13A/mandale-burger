from rest_framework import permissions

class IsInGroup(permissions.BasePermission):
    
    def has_permission(self, request, view):
        allowed_groups = getattr(view, 'allowed_groups', [])
        user_groups = list(request.user.groups.values_list('name', flat=True))

        # Superusuario sin grupo se trata como "sin acceso"
        if request.user.is_superuser and not user_groups:
            return False

        # Permite si hay intersección entre grupos del usuario y permitidos
        return bool(set(user_groups) & set(allowed_groups))
