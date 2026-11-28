class Booking {
    constructor({
        id,
        createdAt = new Date(),
        author,
        clientId,
        trackId,
        kartId,
        dateTime,
        ridesCount,
        rideDuration,
        participantsCount,
        trainingType = "Без обучения",
        trainerId = null,
        status = "Ожидает подтверждения",
        price
    }) {
        this.id = id;
        this.createdAt = createdAt;
        this.author = author;
        this.clientId = clientId;
        this.trackId = trackId;
        this.kartId = kartId;
        this.dateTime = dateTime;
        this.ridesCount = ridesCount;
        this.rideDuration = rideDuration;
        this.participantsCount = participantsCount;
        this.trainingType = trainingType;
        this.trainerId = trainerId;
        this.status = status;
        this.price = price;
    }
}
