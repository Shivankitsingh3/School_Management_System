from django.urls import path
from attendance.views import (
    AttendanceCreateView,
    StudentAttendanceListView,
    AttendanceListView,
)

from attendance.views import (
    TeacherDailyAttendanceReportView,
    TeacherStudentAttendancePercentageView,
    StudentAttendanceSummaryView,
    PrincipalDailyAttendanceReportView,
    PrincipalStudentAttendancePercentageView
)


urlpatterns = [
    path(
        "mark/", AttendanceCreateView.as_view(),
        name="attendance-mark",
    ),
    path(
        "my/", StudentAttendanceListView.as_view(), name="student-attendance-list",
    ),
    path(
        "all/", AttendanceListView.as_view(),
        name="attendance-list",
    ),
    path(
        "reports/teacher/daily/", TeacherDailyAttendanceReportView.as_view(), name="teacher-daily-attendance-report",
    ),
    path(
        "reports/teacher/percentage/", TeacherStudentAttendancePercentageView.as_view(), name="teacher-student-attendance-percentage",
    ),
    path(
        "reports/student/summary/", StudentAttendanceSummaryView.as_view(), name="student-attendance-summary",
    ),
    path(
        "reports/principal/daily/", PrincipalDailyAttendanceReportView.as_view(), name="principal-daily-attendance-report",
    ),
    path('principal/student-percentages/', PrincipalStudentAttendancePercentageView.as_view(), name='principal-student-percentages'),
]
