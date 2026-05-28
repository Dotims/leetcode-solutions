/*
    Problem: 27. Remove Element
    Link: https://leetcode.com/problems/remove-element/description/
    Track: Remove Element

    Time Complexity: O(n)
*/

function removeElement(nums: number[], val: number): number {
    let k = 0

    for (let i = 0; i < nums.length; i++) {
        if (nums[i] !== val) {
            nums[k] = nums[i];
            k++;
        }
    }
    return k
};