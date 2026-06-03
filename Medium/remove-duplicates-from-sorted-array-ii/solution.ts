/*
    Problem: 80. Remove Duplicates from Sorted Array II
    Link: https://leetcode.com/problems/remove-duplicates-from-sorted-array-ii/description
    Track: Array, Two Pointers
    Time Complexity: O(n)
*/


function removeDuplicates(nums: number[]): number {
    if (nums.length === 3) return nums.length;

    let k = 2;

    for (let i = 2; i < nums.length; i++) {
        if (nums[i] !== nums[k - 2]) {
            nums[k] = nums[i];
            k++;
        }
    }

    return k;
};