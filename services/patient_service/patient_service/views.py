from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django.shortcuts import get_object_or_404
from .models import Patient, Appointment, MedicalRecord, HelpEntry
from .serializers import PatientSerializer, AppointmentSerializer, MedicalRecordSerializer, HelpEntrySerializer

# Patient Management
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser, JSONParser])
def patient_list_create(request):
    if request.method == 'GET':
        search = request.GET.get('search')
        qs = Patient.objects.all()
        if search:
            qs = qs.filter(patient_id__icontains=search) | qs.filter(full_name__icontains=search)
        serializer = PatientSerializer(qs, many=True)
        return Response({'patients': serializer.data})
    elif request.method == 'POST':
        serializer = PatientSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'patient': serializer.data}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser, JSONParser])
def patient_detail(request, id):
    patient = get_object_or_404(Patient, patient_id=id)
    if request.method == 'GET':
        serializer = PatientSerializer(patient)
        return Response({'patient': serializer.data})
    elif request.method == 'PUT':
        serializer = PatientSerializer(patient, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({'patient': serializer.data})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        patient.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

# Appointment Scheduling
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def appointment_list_create(request):
    if request.method == 'GET':
        patient_id = request.GET.get('patient_id')
        date = request.GET.get('date')
        qs = Appointment.objects.all()
        if patient_id:
            qs = qs.filter(patient__patient_id=patient_id)
        if date:
            qs = qs.filter(date__date=date)
        serializer = AppointmentSerializer(qs, many=True)
        return Response({'appointments': serializer.data})
    elif request.method == 'POST':
        serializer = AppointmentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'appointment': serializer.data}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def appointment_detail(request, id):
    appointment = get_object_or_404(Appointment, appointment_id=id)
    if request.method == 'GET':
        serializer = AppointmentSerializer(appointment)
        return Response({'appointment': serializer.data})
    elif request.method == 'PUT':
        serializer = AppointmentSerializer(appointment, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({'appointment': serializer.data})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        appointment.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

# Medical Records
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser, JSONParser])
def record_list_create(request):
    if request.method == 'GET':
        patient_id = request.GET.get('patient_id')
        date = request.GET.get('date')
        qs = MedicalRecord.objects.all()
        if patient_id:
            qs = qs.filter(patient__patient_id=patient_id)
        if date:
            qs = qs.filter(date__date=date)
        serializer = MedicalRecordSerializer(qs, many=True)
        return Response({'records': serializer.data})
    elif request.method == 'POST':
        serializer = MedicalRecordSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'record': serializer.data}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser, JSONParser])
def record_detail(request, id):
    record = get_object_or_404(MedicalRecord, record_id=id)
    if request.method == 'GET':
        serializer = MedicalRecordSerializer(record)
        return Response({'record': serializer.data})
    elif request.method == 'PUT':
        serializer = MedicalRecordSerializer(record, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({'record': serializer.data})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        record.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

# Help Center
@api_view(['GET'])
@permission_classes([AllowAny])
def help_center(request):
    entries = HelpEntry.objects.all()
    serializer = HelpEntrySerializer(entries, many=True)
    return Response({'help': serializer.data}) 