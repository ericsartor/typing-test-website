export default class AchievementWithProgress {
    constructor({ achievement, qualifier, progress, isFulfilled }) {
        this.achievement = achievement;
        this.qualifier = qualifier;
        this.progress = progress;
        this.isFulfilled = isFulfilled;
    }

    get progressLabel() {
        const progress = Math.min(this.qualifier, this.progress);

        return `${progress} / ${this.qualifier}`;
    }
}