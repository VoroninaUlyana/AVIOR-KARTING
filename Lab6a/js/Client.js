class Client {
    constructor({
        id,
        createdAt = new Date(),
        fullName,
        phone,
        vipStatusId = null
    }) {
        this.id = id;
        this.createdAt = createdAt;
        this.fullName = fullName;
        this.phone = phone;
        this.vipStatusId = vipStatusId;
    }
}
