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



class IsAssignmentOwner(BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.teacher.user == request.user



class IsSubmissionOwner(BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.student.user == request.user



class IsPrincipalReadOnly(BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        
        if request.user.role != 'principal':
            return False
        
        return request.method in ('GET', 'HEAD', 'OPTIONS')