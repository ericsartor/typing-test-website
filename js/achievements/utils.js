// the highest number of tests completed within the given timeframe
export default {
    numOfTestsWithinTimeFrame(tests, timeframeInHours) {
        const timeframeInMilliseconds = timeframeInHours * 60 * 1000;

        // sort from oldest to newest
        tests = [ ...tests ].sort((testA, testB) => testA.timestamp - testB.timestamp);

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
};