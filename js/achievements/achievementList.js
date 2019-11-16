/* TODO: add an experience points value to each achievement */




// the highest number of consecutive days tests were completed on
function numOfConsecutiveDaysWithCompletedTests(tests) {
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
}

// the highest number of consecutive tests completed with 100% accuracy
function consecutivePerfectTests(tests) {
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
}

// the number of completed tests with 100% accuracy overall
function totalPerfectTests(tests) {
    return tests.reduce((acc, test) => {
        return acc + (test.accuracy === 100);
    }, 0);
}

export default [
    // number of completed tests overall
    {
        name: 'Welcome!',
        description: 'Complete your first test.',
        isFulfilled: (tests) => {
            return tests.length >= 1;
        },
        getProgress: (tests) => {
            const progress = Math.min(tests.length, 1);

            return {
                percent: (progress / 1) * 100,
                label: `${progress} / 1`,
            }
        },
    },
    {
        name: 'Practice Makes Perfect',
        description: 'Complete 25 total tests.',
        isFulfilled: (tests) => {
            return tests.length >= 25;
        },
        getProgress: (tests) => {
            const progress = Math.min(tests.length, 25);

            return {
                percent: (progress / 25) * 100,
                label: `${progress} / 25`,
            }
        },
    },
    {
        name: 'Addicted',
        description: 'Complete 100 total tests.',
        isFulfilled: (tests) => {
            return tests.length >= 100;
        },
    },

        // number of completed tests within 24 hours
    {
        name: 'Daily Dose',
        description: 'Complete 10 tests within 24 hours',
        isFulfilled: (tests) => {
            return testsWithinTimeFrame(tests, 24) >= 10;
        }
    },
    {
        name: 'Time To Kill',
        description: 'Complete 50 tests within 24 hours',
        isFulfilled: (tests) => {
            return testsWithinTimeFrame(tests, 24) >= 50;
        }
    },
    {
        name: 'More...MORE!',
        description: 'Complete 100 tests within 24 hours',
        isFulfilled: (tests) => {
            return testsWithinTimeFrame(tests, 24) >= 100;
        }
    },


        // number of completed tests on consecutive days
    {
        name: 'Back For More',
        description: 'Complete a test on two consecutive days.',
        isFulfilled: (tests) => {
            return numOfConsecutiveDaysWithCompletedTests(tests) >= 2;
        },
    },
    {
        name: 'I\'m A Regular',
        description: 'Complete a test on seven consecutive days.',
        isFulfilled: (tests) => {
            return numOfConsecutiveDaysWithCompletedTests(tests) >= 7;
        },
    },
    {
        name: 'Dedicated',
        description: 'Complete a test on 30 consecutive days.',
        isFulfilled: (tests) => {
            return numOfConsecutiveDaysWithCompletedTests(tests) >= 30;
        },
    },
    {
        name: 'Lifer',
        description: 'Complete a test on 180 consecutive days.',
        isFulfilled: (tests) => {
            return numOfConsecutiveDaysWithCompletedTests(tests) >= 180;
        },
    },
    {
        name: 'No-Lifer',
        description: 'Complete a test on 365 consecutive days.',
        isFulfilled: (tests) => {
            return numOfConsecutiveDaysWithCompletedTests(tests) >= 365;
        },
    },

        // number of completed test with 100% accuracy in a row
    {
        name: 'Attention To Detail',
        description: 'Complete three consecutive tests with 100% accuracy.',
        isFulfilled: (tests) => {
            return consecutivePerfectTests(tests) >= 3;
        },
    },
    {
        name: 'I\'m On A Roll',
        description: 'Complete 10 consecutive tests with 100% accuracy.',
        isFulfilled: (tests) => {
            return consecutivePerfectTests(tests) >= 10;
        },
    },
    {
        name: 'Sharpshooter',
        description: 'Complete 20 consecutive tests with 100% accuracy.',
        isFulfilled: (tests) => {
            return consecutivePerfectTests(tests) >= 10;
        },
    },
    {
        name: 'Aimbot',
        description: 'Complete 50 consecutive tests with 100% accuracy.',
        isFulfilled: (tests) => {
            return consecutivePerfectTests(tests) >= 50;
        },
    },

        // number of completed test with 100% accuracy overall
    {
        name: 'Perfect!',
        description: 'Complete a test with 100% accuracy.',
        svg: 'perfect',
        isFulfilled: (tests) => {
            return totalPerfectTests(tests) >= 1;
        },
        getProgress: (tests) => {
            const perfectTests = tests.reduce((count, test) => count + (test.accuracy === 100), 0);

            const progress = Math.min(perfectTests, 1);
            
            return {
                label: `${progress} / 1`,
                percent: progress / 1 * 100,
            };
        },
    },
    {
        name: 'Accuracy I',
        description: 'Complete 10 tests with 100% accuracy.',
        svg: 'accuracy1',
        isFulfilled: (tests) => {
            return totalPerfectTests(tests) >= 10;
        },
        getProgress: (tests) => {
            const perfectTests = tests.reduce((count, test) => count + (test.accuracy === 100), 0);

            const progress = Math.min(perfectTests, 10);
            
            return {
                label: `${progress} / 10`,
                percent: progress / 10 * 100,
            };
        },
    },
    {
        name: 'Accuracy II',
        description: 'Complete 50 tests with 100% accuracy.',
        svg: 'accuracy2',
        isFulfilled: (tests) => {
            return totalPerfectTests(tests) >= 50;
        },
        getProgress: (tests) => {
            const perfectTests = tests.reduce((count, test) => count + (test.accuracy === 100), 0);

            const progress = Math.min(perfectTests, 50);
            
            return {
                label: `${progress} / 50`,
                percent: progress / 50 * 100,
            };
        },
    },
    {
        name: 'Accuracy III',
        description: 'Complete 100 tests with 100% accuracy.',
        svg: 'accuracy3',
        isFulfilled: (tests) => {
            return totalPerfectTests(tests) >= 100;
        },
        getProgress: (tests) => {
            const perfectTests = tests.reduce((count, test) => count + (test.accuracy === 100), 0);

            const progress = Math.min(perfectTests, 100);
            
            return {
                label: `${progress} / 100`,
                percent: progress / 100 * 100,
            };
        },
    },
    {
        name: 'Accuracy IV',
        description: 'Complete 500 tests with 100% accuracy.',
        svg: 'accuracy4',
        isFulfilled: (tests) => {
            return totalPerfectTests(tests) >= 500;
        },
        getProgress: (tests) => {
            const perfectTests = tests.reduce((count, test) => count + (test.accuracy === 100), 0);

            const progress = Math.min(perfectTests, 500);
            
            return {
                label: `${progress} / 500`,
                percent: progress / 500 * 100,
            };
        },
    },
    {
        name: 'Accuracy V',
        description: 'Complete 1000 tests with 100% accuracy.',
        svg: 'accuracy5',
        isFulfilled: (tests) => {
            return totalPerfectTests(tests) >= 1000;
        },
        getProgress: (tests) => {
            const perfectTests = tests.reduce((count, test) => count + (test.accuracy === 100), 0);

            const progress = Math.min(perfectTests, 1000);
            
            return {
                label: `${progress} / 1000`,
                percent: progress / 1000 * 100,
            };
        },
    },

        // word of mouth marketing
    {
        name: 'Check This Out!',
        description: 'Share the website on any social media platform.',
        isFulfilled: (tests) => {
            return false;
        },
    },
    {
        name: 'Team Player',
        description: 'Be credited as a referal during a sign up.',
        isFulfilled: (tests) => {
            return false;
        },
    },
    {
        name: 'Recruiter',
        description: 'Be credited as a referal during 10 sign ups.',
        isFulfilled: (tests) => {
            return false;
        },
    },
];