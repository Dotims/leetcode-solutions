/*
    Problem: 189. Rotate Array
    Link: https://leetcode.com/problems/rotate-array/description/
    Track: Array
    Time Complexity: O(n)
*/

function rotate(nums: number[], k: number): void {
    const n = nums.length;
    const temp = new Array(n);

    for (let i = 0; i < n; i++) {
        const newIndex = (i + k) % n;
        temp[newIndex] = nums[i];
    }

    for (let i = 0; i < n; i++) {
        nums[i] = temp[i];
    }
};