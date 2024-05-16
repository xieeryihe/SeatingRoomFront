import os
import shutil

import math
import time

import pytz
import datetime as date
from datetime import datetime
from time import *

from django.contrib import messages
from django.shortcuts import render, redirect, reverse
from django.db.models import Sum, Count, Max, Min, Avg

from spm_pj.settings import BASE_DIR
from .models import *


def distance(x1, y1, x2, y2):
    return math.sqrt((float(x2) - float(x1)) ** 2 + (float(y2) - float(y1)) ** 2)


def date_time_to_str(date_time):
    return (str(date_time).split('+'))[0][:-3]


def query_set_to_dict(query_set, key, value):
    if len(query_set) == 0:
        return {}
    return {query_set[i][key]: query_set[i][value] for i in range(len(query_set))}


def log_in(request):
    if request.method == 'GET':
        return render(request, 'log_in.html')

    stu_id = request.POST.get("stu_id")
    password = request.POST.get("password")
    if Student.objects.filter(stu_id=stu_id).exists():
        student = Student.objects.filter(stu_id=stu_id)[0]
        if student.password != password:
            messages.success(request, "密码错误！")
            return render(request, 'log_in.html')
        return redirect(reverse(stu_index, kwargs={'stu_id': stu_id}), content={"student": student})
    else:
        messages.success(request, "账号错误！")
        return render(request, 'log_in.html')


def stu_index(request, stu_id):

    student = Student.objects.filter(stu_id=stu_id)[0]

    b_list = Building.objects.\
        values_list('building_id', 'is_open', 'latitude', 'longitude', 'config_url', 'building_desc')
    c_list = Room.objects.values('building_id_id').annotate(capacity=Sum('capacity'))
    r_list = Reservation.objects.filter(rsv_state__in=['已预约', '待签到', '已签到', ]).\
        values('seat_id__room_id__building_id_id').annotate(reserved=Count('rsv_id'))

    c_dict = query_set_to_dict(c_list, key='building_id_id', value='capacity')
    r_dict = query_set_to_dict(r_list, key='seat_id__room_id__building_id_id', value='reserved')
    assert len(b_list) == len(c_list)

    buildings = []
    for building in b_list:
        buildings.append((building[0], building[1], building[4], building[5],
                          distance(building[2], building[3], 31.303875, 121.51813),
                          int(c_dict[building[0]]), int(r_dict[building[0]]) if building[0] in r_dict else 0))
    buildings.sort(key=lambda building: building[3], reverse=True)

    return render(request, 'stu_index.html', context={"student": student, "buildings": buildings})


def stu_building(request, stu_id, building_id):

    student = Student.objects.filter(stu_id=stu_id)[0]
    building = Building.objects.filter(building_id=building_id)[0]

    c_list = Room.objects.filter(building_id=building_id).\
        values_list('room_id', 'is_open', 'capacity', 'config_url', 'room_desc', 'overnight')
    r_list = Reservation.objects.filter(seat_id__room_id__building_id_id=building_id,
                                        rsv_state__in=['已预约', '待签到', '已签到', ]). \
        values('seat_id__room_id_id').annotate(reserved=Count('rsv_id'))

    r_dict = query_set_to_dict(r_list, key='seat_id__room_id_id', value='reserved')

    rooms = []
    for room in c_list:
        rooms.append((room[0], room[1], room[3], room[4], room[5],
                      int(room[2]), int(r_dict[room[0]]) if room[0] in r_dict else 0))
    rooms.sort(key=lambda room: room[0])

    return render(request, 'stu_building.html', context={"student": student, "building": building, "rooms": rooms})


def stu_room(request, stu_id, room_id):

    student = Student.objects.filter(stu_id=stu_id)[0]

    if request.method == 'GET':
        room = Room.objects.filter(room_id=room_id)[0]
        s_list = Seat.objects.filter(room_id=room_id).\
            values_list('seat_id', 'x_position', 'y_position', 'is_open', 'is_reserved', 'is_with_plug')

        seats = []
        for seat in s_list:
            seats.append((seat[0], float(seat[1]), float(seat[2]), seat[3], seat[4], seat[5]))

        return render(request, 'stu_room.html', context={"student": student, "room": room, "seats": seats})

    if request.method == 'POST':
        seat_id = request.POST.get('seat_id')
        make_rsv_time = str(datetime.now())
        make_rsv_time = datetime.strptime(make_rsv_time[:-10], '%Y-%m-%d %H:%M')
        reservation = Reservation(seat_id_id=seat_id, stu_id_id=stu_id, rsv_state='已预约', make_rsv_time=make_rsv_time,
                                  start_rsv_time=make_rsv_time, end_rsv_time=make_rsv_time)
        # todo: change make_rsv_time and end_rsv_time
        reservation.save()
        request.method = 'GET'
        messages.success(request, "座位预约成功！")
        return redirect(reverse(stu_index, kwargs={'stu_id': stu_id}), content={"student": student})


def stu_record(request, stu_id):
    student = Student.objects.filter(stu_id=stu_id)[0]

    if request.method == 'GET':
        r_list = Reservation.objects.filter(stu_id_id=stu_id).\
            values_list('rsv_id', 'seat_id_id', 'rsv_state', 'make_rsv_time', 'start_rsv_time', 'end_rsv_time')

        reservations = []
        for item in r_list:
            reservations.append((item[0], item[1], item[2], date_time_to_str(item[3]),
                                 date_time_to_str(item[4]), date_time_to_str(item[5])))

        return render(request, 'stu_record.html', context={"student": student, "reservations": reservations})

    if request.method == 'POST':
        rsv_id = request.POST.get('rsv_id')
        Reservation.objects.filter(rsv_id=rsv_id).update(rsv_state='已取消')
        request.method = 'GET'
        messages.warning(request, "预约取消成功！")
        return redirect(reverse(stu_record, kwargs={'stu_id': stu_id}))


def mng_index(request, manager_id):
    pass


def mng_building(request, manager_id, building_id):
    pass


def mng_room(request, manager_id, room_id):
    pass
