import AchievementSet from "./AchievementSet";
import utils from './utils';

export default [

    // achievements based on number of completed tests
    new AchievementSet({
        names: [ 'Welcome!', 'Practice Makes Perfect', 'Addicted', 'MOAR', 'Carpal Tunnel' ],
        qualifiers: [ 1, 25, 100, 500, 1000 ],
        description: 'Complete {qualifier} total test(s).',
        svgs: [ 'welcome', 'practice-makes-perfect', 'addicted', 'moar', 'carpal-tunnel' ],
        getProgress(tests) {
            return tests.length;
        }
    }),

    // achievements based on number of completed tests within 24 hours
    new AchievementSet({
        names: [ 'Daily Dose', 'Time To Kill', 'Nothing Better To Do' ],
        qualifiers: [ 10, 50, 100 ],
        description: 'Complete {qualifier} tests within 24 hours.',
        svgs: [ 'welcome', 'practice-makes-perfect', 'addicted', 'moar', 'carpal-tunnel' ],
        getProgress(tests) {
            return utils.numOfTestsWithinTimeFrame(tests, 24);
        }
    }),

    // achievements based on number consecutive days with completed tests
    new AchievementSet({
        names: [ 'Back For More', 'I\'m A Regular', 'Dedicated', 'Lifer', 'Clack Life' ],
        qualifiers: [ 2, 7, 30, 180, 365 ],
        description: 'Complete a test on {qualifier} consecutive days.',
        svgs: [ 'back-for-more', 'im-a-regular', 'dedicated', 'lifer', 'clack-life' ],
        getProgress(tests) {
            return utils.numOfConsecutiveDaysWithCompletedTests(tests);
        }
    }),

    // achievements based on number consecutive perfect tests
    new AchievementSet({
        names: [ 'Beginner\'s Luck', 'On A Roll', 'Sharpshooter', 'Aimbot' ],
        qualifiers: [ 3, 10, 20, 50 ],
        description: 'Complete {qualifier} consecutive tests with 100% accuracy.',
        svgs: [ 'beginners-luck', 'on-a-roll', 'sharpshooter', 'aimbot' ],
        getProgress(tests) {
            return utils.consecutivePerfectTests(tests);
        }
    }),

    // achievements based on total number perfect tests
    new AchievementSet({
        names: [ 'Perfect', 'Accuracy I', 'Accuracy II', 'Accuracy III', 'Accuracy IV', 'Accuracy V' ],
        qualifiers: [ 1, 10, 50, 100, 500, 1000 ],
        description: 'Complete {qualifier} consecutive tests with 100% accuracy.',
        svgs: [ 'perfect', 'accuracy1', 'accuracy2', 'accuracy3', 'accuracy4' ,'accuracy5' ],
        getProgress(tests) {
            return tests.filter((test) => test.accuracy === 100).length;
        }
    }),

]