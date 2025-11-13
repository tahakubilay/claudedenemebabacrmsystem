from rest_framework import permissions

class IsAdminOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow administrators to edit objects.
    Read-only access is allowed for all authenticated users.
    """

    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return request.user and request.user.is_authenticated
        return request.user and request.user.is_staff

class IsOwnerOrAdmin(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object or administrators to edit it.
    """

    def has_object_permission(self, request, view, obj):
        if request.user and request.user.is_staff:
            return True
        return obj.created_by == request.user

class HasRolePermission(permissions.BasePermission):
    """
    Custom permission to check if the user's role has the required permission.
    Permissions are defined in the Role model's 'permissions' JSONField.
    """

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False

        required_permission = view.get_permission_required()

        if not required_permission:
            return True

        # Assuming user has a 'role' attribute which is a ForeignKey to the Role model
        if hasattr(request.user, 'role') and request.user.role:
            user_permissions = request.user.role.permissions
            if user_permissions and required_permission in user_permissions:
                return True
        
        return False

class IsCompanyAdminOrReadOnly(permissions.BasePermission):
    """
    Custom permission to allow only company administrators to edit company objects.
    Read-only access is allowed for all authenticated users.
    """
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return request.user and request.user.is_authenticated
        
        # Assuming 'obj' is a Company instance and 'request.user' has a 'company' attribute
        return request.user and request.user.is_staff and hasattr(request.user, 'company') and request.user.company == obj

class IsBrandAdminOrReadOnly(permissions.BasePermission):
    """
    Custom permission to allow only brand administrators to edit brand objects.
    Read-only access is allowed for all authenticated users.
    """
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return request.user and request.user.is_authenticated
        
        # Assuming 'obj' is a Brand instance and 'request.user' has a 'brand' attribute
        return request.user and request.user.is_staff and hasattr(request.user, 'brand') and request.user.brand == obj

class IsBranchAdminOrReadOnly(permissions.BasePermission):
    """
    Custom permission to allow only branch administrators to edit branch objects.
    Read-only access is allowed for all authenticated users.
    """
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return request.user and request.user.is_authenticated
        
        # Assuming 'obj' is a Branch instance and 'request.user' has a 'branch' attribute
        return request.user and request.user.is_staff and hasattr(request.user, 'branch') and request.user.branch == obj
