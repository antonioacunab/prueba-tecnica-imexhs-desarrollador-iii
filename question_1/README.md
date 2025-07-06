# Recursion and Colors

## Run the file

In order to run the file, you must have Python installed and be located in this folder. Once you are done, you can run:

```bash
python3 transfer_disks.py
```

## Instructions

You are given n disks of different sizes and colors stacked on a source rod. The goal is to transfer all
the disks to a target rod using an auxiliary rod, following these rules:
1. Only one disk can be moved at a time.
2. A larger disk cannot be placed on top of a smaller disk.
3. Disks of the same color cannot be placed directly on top of each other, even if they differ in size.
4. You must use recursion to solve the problem.
5. You must use python to solve the problem.

## Input:
- An integer n (1 ≤ n ≤ 8), representing the number of disks.
- A list of n tuples where each tuple contains the size and color of a disk, sorted in descending order of size. For example:
disks = [(5, "red"), (4, "blue"), (3, "red"), (2, "green"), (1, "blue")]

## Output
- The sequence of moves required to transfer all disks from the source rod to the target rod.

## Example 1

### Example Input 1
n = 3
disks = [(3, "red"), (2, "blue"), (1, "red")]

### Example Output 1
[
(1, "A", "C"),
(2, "A", "B"),
(1, "C", "B"),
(3, "A", "C"),
(1, "B", "A"),
(2, "B", "C"),
(1, "A", "C")
]

## Example 1

### Example Input 2
n = 3
disks = [(3, "red"), (2, "blue"), (1, "red")]

### Example Output 2
-1 # Impossible to complete the transfer