from django.http import JsonResponse
from django.db import connection


def reset_student_sequence(request):
    with connection.cursor() as cursor:
        cursor.execute("""
            SELECT setval(
                pg_get_serial_sequence('students', 'id'),
                COALESCE((SELECT MAX(id) FROM students), 1),
                true
            );
        """)

    return JsonResponse({"status": "student sequence reset"})