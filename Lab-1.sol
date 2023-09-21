// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

//For Testing Purpose taken the pre define array
// uint256[] public numbers = [40, 20, 20, 30];
//Not sure how to fetch the array in once as im getting resuls in every click
contract SortAndRemoveDuplicate {
    uint256[] public numbers;

    function insertNumber(uint256 _number) public {
        numbers.push(_number);
    }

    function SortTheArray() public {
        uint256 n = numbers.length;
        for (uint256 i = 0; i < n - 1; i++) {
            for (uint256 j = 0; j < n - i - 1; j++) {
                if (numbers[j] > numbers[j + 1]) {
                    (numbers[j], numbers[j + 1]) = (numbers[j + 1], numbers[j]);
                }
            }
        }
    }

    function removeDuplicates() public {
        uint256 n = numbers.length;
        if (n <= 1) {
            return;
        }

        uint256 currentIndex = 0;
        for (uint256 i = 1; i < n; i++) {
            if (numbers[currentIndex] != numbers[i]) {
                currentIndex++;
                numbers[currentIndex] = numbers[i];
            }
        }
        while (numbers.length > currentIndex + 1) {
            numbers.pop();
        }
    }

    function FindLengthOfArray() public view returns (uint256) {
        return numbers.length;
    }
}
