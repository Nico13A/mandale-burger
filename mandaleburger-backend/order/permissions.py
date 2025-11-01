from rest_framework import permissions

class IsClientUser(permissions.BasePermission):
    """Permite acceso solo a usuarios del grupo 'Client'"""
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.groups.filter(name="Client").exists()

class IsCookUser(permissions.BasePermission):
    """Permite acceso solo a usuarios del grupo 'Cook'"""
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.groups.filter(name="Cook").exists()

class IsAppAdminUser(permissions.BasePermission):
    """Permite acceso solo a usuarios del grupo 'AppAdmin'"""
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.groups.filter(name="AppAdmin").exists()