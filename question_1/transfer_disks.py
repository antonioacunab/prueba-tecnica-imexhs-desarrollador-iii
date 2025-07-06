from typing import List, Tuple

Disk = Tuple[int, str]
Move = Tuple[int, str, str]

def transfer_disks (n: int, disks: List[Disk]) -> List[Move] | int:
    """
    This function will try to emulate the Hanoi Tower game. It will receive a list of disks, which are assumed to be in the rod "A".
    There will be an auxiliar rod "B" and a target rod "C". The function will return a list of moves required to move all the disks in "A" to the rod "C".
    """

    # Checks that "n" is equal to the length of the list, and that it is within the required range
    if n != len(disks) or 1 < n > 8:
        return -1

    # This is the output, this array will contain the required moves to take all the disks to the target rod
    moves: List[Move] = []

    # Rods
    rods: dict[str, list] = {
        "A": disks.copy(), # source
        "B": [],           # auxiliar
        "C": []            # target
    }

    def can_place (disk: Disk, stack: List[Disk]) -> bool:
        """
        This function indicates if the disk can be placed on the provided stack.
        In order to be able to place the disk on the stack, the following criteria should be meet:
        - The stack is empty
        - The disk to be placed is smaller than the one top on the stack and has a different color
        """

        # Can place if stack is empty
        if not stack:
            return True

        # Indicates if the disk to be placed has the same color of the disk in the top of the stack
        is_same_color: bool = disk[1] == stack[-1][1]

        # Indicates if the disk to be placed is smaller than the thisk in the top of the stack
        is_smaller: bool = disk[0] < stack[-1][0]

        return not is_same_color and is_smaller

    def move (n: int, source: str, target: str, auxiliary: str) -> bool:
        """
        This function will move the "n" smaller disks from "source" to "target", using "auxiliary"
        """
        if n == 0:
            return True

        # We want to implement the common pattern to solve the Hanoi Tower problem
        def move_from_source_to_aux (n: int) -> bool:
            return move(n, source, auxiliary, target)

        def move_last_disk_to_target_and_register ():
            # Extract from source to disk to be moved
            disk = rods[source].pop()

            # If cannot be placed, then place it back into source
            if not can_place(disk, rods[target]):
                rods[source].append(disk)
                return False

            # At this point, it is assumed that the disk can be placed in the target rod
            rods[target].append(disk)

            # Register the movement
            moves.append((disk[0], source, target))

            return True

        def move_from_aux_to_target (n: int) -> bool:
            return move(n, auxiliary, target, source)

        # The following is the pattern to be followed to complete the hanoi tower

        if not move_from_source_to_aux(n - 1):
            return False

        if not move_last_disk_to_target_and_register():
            return False

        if not move_from_aux_to_target(n - 1):
            return False

        return True

    could_move_all_the_disks = move(len(disks), "A", "C", "B")

    if could_move_all_the_disks:
        return moves
    else:
        return -1


# Prints the list of movements, this is the same as example #1 in the instructions
disks1 = [(3, "red"), (2, "blue"), (1, "red")]
print(transfer_disks(3, disks1))

# Prints -1, because there are two disks with the same size and colors that cannot be moved
disks2 = [(3, "red"), (2, "blue"), (2, "blue"), (1, "red")]
print(transfer_disks(4, disks2))
