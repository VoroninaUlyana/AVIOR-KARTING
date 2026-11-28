class Subscription {
    constructor({
        id,
        createdAt = new Date(),
        clientId,
        validityDays,
        ridesTotal,
        ridesRemaining,
        price,
        startDate,
        endDate
    }) {
        this.id = id;
        this.createdAt = createdAt;
        this.clientId = clientId;
        this.validityDays = validityDays;
        this.ridesTotal = ridesTotal;
        this.ridesRemaining = ridesRemaining;
        this.price = price;
        this.startDate = startDate;
        this.endDate = endDate;
    }
}