class Report {
    static getBookingsForPeriod(bookings, startDate, endDate) {
        return bookings.filter(booking =>
            booking.status === "Завершено" &&
            booking.dateTime >= startDate &&
            booking.dateTime <= endDate
        );
    }

    static getTotalHours(bookings, startDate, endDate) {
        const completed = this.getBookingsForPeriod(
            bookings, startDate, endDate
        );

        const totalMinutes = completed.reduce((sum, booking) => {
            return sum + booking.rideDuration * booking.ridesCount;
        }, 0);

        return totalMinutes / 60;
    }

    static getAverageHours(bookings, startDate, endDate) {
        const completed = this.getBookingsForPeriod(
            bookings, startDate, endDate
        );

        if (completed.length === 0) {
            return 0;
        }

        return this.getTotalHours(
            bookings, startDate, endDate
        ) / completed.length;
    }

    static getRidersCount(bookings, startDate, endDate) {
        const completed = this.getBookingsForPeriod(
            bookings, startDate, endDate
        );

        return completed.reduce(
            (sum, booking) => sum + booking.participantsCount,
            0
        );
    }

    static getTrackOccupancy(bookings, startDate, endDate) {
        const completed = this.getBookingsForPeriod(
            bookings, startDate, endDate
        );

        return completed.map(booking => ({
            trackId: booking.trackId,
            kartId: booking.kartId,
            start: booking.dateTime,
            end: new Date(
                booking.dateTime.getTime() +
                booking.rideDuration *
                booking.ridesCount * 60000
            )
        }));
    }
}
