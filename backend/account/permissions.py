from rest_framework.permissions import BasePermission


class IsAuthenticatedWithRole(BasePermission):
    allowed_roles = []

    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.role in self.allowed_roles
        )


class IsStudent(IsAuthenticatedWithRole):
    allowed_roles = ['student']


class IsTeacher(IsAuthenticatedWithRole):
    allowed_roles = ['teacher']


class IsPrincipal(IsAuthenticatedWithRole):
    allowed_roles = ['principal']


class IsOwnStudentProfile(BasePermission):
    def has_object_permission(self, request, view, obj):
        return (
            request.user.is_authenticated
            and hasattr(request.user, 'student_profile')
            and obj.user == request.user
        )


class IsOwnTeacherProfile(BasePermission):
    def has_object_permission(self, request, view, obj):
        return (
            request.user.is_authenticated
            and hasattr(request.user, 'teacher_profile')
            and obj.user == request.user
        )


class IsOwnPrincipalProfile(BasePermission):
    def has_object_permission(self, request, view, obj):
        return (
            request.user.is_authenticated
            and hasattr(request.user, 'principal_profile')
            and obj.user == request.user
        )


class IsTeacherOrPrincipal(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.role in ['teacher', 'principal']
        )
