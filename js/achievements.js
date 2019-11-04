export default {
    // find all the achievements the user has currently fulfilled
    discover(tests) {
        if (!tests) throw Error('Achievements.discover() requires tests[] as the first prop.');

        return this.achievements
            .filter((achievement) => achievement.isFulfilled.bind(this)(tests))
            .map((achievement) => achievement.label);
    },

    // find all the achievements the user has fulfilled other than the ones they already completed
    discoverNew(tests, currentAchievements) {
        if (!tests)
            throw Error('Achievements.discoverNew() requires tests[] as the first prop.');
        else if (!currentAchievements)
            throw Error('Achievements.discoverNew() requires achievements[] as the seconds prop.');

        return this.discover(tests)
            .filter((achievementLabel) => !currentAchievements.includes(achievementLabel));
    },

    // used to determine achievement fulfillments and display progress towards achievements
    helpers: {
        // the highest number of tests completed within the given timeframe
        testsWithinTimeFrame(tests, timeframeInHours) {
            const timeframeInMilliseconds = timeframeInHours * 60 * 1000;

            // sort from oldest to newest
            tests = [ ...tests ].sort((testA, testB) => testB.timestamp - testA.timestamp);

            // this gets flipped when any of the loops reaches the final test succesfully
            let reachedEndOfTests = false;

            // if this test gets reached in any of the loops, then it's the longest streak
            const mostRecentTest = tests[tests.length - 1];

            // track the highest streak of test within the timeframe
            let highestNumWithinTimeframe = 1;

            // create a slice of the tests array from each test to the end of the array
            tests.some((anchorTest, i) => {
                // create a slice from the current test to the end
                const slice = tests.slice(i + 1);

                // count how many tests were done within the timeframe relative to the anchorTest
                let numWithinTimeFrame = 1;
                slice.some((test) => {
                    if (test.timeframe - anchorTest.timeframe < timeframeInMilliseconds) {
                        // within time frame, increment the counter
                        numWithinTimeFrame++;
                        highestNumWithinTimeframe = Math.max(numWithinTimeFrame, highestNumWithinTimeframe);
                    } else {
                        // outside timeframe, leave the some() loop
                        return true;
                    }

                    // if the most recent test was reached, we've found the longest streak
                    if (test === mostRecentTest) {
                        reachedEndOfTests = true;
                        return true;
                    }
                });

                // leave the some() loop if one of the above loops reached the mostRecentTest
                return reachedEndOfTests;
            });

            return highestNumWithinTimeframe;
        },

        // the highest number of consecutive days tests were completed on
        numOfConsecutiveDaysWithCompletedTests(tests) {
            let previousDay = '';
            return tests.reduce((numOfDays, test) => {
                const date = new Date();
                const day = `${date.getDay()}/${date.getMonth()}/${date.getFullYear()}`;

                if (day !== previousDay) {
                    previousDay = day;
                    return numOfDays + 1;
                } else {
                    return numOfDays;
                }
            }, 0);
        },

        // the highest number of consecutive tests completed with 100% accuracy
        consecutivePerfectTests(tests) {
            // sort from oldest to newest
            tests = [ ...tests ].sort((testA, testB) => testB.timestamp - testA.timestamp);

            // track the highest streak of test within the timeframe
            let highestNumConsecutive = 1;

            // find the largest streak of perfect tests
            let counter = 0;
            tests.forEach((test) => {
                const testIsPerfect = test.accuracy === 100;
                counter += testIsPerfect;

                if (testIsPerfect) {
                    highestNumConsecutive = Math.max(counter, highestNumConsecutive);
                } else {
                    counter = 0;
                }
            });

            return highestNumConsecutive;
        },

        // the number of completed tests with 100% accuracy overall
        totalPerfectTests(tests) {
            return tests.reduce((acc, test) => {
                return acc + (test.accuracy === 100);
            }, 0);
        },
    },

    /* TODO: add an experience points value to each achievement */
    achievements: [
            // number of completed tests overall
        {
            label: 'Welcome!',
            description: 'Complete your first test.',
            isFulfilled: function(tests) {
                return tests.length >= 1;
            },
        },
        {
            label: 'Practice Makes Perfect',
            description: 'Complete 25 total tests.',
            isFulfilled: function(tests) {
                console.log(tests.length);
                return tests.length >= 25;
            },
        },
        {
            label: 'Addicted',
            description: 'Complete 100 total tests.',
            isFulfilled: function(tests) {
                return tests.length >= 100;
            },
        },

            // number of completed tests within 24 hours
        {
            label: 'Daily Dose',
            description: 'Complete 10 tests within 24 hours',
            isFulfilled: function(tests) {
                return this.helpers.testsWithinTimeFrame(tests, 24) >= 10;
            }
        },
        {
            label: 'Time To Kill',
            description: 'Complete 50 tests within 24 hours',
            isFulfilled: function(tests) {
                return this.helpers.testsWithinTimeFrame(tests, 24) >= 50;
            }
        },
        {
            label: 'More...MORE!',
            description: 'Complete 100 tests within 24 hours',
            isFulfilled: function(tests) {
                return this.helpers.testsWithinTimeFrame(tests, 24) >= 100;
            }
        },


            // number of completed tests on consecutive days
        {
            label: 'Back For More',
            description: 'Complete a test on two consecutive days.',
            isFulfilled: function(tests) {
                return this.helpers.numOfConsecutiveDaysWithCompletedTests(tests) >= 2;
            },
        },
        {
            label: 'I\'m A Regular',
            description: 'Complete a test on seven consecutive days.',
            isFulfilled: function(tests) {
                return this.helpers.numOfConsecutiveDaysWithCompletedTests(tests) >= 7;
            },
        },
        {
            label: 'Dedicated',
            description: 'Complete a test on 30 consecutive days.',
            isFulfilled: function(tests) {
                return this.helpers.numOfConsecutiveDaysWithCompletedTests(tests) >= 30;
            },
        },
        {
            label: 'Lifer',
            description: 'Complete a test on 180 consecutive days.',
            isFulfilled: function(tests) {
                return this.helpers.numOfConsecutiveDaysWithCompletedTests(tests) >= 180;
            },
        },
        {
            label: 'No-Lifer',
            description: 'Complete a test on 365 consecutive days.',
            isFulfilled: function(tests) {
                return this.helpers.numOfConsecutiveDaysWithCompletedTests(tests) >= 365;
            },
        },

            // number of completed test with 100% accuracy in a row
        {
            label: 'Attention To Detail',
            description: 'Complete three consecutive tests with 100% accuracy.',
            isFulfilled: function(tests) {
                return this.helpers.consecutivePerfectTests(tests) >= 3;
            },
        },
        {
            label: 'I\'m On A Roll',
            description: 'Complete 10 consecutive tests with 100% accuracy.',
            isFulfilled: function(tests) {
                return this.helpers.consecutivePerfectTests(tests) >= 10;
            },
        },
        {
            label: 'Sharpshooter',
            description: 'Complete 20 consecutive tests with 100% accuracy.',
            isFulfilled: function(tests) {
                return this.helpers.consecutivePerfectTests(tests) >= 10;
            },
        },
        {
            label: 'Aimbot',
            description: 'Complete 50 consecutive tests with 100% accuracy.',
            isFulfilled: function(tests) {
                return this.helpers.consecutivePerfectTests(tests) >= 50;
            },
        },

            // number of completed test with 100% accuracy overall
        {
            label: 'Perfect!',
            description: 'Complete a test with 100% accuracy.',
            isFulfilled: function(tests) {
                return this.helpers.totalPerfectTests(tests) >= 1;
            },
        },
        {
            label: 'Accuracy I',
            description: 'Complete 10 tests with 100% accuracy.',
            isFulfilled: function(tests) {
                return this.helpers.totalPerfectTests(tests) >= 10;
            },
        },
        {
            label: 'Accuracy II',
            description: 'Complete 50 tests with 100% accuracy.',
            isFulfilled: function(tests) {
                return this.helpers.totalPerfectTests(tests) >= 50;
            },
        },
        {
            label: 'Accuracy III',
            description: 'Complete 100 tests with 100% accuracy.',
            isFulfilled: function(tests) {
                return this.helpers.totalPerfectTests(tests) >= 100;
            },
        },
        {
            label: 'Accuracy IV',
            description: 'Complete 500 tests with 100% accuracy.',
            isFulfilled: function(tests) {
                return this.helpers.totalPerfectTests(tests) >= 500;
            },
        },
        {
            label: 'Accuracy V',
            description: 'Complete 1000 tests with 100% accuracy.',
            isFulfilled: function(tests) {
                return this.helpers.totalPerfectTests(tests) >= 1000;
            },
        },

            // word of mouth marketing
        {
            label: 'Check This Out!',
            description: 'Share the website on any social media platform.',
            isFulfilled: function(tests) {
                return false;
            },
        },
        {
            label: 'Team Player',
            description: 'Be credited as a referal during a sign up.',
            isFulfilled: function(tests) {
                return false;
            },
        },
        {
            label: 'Recruiter',
            description: 'Be credited as a referal during 10 sign ups.',
            isFulfilled: function(tests) {
                return false;
            },
        },
    ],
};