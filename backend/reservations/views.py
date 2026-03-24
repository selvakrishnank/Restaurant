from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Reservation
from .serializers import ReservationSerializer


class ReservationCreateView(APIView):

    def post(self, request):
        serializer = ReservationSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "Reservation created successfully"},
                status=status.HTTP_201_CREATED
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


    def get(self, request):
        reservations = Reservation.objects.all().order_by('-created_at')
        serializer = ReservationSerializer(reservations, many=True)
        return Response(serializer.data)