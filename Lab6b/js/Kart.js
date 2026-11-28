class Kart {
    constructor({
        id,
        type,
        trackId,
        isAvailable = true
    }) {
        this.id = id;
        this.type = type;
        this.trackId = trackId;
        this.isAvailable = isAvailable;
    }
}
