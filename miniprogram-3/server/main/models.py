from django.db import models


class Student(models.Model):
    stu_id = models.CharField(max_length=12, primary_key=True)
    stu_name = models.CharField(max_length=20)
    password = models.CharField(max_length=20)


class Manager(models.Model):
    manager_id = models.CharField(max_length=12, primary_key=True)
    manager_name = models.CharField(max_length=20)
    password = models.CharField(max_length=20)


class Setting(models.Model):
    max_reserve_span = models.DecimalField(max_digits=4, decimal_places=2, default=4.00)
    start_reserve_time = models.TimeField()
    end_reserve_time = models.TimeField()


class Building(models.Model):
    building_id = models.CharField(max_length=20, primary_key=True)
    building_desc = models.CharField(max_length=200, null=True)
    config_url = models.FileField(upload_to='media/configs/', null=True)
    latitude = models.DecimalField(max_digits=10, decimal_places=6)
    longitude = models.DecimalField(max_digits=10, decimal_places=6)
    is_open = models.BooleanField(default=False)


class Room(models.Model):
    room_id = models.CharField(max_length=20, primary_key=True)
    building_id = models.ForeignKey('Building', to_field='building_id', on_delete=models.CASCADE)
    room_desc = models.CharField(max_length=200, null=True)
    config_url = models.FileField(upload_to='media/configs/', null=True)
    is_open = models.BooleanField(default=False)
    capacity = models.DecimalField(max_digits=4, decimal_places=0, default=150)
    overnight = models.BooleanField(default=False)


class Seat(models.Model):
    seat_id = models.CharField(max_length=20, primary_key=True)
    room_id = models.ForeignKey('Room', to_field='room_id', on_delete=models.CASCADE)
    x_position = models.DecimalField(max_digits=10, decimal_places=6)
    y_position = models.DecimalField(max_digits=10, decimal_places=6)
    is_open = models.BooleanField(default=False)
    is_reserved = models.BooleanField(default=False)
    is_with_plug = models.BooleanField(default=False)


class Reservation(models.Model):
    rsv_id = models.AutoField(primary_key=True)
    stu_id = models.ForeignKey('Student', to_field='stu_id', on_delete=models.CASCADE)
    seat_id = models.ForeignKey('Seat', to_field='seat_id', on_delete=models.CASCADE)
    rsv_state = models.CharField(max_length=20, null=False)
    make_rsv_time = models.DateTimeField()
    start_rsv_time = models.DateTimeField()
    end_rsv_time = models.DateTimeField()
