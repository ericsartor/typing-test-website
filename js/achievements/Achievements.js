import achievementSets from './achievementSets';

export default class Achievements {

    // { profile: UserProfile, onAchievementCompleted: (achievement: Achievement) => void }
    constructor(props) {
        // receive the logged in user's profile
        this.profile = props.profile;

        // this will get triggered when an achievement has been completed
        this.onAchievementCompleted = props.onAchievementCompleted;

        // get the achievements the logged in user has already completed
        this.completedAchievementNames = this.profile.achievements
            .map((achievement) => achievement.name);

        // create the non-completed achievement list
        this.remainingAchievementSets = achievementSets
            .map((achievementSet) => {
                achievementSet.names
                    .map(((name, i) => this.completedAchievements.includes(name) ? i : false))
                    .filter((index) => index !== false)
                    .reverse()
                    forEach((index) => this.removeAchievementFromSet(achievementSet, index));

                return achievementSet;
            });
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
                    .filter((achievement) => achievement.isFulfilled)
                    .map((achievement) => {
                        const set = remainingAchievementSet;
                        this.removeAchievementFromSet(set, set.names.indexOf(achievement.name));

                        return achievement;
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
            // this function should handle updating the user's profile on the server
            this.onAchievementCompleted(achievement);

            // move the achievement from remaining to completed
            this.completedAchievementNames.push(achievement);
        });

        return newlyCompletedAchievements;
    }
}