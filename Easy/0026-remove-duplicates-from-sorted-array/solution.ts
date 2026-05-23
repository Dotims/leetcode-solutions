/*
    Problem: 26. Remove Duplicates from Sorted Array
    Link: https://leetcode.com/problems/remove-duplicates-from-sorted-array/description/
    Track: Remove Duplicates from Sorted Array

    Time Complexity: O(n)
*/


function removeDuplicates(nums: number[]): number {
    if (nums.length === 0) return 0;
    let k = 1

    for (let i = 1; i < nums.length; i++) {
        if (nums[i] !== nums[i - 1]) {
            nums[k] = nums[i];
            k++;
        }
    }

    return k
};