import React from 'react'

const BookingCardOwner = ({ booking }) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="grid md:grid-cols-4 gap-6 items-center">
          <Info label="Guest Name" value={booking.guestName} />
          <Info label="Hotel" value={booking.hotelName} />

          <Info
            label="Dates"
            value={`${format(booking.checkIn)} - ${format(booking.checkOut)}`}
          />

          <StatusBadge status={booking.status} />
        </div>

        <div className="mt-4 pt-4 border-t flex gap-2 items-center">
          {booking.status === "pending" ? (
            <>
              <Button size="sm" className="flex-1">
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Confirm
              </Button>

              <Button size="sm" variant="outline" className="flex-1">
                <XCircle className="h-4 w-4 mr-2" />
                Reject
              </Button>
            </>
          ) : (
            <p className="text-sm text-green-600 font-medium">
              ✓ Confirmed
            </p>
          )}

          <Button variant="ghost" size="sm" className="ml-auto">
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default BookingCardOwner