/*
    Problem: 169. Majority Element
    Link: https://leetcode.com/problems/majority-element/description/
    Track: Majority Element
    Time Complexity: O(n)
*/

function majorityElement(nums: number[]): number {
    const counts = new Map<number, number>();
    const limit = nums.length / 2;

    for (let i = 0; i < nums.length; i++) {
        const num = nums[i];

        if (!counts.has(num)) {
            counts.set(num, 1);
        } else {
            const oldCount = counts.get(num)!;
            counts.set(num, oldCount + 1);
        }

        if (counts.get(num)! > limit) {
            return num;
        }
    }
    return -1;
};


/* 
    better solution
*/
function majorityElement1(nums: number[]): number {
    let candidate = 0;
    let count = 0;

    for (let i = 0; i < nums.length; i ++) {
        if (count === 0) {
            candidate = nums[i];
        }

        if (nums[i] === candidate) {
            count++;
        } else {
            count --;
        }
    }

    return candidate;
};