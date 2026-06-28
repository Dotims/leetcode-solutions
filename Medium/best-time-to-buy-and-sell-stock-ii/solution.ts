/*
    Problem: 122. Best Time to Buy and Sell Stock II
    Link: https://leetcode.com/problems/best-time-to-buy-and-sell-stock-ii/description
    Time Complexity: O(n)
*/

function maxProfit(prices: number[]): number {
    let profit = 0;

    for (let i = 1; i < prices.length; i++) {
        if (prices[i] >= prices[i - 1]) {
            profit += prices[i] - prices[i - 1];
        }
    }

    return profit;
};