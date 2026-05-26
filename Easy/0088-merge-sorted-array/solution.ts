/*
    Problem: 88. Merge Sorted Array
    Link: https://leetcode.com/problems/merge-sorted-array/description/
    Track: Merge Sorted Array

    Time Complexity: O(m + n)
*/

function merge(nums1: number[], m: number, nums2: number[], n: number): void {
    let p1 = m - 1;
    let p2 = n - 1;
    let r = m + n - 1;

    while (p1 >= 0 && p2 >= 0) {
        if (nums1[p1] > nums2[p2]) {
            nums1[r] = nums1[p1];
            p1--;
        } else {
            nums1[r] = nums2[p2];
            p2--;
        }
        r--;
    }

    while (p2 >= 0) {
        nums1[r] = nums2[p2];
        p2--;
        r--;
    }
};
