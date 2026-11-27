class Payment {
    constructor({
        id,
        amount,
        paymentMethod,
        paymentDate,
        paymentStatus,
        targetType,
        targetId
    }) {
        this.id = id;
        this.amount = amount;
        this.paymentMethod = paymentMethod;
        this.paymentDate = paymentDate;
        this.paymentStatus = paymentStatus;
        this.targetType = targetType;
        this.targetId = targetId;
    }
}
