from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .models import Reservation
from .serializers import ReservationSerializer
from tables.models import Table  


class ReservationCreateView(APIView):

    def post(self, request):

        serializer = ReservationSerializer(data=request.data)

        if serializer.is_valid():

            reservation = serializer.save()

            table_id = request.data.get("table")

            if table_id:
                try:
                    table = Table.objects.get(id=table_id)
                    table.status = "reserved"
                    table.save()
                except Table.DoesNotExist:
                    pass

            return Response(
                {"message": "Reservation created successfully"},
                status=status.HTTP_201_CREATED
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):

        reservations = Reservation.objects.all().order_by('-created_at')
        serializer = ReservationSerializer(reservations, many=True)

        return Response(serializer.data)
    

class ReservedTablesListView(APIView):

    def get(self, request):
        reservations = Reservation.objects.select_related("table").all().order_by("-created_at")

        data = [
            {
                "id": r.id,
                "name": r.full_name,
                "phone": r.phone_number,
                "date": r.date,
                "time": r.time,
                "table": r.table.name if r.table else None,
                "table_id": r.table.id if r.table else None
            }
            for r in reservations
        ]

        return Response(data)


class CancelReservationView(APIView):

    def delete(self, request, reservation_id):

        try:
            reservation = Reservation.objects.get(id=reservation_id)
        except Reservation.DoesNotExist:
            return Response({"error": "Not found"}, status=404)

        if reservation.table:
            table = reservation.table
            table.status = "available"
            table.save()

        reservation.delete()

        return Response({"message": "Reservation cancelled"})    