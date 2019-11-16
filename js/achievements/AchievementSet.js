/*
    [names: string[]] relates to [qualifiers: number[]]
    [description: stirng] will be parsed to replace "{qualifier}" with [level: number]
    [isFulfilled: Function] will be passed TypingTestResults as first argument and [level: number] as second
*/

export default class AchievementSet {
    constructor({ names, description, getProgress, svgs, qualifiers }) {
        if (names === undefined)
            throw new Error('Achievement was created without [names: string[]].');
        else if (description === undefined)
            throw new Error('Achievement was created without [description: string].');
        else if (getProgress === undefined)
            throw new Error('Achievement was created without [getProgress: function].');
        else if (svgs === undefined)
            throw new Error('Achievement was created without [svgs: string[]].');
        else if (qualifiers === undefined)
            throw new Error('Achievement was created without [levels: number[]].');
            

        this.label = label;
        this.description = description;
        this.isFulfilled = isFulfilled;
        this.getProgress = getProgress;
        this.svg = svg;
        this.qualifier = qualifier;
    }

    get achievements() {
        return this.qualifiers
            .map((qualifier, i) => {
                return {
                    name: this.names[i],
                    description: this.description.replace('{qualifier}', qualifier),
                    svg: this.svgs[i],
                };
            });
    }

    getAchievementsWithProgress(tests) {
        const progress = this.getProgress(tests);

        this.achievements
            .map((achievementWithoutProgress, i) => {
                return {
                    ...achievementWithoutProgress,
                    qualifier: this.qualifiers[i],
                    progress: progress,
                    isFulfilled: progress >= quallifier,
                };
            });
    }
}