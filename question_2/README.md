# File Handling and Array Operations

Write a Python script that implements a class, FileProcessor, with methods to handle file and data processing tasks. The class should have the following functionality:

## Attributes
- base_path: A string representing the root folder for file operations.
- logger: A logging object to handle and record errors.

## Methods:

### __init__(self, base_path: str, log_file: str):
- Initializes the base folder path.
- Configures logging to write to the specified log_file.

### list_folder_contents(self, folder_name: str, details: bool = False) -> None
- Receives the folder name relative to base_path.
- Counts and prints the number of elements inside the folder.
- Prints the names and type (folder or file) of the elements.
- Additional: If details=True, includes file sizes (in MB) and last modified times in the
output.
- Logs an error if the folder does not exist.

### read_csv(self, filename: str, report_path: Optional[str] = None, summary: bool = False) -> None

- Receives a CSV filename in the base_path.
- Reads the CSV file and prints: number of columns and their names, number of rows,
and the average and standard deviation for numeric columns.
- If report_path is provided, saves the analysis (averages and standard deviations) as
a TXT.
- If summary=True, prints a summary of non-numeric columns, including unique
values and their frequencies.
- Logs an error for: missing file, incorrect file format, columns with non-numeric data
when attempting numeric operations.

### read_dicom(self, filename: str, tags: Optional[List[Tuple[int, int]]] = None, extract_image: bool = False) -> None
- Receives a DICOM filename in the base_path.
- Reads the file using pydicom and prints: Patient’s name, Study date, Modality.
- Optionally accepts any amount of tag numbers (e.g., [(0x0010, 0x0010)]) and prints
the corresponding contents.
- If extract_image=True, extracts the DICOM image and saves it as a PNG in
base_path.
- Logs errors for missing files, invalid DICOM format, or unsupported pixel data.

## Additional Instructions:
• Use the provided files: `./sample-02-xxxxxxx.xxx` files
• You can use https://pydicom.github.io

## Example Implementation
```py
processor = FileProcessor(base_path="./data")
```

### List folder contents
```py
processor.list_folder_contents(folder_name="test_folder", details=True)
```

### Analyze a CSV file
```py
processor.read_csv(filename="sample-01-csv.csv", report_path="./reports", summary=True)
```

### Analyze a DICOM file
```py
processor.read_dicom(filename="sample-01-dicom.dcm", tags=[(0x0010, 0x0010), (0x0008, 0x0060)], extract_image=True)
```
Example Output

```
Folder: ./data/test_folder
Number of elements: 5
Files:
    - file1.txt (1.2 MB, Last Modified: 2024-01-01 12:00:00)
    - file2.csv (0.8 MB, Last Modified: 2024-01-02 12:00:00)
Folders:
    - folder1 (Last Modified: 2024-01-01 15:00:00)
    - folder2 (Last Modified: 2024-01-03 16:00:00)
CSV Analysis:
Columns: ["Name", "Age", "Height"]
Rows: 100
Numeric Columns:
    - Age: Average = 30.5, Std Dev = 5.6
    - Height: Average = 170.2, Std Dev = 10.3
Non-Numeric Summary:
    - Name: Unique Values = 50
Saved summary report to ./reports

DICOM Analysis:
Patient Name: John Doe
Study Date: 2024-01-01
Modality: CT
Tag 0x0010, 0x0010: John Doe
Tag 0x0008, 0x0060: CT
Extracted image saved to ./data/sample-01-dicom.png
```