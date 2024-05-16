# from ..models import *
#
#
# class StuService:
#
#     @staticmethod
#     def check_password(stu_id, password):
#         if Student.objects.filter(stu_id=stu_id).exists():
#             student = Student.objects.filter(stu_id=stu_id)[0]
#             if student.password != password:
#                 return "password wrong"
#             else:
#                 return "password right"
#         else:
#             return "student not exist"
#
#     @staticmethod
#     def query_rsv_records(stu_id, password):
#         if Student.objects.filter(stu_id=stu_id).exists():
#             student = Student.objects.filter(stu_id=stu_id)[0]
#             if student.password != password:
#                 return "password wrong"
#             else:
#                 return "password right"
#         else:
#             return "student not exist"
