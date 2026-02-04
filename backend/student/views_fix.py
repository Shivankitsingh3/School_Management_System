from django.http import JsonResponse
from django.db import connection


def reset_student_sequence(request):
    with connection.cursor() as cursor:
        # find real sequence name
        cursor.execute("""
            SELECT pg_get_serial_sequence('students', 'id');
        """)
        seq = cursor.fetchone()[0]

        # reset it to max(id)
        cursor.execute(f"""
            SELECT setval(
                '{seq}',
                COALESCE((SELECT MAX(id) FROM students), 1),
                true
            );
        """)

    return JsonResponse({"status": "reset done", "sequence": seq})