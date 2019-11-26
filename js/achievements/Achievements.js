import achievementSets from './achievementSets';

export default class Achievements {

    // { profile: UserProfile, onAchievementCompleted: (achievement: Achievement) => void }
    constructor({ profile }) {
        // receive the logged in user's profile
        this.profile = profile;

        this.completedAchievements = [];

        // create the non-completed achievement list
        this.remainingAchievementSets = achievementSets;

        this.checkForCompletedAchievements(this.profile.tests);
    }

    removeAchievementFromSet(set, index) {
        set.names.splice(index, 1); 
        set.qualifiers.splice(index, 1);
        set.svgs.splice(index, 1);
    }

    // find all the achievements the user has fulfilled other than the ones they already completed
    checkForCompletedAchievements() {
        // find achievements that are now complete, log them and remove them from their sets
        const newlyCompletedAchievements = this.remainingAchievementSets
            .map((remainingAchievementSet) => {
                return remainingAchievementSet
                    .getAchievementsWithProgress(this.profile.tests)
                    .filter((achievementWithProgress) => achievementWithProgress.isFulfilled)
                    .map((achievementWithProgress) => {
                        const { details } = achievementWithProgress;
                        const removeIndex = remainingAchievementSet.names.indexOf(details.name);
                        this.removeAchievementFromSet(remainingAchievementSet, removeIndex);

                        return achievementWithProgress;
                    });
            })
            .flat(Infinity);

        // remove empty achievement sets if they have all been completed
        this.remainingAchievementSets
            .map((set, i) => set.names.length === 0 ? i : false)
            .filter((index) => index !== false)
            .reverse()
            .forEach((index) => this.remainingAchievementSets.splice(index, 1));
        
        newlyCompletedAchievements.forEach((achievement) => {
            // move the achievement from remaining to completed
            this.completedAchievements.push(achievement);
        });

        return newlyCompletedAchievements;
    }

    get incompleteAchievementsByProgress() {
        return this.remainingAchievementSets
            .map((achievementSet) => achievementSet.getAchievementsWithProgress(this.profile.tests))
            .flat(Infinity)
            .sort((achievementA, achievementB) => {
                const progressA = achievementA.progress / achievementA.qualifier;
                const progressB = achievementB.progress / achievementB.qualifier;

                return progressB - progressA;
            });
    }

    get allAchievements() {
        return [ ...this.incompleteAchievementsByProgress, ...this.completedAchievements ];
    }
}