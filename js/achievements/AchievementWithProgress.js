export default class AchievementWithProgress {
    constructor({ details, qualifier, progress, isFulfilled }) {
        this.details = details;
        this.qualifier = qualifier;
        this.progress = progress;
        this.isFulfilled = isFulfilled;
    }

    get progressLabel() {
        const progress = Math.min(this.qualifier, this.progress);

        return `${progress} / ${this.qualifier}`;
    }
}