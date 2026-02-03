from rest_framework.permissions import BasePermission



class IsTeacher(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.role == 'teacher'
        )



class IsStudent(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.role == 'student'
        )



class IsPrincipalReadOnly(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.role == 'principal'
            and request.method in ('GET', 'HEAD', 'OPTIONS')
        )


class CanViewStudentList(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.role in ['teacher', 'student', 'principal']
        )
