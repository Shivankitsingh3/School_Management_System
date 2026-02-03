import os
import google.genai as genai
from django.conf import settings
import mimetypes
import requests
import base64


client = genai.Client(api_key=settings.GEMINI_API_KEY)


def get_submission_feedback(assignment_title, assignment_desc, student_answer, assignment_max_marks=100, file_path=None):
    """
    Generate AI feedback for student submissions using Gemini API.
    
    Args:
        assignment_title (str): Title of the assignment
        assignment_desc (str): Assignment requirements/criteria
        student_answer (str): Student's text answer (optional)
        assignment_max_marks (int): Maximum marks for the assignment (default: 100)
        file_path (str): Path to student's uploaded file (optional)
    
    Returns:
        str: AI-generated feedback with score, issues, and suggestions
    """

    prompt = f"""
You are an expert teacher evaluating student work across multiple subjects.
**Assignment Details:**
- Title: {assignment_title}
- Requirements/Criteria: {assignment_desc}
- Max Marks: {assignment_max_marks}

**Student's Work:**
"""

    if student_answer and student_answer.strip():
        prompt += f"\n**Text Answer:**\n{student_answer}\n"

    content_parts = [prompt]

    if file_path:
        try:
            is_url = file_path.startswith('http')
            filename = os.path.basename(file_path).split('?')[0]
            mime_type, _ = mimetypes.guess_type(filename)
            ext = os.path.splitext(filename)[1].lower()

            file_data = None
            if is_url:
                response = requests.get(file_path)
                if response.status_code == 200:
                    file_data = response.content
            else:
                if os.path.exists(file_path):
                    with open(file_path, 'rb') as f:
                        file_data = f.read()

            if file_data:
                text_extensions = ('.py', '.java', '.cpp',
                                   '.c', '.js', '.html', '.css', '.txt', '.md')

                # TEXT FILES (code, markdown, plain text)
                if (mime_type and mime_type.startswith('text/')) or filename.endswith(text_extensions):
                    decoded_text = file_data.decode('utf-8', errors='ignore')
                    prompt += f"\n**Uploaded File Content ({ext}):**\n```\n{decoded_text}\n```\n"
                    content_parts = [prompt]

                # IMAGES
                elif mime_type and mime_type.startswith('image/'):
                    prompt += f"\n**[Image file attached: {filename}]**\n"

                    encoded_image = base64.standard_b64encode(
                        file_data).decode('utf-8')

                    content_parts = [
                        prompt,
                        {
                            "inline_data": {
                                "mime_type": mime_type,
                                "data": encoded_image
                            }
                        }
                    ]

                # PDF & DOCS (PDF, Word documents)
                elif ext in ['.pdf', '.doc', '.docx'] or (mime_type and mime_type in ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']):
                    prompt += f"\n**[Document attached: {filename}]**\n"

                    # Encode PDF/Doc as base64
                    encoded_file = base64.standard_b64encode(
                        file_data).decode('utf-8')

                    # Determine correct MIME type
                    if ext == '.pdf':
                        file_mime = "application/pdf"
                    elif ext in ['.doc', '.docx']:
                        file_mime = mime_type or "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    else:
                        file_mime = mime_type or "application/octet-stream"

                    content_parts = [
                        prompt,
                        {
                            "inline_data": {
                                "mime_type": file_mime,
                                "data": encoded_file
                            }
                        }
                    ]

                else:
                    prompt += f"\n**[File uploaded: {filename}] (Format: {ext} - Limited analysis possible)**\n"
                    content_parts = [prompt]

        except Exception as e:
            prompt += f"\n**[Error processing file: {str(e)}]**\n"
            content_parts = [prompt]

    # Evaluation prompt with dynamic max marks
    evaluation_prompt = f"""
**Your Task:**
1. Evaluate work against the assignment criteria.
2. For code: check logic, bugs, efficiency, and suggest improvements.
3. For text: check accuracy, grammar, structure, and depth of understanding.
4. For documents/PDFs: summarize key points and evaluate relevance and quality.
5. For images: analyze content and evaluate against assignment requirements.

**Response Format (STRICTLY FOLLOW):**
Feedback: [2-3 specific sentences about the submission]
Score: [Suggested score out of {assignment_max_marks}]
Issues: [List specific issues found, or "None" if submission is good]
Suggestions: [1-2 specific actionable points for improvement]
"""

    # Append evaluation prompt to first content part
    if isinstance(content_parts[0], str):
        content_parts[0] += evaluation_prompt
    else:
        content_parts[0] = content_parts[0] + evaluation_prompt

    try:
        # Generate content using Gemini API
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=content_parts
        )
        return response.text

    except Exception as e:
        return f"AI Feedback unavailable: {str(e)}"
