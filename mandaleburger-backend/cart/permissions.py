from rest_framework import permissions

class IsClientUser(permissions.BasePermission):
    """
    Permite acceso solo a usuarios en el grupo 'Client'.
    """
    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.groups.filter(name="Client").exists()
        )
